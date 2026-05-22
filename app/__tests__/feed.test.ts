// `jest` must be imported directly from @jest/globals here (not used via globalThis).
// The globalThis.jest set by jest.setup.ts is bound to jest.setup.ts's module
// context, so its _testPath resolves relative paths from the project root, not
// from this test file. Importing locally gives an instance scoped to this file.
import { jest as localJest } from '@jest/globals';

// ---------------------------------------------------------------------------
// ESM module mocks
//
// jest.unstable_mockModule MUST be registered before the mocked modules are
// imported. In ESM there is no hoisting, so we use dynamic imports (top-level
// await) after this block to receive the mocked versions.
// ---------------------------------------------------------------------------

// Provide a minimal NextResponse.json shim backed by the standard Web API
// Response so tests can inspect status and body without the Next.js runtime.
localJest.unstable_mockModule('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(data), {
        status: init?.status ?? 200,
        headers: { 'content-type': 'application/json' },
      }),
  },
}));

const mockArticleFindMany = localJest.fn();
const mockSourceFindMany = localJest.fn();

localJest.unstable_mockModule('@/lib/prisma', () => ({
  prisma: {
    article: { findMany: mockArticleFindMany },
    source: { findMany: mockSourceFindMany },
  },
}));

const mockIngestFeed = localJest.fn();

localJest.unstable_mockModule('@/lib/ingestFeed', () => ({
  ingestFeed: mockIngestFeed,
}));

// Dynamic imports — resolved after mock registration so route handlers see the
// mocked versions of their dependencies when evaluated for the first time.
const { GET } = await import('../api/feed/route');
const { POST } = await import('../api/feed/refresh/route');

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const SOURCE_BBC = {
  id: 1,
  name: 'BBC News',
  url: 'http://feeds.bbci.co.uk/news/rss.xml',
  language: 'en-gb',
  sourceColor: '#BB1919',
  lastFetchedAt: null,
  createdAt: new Date('2026-01-01T00:00:00Z'),
};

const SOURCE_AJ = {
  id: 2,
  name: 'Al Jazeera',
  url: 'https://www.aljazeera.com/xml/rss/all.xml',
  language: 'en',
  sourceColor: '#D4A017',
  lastFetchedAt: null,
  createdAt: new Date('2026-01-01T00:00:00Z'),
};

// Articles already ordered by pubDate desc (newest first) as the DB would return.
const SAMPLE_ARTICLES = [
  {
    id: 2,
    sourceId: 1,
    title: 'Article Two',
    description: 'Summary two.',
    link: 'https://www.bbc.co.uk/news/world-22222222',
    guid: 'guid-world-22222222',
    pubDate: new Date('2026-01-01T10:00:00Z'),
    thumbnailUrl: 'https://ichef.bbci.co.uk/thumb2.jpg',
    thumbnailW: 240,
    thumbnailH: 135,
    createdAt: new Date('2026-01-01T10:00:00Z'),
    source: { name: 'BBC News', sourceColor: '#BB1919' },
  },
  {
    id: 1,
    sourceId: 1,
    title: 'Article One',
    description: 'Summary one.',
    link: 'https://www.bbc.co.uk/news/world-11111111',
    guid: 'guid-world-11111111',
    pubDate: new Date('2026-01-01T09:00:00Z'),
    thumbnailUrl: null,
    thumbnailW: null,
    thumbnailH: null,
    createdAt: new Date('2026-01-01T09:00:00Z'),
    source: { name: 'BBC News', sourceColor: '#BB1919' },
  },
];

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  mockArticleFindMany.mockReset();
  mockSourceFindMany.mockReset();
  mockIngestFeed.mockReset();
});

// ---------------------------------------------------------------------------
// Tests — GET /api/feed
// ---------------------------------------------------------------------------

