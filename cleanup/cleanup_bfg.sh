#!/usr/bin/env bash
set -euo pipefail

# === Settings ===
REPO_URL="${REPO_URL:-https://github.com/cejohns/FireStarGamingBlog.git}"
MIRROR_DIR="${MIRROR_DIR:-FireStarGamingBlog.git}"
BFG_JAR="${BFG_JAR:-bfg.jar}"

echo ">>> Mirror cloning $REPO_URL"
git clone --mirror "$REPO_URL" "$MIRROR_DIR"
cd "$MIRROR_DIR"

echo ">>> Preparing file list to delete across history"
cat > files-to-delete.txt <<'EOF'
.env
.env.local
cert.pem
key.pem
server.key
server.cert
id_rsa
id_rsa.pub
*.pfx
*.crt
*.csr
node_modules
EOF

echo ">>> Running BFG (ensure $BFG_JAR exists in this directory)"
java -jar "$BFG_JAR" --delete-files files-to-delete.txt .

echo ">>> Cleaning and force-pushing"
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force --all
git push --force --tags

echo ">>> Done. All contributors must re-clone the repository."
