#!/usr/bin/env npx tsx
// scripts/award-translation.ts <user_id>
// Manually grants Acharya (level 6) via the translation_accepted event.
import { awardProgress } from '../src/lib/gamification/award';

const userId = process.argv[2];
if (!userId) { console.error('Usage: award-translation.ts <user_id>'); process.exit(1); }

awardProgress(userId, { type: 'translation_accepted' })
  .then(r => { console.log('Result:', r); })
  .catch(err => { console.error(err); process.exit(1); });
