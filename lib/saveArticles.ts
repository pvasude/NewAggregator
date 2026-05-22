import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type { ParsedArticle } from './fetchAndParseFeed';

// Lazily created so the client reads DATABASE_URL at first call-time rather
// than at module evaluation time. This lets test infrastructure (setupFiles)
// set the correct URL before the client is constructed.
let _prisma: PrismaClient | null = null;

function getDb(): PrismaClient {
  if (!_prisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    _prisma = new PrismaClient({ adapter });
  }
  return _prisma;
}

export async function saveArticles(
  sourceId: number,
  articles: ParsedArticle[]
): Promise<number> {
  if (articles.length === 0) return 0;

  const result = await getDb().article.createMany({
    data: articles.map((a) => ({
      sourceId,
      title: a.title,
      description: a.description,
      link: a.link,
      guid: a.guid,
      pubDate: a.pubDate,
      thumbnailUrl: a.thumbnailUrl,
      thumbnailW: a.thumbnailW,
      thumbnailH: a.thumbnailH,
    })),
    skipDuplicates: true,
  });

  return result.count;
}
