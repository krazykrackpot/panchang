#!/bin/bash
# Generate narration audio for a video using Google Cloud TTS
#
# Prerequisites:
#   1. Enable Cloud TTS API: https://console.cloud.google.com/apis/library/texttospeech.googleapis.com
#   2. Create API key: https://console.cloud.google.com/apis/credentials
#   3. export GOOGLE_CLOUD_TTS_KEY=your_key_here  (or add to .env.local)
#
# Usage:
#   ./scripts/video/generate-narration.sh 001-seven-days
#   ./scripts/video/generate-narration.sh 001-seven-days en    # English only
#   ./scripts/video/generate-narration.sh 001-seven-days hi    # Hindi only

set -euo pipefail

VIDEO_ID="${1:?Usage: generate-narration.sh <video-id> [lang]}"
LANG="${2:-all}"
DIR="scripts/video/${VIDEO_ID}"

# Load API key from .env.local if not in environment
if [ -z "${GOOGLE_CLOUD_TTS_KEY:-}" ] && [ -f .env.local ]; then
  export GOOGLE_CLOUD_TTS_KEY=$(grep GOOGLE_CLOUD_TTS_KEY .env.local | cut -d= -f2)
fi

if [ -z "${GOOGLE_CLOUD_TTS_KEY:-}" ]; then
  echo "ERROR: GOOGLE_CLOUD_TTS_KEY not set"
  echo "Get one at: https://console.cloud.google.com/apis/credentials"
  exit 1
fi

generate() {
  local lang=$1
  local input="${DIR}/narration-${lang}.txt"
  local output="${DIR}/narration-${lang}.mp3"

  if [ ! -f "$input" ]; then
    echo "SKIP: ${input} not found"
    return
  fi

  echo "=== Generating ${lang} narration ==="
  npx tsx scripts/video/lib/google-tts.ts --lang "$lang" --input "$input" --output "$output"
  echo ""
}

if [ "$LANG" = "all" ]; then
  generate en
  generate hi
else
  generate "$LANG"
fi

echo "Done! Files in ${DIR}/"
ls -la "${DIR}/"*.mp3 2>/dev/null || echo "(no mp3 files yet — check API key)"
