import Parser from 'rss-parser';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MediaThumbnail = {
  $?: {
    url?: string;
    width?: string;
    height?: string;
  };
};

type CustomItem = {
  mediaThumbnail?: MediaThumbnail;
};

const ParsedArticleSchema = z.object({
  title: z.string(),
  description: z.string().nullable(),
  link: z.string(),
  guid: z.string(),
  pubDate: z.date(),
  thumbnailUrl: z.string().nullable(),
  thumbnailW: z.number().nullable(),
  thumbnailH: z.number().nullable(),
});

export type ParsedArticle = z.infer<typeof ParsedArticleSchema>;

// ---------------------------------------------------------------------------
// Parser instance — created once, reused across calls
// ---------------------------------------------------------------------------

const feedParser = new Parser<Record<string, never>, CustomItem>({
  customFields: {
    item: [['media:thumbnail', 'mediaThumbnail']],
  },
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const TRACKING_PARAMS = ['at_medium', 'at_campaign'];

function stripTrackingParams(rawLink: string): string {
  const url = new URL(rawLink);
  for (const param of TRACKING_PARAMS) {
    url.searchParams.delete(param);
  }
  return url.href;
}

// BBC repeats articles with guids like "https://...#0", "#1", "#7".
// Strip the fragment so they are treated as the same article.
function stripHashSuffix(guid: string): string {
  return guid.replace(/#.*$/, '');
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function fetchAndParseFeed(url: string): Promise<ParsedArticle[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Feed fetch failed: HTTP ${response.status}`);
  }

  const xml = await response.text();
  const feed = await feedParser.parseString(xml);

  return (feed.items ?? []).map((item) => {
    const thumb = item.mediaThumbnail;

    return ParsedArticleSchema.parse({
      title: item.title ?? '',
      description: item.contentSnippet ?? item.content ?? null,
      link: stripTrackingParams(item.link ?? ''),
      guid: stripHashSuffix(item.guid ?? ''),
      pubDate: new Date(item.pubDate ?? ''),
      thumbnailUrl: thumb?.$?.url ?? null,
      thumbnailW: thumb?.$?.width != null ? parseInt(thumb.$.width!, 10) : null,
      thumbnailH: thumb?.$?.height != null ? parseInt(thumb.$.height!, 10) : null,
    });
  });
}
