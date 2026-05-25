import { prisma } from './prisma';
import { fetchAndParseFeed } from './fetchAndParseFeed';
import { saveArticles } from './saveArticles';

export async function ingestFeed(sourceId: number, feedUrl: string): Promise<number> {
  try {
    const articles = await fetchAndParseFeed(feedUrl);
    const count = await saveArticles(sourceId, articles);

    await prisma.source.update({
      where: { id: sourceId },
      data: { lastFetchedAt: new Date() },
    });

    return count;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Ingest failed for source ${sourceId} (${feedUrl}): ${message}`, { cause: err });
  }
}
