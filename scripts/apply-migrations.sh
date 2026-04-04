#!/bin/bash
# Apply pending Supabase migrations
# Usage: ./scripts/apply-migrations.sh
#
# Requires SUPABASE_DB_URL in .env.local, e.g.:
# SUPABASE_DB_URL=postgresql://postgres.qtxbbeyjvkhvciseswpr:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres

set -e

# Load env
if [ -f .env.local ]; then
  export $(grep SUPABASE_DB_URL .env.local | xargs)
fi

if [ -z "$SUPABASE_DB_URL" ]; then
  echo "Error: SUPABASE_DB_URL not set in .env.local"
  echo ""
  echo "Add this to .env.local:"
  echo "SUPABASE_DB_URL=postgresql://postgres.qtxbbeyjvkhvciseswpr:[YOUR_DB_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres"
  echo ""
  echo "Find your DB password in: Supabase Dashboard → Settings → Database → Connection string"
  exit 1
fi

echo "Applying migrations..."
npx supabase db push --db-url "$SUPABASE_DB_URL"
echo "Done!"
