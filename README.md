# Visa Requirements in 1 Click — SEO + GEO Optimized

- Tailwind UI/UX, CSV-driven content
- SEO essentials: dynamic titles/descriptions, OpenGraph, Twitter cards, canonical, robots.txt, sitemap.xml
- JSON-LD for WebSite & Dataset (LLM-friendly)
- URL params for shareable routes: `?nationality=India&destination=Thailand`

## Run locally
```bash
npm install
npm run dev
```

## Deploy
- GitHub → Vercel (Import repo) or
- CLI: `npm i -g vercel && vercel --prod`

## Replace placeholders
- In `public/sitemap.xml` and `public/robots.txt`, replace `your-domain.vercel.app` with your real domain.
- Add a real `public/og.png` image (1200x630).

## Data
Update `public/visa_matrix.csv` anytime and redeploy or let Vercel auto-redeploy on commit.
