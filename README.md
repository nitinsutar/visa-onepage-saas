# Visa Requirements in 1 Click — Ultimate Build (v2.0)

**Included**
- Tailwind UI + SEO
- CSV baseline (multinational sample at `public/visa_matrix.csv`)
- Dynamic currency symbols, documents list, stay-limit fix (hide 0)
- “Check latest (Beta)” — parse official sources with OpenAI Structured JSON
- **48h KV caching**, **domain whitelist**, **admin workflow** (propose → approve overrides)

**Env vars (Vercel → Settings → Environment Variables)**
- `OPENAI_API_KEY` – your OpenAI key
- `KV_REST_API_URL`, `KV_REST_API_TOKEN` – Vercel KV
- `ADMIN_PASS` – any password you choose for approvals

**Admin flow**
1) User runs “Check latest” and clicks **Propose update** → stored in KV `pending:*`.
2) Admin POST `/api/approve` with header `x-admin-key: ADMIN_PASS` and JSON `{ nationality, destination }`.
3) Approved record is stored to KV as `override:*` and auto-merged on the frontend.

**Run locally**
```bash
npm install
npm run dev
```

**Deploy**
- Push to GitHub and import into Vercel, or
- `npm i -g vercel && vercel --prod`
