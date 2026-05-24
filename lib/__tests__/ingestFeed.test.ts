// `jest` must be imported directly from @jest/globals here (not used via globalThis).
// The globalThis.jest set by jest.setup.ts is bound to jest.setup.ts's module
// context, so its _testPath resolves relative paths from the project root, not
// from this test file. Importing locally gives an instance scoped to this file.
import { jest as localJest } from '@jest/globals';
import { PrismaClient } from '../../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// `import type` is erased at compile time — safe before mock registration.
import type { ParsedArticle } from '../fetchAndParseFeed';

// Load from environment — set TEST_DATABASE_URL in GitHub Secrets for CI,
// or export it locally. Falls back to DATABASE_URL if TEST_DATABASE_URL is absent.
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL ?? '';

// ---------------------------------------------------------------------------
// ESM module mocks
//
// jest.unstable_mockModule MUST be registered before the mocked modules are
// imported. In ESM there is no hoisting, so we use dynamic imports (top-level
// await) after this block to receive the mocked versions.
// ---------------------------------------------------------------------------

localJest.unstable_mockModule('../fetchAndParseFeed', () => ({
  fetchAndParseFeed: localJest.fn(),
}));

localJest.unstable_mockModule('../saveArticles', () => ({
  saveArticles: localJest.fn(),
}));

// Dynamic imports — resolved after mock registration so ingestFeed sees the
// mocked versions of its dependencies when evaluated for the first time.
const { fetchAndParseFeed } = await import('../fetchAndParseFeed');
const { saveArticles } = await import('../saveArticles');
const { ingestFeed } = await import('../ingestFeed');

// Typed as jest.Mock so .mockResolvedValue() / .mockReset() etc. compile.
const mockFetch = fetchAndParseFeed as jest.Mock;
const mockSave = saveArticles as jest.Mock;

// ---------------------------------------------------------------------------
// Test database client — used ONLY to assert lastFetchedAt side-effects.
// fetchAndParseFeed and saveArticles are mocked; no real network or article
// storage calls happen in these tests.
// ---------------------------------------------------------------------------

const adapter = new PrismaPg({ connectionString: TEST_DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const SAMPLE_ARTICLES: ParsedArticle[] = [
  {
    title: 'Article One',
    description: 'Summary one.',
    link: 'https://www.bbc.co.uk/news/world-11111111',
    guid: 'guid-world-11111111',
    pubDate: new Date('2026-01-01T09:00:00Z'),
    thumbnailUrl: 'https://ichef.bbci.co.uk/thumb1.jpg',
    thumbnailW: 240,
    thumbnailH: 135,
  },
  {
    title: 'Article Two',
    description: null,
    link: 'https://www.bbc.co.uk/news/world-22222222',
    guid: 'guid-world-22222222',
    pubDate: new Date('2026-01-01T10:00:00Z'),
    thumbnailUrl: null,
    thumbnailW: null,
    thumbnailH: null,
  },
];

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
      url: 'http://feeds.bbci.co.uk/news/rss.xml',
      language: 'en',
      sourceColor: '#BB1919',
    },
  });
  sourceId = source.id;

  mockFetch.mockReset();
  mockSave.mockReset();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ingestFeed', () => {
  // --- 1. Happy path ---

  describe('happy path', () => {
    it('calls fetchAndParseFeed with the feedUrl', async () => {
      mockFetch.mockResolvedValue(SAMPLE_ARTICLES);
      mockSave.mockResolvedValue(2);

      await ingestFeed(sourceId, 'http://feeds.bbci.co.uk/news/rss.xml');

      expect(mockFetch).toHaveBeenCalledWith('http://feeds.bbci.co.uk/news/rss.xml');
    });

    it('calls saveArticles with the sourceId and parsed articles', async () => {
      mockFetch.mockResolvedValue(SAMPLE_ARTICLES);
      mockSave.mockResolvedValue(2);

      await ingestFeed(sourceId, 'http://feeds.bbci.co.uk/news/rss.xml');

      expect(mockSave).toHaveBeenCalledWith(sourceId, SAMPLE_ARTICLES);
    });

    it('returns the count returned by saveArticles', async () => {
      mockFetch.mockResolvedValue(SAMPLE_ARTICLES);
      mockSave.mockResolvedValue(2);

      const result = await ingestFeed(sourceId, 'http://feeds.bbci.co.uk/news/rss.xml');

      expect(result).toBe(2);
    });

    it('updates lastFetchedAt on the source after a successful ingest', async () => {
      mockFetch.mockResolvedValue(SAMPLE_ARTICLES);
      mockSave.mockResolvedValue(2);

      const before = new Date();
      await ingestFeed(sourceId, 'http://feeds.bbci.co.uk/news/rss.xml');
      const after = new Date();

      const source = await prisma.source.findUniqueOrThrow({ where: { id: sourceId } });
      expect(source.lastFetchedAt).not.toBeNull();
      expect(source.lastFetchedAt!.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(source.lastFetchedAt!.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  // --- 2. Empty feed ---

  describe('empty feed', () => {
    it('returns 0 when fetchAndParseFeed returns an empty array', async () => {
      mockFetch.mockResolvedValue([]);
      mockSave.mockResolvedValue(0);

      const result = await ingestFeed(sourceId, 'http://feeds.bbci.co.uk/news/rss.xml');

      expect(result).toBe(0);
    });

    it('still updates lastFetchedAt even when the feed is empty', async () => {
      mockFetch.mockResolvedValue([]);
      mockSave.mockResolvedValue(0);

      const before = new Date();
      await ingestFeed(sourceId, 'http://feeds.bbci.co.uk/news/rss.xml');
      const after = new Date();

      const source = await prisma.source.findUniqueOrThrow({ where: { id: sourceId } });
      expect(source.lastFetchedAt).not.toBeNull();
      expect(source.lastFetchedAt!.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(source.lastFetchedAt!.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  // --- 3. Error handling ---

  describe('error handling', () => {
    it('throws an error if fetchAndParseFeed fails', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(
        ingestFeed(sourceId, 'http://feeds.bbci.co.uk/news/rss.xml')
      ).rejects.toThrow('Network error');
    });

    it('does not update lastFetchedAt if fetchAndParseFeed throws', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      // Consume the rejection so the assertion below can run.
      await expect(
        ingestFeed(sourceId, 'http://feeds.bbci.co.uk/news/rss.xml')
      ).rejects.toThrow();

      const source = await prisma.source.findUniqueOrThrow({ where: { id: sourceId } });
      expect(source.lastFetchedAt).toBeNull();
    });

    it('throws an error if saveArticles fails', async () => {
      mockFetch.mockResolvedValue(SAMPLE_ARTICLES);
      mockSave.mockRejectedValue(new Error('Database error'));

      await expect(
        ingestFeed(sourceId, 'http://feeds.bbci.co.uk/news/rss.xml')
      ).rejects.toThrow('Database error');
    });

    it('does not update lastFetchedAt if saveArticles throws', async () => {
      mockFetch.mockResolvedValue(SAMPLE_ARTICLES);
      mockSave.mockRejectedValue(new Error('Database error'));

      // Consume the rejection so the assertion below can run.
      await expect(
        ingestFeed(sourceId, 'http://feeds.bbci.co.uk/news/rss.xml')
      ).rejects.toThrow();

      const source = await prisma.source.findUniqueOrThrow({ where: { id: sourceId } });
      expect(source.lastFetchedAt).toBeNull();
    });
  });
});
