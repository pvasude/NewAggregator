Please update README.md with a comprehensive one-pager about this project. Write it for both human developers and AI coding agents who will parse this repo.

Include:

## The Feed — News Aggregator

### What this is
A news aggregation web app that ingests RSS feeds from multiple sources, stores articles in a database, and surfaces them in a clean readable feed.

### Current capabilities
- Ingests BBC News and Al Jazeera RSS feeds
- Parses and stores articles in PostgreSQL (deduplication via guid)
- Displays articles in a responsive feed UI with source colour coding
- Manual refresh button triggers immediate ingestion of all sources
- Auto-refresh via Vercel Cron once daily at midnight UTC
- Graceful handling of missing thumbnails and feed errors

### Tech stack
- Framework: Next.js 15 (TypeScript)
- UI: ShadCN/UI + Tailwind CSS
- Fonts/Icons: Geist, Instrument Serif, Lucide React (all open source)
- ORM: Prisma 7
- Database: PostgreSQL (Render)
- Validation: Zod
- RSS Parser: rss-parser
- Hosting: Vercel
- Testing: Jest (77 tests)

### Architecture
- lib/fetchAndParseFeed.ts — fetches and parses RSS XML into structured articles
- lib/saveArticles.ts — stores parsed articles, skips duplicates via guid
- lib/ingestFeed.ts — orchestrates fetch → save → updates lastFetchedAt
- app/api/feed/route.ts — GET returns articles ordered by pubDate desc
- app/api/feed/refresh/route.ts — POST triggers ingestion for all sources
- app/api/cron/route.ts — GET endpoint called by Vercel Cron, protected by CRON_SECRET
- components/feed/ — all UI components
- prisma/schema.prisma — Source and Article tables

### Database schema
Source: id, name, url, language, sourceColor, lastFetchedAt, createdAt
Article: id, sourceId, title, description, link, guid (unique), pubDate, thumbnailUrl, thumbnailW, thumbnailH, createdAt

### Known limitations
- Al Jazeera RSS feed does not include thumbnails
- Cron runs once daily on Vercel free plan (manual refresh available anytime)
- No authentication or user accounts yet

### Environment variables required
- DATABASE_URL — PostgreSQL connection string
- CRON_SECRET — secret token for cron endpoint protection

### Running locally
npm install
npm run dev
Visit http://localhost:3000
