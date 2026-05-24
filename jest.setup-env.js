// Runs via `setupFiles` — before any test module is evaluated.
// Ensures that any code reading process.env.DATABASE_URL during tests
// connects to the test database, not the development database.
//
// For CI: add TEST_DATABASE_URL to GitHub Secrets:
//   Settings → Secrets and variables → Actions → New repository secret
//   Name: TEST_DATABASE_URL
//   Value: postgresql://<user>@<host>:<port>/<test_db_name>
//
// For local development: export TEST_DATABASE_URL in your shell or .env.test file.
if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}
