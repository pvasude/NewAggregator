'use strict';
const { execSync } = require('child_process');

// TEST_DATABASE_URL is set by the CI workflow env (test.yml) or locally via
// `export TEST_DATABASE_URL=...`. No .env loading needed — dotenv is not used
// here to avoid overriding CI environment variables.
// To set locally: export TEST_DATABASE_URL=postgresql://user:pass@localhost:5432/db_test
// In CI: add TEST_DATABASE_URL to GitHub Secrets and reference in test.yml env block.
module.exports = async function globalSetup() {
  const testDbUrl = process.env.TEST_DATABASE_URL;
  if (!testDbUrl) {
    throw new Error(
      'TEST_DATABASE_URL must be set to run tests. ' +
      'Add it to GitHub Secrets for CI, or export it locally.'
    );
  }

  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: testDbUrl,
    },
  });
};
