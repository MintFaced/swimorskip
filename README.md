# Swim or Skip? 🏊

**Hawke's Bay water quality — honestly.**

An interactive site exploring how river and beach water quality in Hawke's Bay has changed since the 1980s, and how it compares to the rest of New Zealand. Built on public LAWA, HBRC, and NIWA data.

## Features

- **Back in My Day** — time-slider hero that rewinds to any year from 1985–2024. All rivers update simultaneously with animated E. coli bars and era-contextual storytelling.
- **Rivers Today** — current grades and trends for all major Hawke's Bay waterways including Westshore Estuary.
- **National Picture** — how Hawke's Bay compares to all 12 NZ regions.

## Data Sources

- [LAWA (Land, Air, Water New Zealand)](https://www.lawa.org.nz/) — CC BY 4.0
- Hawke's Bay Regional Council (HBRC) monitoring network
- NIWA Water Quality Information System

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deploy to Railway

1. Push this repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
3. Select this repo — Railway auto-detects Vite and builds it
4. Done. Your app will be live at a `*.railway.app` URL within ~2 minutes.

The `railway.json` and `Procfile` are already configured. No environment variables needed.

## Build for production

```bash
npm run build
npm run start   # previews the built output
```
