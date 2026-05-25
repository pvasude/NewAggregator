'use strict';
// Runs via `setupFiles` — before any test module is evaluated.
// Ensures all code reading process.env.DATABASE_URL connects to the
// isolated test schema, not the development database.
//
// For CI: add TEST_DATABASE_URL to GitHub Secrets:
//   Settings → Secrets and variables → Actions → New repository secret
//   Name: TEST_DATABASE_URL
//   Value: postgresql://<user>@<host>:<port>/<db_name>
//
// For local development: export TEST_DATABASE_URL in your shell or .env.test file.

const fs = require('fs');
const path = require('path');

const SCHEMA_FILE = path.join(__dirname, '.jest-schema');

function appendSearchPath(rawUrl, schemaName) {
  const u = new URL(rawUrl);
  u.searchParams.set('options', `-csearch_path=${schemaName}`);
  return u.toString();
}

const baseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
if (baseUrl) {
  let finalUrl = baseUrl;
  // Apply the isolated schema written by globalSetup so every worker
  // connects to this run's schema, not the shared public schema.
  try {
    const schema = fs.readFileSync(SCHEMA_FILE, 'utf8').trim();
    if (schema) {
      finalUrl = appendSearchPath(baseUrl, schema);
    }
  } catch {
    // No schema file — running without schema isolation (local dev without globalSetup).
  }

  process.env.DATABASE_URL = finalUrl;
  process.env.TEST_DATABASE_URL = finalUrl;
}
