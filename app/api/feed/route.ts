import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { pubDate: 'desc' },
      include: {
        source: {
          select: { name: true, sourceColor: true },
        },
      },
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}
