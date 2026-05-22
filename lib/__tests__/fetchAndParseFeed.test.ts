import { fetchAndParseFeed } from '../fetchAndParseFeed';

// ---------------------------------------------------------------------------
// XML fixtures
// ---------------------------------------------------------------------------

// A single item with all fields present, including BBC tracking params on link.
const FEED_ONE_ARTICLE = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:media="http://search.yahoo.com/mrss/" version="2.0">
  <channel>
    <title>BBC News - Home</title>
    <link>https://www.bbc.co.uk/news/</link>
    <description>BBC News - Home</description>
    <item>
      <title>Scientists discover new species</title>
      <description>A remarkable find deep in the Amazon rainforest.</description>
      <link>https://www.bbc.co.uk/news/science-12345678?at_medium=RSS&amp;at_campaign=rss</link>
      <guid isPermaLink="false">https://www.bbc.co.uk/news/science-12345678</guid>
      <pubDate>Thu, 01 Jan 2026 12:00:00 GMT</pubDate>
      <media:thumbnail url="https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/abc/thumbnail.jpg" width="240" height="135"/>
    </item>
  </channel>
</rss>`;

// Two items — used to assert count and per-item independence.
const FEED_TWO_ARTICLES = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:media="http://search.yahoo.com/mrss/" version="2.0">
  <channel>
    <title>BBC News - Home</title>
    <item>
      <title>Article One</title>
      <description>Summary one.</description>
      <link>https://www.bbc.co.uk/news/world-11111111?at_medium=RSS&amp;at_campaign=rss</link>
      <guid isPermaLink="false">https://www.bbc.co.uk/news/world-11111111</guid>
      <pubDate>Thu, 01 Jan 2026 09:00:00 GMT</pubDate>
      <media:thumbnail url="https://ichef.bbci.co.uk/thumbnail-1.jpg" width="240" height="135"/>
    </item>
    <item>
      <title>Article Two</title>
      <description>Summary two.</description>
      <link>https://www.bbc.co.uk/news/world-22222222?at_medium=RSS&amp;at_campaign=rss</link>
      <guid isPermaLink="false">https://www.bbc.co.uk/news/world-22222222</guid>
      <pubDate>Thu, 01 Jan 2026 10:00:00 GMT</pubDate>
      <media:thumbnail url="https://ichef.bbci.co.uk/thumbnail-2.jpg" width="480" height="270"/>
    </item>
  </channel>
</rss>`;

// Item with no <media:thumbnail> element at all.
const FEED_NO_THUMBNAIL = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:media="http://search.yahoo.com/mrss/" version="2.0">
  <channel>
    <title>BBC News - Home</title>
    <item>
      <title>No Thumbnail Article</title>
      <description>This article has no thumbnail.</description>
      <link>https://www.bbc.co.uk/news/uk-99999999?at_medium=RSS&amp;at_campaign=rss</link>
      <guid isPermaLink="false">https://www.bbc.co.uk/news/uk-99999999</guid>
      <pubDate>Thu, 01 Jan 2026 08:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

// Valid feed structure with zero <item> elements.
const FEED_EMPTY = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:media="http://search.yahoo.com/mrss/" version="2.0">
  <channel>
    <title>BBC News - Home</title>
  </channel>
