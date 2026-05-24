import { PrismaClient } from '../../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type { ParsedArticle } from '../fetchAndParseFeed';
import { saveArticles } from '../saveArticles';

// Load from environment — set TEST_DATABASE_URL in GitHub Secrets for CI,
// or export it locally. Falls back to DATABASE_URL if TEST_DATABASE_URL is absent.
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL ?? '';

const adapter = new PrismaPg({ connectionString: TEST_DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeArticle(overrides: Partial<ParsedArticle> = {}): ParsedArticle {
  return {
    title: 'Test Article',
    description: 'A short summary.',
    link: 'https://www.bbc.co.uk/news/test-article',
    guid: `guid-${Date.now()}-${Math.random()}`,
    pubDate: new Date('2026-01-01T12:00:00Z'),
    thumbnailUrl: 'https://ichef.bbci.co.uk/thumbnail.jpg',
    thumbnailW: 240,
    thumbnailH: 135,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

let sourceId: number;

beforeEach(async () => {
  await prisma.article.deleteMany();
  await prisma.source.deleteMany();

  const source = await prisma.source.create({
    data: {
      name: 'BBC News',
      url: 'https://feeds.bbci.co.uk/news/rss.xml',
      language: 'en',
      sourceColor: '#BB1919',
    },
  });
  sourceId = source.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('saveArticles', () => {
  // --- 1. Saves new articles ---

  describe('saving new articles', () => {
    it('inserts all articles when none exist yet', async () => {
      const articles = [
        makeArticle({ guid: 'new-guid-1' }),
        makeArticle({ guid: 'new-guid-2' }),
        makeArticle({ guid: 'new-guid-3' }),
      ];

      await saveArticles(sourceId, articles);

      const saved = await prisma.article.findMany();
      expect(saved).toHaveLength(3);
    });

    it('stores all fields correctly on each saved article', async () => {
      const article = makeArticle({
        guid: 'all-fields-guid',
        title: 'Scientists find new planet',
        description: 'A new planet was discovered.',
        link: 'https://www.bbc.co.uk/news/science-99999',
        pubDate: new Date('2026-05-22T10:00:00Z'),
        thumbnailUrl: 'https://ichef.bbci.co.uk/planet.jpg',
        thumbnailW: 480,
        thumbnailH: 270,
      });

      await saveArticles(sourceId, [article]);

      const saved = await prisma.article.findFirst({
        where: { guid: 'all-fields-guid' },
      });

      expect(saved?.sourceId).toBe(sourceId);
      expect(saved?.title).toBe('Scientists find new planet');
      expect(saved?.description).toBe('A new planet was discovered.');
      expect(saved?.link).toBe('https://www.bbc.co.uk/news/science-99999');
      expect(saved?.guid).toBe('all-fields-guid');
      expect(saved?.pubDate.toISOString()).toBe('2026-05-22T10:00:00.000Z');
      expect(saved?.thumbnailUrl).toBe('https://ichef.bbci.co.uk/planet.jpg');
      expect(saved?.thumbnailW).toBe(480);
      expect(saved?.thumbnailH).toBe(270);
    });

    it('stores null description when description is null', async () => {
      const article = makeArticle({ guid: 'null-desc-guid', description: null });

      await saveArticles(sourceId, [article]);

      const saved = await prisma.article.findFirst({
        where: { guid: 'null-desc-guid' },
      });
      expect(saved?.description).toBeNull();
    });

    it('stores null thumbnail fields when thumbnail is absent', async () => {
      const article = makeArticle({
        guid: 'null-thumb-guid',
        thumbnailUrl: null,
        thumbnailW: null,
        thumbnailH: null,
      });

      await saveArticles(sourceId, [article]);

      const saved = await prisma.article.findFirst({
        where: { guid: 'null-thumb-guid' },
      });
      expect(saved?.thumbnailUrl).toBeNull();
      expect(saved?.thumbnailW).toBeNull();
      expect(saved?.thumbnailH).toBeNull();
    });
  });

  // --- 2. Prevents duplicates via guid ---

  describe('preventing duplicate guids', () => {
    it('skips an article whose guid already exists in the database', async () => {
      const article = makeArticle({ guid: 'dup-guid' });

      await saveArticles(sourceId, [article]);
      await saveArticles(sourceId, [article]); // same guid

      const count = await prisma.article.count({ where: { guid: 'dup-guid' } });
      expect(count).toBe(1);
    });

    it('does not update an existing article when guid matches', async () => {
      const original = makeArticle({ guid: 'no-update-guid', title: 'Original Title' });
      await saveArticles(sourceId, [original]);

      const withNewTitle = makeArticle({ guid: 'no-update-guid', title: 'Updated Title' });
      await saveArticles(sourceId, [withNewTitle]);

      const saved = await prisma.article.findFirst({
        where: { guid: 'no-update-guid' },
      });
      expect(saved?.title).toBe('Original Title');
    });

    it('inserts only new articles when the batch contains existing guids', async () => {
      const existing = makeArticle({ guid: 'already-exists' });
      await saveArticles(sourceId, [existing]);

      const newOne = makeArticle({ guid: 'brand-new' });
      await saveArticles(sourceId, [existing, newOne]);

      const total = await prisma.article.count();
      expect(total).toBe(2);
    });
  });

  // --- 3. Empty array ---

  describe('empty array', () => {
    it('returns 0 when passed an empty array', async () => {
      const result = await saveArticles(sourceId, []);
      expect(result).toBe(0);
    });

    it('does not modify the database when passed an empty array', async () => {
      const article = makeArticle({ guid: 'pre-existing' });
      await saveArticles(sourceId, [article]);

      const countBefore = await prisma.article.count();
      await saveArticles(sourceId, []);
      const countAfter = await prisma.article.count();

      expect(countAfter).toBe(countBefore);
    });
  });

  // --- 4. Returns count of newly inserted articles ---

  describe('return value', () => {
    it('returns the number of newly inserted articles', async () => {
      const articles = [
        makeArticle({ guid: 'count-guid-1' }),
        makeArticle({ guid: 'count-guid-2' }),
        makeArticle({ guid: 'count-guid-3' }),
      ];

      const result = await saveArticles(sourceId, articles);
      expect(result).toBe(3);
    });

    it('returns 0 when all articles already exist in the database', async () => {
      const articles = [
        makeArticle({ guid: 'all-existing-1' }),
        makeArticle({ guid: 'all-existing-2' }),
      ];

      await saveArticles(sourceId, articles);
      const result = await saveArticles(sourceId, articles);

      expect(result).toBe(0);
    });

    it('returns only the count of newly inserted articles in a mixed batch', async () => {
      const existing = makeArticle({ guid: 'mixed-existing-guid' });
      await saveArticles(sourceId, [existing]);

      const batch = [
        existing,
        makeArticle({ guid: 'mixed-new-guid-1' }),
        makeArticle({ guid: 'mixed-new-guid-2' }),
      ];
      const result = await saveArticles(sourceId, batch);

      expect(result).toBe(2);
    });
  });
});
