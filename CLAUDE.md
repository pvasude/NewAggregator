# Project: News Aggregator

## Tech Stack
- **Framework**: Next.js (TypeScript)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN/UI
- **ORM**: Prisma
- **Validation**: Zod
- **RSS Parser**: rss-parser

## Rules for Claude
- Always use TypeScript, never plain JavaScript
- Use ShadCN components for all UI
- Use Tailwind for all styling
- Never use inline styles
- Always use open source icons and fonts
- All designs must be responsive — mobile and desktop
- Use hardcoded dummy data until database is connected
- Always use Zod to validate all external data before storing in database
- Never parse raw strings from external sources without Zod validation

## RSS Ingestion
- Use rss-parser library for fetching and parsing RSS feeds
- Strip tracking params from article URLs (?at_medium=RSS&at_campaign=rss)
- Always validate parsed data with Zod before storing
- Use guid field to prevent duplicate articles

## Testing
- Use Jest as the test framework
- Use MSW (Mock Service Worker) to mock all external HTTP calls in tests
- Never make real network calls in tests
- Use a separate test database — seed and tear down per test
- Always write tests before implementation (TDD)
- Tests must fail first before writing any implementation code
- Every test should have clear pass/fail criteria
- Test file naming: `*.test.ts`