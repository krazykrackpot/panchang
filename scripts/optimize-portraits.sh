#!/bin/bash
# scripts/optimize-portraits.sh — convert Sadhaka Path portraits to webp.
set -euo pipefail
cd "$(dirname "$0")/.."

for f in public/sadhaka-path/*.png; do
  out="${f%.png}.webp"
  cwebp -q 85 -mt "$f" -o "$out"
  echo "→ $out ($(wc -c < "$out") bytes)"
done
