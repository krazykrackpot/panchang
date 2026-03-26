/**
 * Generic Verse Parser
 *
 * Handles common patterns found in English translations of classical Jyotish texts.
 * Supports multiple verse boundary formats and groups consecutive verses.
 */

import type { RawChunk, TextParser } from '../../src/lib/rag/types';

// Common verse boundary patterns across different text editions
const VERSE_PATTERNS = [
  // "Ch. 22, Sl. 3-4:" or "Chapter 22, Shloka 3-4:"
  /(?:Ch(?:apter)?\.?\s*(\d+))[\s,]*(?:Sl(?:oka)?\.?\s*(\d+)(?:\s*[-–]\s*(\d+))?)/i,
  // "22.3" or "22.3-4"
  /^(\d+)\.(\d+)(?:\s*[-–]\s*(\d+))?\s*[.:]/m,
  // "Verse 3:" or "Shloka 3:"
  /(?:Verse|Shloka|Sl\.)\s*(\d+)(?:\s*[-–]\s*(\d+))?[\s.:]/i,
  // "3." at start of line (simple numbering)
  /^(\d+)\.\s+/m,
];

// Sanskrit shloka detector (Devanagari Unicode range)
const DEVANAGARI_PATTERN = /[\u0900-\u097F]{4,}/;

export class GenericVerseParser implements TextParser {
  readonly textName: string;
  readonly textFullName: string;

  constructor(textName: string, textFullName: string) {
    this.textName = textName;
    this.textFullName = textFullName;
  }

  parse(content: string): RawChunk[] {
    const chunks: RawChunk[] = [];

    // Try chapter-based splitting first
    const chapters = this.splitIntoChapters(content);

    for (const chapter of chapters) {
      const verses = this.splitIntoVerses(chapter.content);

      for (const verse of verses) {
        const hasSanskrit = DEVANAGARI_PATTERN.test(verse.text);
        const { sanskrit, english } = hasSanskrit
          ? this.separateSanskritEnglish(verse.text)
          : { sanskrit: '', english: verse.text };

        chunks.push({
          chapterNumber: chapter.number,
          chapterTitle: chapter.title,
          verseStart: verse.start,
          verseEnd: verse.end,
          sanskritText: sanskrit.trim(),
          translation: english.trim(),
          commentary: '',
        });
      }
    }

    // If chapter splitting failed, treat entire text as one chapter
    if (chunks.length === 0) {
      const paragraphs = this.splitIntoParagraphs(content);
      let verseNum = 1;
      for (const para of paragraphs) {
        if (para.trim().length < 20) continue;
        chunks.push({
          chapterNumber: 1,
          chapterTitle: '',
          verseStart: verseNum,
          verseEnd: verseNum,
          sanskritText: '',
          translation: para.trim(),
          commentary: '',
        });
        verseNum++;
      }
    }

    return chunks;
  }

  private splitIntoChapters(
    content: string
  ): Array<{ number: number; title: string; content: string }> {
    const chapterPattern =
      /(?:^|\n)(?:Chapter|CHAPTER|Ch\.?)\s*(\d+)[.:\s]*[-–]?\s*([^\n]*)/gi;
    const chapters: Array<{
      number: number;
      title: string;
      start: number;
    }> = [];

    let match;
    while ((match = chapterPattern.exec(content)) !== null) {
      chapters.push({
        number: parseInt(match[1]),
        title: match[2]?.trim() || '',
        start: match.index,
      });
    }

    if (chapters.length === 0) {
      return [{ number: 1, title: '', content }];
    }

    return chapters.map((ch, i) => {
      const end = i < chapters.length - 1 ? chapters[i + 1].start : content.length;
      return {
        number: ch.number,
        title: ch.title,
        content: content.slice(ch.start, end),
      };
    });
  }

  private splitIntoVerses(
    content: string
  ): Array<{ start: number; end: number; text: string }> {
    const verses: Array<{ start: number; end: number; text: string }> = [];

    // Try each verse pattern to find boundaries
    for (const pattern of VERSE_PATTERNS) {
      const globalPattern = new RegExp(pattern.source, pattern.flags + (pattern.flags.includes('g') ? '' : 'g'));
      const matches: Array<{
        index: number;
        verseStart: number;
        verseEnd: number;
      }> = [];

      let m;
      while ((m = globalPattern.exec(content)) !== null) {
        const groups = m.slice(1).filter(Boolean).map(Number);
        // For patterns with chapter.verse format, skip chapter number
        const vStart = groups.length >= 2 ? groups[1] : groups[0];
        const vEnd = groups.length >= 3 ? groups[2] : (groups.length >= 2 ? groups[1] : groups[0]);
        matches.push({
          index: m.index,
          verseStart: vStart || 1,
          verseEnd: vEnd || vStart || 1,
        });
      }

      if (matches.length >= 3) {
        // This pattern found enough verses — use it
        for (let i = 0; i < matches.length; i++) {
          const textEnd =
            i < matches.length - 1 ? matches[i + 1].index : content.length;
          verses.push({
            start: matches[i].verseStart,
            end: matches[i].verseEnd,
            text: content.slice(matches[i].index, textEnd).trim(),
          });
        }
        break;
      }
    }

    // Fallback: split by double newlines
    if (verses.length === 0) {
      const paragraphs = content.split(/\n\s*\n/);
      let num = 1;
      for (const p of paragraphs) {
        if (p.trim().length > 20) {
          verses.push({ start: num, end: num, text: p.trim() });
          num++;
        }
      }
    }

    return verses;
  }

  private separateSanskritEnglish(text: string): {
    sanskrit: string;
    english: string;
  } {
    const lines = text.split('\n');
    const sanskritLines: string[] = [];
    const englishLines: string[] = [];

    for (const line of lines) {
      if (DEVANAGARI_PATTERN.test(line)) {
        sanskritLines.push(line);
      } else {
        englishLines.push(line);
      }
    }

    return {
      sanskrit: sanskritLines.join('\n'),
      english: englishLines.join('\n'),
    };
  }

  private splitIntoParagraphs(content: string): string[] {
    return content
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }
}
