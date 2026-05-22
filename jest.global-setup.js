const { execSync } = require('child_process');

const TEST_DATABASE_URL =
  'postgresql://preetivasudevan@localhost:5432/newsaggregator_test';

module.exports = async function globalSetup() {
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
