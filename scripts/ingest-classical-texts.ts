/**
 * Classical Jyotish Text Ingestion Pipeline
 *
 * Usage:
 *   npx tsx scripts/ingest-classical-texts.ts --text BPHS --source ./data/texts/bphs/bphs.txt
 *   npx tsx scripts/ingest-classical-texts.ts --text Phaladeepika --source ./data/texts/phaladeepika.txt
 *
 * Pipeline: Parse → Tag → Embed → Store in Supabase
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import type { RawChunk, TaggedChunk, TopicCategory, TextParser } from '../src/lib/rag/types';
import { BPHSParser } from './parsers/bphs-parser';
import { GenericVerseParser } from './parsers/generic-verse-parser';

// ============================================================
// CLI argument parsing
// ============================================================

function parseArgs(): { textName: string; sourcePath: string; dryRun: boolean } {
  const args = process.argv.slice(2);
  let textName = '';
  let sourcePath = '';
  let dryRun = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--text' && args[i + 1]) textName = args[++i];
    else if (args[i] === '--source' && args[i + 1]) sourcePath = args[++i];
    else if (args[i] === '--dry-run') dryRun = true;
  }

  if (!textName || !sourcePath) {
    console.error('Usage: npx tsx scripts/ingest-classical-texts.ts --text BPHS --source ./path/to/file.txt [--dry-run]');
    process.exit(1);
  }

  return { textName, sourcePath, dryRun };
}

// ============================================================
// Text name → Parser mapping
// ============================================================

const TEXT_METADATA: Record<string, string> = {
  BPHS: 'Brihat Parashara Hora Shastra',
  Phaladeepika: 'Phaladeepika',
  Saravali: 'Saravali',
  'Brihat-Jataka': 'Brihat Jataka',
  'Bhrigu-Sutram': 'Bhrigu Sutram',
  'Jataka-Parijata': 'Jataka Parijata',
  'Uttara-Kalamrita': 'Uttara Kalamrita',
};

function getParser(textName: string): TextParser {
  const fullName = TEXT_METADATA[textName] || textName;
  if (textName === 'BPHS') return new BPHSParser();
  return new GenericVerseParser(textName, fullName);
}

// ============================================================
// Auto-Tagger: Extract metadata from chunk content
// ============================================================

const GRAHA_PATTERNS: Record<string, RegExp> = {
  sun: /\b(sun|surya|soorya|ravi|aditya)\b/i,
  moon: /\b(moon|chandra|soma)\b/i,
  mars: /\b(mars|mangal|kuja|angaraka|mangala)\b/i,
  mercury: /\b(mercury|budh|budha|soumya)\b/i,
  jupiter: /\b(jupiter|guru|brihaspati|devaguru)\b/i,
  venus: /\b(venus|shukra|bhrigu|sukra)\b/i,
  saturn: /\b(saturn|shani|sanaischara|manda|sani)\b/i,
  rahu: /\b(rahu|north[\s-]?node|dragon[\s']?s?\s*head)\b/i,
  ketu: /\b(ketu|south[\s-]?node|dragon[\s']?s?\s*tail)\b/i,
};

const BHAVA_PATTERNS: Array<{ house: number; pattern: RegExp }> = [
  { house: 1, pattern: /\b(1st\s+house|first\s+house|lagna|ascendant|tanu\s*bhava)\b/i },
  { house: 2, pattern: /\b(2nd\s+house|second\s+house|dhana\s*bhava)\b/i },
  { house: 3, pattern: /\b(3rd\s+house|third\s+house|sahaja\s*bhava)\b/i },
  { house: 4, pattern: /\b(4th\s+house|fourth\s+house|sukha\s*bhava|bandhu\s*bhava)\b/i },
  { house: 5, pattern: /\b(5th\s+house|fifth\s+house|putra\s*bhava)\b/i },
  { house: 6, pattern: /\b(6th\s+house|sixth\s+house|ripu\s*bhava|shatru\s*bhava)\b/i },
  { house: 7, pattern: /\b(7th\s+house|seventh\s+house|kalatra\s*bhava)\b/i },
  { house: 8, pattern: /\b(8th\s+house|eighth\s+house|randhra\s*bhava)\b/i },
  { house: 9, pattern: /\b(9th\s+house|ninth\s+house|dharma\s*bhava)\b/i },
  { house: 10, pattern: /\b(10th\s+house|tenth\s+house|karma\s*bhava)\b/i },
  { house: 11, pattern: /\b(11th\s+house|eleventh\s+house|labha\s*bhava)\b/i },
  { house: 12, pattern: /\b(12th\s+house|twelfth\s+house|vyaya\s*bhava)\b/i },
];

const RASHI_PATTERNS: Record<string, RegExp> = {
  aries: /\b(aries|mesha|mesh)\b/i,
  taurus: /\b(taurus|vrishabha|vrishabh|vrish)\b/i,
  gemini: /\b(gemini|mithuna|mithun)\b/i,
  cancer: /\b(cancer|karka|karkata)\b/i,
  leo: /\b(leo|simha|sinh)\b/i,
  virgo: /\b(virgo|kanya)\b/i,
  libra: /\b(libra|tula|thula)\b/i,
  scorpio: /\b(scorpio|vrishchika|vrischika|vrischik)\b/i,
  sagittarius: /\b(sagittarius|dhanu|dhanush)\b/i,
  capricorn: /\b(capricorn|makara|makar)\b/i,
  aquarius: /\b(aquarius|kumbha|kumbh)\b/i,
  pisces: /\b(pisces|meena|meen)\b/i,
};

const YOGA_PATTERNS: Record<string, RegExp> = {
  gajakesari: /gajakesari/i,
  raja: /raja[\s-]?yoga/i,
  dhana: /dhana[\s-]?yoga/i,
  budhaditya: /budhaditya/i,
  ruchaka: /ruchaka/i,
  bhadra: /bhadra[\s-]?yoga/i,
  hamsa: /hamsa[\s-]?yoga/i,
  malavya: /malavya/i,
  shasha: /shasha[\s-]?yoga/i,
  viparita: /viparita/i,
  neechabhanga: /neech[\s-]?bhang/i,
  pancha: /pancha[\s-]?mahapurusha/i,
  chandra: /chandra[\s-]?mangala/i,
  kemadruma: /kemadruma/i,
  adhi: /adhi[\s-]?yoga/i,
  sunapha: /sunapha/i,
  anapha: /anapha/i,
  durudhura: /durudhura/i,
};

const DOSHA_PATTERNS: Record<string, RegExp> = {
  manglik: /manglik|kuja[\s-]?dosha|mangal[\s-]?dosha/i,
  'kaal-sarp': /kaal[\s-]?sarp|kal[\s-]?sarp/i,
  pitra: /pitra[\s-]?dosha|pitru[\s-]?dosha/i,
  grahan: /grahan[\s-]?dosha/i,
  shani: /shani[\s-]?dosha|sade[\s-]?sati/i,
};

function autoTagChunk(chunk: RawChunk): TaggedChunk {
  const text = `${chunk.translation} ${chunk.commentary || ''}`;

  const grahaTags = Object.entries(GRAHA_PATTERNS)
    .filter(([, pattern]) => pattern.test(text))
    .map(([name]) => name);

  const bhavaTags = BHAVA_PATTERNS
    .filter(({ pattern }) => pattern.test(text))
    .map(({ house }) => house);

  const rashiTags = Object.entries(RASHI_PATTERNS)
    .filter(([, pattern]) => pattern.test(text))
    .map(([name]) => name);

  const yogaTags = Object.entries(YOGA_PATTERNS)
    .filter(([, pattern]) => pattern.test(text))
    .map(([name]) => name);

  const doshaTags = Object.entries(DOSHA_PATTERNS)
    .filter(([, pattern]) => pattern.test(text))
    .map(([name]) => name);

  const topicCategory = inferTopicCategory(text, grahaTags, bhavaTags);

  // Build composite topic tags
  const topicTags: string[] = [];
  for (const g of grahaTags) {
    for (const b of bhavaTags) {
      topicTags.push(`${g}-in-house-${b}`);
    }
    for (const r of rashiTags) {
      topicTags.push(`${g}-in-${r}`);
    }
  }

  return {
    ...chunk,
    topicCategory,
    topicTags,
    grahaTags,
    bhavaTags,
    rashiTags,
    yogaTags,
    doshaTags,
  };
}

function inferTopicCategory(
  text: string,
  grahaTags: string[],
  bhavaTags: number[]
): TopicCategory {
  if (/\b(yoga|rajayoga|dhana[\s-]?yoga|pancha[\s-]?mahapurusha)\b/i.test(text)) return 'yoga';
  if (/\b(dosha|manglik|kuja[\s-]?dosha|kaal[\s-]?sarp|pitra[\s-]?dosha)\b/i.test(text)) return 'dosha';
  if (/\b(dasha|mahadasha|antardasha|vimshottari)\b/i.test(text)) return 'dasha';
  if (/\b(remed|upay|mantra|gemstone|ratna|charity|daan)\b/i.test(text)) return 'remedy';
  if (/\b(aspect|drishti)\b/i.test(text)) return 'aspect';
  if (/\b(exalt|debilitat|moolatrikona|own[\s-]?sign|dignity)\b/i.test(text)) return 'dignity';
  if (/\b(nakshatra|asterism|lunar[\s-]?mansion)\b/i.test(text)) return 'nakshatra';
  if (grahaTags.length > 0 && bhavaTags.length > 0) return 'graha-in-bhava';
  if (grahaTags.length > 0) return 'graha-in-rashi';
  if (bhavaTags.length > 0) return 'bhava-analysis';
  return 'general';
}

// ============================================================
// Embedding (reuses the configurable provider from src/lib/rag)
// ============================================================

import { createEmbeddingProvider } from '../src/lib/rag/embeddings';

async function embedTexts(texts: string[]): Promise<number[][]> {
  const provider = createEmbeddingProvider();
  console.log(`  Using embedding provider: ${provider.name} (${provider.model}, ${provider.dimensions}d)`);
  const results = await provider.embedBatch(texts);
  return results.map((r) => r.embedding);
}

// ============================================================
// Supabase upsert
// ============================================================

async function storeChunks(
  chunks: TaggedChunk[],
  embeddings: number[][],
  textName: string,
  textFullName: string,
  sourceFile: string
): Promise<void> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const batchSize = 50;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const batchEmbeddings = embeddings.slice(i, i + batchSize);

    const rows = batch.map((chunk, j) => ({
      text_name: textName,
      text_full_name: textFullName,
      chapter: chunk.chapterNumber,
      chapter_title: chunk.chapterTitle,
      verse_start: chunk.verseStart,
      verse_end: chunk.verseEnd,
      sanskrit_text: chunk.sanskritText || null,
      translation: chunk.translation,
      commentary: chunk.commentary || null,
      embedding: JSON.stringify(batchEmbeddings[j]),
      topic_tags: chunk.topicTags,
      graha_tags: chunk.grahaTags,
      bhava_tags: chunk.bhavaTags,
      rashi_tags: chunk.rashiTags,
      yoga_tags: chunk.yogaTags,
      dosha_tags: chunk.doshaTags,
      topic_category: chunk.topicCategory,
      source_file: sourceFile,
      embedding_model: process.env.EMBEDDING_PROVIDER === 'openai'
        ? 'openai-text-embedding-3-small'
        : 'cohere-embed-multilingual-v3.0',
    }));

    const { error } = await supabase.from('classical_chunks').insert(rows);
    if (error) {
      console.error(`Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
      throw error;
    }

    console.log(`  Stored batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}`);
  }
}

// ============================================================
// Main
// ============================================================

async function main() {
  const { textName, sourcePath, dryRun } = parseArgs();
  const fullName = TEXT_METADATA[textName] || textName;

  console.log(`\n=== Ingesting: ${fullName} ===`);
  console.log(`Source: ${sourcePath}`);
  console.log(`Dry run: ${dryRun}\n`);

  // 1. Read source file
  const resolvedPath = path.resolve(sourcePath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`Source file not found: ${resolvedPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(resolvedPath, 'utf-8');
  console.log(`Read ${content.length.toLocaleString()} characters\n`);

  // 2. Parse into chunks
  const parser = getParser(textName);
  const rawChunks = parser.parse(content);
  console.log(`Parsed ${rawChunks.length} verse chunks\n`);

  if (rawChunks.length === 0) {
    console.error('No chunks extracted. Check the source file format.');
    process.exit(1);
  }

  // 3. Auto-tag
  const taggedChunks = rawChunks.map(autoTagChunk);

  // Print sample
  console.log('Sample tagged chunk:');
  const sample = taggedChunks[Math.min(5, taggedChunks.length - 1)];
  console.log(JSON.stringify({
    chapter: sample.chapterNumber,
    verse: `${sample.verseStart}-${sample.verseEnd}`,
    category: sample.topicCategory,
    graha: sample.grahaTags,
    bhava: sample.bhavaTags,
    rashi: sample.rashiTags,
    translation: sample.translation.slice(0, 100) + '...',
  }, null, 2));
  console.log();

  // Print tag distribution
  const catCounts: Record<string, number> = {};
  for (const c of taggedChunks) {
    catCounts[c.topicCategory] = (catCounts[c.topicCategory] || 0) + 1;
  }
  console.log('Topic category distribution:');
  for (const [cat, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat}: ${count}`);
  }
  console.log();

  if (dryRun) {
    console.log('Dry run complete. No embeddings generated or data stored.');
    return;
  }

  // 4. Check env vars
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // 5. Embed (provider validates API keys at construction time)
  console.log('Generating embeddings...');
  const texts = taggedChunks.map((c) =>
    c.sanskritText ? `${c.sanskritText}\n${c.translation}` : c.translation
  );
  const embeddings = await embedTexts(texts);
  console.log(`Generated ${embeddings.length} embeddings\n`);

  // 6. Store
  console.log('Storing in Supabase...');
  await storeChunks(taggedChunks, embeddings, textName, fullName, path.basename(sourcePath));

  console.log(`\nDone! Ingested ${taggedChunks.length} chunks from ${fullName}.`);
}

main().catch((err) => {
  console.error('Ingestion failed:', err);
  process.exit(1);
});
