'use strict';
const { execSync } = require('child_process');
const { config } = require('dotenv');
const path = require('path');

// Load .env so TEST_DATABASE_URL is available when running locally.
config({ path: path.join(__dirname, '.env') });

module.exports = async function globalSetup() {
  const testDbUrl = process.env.TEST_DATABASE_URL;
  if (!testDbUrl) {
    throw new Error(
      'TEST_DATABASE_URL must be set to run tests. ' +
      'Add it to .env locally, or to GitHub Secrets for CI.'
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
