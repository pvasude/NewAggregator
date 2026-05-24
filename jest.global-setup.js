const { execSync } = require('child_process');

// Load the test database URL from the environment.
// For CI: add TEST_DATABASE_URL to GitHub Secrets:
//   Settings → Secrets and variables → Actions → New repository secret
//   Name: TEST_DATABASE_URL
//   Value: postgresql://<user>@<host>:<port>/<test_db_name>
//
// For local development: export TEST_DATABASE_URL in your shell or .env.test file.
const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;

module.exports = async function globalSetup() {
  if (!TEST_DATABASE_URL) {
    throw new Error(
      'TEST_DATABASE_URL must be set to run tests. ' +
      'Add it to GitHub Secrets for CI, or export it locally.'
    );
  }

  try {
    execSync('createdb newsaggregator_test', { stdio: 'pipe' });
  } catch {
    // Database already exists — that's fine, migrate deploy is idempotent
  }

  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: TEST_DATABASE_URL },
  });
};
