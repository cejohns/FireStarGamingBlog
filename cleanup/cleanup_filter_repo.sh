#!/usr/bin/env bash
set -euo pipefail

# === Settings ===
REPO_URL="${REPO_URL:-https://github.com/cejohns/FireStarGamingBlog.git}"
MIRROR_DIR="${MIRROR_DIR:-FireStarGamingBlog.git}"

echo ">>> Mirror cloning $REPO_URL"
git clone --mirror "$REPO_URL" "$MIRROR_DIR"
cd "$MIRROR_DIR"

echo ">>> Running git-filter-repo to remove sensitive files & directories across history"
# Add or remove --path entries as needed for your repo
git filter-repo --invert-paths \
  --path .env \
  --path .env.local \
  --path cert.pem \
  --path key.pem \
  --path server.key \
  --path server.cert \
  --path id_rsa \
  --path id_rsa.pub \
  --path-glob '*.pfx' \
  --path-glob '*.crt' \
  --path-glob '*.csr' \
  --path node_modules \
  --force

echo ">>> Force-pushing rewritten history (all branches + tags)"
git push --force --all
git push --force --tags

echo ">>> Done. All contributors must re-clone the repository."
