import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { fetchAndParseFeed } from './fetchAndParseFeed';
import { saveArticles } from './saveArticles';

let _prisma: PrismaClient | null = null;

function getDb(): PrismaClient {
  if (!_prisma) {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
    _prisma = new PrismaClient({ adapter });
  }
  return _prisma;
}

export async function ingestFeed(sourceId: number, feedUrl: string): Promise<number> {
  const articles = await fetchAndParseFeed(feedUrl);
  const count = await saveArticles(sourceId, articles);

  await getDb().source.update({
    where: { id: sourceId },
    data: { lastFetchedAt: new Date() },
  });

  return count;
}
