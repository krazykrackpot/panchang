/**
 * BPHS (Brihat Parashara Hora Shastra) Parser
 *
 * Handles the specific formatting of R. Santhanam's BPHS translation,
 * the most widely available digital version.
 *
 * Typical format:
 *   Chapter 22 - Effects of Planets in Houses
 *   Ch.22, Sl.1-2: Sun in the first house...
 *   Ch.22, Sl.3: If Sun is in the second...
 */

import type { RawChunk, TextParser } from '../../src/lib/rag/types';

// Matches "Ch.22, Sl.3-4:" or "Ch. 22 Sl. 3-4." etc.
const BPHS_VERSE_PATTERN =
  /Ch\.?\s*(\d+)[\s,]+Sl\.?\s*(\d+)(?:\s*[-–]\s*(\d+))?\s*[.:]/gi;

// Matches chapter headings
const BPHS_CHAPTER_PATTERN =
  /(?:^|\n)(?:Chapter\s+(\d+)\s*[-–.:]\s*(.+?)(?:\n|$))/gi;

// Sanskrit shloka detector
const DEVANAGARI_PATTERN = /[\u0900-\u097F]{4,}/;

export class BPHSParser implements TextParser {
  readonly textName = 'BPHS';
  readonly textFullName = 'Brihat Parashara Hora Shastra';

  parse(content: string): RawChunk[] {
    const chunks: RawChunk[] = [];

    // Extract chapter titles for reference
    const chapterTitles = new Map<number, string>();
    let chMatch;
    const chPattern = new RegExp(BPHS_CHAPTER_PATTERN.source, 'gi');
    while ((chMatch = chPattern.exec(content)) !== null) {
      chapterTitles.set(parseInt(chMatch[1]), chMatch[2].trim());
    }

    // Find all verse boundaries
    const versePattern = new RegExp(BPHS_VERSE_PATTERN.source, 'gi');
    const boundaries: Array<{
      index: number;
      chapter: number;
      verseStart: number;
      verseEnd: number;
    }> = [];

    let vMatch;
    while ((vMatch = versePattern.exec(content)) !== null) {
      const chapter = parseInt(vMatch[1]);
      const verseStart = parseInt(vMatch[2]);
      const verseEnd = vMatch[3] ? parseInt(vMatch[3]) : verseStart;
      boundaries.push({
        index: vMatch.index,
        chapter,
        verseStart,
        verseEnd,
      });
    }

    // Extract text between consecutive boundaries
    for (let i = 0; i < boundaries.length; i++) {
      const b = boundaries[i];
      const textEnd =
        i < boundaries.length - 1 ? boundaries[i + 1].index : content.length;
      const rawText = content.slice(b.index, textEnd).trim();

      // Remove the "Ch.X, Sl.Y:" prefix from the text
      const prefixEnd = rawText.indexOf(':');
      const bodyText = prefixEnd >= 0 ? rawText.slice(prefixEnd + 1).trim() : rawText;

      // Separate Sanskrit and English
      const { sanskrit, english } = this.separateContent(bodyText);

      // Skip empty chunks
      if (english.length < 10) continue;

      chunks.push({
        chapterNumber: b.chapter,
        chapterTitle: chapterTitles.get(b.chapter) || '',
        verseStart: b.verseStart,
        verseEnd: b.verseEnd,
        sanskritText: sanskrit,
        translation: english,
        commentary: '',
      });
    }

    // If BPHS pattern didn't match, fall back to generic parsing
    if (chunks.length === 0) {
      return this.fallbackParse(content);
    }

    return chunks;
  }

  private separateContent(text: string): {
    sanskrit: string;
    english: string;
  } {
    const lines = text.split('\n');
    const sanskritLines: string[] = [];
    const englishLines: string[] = [];

    for (const line of lines) {
      if (DEVANAGARI_PATTERN.test(line)) {
        sanskritLines.push(line.trim());
      } else if (line.trim().length > 0) {
        englishLines.push(line.trim());
      }
    }

    return {
      sanskrit: sanskritLines.join('\n'),
      english: englishLines.join(' '),
    };
  }

  private fallbackParse(content: string): RawChunk[] {
    // Split on double newlines, number sequentially
    const chunks: RawChunk[] = [];
    const paragraphs = content.split(/\n\s*\n/);
    let verseNum = 1;
    let currentChapter = 1;

    for (const para of paragraphs) {
      const trimmed = para.trim();
      if (trimmed.length < 20) continue;

      // Check if this is a chapter heading
      const chapterMatch = trimmed.match(/^Chapter\s+(\d+)/i);
      if (chapterMatch) {
        currentChapter = parseInt(chapterMatch[1]);
        verseNum = 1;
        continue;
      }

      chunks.push({
        chapterNumber: currentChapter,
        chapterTitle: '',
        verseStart: verseNum,
        verseEnd: verseNum,
        sanskritText: '',
        translation: trimmed,
        commentary: '',
      });
      verseNum++;
    }

    return chunks;
  }
}
