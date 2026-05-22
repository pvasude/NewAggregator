// Required environment variable in Vercel: CRON_SECRET
import { NextResponse } from 'next/server';
import { POST as refreshFeed } from '../feed/refresh/route';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const refreshResponse = await refreshFeed();
    if (!refreshResponse.ok) {
      return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
    }

    const { count } = await refreshResponse.json();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
  }
}
