#!/usr/bin/env bash
# Update every hardcoded site URL after deploying.
#
#   ./set-domain.sh https://your-project.vercel.app
#
# Run once you know your real domain. Affects index.html, robots.txt, sitemap.xml.

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "usage: $0 https://your-domain.com" >&2
  exit 1
fi

NEW="${1%/}"                      # strip trailing slash
OLD="https://vicarus.vercel.app"

if [ "$NEW" = "$OLD" ]; then
  echo "Already set to $NEW — nothing to do."
  exit 0
fi

for f in index.html robots.txt sitemap.xml; do
  if [ -f "$f" ]; then
    sed -i.bak "s|${OLD}|${NEW}|g" "$f" && rm -f "$f.bak"
    echo "updated $f"
  fi
done

# refresh sitemap lastmod to today
if [ -f sitemap.xml ]; then
  sed -i.bak "s|<lastmod>.*</lastmod>|<lastmod>$(date +%F)</lastmod>|" sitemap.xml && rm -f sitemap.xml.bak
  echo "updated sitemap lastmod"
fi

echo "Done. Domain is now ${NEW}"
