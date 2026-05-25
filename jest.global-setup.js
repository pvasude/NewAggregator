'use strict';
const { execSync } = require('child_process');
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// For CI: add TEST_DATABASE_URL to GitHub Secrets:
//   Settings → Secrets and variables → Actions → New repository secret
//   Name: TEST_DATABASE_URL
//   Value: postgresql://<user>@<host>:<port>/<db_name>
//
// For local development: export TEST_DATABASE_URL in your shell or .env.test file.

// Path to the file that communicates the unique schema name to worker processes
// (setupFiles run in workers; process.env changes in globalSetup don't propagate to them).
const SCHEMA_FILE = path.join(__dirname, '.jest-schema');

function appendSearchPath(rawUrl, schemaName) {
  const u = new URL(rawUrl);
  u.searchParams.set('options', `-csearch_path=${schemaName}`);
  return u.toString();
}

module.exports = async function globalSetup() {
  const baseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!baseUrl) {
    throw new Error(
      'TEST_DATABASE_URL must be set to run tests. ' +
      'Add it to GitHub Secrets for CI, or export it locally.'
    );
  }

  // Generate a unique schema name for this CI run so concurrent runs never
  // share tables even if they hit the same database.
  const schema = `test_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Persist the schema name so worker processes (jest.setup-env.js) and
  // globalTeardown can read it from the filesystem.
  fs.writeFileSync(SCHEMA_FILE, schema, 'utf8');

  // Create the schema in the database with a raw pg client.
  const client = new Client({ connectionString: baseUrl });
  await client.connect();
  await client.query(`CREATE SCHEMA "${schema}"`);
  await client.end();

  // Run Prisma migrations against the isolated schema.
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: appendSearchPath(baseUrl, schema),
    },
  });
};
