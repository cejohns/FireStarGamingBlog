# FireStar API — Deployment Bundle

This bundle gives you three deployment paths:

1) **Docker** (any VPS or Docker host) — `Dockerfile` + `docker-compose.yml` + optional Caddy reverse proxy  
2) **PM2 + Nginx** (no Docker, single VM) — `ecosystem.config.js` + `nginx` snippet  
3) **Render (Docker)** — `render.yaml` (one-click style)  

Also included:
- `.env.production.example` — copy to set required prod env vars
- `.github/workflows/deploy.yml` — build and push an image to GHCR

---

## 0) Prepare production secrets
- **Rotate** any dev/test secrets before going public.
- Set these in your platform/VM (never commit real values):
  - `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `PORT` (if platform requires).

Copy the template:
```
cp .env.production.example .env.production
# Edit values (if deploying via docker-compose, the compose file reads from your shell env or an .env file next to it)
```

---

## 1) Docker on a VPS (with optional Caddy TLS)
On your server (Ubuntu 22.04+ recommended):

```bash
git clone <your_repo>
cd <your_repo>

# Option A) Quick run exposing 5000
docker build -t firestar-api .
docker run -d --name firestar_api --restart unless-stopped \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e MONGO_URI="..." \
  -e JWT_SECRET="..." \
  -e CORS_ORIGIN="https://your-frontend-domain.com" \
  firestar-api

# Option B) docker-compose with Caddy TLS on api.your-domain.com
# 1. Edit Caddyfile domain names
# 2. Ensure DNS for api.your-domain.com points to this server
docker compose up -d
```

Health check: `curl -i http://localhost:5000/healthz` should return **204**.

---

## 2) PM2 + Nginx (no Docker)
On your VM:

```bash
# Install Node 20 and PM2
npm i -g pm2

# Pull code and install prod deps
git clone <your_repo> && cd <your_repo>
npm ci --only=production

# Start
pm2 start ecosystem.config.js
pm2 save && pm2 startup
```

Nginx reverse proxy (Ubuntu):
- Save the provided `nginx/firestar_api.conf` to `/etc/nginx/sites-available/firestar_api`.
- Link and reload:
```bash
sudo ln -s /etc/nginx/sites-available/firestar_api /etc/nginx/sites-enabled/firestar_api
sudo nginx -t && sudo systemctl reload nginx
```

---

## 3) Render (Docker)
- Commit the `Dockerfile` and `render.yaml`. Push to your GitHub repo.
- In Render, create a **Web Service** from repo, Environment = Docker.
- Set env vars for `MONGO_URI`, `JWT_SECRET`, optionally `CORS_ORIGIN`.
- Health check path: `/healthz`

---

## 4) GitHub Actions (optional, for GHCR)
- On push to `main`, the workflow builds and pushes `ghcr.io/<owner>/firestar-api:latest`.
- On your server, you can then `docker pull ghcr.io/<owner>/firestar-api:latest` and restart.

---

## Notes
- Keep `CORS_ORIGIN` tight to your real site (comma-separate if multiple).
- Ensure MongoDB has backups (provider snapshots).
- Add monitoring/alerts (uptime on `/healthz`, logs export).

Happy shipping! 🚀
