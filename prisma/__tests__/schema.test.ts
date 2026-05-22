import { PrismaClient } from '../../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const TEST_DATABASE_URL =
  'postgresql://preetivasudevan@localhost:5432/newsaggregator_test';

const adapter = new PrismaPg({ connectionString: TEST_DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeSource(overrides: Record<string, unknown> = {}) {
  return {
    name: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/rss.xml',
    language: 'en',
    sourceColor: '#BB1919',
    ...overrides,
  };
}

function makeArticle(sourceId: number, overrides: Record<string, unknown> = {}) {
  return {
    sourceId,
    title: 'Test Article',
    link: 'https://example.com/article-1',
    guid: `guid-${Date.now()}-${Math.random()}`,
    pubDate: new Date('2024-01-15T10:00:00Z'),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(async () => {
  // Delete in FK-safe order: children before parents
  await prisma.article.deleteMany();
  await prisma.source.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// ---------------------------------------------------------------------------
// 1. Source
// ---------------------------------------------------------------------------

describe('Source', () => {
  describe('creating a source with valid data', () => {
    it('should successfully create a source with all required fields', async () => {
      const source = await prisma.source.create({ data: makeSource() as any });

      expect(source.id).toBeDefined();
      expect(source.name).toBe('BBC News');
      expect(source.url).toBe('https://feeds.bbci.co.uk/news/rss.xml');
      expect(source.language).toBe('en');
      expect(source.sourceColor).toBe('#BB1919');
      expect(source.createdAt).toBeInstanceOf(Date);
    });

    it('should default lastFetchedAt to null', async () => {
      const source = await prisma.source.create({ data: makeSource() as any });

      expect(source.lastFetchedAt).toBeNull();
    });
  });

  describe('creating a source with missing required fields', () => {
    it.each(['name', 'url', 'language', 'sourceColor'])(
      'should fail when %s is missing',
      async (field) => {
        const data = { ...makeSource() };
        delete (data as Record<string, unknown>)[field];

        await expect(
          prisma.source.create({ data: data as any })
        ).rejects.toThrow();
      }
    );
  });
});

// ---------------------------------------------------------------------------
// 2. Article
// ---------------------------------------------------------------------------

describe('Article', () => {
  let sourceId: number;

  beforeEach(async () => {
    const source = await prisma.source.create({ data: makeSource() as any });
    sourceId = source.id;
  });

  describe('creating an article with valid data', () => {
    it('should successfully create an article with all required fields', async () => {
      const article = await prisma.article.create({
        data: makeArticle(sourceId, { guid: 'required-fields-guid' }) as any,
      });

      expect(article.id).toBeDefined();
      expect(article.sourceId).toBe(sourceId);
      expect(article.title).toBe('Test Article');
      expect(article.link).toBe('https://example.com/article-1');
      expect(article.guid).toBe('required-fields-guid');
      expect(article.pubDate).toBeInstanceOf(Date);
    });

    it('should auto-populate createdAt with the current timestamp', async () => {
      const before = new Date();
      const article = await prisma.article.create({
        data: makeArticle(sourceId, { guid: 'created-at-guid' }) as any,
      });
      const after = new Date();

      expect(article.createdAt).toBeInstanceOf(Date);
      expect(article.createdAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(article.createdAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('should allow description, thumbnailUrl, thumbnailW, thumbnailH to be null', async () => {
      const article = await prisma.article.create({
        data: {
          ...makeArticle(sourceId, { guid: 'nullable-fields-guid' }),
          description: null,
          thumbnailUrl: null,
          thumbnailW: null,
          thumbnailH: null,
        } as any,
      });

      expect(article.description).toBeNull();
      expect(article.thumbnailUrl).toBeNull();
      expect(article.thumbnailW).toBeNull();
      expect(article.thumbnailH).toBeNull();
    });

    it('should omit optional fields when not provided', async () => {
      const article = await prisma.article.create({
        data: makeArticle(sourceId, { guid: 'omitted-fields-guid' }) as any,
      });

      expect(article.description).toBeNull();
      expect(article.thumbnailUrl).toBeNull();
      expect(article.thumbnailW).toBeNull();
      expect(article.thumbnailH).toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// 3. guid uniqueness
// ---------------------------------------------------------------------------

describe('Article guid uniqueness', () => {
  let sourceId: number;

  beforeEach(async () => {
    const source = await prisma.source.create({ data: makeSource() as any });
    sourceId = source.id;
  });

  it('should fail when inserting two articles with the same guid', async () => {
    const guid = 'duplicate-guid';
    await prisma.article.create({ data: makeArticle(sourceId, { guid }) as any });

    await expect(
      prisma.article.create({ data: makeArticle(sourceId, { guid }) as any })
    ).rejects.toThrow();
  });

  it('should succeed when inserting two articles with different guids', async () => {
    const article1 = await prisma.article.create({
      data: makeArticle(sourceId, { guid: 'guid-alpha' }) as any,
    });
    const article2 = await prisma.article.create({
      data: makeArticle(sourceId, { guid: 'guid-beta' }) as any,
    });

    expect(article1.guid).toBe('guid-alpha');
    expect(article2.guid).toBe('guid-beta');
  });
});

// ---------------------------------------------------------------------------
// 4. Cascade delete
// ---------------------------------------------------------------------------

describe('Source cascade delete', () => {
  it('should delete all articles belonging to the source', async () => {
    const source = await prisma.source.create({ data: makeSource() as any });

    await prisma.article.createMany({
      data: [
        makeArticle(source.id, { guid: 'cascade-guid-1' }),
        makeArticle(source.id, { guid: 'cascade-guid-2' }),
      ] as any,
    });

    const countBefore = await prisma.article.count({ where: { sourceId: source.id } });
    expect(countBefore).toBe(2);

    await prisma.source.delete({ where: { id: source.id } });

    const countAfter = await prisma.article.count({ where: { sourceId: source.id } });
    expect(countAfter).toBe(0);
  });

  it('should leave no orphaned articles after source deletion', async () => {
    const source1 = await prisma.source.create({ data: makeSource({ name: 'Source One' }) as any });
    const source2 = await prisma.source.create({
      data: makeSource({ name: 'Source Two', url: 'https://example.com/feed2' }) as any,
    });

    await prisma.article.createMany({
      data: [
        makeArticle(source1.id, { guid: 'orphan-guid-1' }),
        makeArticle(source2.id, { guid: 'orphan-guid-2' }),
      ] as any,
    });

    await prisma.source.delete({ where: { id: source1.id } });

    const remaining = await prisma.article.findMany();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].sourceId).toBe(source2.id);
  });
});
