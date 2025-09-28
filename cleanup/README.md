# FireStarGamingBlog — History Cleanup

This folder contains **two** options to purge committed secrets and large folders like `node_modules` from your repo history. 
**Rotate any leaked secrets first** (JWTs, SMTP creds, certs), then proceed.

> ⚠️ These commands REWRITE GIT HISTORY. All collaborators must re-clone after you push the rewritten history.

## Quick Start (Recommended: git-filter-repo)

1. Install `git-filter-repo`  
   - Windows (Python): `pip install git-filter-repo`  
   - macOS: `brew install git-filter-repo`
2. Run `cleanup_filter_repo.sh` (Bash) or copy/paste its commands into Git Bash/WSL/Terminal.
3. Force-push the rewritten history.
4. Ask collaborators to **re-clone** the repo.

## Alternative: BFG Repo-Cleaner

If you prefer BFG, use `cleanup_bfg.sh` and download BFG jar from: https://rtyley.github.io/bfg-repo-cleaner/
