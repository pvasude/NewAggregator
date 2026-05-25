import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const SOURCES = [
  {
    name: 'BBC News',
    url: 'https://feeds.bbci.co.uk/news/rss.xml',
    language: 'en-gb',
    sourceColor: '#BB1919',
  },
  {
    name: 'Al Jazeera',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
    language: 'en',
    sourceColor: '#D4A017',
  },
];

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  try {
    for (const source of SOURCES) {
      const existing = await prisma.source.findFirst({ where: { url: source.url } });

      if (existing) {
        console.log(`${source.name} already exists (id=${existing.id})`);
      } else {
        const created = await prisma.source.create({ data: source });
        console.log(`Created ${source.name} (id=${created.id})`);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
