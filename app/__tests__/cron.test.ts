// `jest` must be imported directly from @jest/globals here (not used via globalThis).
// The globalThis.jest set by jest.setup.ts is bound to jest.setup.ts's module
// context, so its _testPath resolves relative paths from the project root, not
// from this test file. Importing locally gives an instance scoped to this file.
import { jest as localJest } from '@jest/globals';

// ---------------------------------------------------------------------------
// ESM module mocks
// ---------------------------------------------------------------------------

localJest.unstable_mockModule('next/server', () => ({
  NextResponse: {
    json: (data: unknown, init?: { status?: number }) =>
      new Response(JSON.stringify(data), {
        status: init?.status ?? 200,
        headers: { 'content-type': 'application/json' },
      }),
  },
}));

// Mock the refresh route's POST handler — the cron route calls it directly
// rather than making an HTTP round-trip. The path here resolves (from this
// test file) to the same absolute module as '../feed/refresh/route' does
// from inside app/api/cron/route.ts.
const mockRefreshPOST = localJest.fn();

localJest.unstable_mockModule('../api/feed/refresh/route', () => ({
  POST: mockRefreshPOST,
}));

const { GET } = await import('../api/cron/route');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CRON_SECRET = 'test-cron-secret-xyz';

function makeRequest(authHeader?: string): Request {
  return new Request('http://localhost/api/cron', {
    headers: authHeader ? { Authorization: authHeader } : {},
  });
}

function makeRefreshResponse(count: number, status = 200): Response {
  return new Response(JSON.stringify({ count }), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  process.env.CRON_SECRET = CRON_SECRET;
  mockRefreshPOST.mockReset();
});

afterEach(() => {
  delete process.env.CRON_SECRET;
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GET /api/cron', () => {
  describe('authorization', () => {
    it('returns 401 when the Authorization header is missing', async () => {
      const response = await GET(makeRequest());

      expect(response.status).toBe(401);
    });

    it('returns 401 when the Authorization header does not match CRON_SECRET', async () => {
      const response = await GET(makeRequest('Bearer wrong-secret'));

      expect(response.status).toBe(401);
    });

    it('does not call the refresh handler when authorization fails', async () => {
      await GET(makeRequest('Bearer wrong-secret'));

      expect(mockRefreshPOST).not.toHaveBeenCalled();
    });
  });

  describe('happy path', () => {
    it('calls the refresh POST handler when authorization succeeds', async () => {
      mockRefreshPOST.mockResolvedValue(makeRefreshResponse(5));

      await GET(makeRequest(`Bearer ${CRON_SECRET}`));

      expect(mockRefreshPOST).toHaveBeenCalledTimes(1);
    });

    it('returns 200 with the count of newly ingested articles', async () => {
      mockRefreshPOST.mockResolvedValue(makeRefreshResponse(12));

      const response = await GET(makeRequest(`Bearer ${CRON_SECRET}`));
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body.count).toBe(12);
    });
  });

  describe('error handling', () => {
    it('returns 500 if the refresh handler returns a non-ok response', async () => {
      mockRefreshPOST.mockResolvedValue(makeRefreshResponse(0, 500));

      const response = await GET(makeRequest(`Bearer ${CRON_SECRET}`));

      expect(response.status).toBe(500);
    });

    it('returns 500 if the refresh handler throws', async () => {
      mockRefreshPOST.mockRejectedValue(new Error('Unexpected failure'));

      const response = await GET(makeRequest(`Bearer ${CRON_SECRET}`));

      expect(response.status).toBe(500);
    });
  });
});
