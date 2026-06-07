/**
 * Unit tests for VercelBlobStorage.
 *
 * We can't hit a real Vercel Blob store from CI without provisioning a
 * BLOB_READ_WRITE_TOKEN (cost + flake). Instead we mock @vercel/blob
 * and assert the storage adapter:
 *   1. uses the precompute/v1/ path prefix
 *   2. .json suffix
 *   3. access:'public', addRandomSuffix:false, allowOverwrite:true
 *   4. exists() returns false on BlobNotFoundError, true on success
 *   5. get() returns null on BlobNotFoundError (without bubbling)
 *   6. get() returns the Blob body on success
 *   7. illegal keys are rejected with the same .. guard as LocalFs
 *
 * If any of these change, the GH Action will write to a path the page
 * handler can't find — silent breakage. Lock the contract here.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the SDK at module load time. The Storage class dynamic-imports
// @vercel/blob, so the mock fires the first time storage.put / get /
// exists is called.
//
// vi.hoisted() runs BEFORE the file body. The fake error class must
// live inside the factory so it exists when the hoist evaluates.
const sdkMock = vi.hoisted(() => {
  class FakeBlobNotFoundError extends Error {
    constructor() {
      super('not found');
      this.name = 'BlobNotFoundError';
    }
  }
  return {
    put: vi.fn(),
    head: vi.fn(),
    BlobNotFoundError: FakeBlobNotFoundError,
  };
});
const { BlobNotFoundError: FakeBlobNotFoundError } = sdkMock;

vi.mock('@vercel/blob', () => sdkMock);

// fetch mock — used by .get() after head() returns metadata.
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

import { VercelBlobStorage } from '@/lib/precompute/storage';

describe('VercelBlobStorage', () => {
  let storage: VercelBlobStorage;

  beforeEach(() => {
    storage = new VercelBlobStorage();
    sdkMock.put.mockReset();
    sdkMock.head.mockReset();
    fetchMock.mockReset();
  });

  it('put: writes with precompute/v1/ prefix, .json suffix, public access', async () => {
    sdkMock.put.mockResolvedValue({ url: 'https://example.public.blob/test.json' });

    await storage.put('choghadiya/2026-06-07/delhi', '{"foo":1}');

    expect(sdkMock.put).toHaveBeenCalledTimes(1);
    expect(sdkMock.put).toHaveBeenCalledWith(
      'precompute/v1/choghadiya/2026-06-07/delhi.json',
      '{"foo":1}',
      expect.objectContaining({
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
      }),
    );
  });

  it('get: head + fetch on success', async () => {
    sdkMock.head.mockResolvedValue({ url: 'https://example.public.blob/choghadiya.json' });
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '{"hello":"world"}',
    } as Response);

    const raw = await storage.get('choghadiya/2026-06-07/delhi');

    expect(raw).toBe('{"hello":"world"}');
    expect(sdkMock.head).toHaveBeenCalledWith('precompute/v1/choghadiya/2026-06-07/delhi.json');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://example.public.blob/choghadiya.json',
      // `force-cache` (NOT 'no-store') keeps the calling route eligible for
      // ISR; the `next.tags` entry lets the precompute webhook bust the
      // Next.js Data Cache surgically when a Blob is rewritten — without
      // it, revalidatePath would invalidate the page HTML but the inner
      // fetch would still serve the stale body. See storage.ts:get for
      // the full reasoning + 2026-06-07 post-#505 verification context.
      expect.objectContaining({
        cache: 'force-cache',
        next: { tags: ['precompute:choghadiya/2026-06-07/delhi'] },
      }),
    );
  });

  it('get: returns null on BlobNotFoundError without bubbling', async () => {
    sdkMock.head.mockRejectedValue(new FakeBlobNotFoundError());

    const raw = await storage.get('choghadiya/2099-01-01/atlantis');

    expect(raw).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled(); // never even tried to fetch
  });

  it('get: returns null on fetch 404 (defensive — Blob present but body missing)', async () => {
    sdkMock.head.mockResolvedValue({ url: 'https://example.public.blob/x.json' });
    fetchMock.mockResolvedValue({ ok: false, status: 404 } as Response);

    expect(await storage.get('choghadiya/2026-06-07/delhi')).toBeNull();
  });

  it('get: throws on fetch 5xx (so reader can fall back to live compute)', async () => {
    sdkMock.head.mockResolvedValue({ url: 'https://example.public.blob/x.json' });
    fetchMock.mockResolvedValue({ ok: false, status: 503 } as Response);

    await expect(storage.get('choghadiya/2026-06-07/delhi')).rejects.toThrow(/blob fetch 503/);
  });

  it('exists: true when head succeeds, false on BlobNotFoundError', async () => {
    sdkMock.head.mockResolvedValueOnce({ url: 'x' });
    expect(await storage.exists('a/b/c')).toBe(true);

    sdkMock.head.mockRejectedValueOnce(new FakeBlobNotFoundError());
    expect(await storage.exists('does/not/exist')).toBe(false);
  });

  it('exists: bubbles unexpected errors (so backfill ops sees real failures)', async () => {
    sdkMock.head.mockRejectedValueOnce(new Error('connection refused'));
    await expect(storage.exists('a/b/c')).rejects.toThrow(/connection refused/);
  });

  it('rejects illegal keys at the .. guard (same shape as LocalFs)', async () => {
    await expect(storage.put('../etc/passwd', '{}')).rejects.toThrow(/illegal key/);
    await expect(storage.get('a/../../escape')).rejects.toThrow(/illegal key/);
    await expect(storage.exists('a/b/../../escape')).rejects.toThrow(/illegal key/);
  });
});
