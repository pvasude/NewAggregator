// Runs via `setupFiles` — before any test module is evaluated.
// Ensures that any code reading process.env.DATABASE_URL during tests
// connects to the test database, not the development database.
process.env.DATABASE_URL =
  'postgresql://preetivasudevan@localhost:5432/newsaggregator_test';
