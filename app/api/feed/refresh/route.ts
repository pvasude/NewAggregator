import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ingestFeed } from '@/lib/ingestFeed';

export async function POST() {
  try {
    const sources = await prisma.source.findMany();

    const results = await Promise.allSettled(
      sources.map((source) => ingestFeed(source.id, source.url)),
    );

    let count = 0;
    for (const result of results) {
      if (result.status === 'fulfilled') {
        count += result.value;
      } else {
        console.error('Failed to ingest source:', result.reason);
      }
    }

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: 'Failed to refresh feed' }, { status: 500 });
  }
}
