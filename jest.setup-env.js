'use strict';

// TEST_DATABASE_URL is set by the CI workflow env (test.yml) or locally via
// `export TEST_DATABASE_URL=...`. No .env loading needed — dotenv is not used
// here to avoid overriding CI environment variables.
const testDbUrl = process.env.TEST_DATABASE_URL;
if (testDbUrl) {
  process.env.DATABASE_URL = testDbUrl;
}
