#!/usr/bin/env python3
"""Backfill `mr` (Marathi) keys into message files that were authored before
PR #170 restored mr to active locales (2026-05-25). Each leaf locale-dict that
already carries `en` but no `mr` gets `mr: <en value>` as parity until proper
translation lands via /translate-locale.

Same shape as Sprint 6's i18n parity backfill (#139) which covered the eight
locales active before mr was restored. Matches `getMessageFallback` semantics
in src/lib/i18n/request.ts — EN-as-fallback is non-negotiable.

Idempotent: only writes a file if at least one key was added. Re-running on a
fully-backfilled file is a no-op."""

import json
import os
import sys
from glob import glob

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MESSAGES_DIR = os.path.join(REPO, 'src', 'messages')

added_per_file: dict[str, int] = {}


def backfill(node):
    # Lists: recurse so we catch dicts-inside-arrays (Gemini #205 review).
    if isinstance(node, list):
        added = 0
        for item in node:
            added += backfill(item)
        return added
    if not isinstance(node, dict):
        return 0
    # Leaf locale-dict heuristic: `en` present + no nested-dict values.
    # Tolerates array-valued leaves like `keyTakeawayPoints: { en: [...],
    # hi: [...], mai: [...] }` in src/messages/learn/modules/27-1.json. The
    # earlier all-strings check missed these silently — `next-intl` accepts
    # message-array values, so `mr: <en list>` is a valid placeholder copy.
    if 'en' in node and 'mr' not in node and all(not isinstance(v, dict) for v in node.values()):
        node['mr'] = node['en']
        return 1
    added = 0
    for v in node.values():
        added += backfill(v)
    return added


def main():
    paths = sorted(glob(os.path.join(MESSAGES_DIR, '**', '*.json'), recursive=True))
    files_touched = 0
    total_added = 0
    for path in paths:
        with open(path, encoding='utf-8') as f:
            data = json.load(f)
        added = backfill(data)
        if added > 0:
            with open(path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
                f.write('\n')
            rel = os.path.relpath(path, REPO)
            added_per_file[rel] = added
            files_touched += 1
            total_added += added
    print(f'backfilled mr parity into {files_touched} file(s); {total_added} key(s) added')
    for rel, n in sorted(added_per_file.items()):
        print(f'  +{n:>4}  {rel}')


if __name__ == '__main__':
    sys.exit(main())