describe('GET /api/feed', () => {
  describe('happy path', () => {
    it('returns 200 with articles ordered by pubDate descending', async () => {
      mockArticleFindMany.mockResolvedValue(SAMPLE_ARTICLES);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toHaveLength(2);
      expect(body[0].title).toBe('Article Two');
      expect(body[1].title).toBe('Article One');
    });

    it('includes all required fields on each article', async () => {
      mockArticleFindMany.mockResolvedValue([SAMPLE_ARTICLES[0]]);

      const response = await GET();
      const body = await response.json();
      const article = body[0];

      expect(article.id).toBe(2);
      expect(article.title).toBe('Article Two');
      expect(article.description).toBe('Summary two.');
      expect(article.link).toBe('https://www.bbc.co.uk/news/world-22222222');
      expect(article.pubDate).toBeDefined();
      expect(article.thumbnailUrl).toBe('https://ichef.bbci.co.uk/thumb2.jpg');
      expect(article.thumbnailW).toBe(240);
      expect(article.thumbnailH).toBe(135);
      expect(article.source.name).toBe('BBC News');
      expect(article.source.sourceColor).toBe('#BB1919');
    });

    it('includes null thumbnail fields when the article has no thumbnail', async () => {
      mockArticleFindMany.mockResolvedValue([SAMPLE_ARTICLES[1]]);

      const response = await GET();
      const body = await response.json();
      const article = body[0];

      expect(article.thumbnailUrl).toBeNull();
      expect(article.thumbnailW).toBeNull();
      expect(article.thumbnailH).toBeNull();
    });

    it('returns 200 with an empty array when no articles exist', async () => {
      mockArticleFindMany.mockResolvedValue([]);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('returns 500 if the database query fails', async () => {
      mockArticleFindMany.mockRejectedValue(new Error('Connection refused'));

      const response = await GET();

      expect(response.status).toBe(500);
    });
  });
});

// ---------------------------------------------------------------------------
// Tests — POST /api/feed/refresh
// ---------------------------------------------------------------------------

describe('POST /api/feed/refresh', () => {
  describe('happy path', () => {
    it('calls ingestFeed for every source in the database', async () => {
      mockSourceFindMany.mockResolvedValue([SOURCE_BBC, SOURCE_AJ]);
      mockIngestFeed.mockResolvedValue(5);

      await POST();

      expect(mockIngestFeed).toHaveBeenCalledWith(SOURCE_BBC.id, SOURCE_BBC.url);
      expect(mockIngestFeed).toHaveBeenCalledWith(SOURCE_AJ.id, SOURCE_AJ.url);
      expect(mockIngestFeed).toHaveBeenCalledTimes(2);
    });

    it('returns 200 with the total count across all sources', async () => {
      mockSourceFindMany.mockResolvedValue([SOURCE_BBC, SOURCE_AJ]);
      mockIngestFeed
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(7);

      const response = await POST();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.count).toBe(17);
    });

    it('returns 200 with count 0 when no sources exist in the database', async () => {
      mockSourceFindMany.mockResolvedValue([]);

      const response = await POST();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.count).toBe(0);
    });
  });

  describe('partial failure', () => {
    it('continues ingesting remaining sources when one source fails', async () => {
      mockSourceFindMany.mockResolvedValue([SOURCE_BBC, SOURCE_AJ]);
      mockIngestFeed
        .mockRejectedValueOnce(new Error('Feed unreachable'))
        .mockResolvedValueOnce(5);

      const response = await POST();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.count).toBe(5);
    });

    it('returns count 0 when all sources fail', async () => {
      mockSourceFindMany.mockResolvedValue([SOURCE_BBC, SOURCE_AJ]);
      mockIngestFeed.mockRejectedValue(new Error('Feed unreachable'));

      const response = await POST();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.count).toBe(0);
    });
  });

  describe('error handling', () => {
    it('returns 500 if the database query fails', async () => {
      mockSourceFindMany.mockRejectedValue(new Error('Connection refused'));

      const response = await POST();

      expect(response.status).toBe(500);
    });
  });
});
