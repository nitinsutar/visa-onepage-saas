# Visa Requirements in 1 Click — Tailwind UI

A one-page Vite + React app styled with **Tailwind CSS**.

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```
Output: `dist/`

## Deploy
- **GitHub → Vercel** (Import repo) or
- **Vercel CLI**: `npm i -g vercel && vercel --prod`

## Data
Place your CSV at `public/visa_matrix.csv` with fields like:
```
nationality,destination,allowed,fee,processing,stayLimit,acceptanceRate,documentsRequired,notes,lastUpdated,currency
```
The app reads it at runtime (no rebuild required for content changes).

## Disclaimer
Informational only. Always verify with official sources before travel.
