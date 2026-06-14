/**
 * Cleanup orphaned engine-prefix Blobs.
 *
 * After an ENGINE_VERSION bump, reads switch to a fresh prefix
 * (PR #692). Old Blobs at `precompute/v1/{retired-hash}/...` are
 * unreachable but still in storage — they're cheap (~$0.15/GB-month)
 * but accumulate over time.
 *
 * This script enumerates every Blob under `precompute/v1/`, groups
 * by engine prefix, and (with --apply) deletes everything outside
 * the current ENGINE_PREFIX.
 *
 * Usage:
 *   # Dry run (default — lists prefixes and counts without deleting):
 *   PRECOMPUTE_STORAGE=blob BLOB_READ_WRITE_TOKEN=... \
 *     npx tsx scripts/precompute/cleanup-old-prefixes.ts
 *
 *   # Apply deletions:
 *   PRECOMPUTE_STORAGE=blob BLOB_READ_WRITE_TOKEN=... \
 *     npx tsx scripts/precompute/cleanup-old-prefixes.ts --apply
 *
 * Safety: only ever touches paths under `precompute/v1/`. Blobs
 * outside that prefix (other apps, other features) are never seen
 * by the enumeration. The current ENGINE_PREFIX is read from
 * src/lib/precompute/storage.ts and is always preserved.
 */

import { ENGINE_PREFIX } from '@/lib/precompute/storage';

const PRECOMPUTE_PREFIX = 'precompute/v1/';
const DEL_BATCH_SIZE = 100; // @vercel/blob `del` accepts up to 1000 URLs per call

interface BlobMeta {
  url: string;
  pathname: string;
}

async function main(): Promise<void> {
  const apply = process.argv.includes('--apply');

  const { list, del } = await import('@vercel/blob');

  console.log(`Current ENGINE_PREFIX: ${ENGINE_PREFIX}`);
  console.log(`Scanning ${PRECOMPUTE_PREFIX}* ...`);

  // First pass — enumerate every Blob and bucket by the engine prefix
  // segment immediately after `precompute/v1/`.
  const byPrefix = new Map<string, BlobMeta[]>();
  let cursor: string | undefined;
  let scanned = 0;
  do {
    const result = await list({ prefix: PRECOMPUTE_PREFIX, cursor });
    for (const blob of result.blobs) {
      scanned++;
      const rest = blob.pathname.slice(PRECOMPUTE_PREFIX.length);
      // Expect shape `{engineHash}/...`. If the next segment doesn't
      // look like a 7-char hex slice, treat as unknown — never delete.
      const slashIdx = rest.indexOf('/');
      const enginePrefix = slashIdx >= 0 ? rest.slice(0, slashIdx) : rest;
      if (!byPrefix.has(enginePrefix)) byPrefix.set(enginePrefix, []);
      byPrefix.get(enginePrefix)!.push({ url: blob.url, pathname: blob.pathname });
    }
    cursor = result.cursor;
  } while (cursor);

  console.log(`\nScanned ${scanned} Blobs across ${byPrefix.size} engine prefix(es):\n`);
  const sortedPrefixes = Array.from(byPrefix.entries()).sort(
    (a, b) => b[1].length - a[1].length,
  );
  for (const [prefix, blobs] of sortedPrefixes) {
    const marker =
      prefix === ENGINE_PREFIX
        ? '← CURRENT (keep)'
        : /^[0-9a-f]{7}$/.test(prefix)
        ? '(retired engine — candidate for deletion)'
        : '(unrecognised prefix — will NOT delete)';
    console.log(`  ${prefix.padEnd(20)} ${String(blobs.length).padStart(6)} Blobs  ${marker}`);
  }

  // Collect deletion candidates: prefixes that match the 7-hex-char
  // shape but aren't current. Anything else (oddly-shaped paths) is
  // left alone to avoid touching content that doesn't fit the
  // engine-hash convention.
  const candidatesForDeletion: BlobMeta[] = [];
  for (const [prefix, blobs] of byPrefix) {
    if (prefix === ENGINE_PREFIX) continue;
    if (!/^[0-9a-f]{7}$/.test(prefix)) continue;
    candidatesForDeletion.push(...blobs);
  }

  if (candidatesForDeletion.length === 0) {
    console.log('\nNo retired-prefix Blobs found. Nothing to delete.');
    return;
  }

  if (!apply) {
    console.log(
      `\nDRY RUN: ${candidatesForDeletion.length} Blob(s) would be deleted. ` +
        `Re-run with --apply to actually delete.`,
    );
    return;
  }

  console.log(`\nDeleting ${candidatesForDeletion.length} Blob(s) in batches of ${DEL_BATCH_SIZE}...`);
  let deleted = 0;
  for (let i = 0; i < candidatesForDeletion.length; i += DEL_BATCH_SIZE) {
    const batch = candidatesForDeletion.slice(i, i + DEL_BATCH_SIZE);
    const urls = batch.map((b) => b.url);
    await del(urls);
    deleted += batch.length;
    console.log(`  ${deleted}/${candidatesForDeletion.length} deleted`);
  }
  console.log(`\nDone. Deleted ${deleted} retired-prefix Blob(s).`);
}

main().catch((err) => {
  console.error('[cleanup-old-prefixes] fatal:', err);
  process.exit(1);
});
