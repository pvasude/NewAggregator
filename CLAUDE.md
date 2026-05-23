# Project: News Aggregator — The Feed

## Tech Stack
- **Framework**: Next.js (TypeScript)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN/UI
- **ORM**: Prisma
- **Validation**: Zod
- **RSS Parser**: rss-parser
- **Testing**: Jest + MSW

## Rules for Claude

### Code
- Always use TypeScript, never plain JavaScript
- Use ShadCN components for all UI
- Use Tailwind for all styling
- Never use inline styles
- Always use open source icons and fonts
- All designs must be responsive — mobile and desktop
- Always use Zod to validate all external data before storing in database
- Never parse raw strings from external sources without Zod validation
- Always import Prisma client from lib/prisma.ts — never create a new PrismaClient() anywhere else

### TDD
- Always write tests before implementation
- Tests must fail first before writing any implementation code
- Never write tests and implementation at the same time
- Never modify test files to make tests pass — fix the implementation instead
- Run tests after writing them to confirm they fail, then write implementation

### Testing
- Use Jest as the test framework
- Use MSW to mock all external HTTP calls in tests
- Never make real network calls in tests
- Always use a separate test database — never run tests against development or production database
- Seed and tear down test data per test
- Every test must have clear pass/fail criteria
- Test file naming: `*.test.ts`

### Security
- Never put secrets, API keys, or connection strings in code
- Never commit .env files
- Never commit build artifacts (.next, node_modules, dist)
- All external data must be validated with Zod before use

### Database
- Always import Prisma client from lib/prisma.ts
- Never create a new PrismaClient() in any other file
- Always run prisma migrate deploy before next build in production

### RSS Ingestion
- Use rss-parser library for fetching and parsing RSS feeds
- Strip tracking params from article URLs (?at_medium=RSS&at_campaign=rss)
- Strip # suffix from guids before storing
- Use guid field to prevent duplicate articles
- Handle missing thumbnails gracefully (return null)

## PR Checklist
Before raising any PR, confirm:
- [ ] Tests written before implementation
- [ ] Tests never modified to make them pass
- [ ] All external calls mocked in tests
- [ ] No secrets in code or git history
- [ ] No build artifacts committed
- [ ] All external data validated with Zod
- [ ] Single shared Prisma client used everywhere
- [ ] All tests passing