</rss>`;

// ---------------------------------------------------------------------------
// Mock helper
// ---------------------------------------------------------------------------

function mockFetchOk(xml: string) {
  return jest.spyOn(globalThis, 'fetch').mockResolvedValue({
    ok: true,
    text: () => Promise.resolve(xml),
  } as Response);
}

// ---------------------------------------------------------------------------
// Shared setup
// ---------------------------------------------------------------------------

afterEach(() => {
  jest.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('fetchAndParseFeed', () => {
  // --- 1. Return shape ---

  describe('return shape', () => {
    it('returns an array', async () => {
      mockFetchOk(FEED_ONE_ARTICLE);
      const result = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(Array.isArray(result)).toBe(true);
    });

    it('returns one entry per <item> in the feed', async () => {
      mockFetchOk(FEED_TWO_ARTICLES);
      const result = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(result).toHaveLength(2);
    });

    it('calls fetch with the URL that was passed in', async () => {
      const spy = mockFetchOk(FEED_ONE_ARTICLE);
      await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(spy).toHaveBeenCalledWith('http://feeds.bbci.co.uk/news/rss.xml');
    });
  });

  // --- 2. Article fields ---

  describe('article fields', () => {
    it('parses title', async () => {
      mockFetchOk(FEED_ONE_ARTICLE);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(article.title).toBe('Scientists discover new species');
    });

    it('parses description', async () => {
      mockFetchOk(FEED_ONE_ARTICLE);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(article.description).toBe('A remarkable find deep in the Amazon rainforest.');
    });

    it('parses link', async () => {
      mockFetchOk(FEED_ONE_ARTICLE);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      // Tracking params should be gone — see dedicated section below
      expect(typeof article.link).toBe('string');
      expect(article.link.length).toBeGreaterThan(0);
    });

    it('parses guid', async () => {
      mockFetchOk(FEED_ONE_ARTICLE);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(article.guid).toBe('https://www.bbc.co.uk/news/science-12345678');
    });

    it('parses pubDate as a Date object', async () => {
      mockFetchOk(FEED_ONE_ARTICLE);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(article.pubDate).toBeInstanceOf(Date);
    });

    it('parses pubDate to the correct timestamp', async () => {
      mockFetchOk(FEED_ONE_ARTICLE);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      // "Thu, 01 Jan 2026 12:00:00 GMT"
      expect(article.pubDate.toISOString()).toBe('2026-01-01T12:00:00.000Z');
    });

    it('parses thumbnailUrl', async () => {
      mockFetchOk(FEED_ONE_ARTICLE);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(article.thumbnailUrl).toBe(
        'https://ichef.bbci.co.uk/ace/standard/240/cpsprodpb/abc/thumbnail.jpg'
      );
    });

    it('parses thumbnailW as a number', async () => {
      mockFetchOk(FEED_ONE_ARTICLE);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(article.thumbnailW).toBe(240);
      expect(typeof article.thumbnailW).toBe('number');
    });

    it('parses thumbnailH as a number', async () => {
      mockFetchOk(FEED_ONE_ARTICLE);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(article.thumbnailH).toBe(135);
      expect(typeof article.thumbnailH).toBe('number');
    });

    it('parses each item independently', async () => {
      mockFetchOk(FEED_TWO_ARTICLES);
      const [first, second] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(first.guid).toBe('https://www.bbc.co.uk/news/world-11111111');
      expect(second.guid).toBe('https://www.bbc.co.uk/news/world-22222222');
      expect(second.thumbnailW).toBe(480);
      expect(second.thumbnailH).toBe(270);
    });
  });

  // --- 3. Link tracking param stripping ---

  describe('link tracking params', () => {
    it('strips the at_medium=RSS param from the link', async () => {
      mockFetchOk(FEED_ONE_ARTICLE);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(article.link).not.toContain('at_medium');
    });

    it('strips the at_campaign=rss param from the link', async () => {
      mockFetchOk(FEED_ONE_ARTICLE);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(article.link).not.toContain('at_campaign');
    });

    it('leaves the clean base URL intact after stripping', async () => {
      mockFetchOk(FEED_ONE_ARTICLE);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(article.link).toBe('https://www.bbc.co.uk/news/science-12345678');
    });

    it('does not append a trailing ? when all params are stripped', async () => {
      mockFetchOk(FEED_ONE_ARTICLE);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(article.link).not.toMatch(/\?$/);
    });
  });

  // --- 4. Missing thumbnail ---

  describe('missing thumbnail', () => {
    it('returns null for thumbnailUrl when <media:thumbnail> is absent', async () => {
      mockFetchOk(FEED_NO_THUMBNAIL);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(article.thumbnailUrl).toBeNull();
    });

    it('returns null for thumbnailW when <media:thumbnail> is absent', async () => {
      mockFetchOk(FEED_NO_THUMBNAIL);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(article.thumbnailW).toBeNull();
    });

    it('returns null for thumbnailH when <media:thumbnail> is absent', async () => {
      mockFetchOk(FEED_NO_THUMBNAIL);
      const [article] = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(article.thumbnailH).toBeNull();
    });
  });

  // --- 5. Empty feed ---

  describe('empty feed', () => {
    it('returns an empty array when the feed contains no <item> elements', async () => {
      mockFetchOk(FEED_EMPTY);
      const result = await fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml');
      expect(result).toEqual([]);
    });
  });

  // --- 6. Unreachable URL ---

  describe('unreachable URL', () => {
    it('throws when fetch rejects (network failure)', async () => {
      jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('fetch failed'));
      await expect(
        fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml')
      ).rejects.toThrow();
    });

    it('throws when the server returns a non-2xx status', async () => {
      jest.spyOn(globalThis, 'fetch').mockResolvedValue({
        ok: false,
        status: 503,
        text: () => Promise.resolve(''),
      } as Response);
      await expect(
        fetchAndParseFeed('http://feeds.bbci.co.uk/news/rss.xml')
      ).rejects.toThrow();
    });
  });
});
