# Visa Requirements in 1 Click

Vite + React one-page app. Deployable on Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=<YOUR_GITHUB_REPO_URL>&project-name=visa-onepage-saas&repository-name=visa-onepage-saas)

## Local Dev
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```
Outputs to `dist/`.

## CSV-driven dataset
Edit `public/visa_matrix.csv`. Columns:

```
nationality,destination,allowed,fee,processing,stayLimit,notes,lastUpdated,acceptanceRate,documents
```
- **allowed**: `true`/`false`
- **fee**: number (INR)
- **acceptanceRate**: number (0-100)
- **documents**: list separated by `|` (pipe), e.g. `Passport (6 months)|Return ticket|Hotel booking|Proof of funds`

> This app is informational only. Always verify with official sources.

## Deploy
**GitHub → Vercel** (Import repo) or **Vercel CLI**:
```bash
npm i -g vercel
vercel --prod
```
