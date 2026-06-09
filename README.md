# CompSci Year End Project - View Guesser

Guess which music video has more YouTube views. Built for IB Computer Science SL.

## Structure
- `documentation/` - group norms, specification, Gantt chart
- `product/` - HTML/CSS/JS app + Vercel API

## Local Start
```bash
cd product
npx vercel dev
```
Open http://localhost:3000

Optional: copy `.env.example` to `.env.local` and add a [YouTube Data API key](https://console.cloud.google.com/) for live view counts. Without it, cached fallback counts are used.

## Deploy on Vercel
```bash
cd product
npx vercel
```
Set `YOUTUBE_API_KEY` in the Vercel project Environment Variables.

## Start Commands Summary
| Command | Purpose |
|---------|---------|
| `cd product && npx vercel dev` | Run locally |
| `cd product && npx vercel` | Deploy to Vercel |
| `cd product && npx vercel --prod` | Production deploy |
