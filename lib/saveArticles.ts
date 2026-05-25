import { prisma } from './prisma';
import type { ParsedArticle } from './fetchAndParseFeed';

export async function saveArticles(
  sourceId: number,
  articles: ParsedArticle[]
): Promise<number> {
  if (articles.length === 0) return 0;

  const result = await prisma.$transaction(async (tx) => {
    return tx.article.createMany({
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
  });

  return result.count;
}
