# Project: News Aggregator — The Feed

## Skills

Always read these before writing any code:
- `.claude/skills/coding-standards/SKILL.md`
- `.claude/skills/testing/SKILL.md`

Available on demand via slash commands:
- `/architecture` — before designing a new feature or making structural decisions
- `/delivery` — before breaking down and implementing a task
- `/debugging` — when investigating a failure

## Tech Stack
- **Framework**: Next.js 15 (TypeScript)
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN/UI
- **ORM**: Prisma 7
- **Validation**: Zod
- **RSS Parser**: rss-parser
- **Testing**: Jest + MSW
- **Database**: PostgreSQL (Render production, Neon test)
- **Hosting**: Vercel (free plan)
- **CI**: GitHub Actions

## Project-specific coding rules

### Language and UI
- Always use TypeScript — never plain JavaScript
- Use ShadCN components for all UI — do not build custom components when
  a ShadCN equivalent exists
- Use Tailwind for all styling — never inline styles
- Open source icons and fonts only (Lucide React, Geist, Instrument Serif)
- All designs must be responsive — mobile and desktop

### Database
- Always import Prisma client from `lib/prisma.ts` — never instantiate
  PrismaClient anywhere else
- Connection pooling via `pg.Pool` inside the shared Prisma client
- Render free tier has ~5 connections — avoid anything that exhausts the pool
- Always run `prisma migrate deploy` before `next build` in production

### Validation
- Use Zod to validate all external data before use or storage
- Never use external data to drive behavior before Zod validation

### RSS Ingestion
- Use `rss-parser` for all feed fetching and parsing
- Strip tracking params from article URLs (`?at_medium=RSS&at_campaign=rss`)
- Strip `#` suffix from guids before storing
- Use `guid` field to prevent duplicate articles — enforced at DB layer
- Handle missing thumbnails gracefully — return `null`, never throw
- Explicit 10s timeout on all feed fetches via `Promise.race`
- Use `Promise.allSettled` for multi-source ingestion

### Authentication (current implementation)
- CRON_SECRET checked inside the cron route handler — not middleware
- This project intentionally deviates from "authentication executes before
  protected business operations" because the middleware pattern requires
  Phase 3 refactoring

### Testing infrastructure
- Use Jest as the test framework
- Use MSW to mock all external HTTP calls
- Always use the Neon test database — never development or production
- Test file naming: `*.test.ts`
- `maxWorkers:1` in Jest — do not change this

### CI
- CI triggers on `pull_request` only — not `push`
- Intentional — avoids simultaneous runs hitting the same test database
- Squash and merge only — no merge commits on main

### Deployment
- Migrations: `prisma migrate deploy` before `next build`
- Seed runs automatically as part of deployment
- Vercel free plan supports daily cron only — do not introduce sub-daily
  scheduling assumptions
- Vercel function timeout applies to all synchronous endpoints — do not
  introduce new long-running synchronous operations

### Security
- Never commit `.env`, `.env.local`, or build artifacts
- `CRON_SECRET` and `TEST_DATABASE_URL` live in GitHub Secrets — never hardcoded

## Known intentional deviations

| Deviation | Reason |
|---|---|
| Auth check inside cron route handler | Middleware approach deferred to Phase 3 |
| Feed refresh executes synchronously within the request lifecycle | Async job processing deferred to Phase 3 |
| No Sentry error tracking | Deferred to Phase 3 |
| No rate limiting | Deferred to Phase 3 |
| No pagination | Deferred to Phase 3 |
| Source filter pills not wired | Deferred to Phase 3 |
| Al Jazeera null thumbnails | Feed does not include media:thumbnail — expected behavior |
| Daily cron only | Vercel free plan limitation |
| maxWorkers:1 in Jest | Prevents test database interference |
| CI on pull_request only | Prevents simultaneous runs hitting test database |
| No automated database backups | Render free tier limitation — must fix before public launch |

## PR Checklist
- [ ] Tests written before implementation (or behavior specified by tests before complete)
- [ ] No test weakened to make it pass — implementation fixed or behavior
  change explicitly validated
- [ ] All external calls mocked in tests
- [ ] No secrets in code or git history
- [ ] No build artifacts committed
- [ ] All external data validated with Zod before use
- [ ] Prisma client imported from `lib/prisma.ts` only
- [ ] All tests passing in CI
