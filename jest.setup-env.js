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

// Read the isolated schema name written by globalSetup.
// Falls back gracefully if the file doesn't exist (local dev without globalSetup).
let schema = null;
try {
  const raw = fs.readFileSync(SCHEMA_FILE, 'utf8').trim();
  if (raw) schema = raw;
} catch {
  // No schema file: running without schema isolation.
}

// Expose the base URL to all modules. We do NOT append ?options=... here because
// URL.searchParams.set() percent-encodes '=' to '%3D', which pg v8.x / pg-connection-string
// v2.x does not decode back before applying the options startup parameter. The
// search_path is instead applied via the pg.Pool patch below.
const baseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
if (baseUrl) {
  process.env.DATABASE_URL = baseUrl;
  process.env.TEST_DATABASE_URL = baseUrl;
}

if (schema) {
  // Patch pg.Pool so that every pool created in this worker — including those
  // created internally by PrismaPg({ connectionString }) — sets search_path on
  // every new connection via an explicit SQL SET command.
  //
  // This is more reliable than the URL ?options=-csearch_path=... approach because:
  //   1. No URL encoding ambiguity (pg handles SET search_path as plain SQL)
  //   2. Works regardless of how @prisma/adapter-pg constructs its internal pool
  //   3. pg executes queries in strict FIFO order per connection, so SET search_path
  //      is guaranteed to complete before any test query on that connection
  //
  // Because setupFiles runs before any test module is imported, the patched Pool
  // constructor is what @prisma/adapter-pg and lib/prisma.ts will see when they
  // call new Pool(...) at module-evaluation time.
  const pg = require('pg');
  const OriginalPool = pg.Pool;
  const schemaName = schema;

  class SchemaAwarePool extends OriginalPool {
    constructor(config) {
      super(config);
      this.on('connect', (client) => {
        // SET search_path immediately after the TCP handshake completes.
        // Any subsequent queries on this client are queued after this one.
        client
          .query(`SET search_path TO "${schemaName}"`)
          .catch((err) => {
            console.error(`[jest-schema-isolation] SET search_path failed: ${err.message}`);
          });
      });
    }
  }

  // Replace the exported Pool constructor in Jest's module registry.
  // All subsequent require('pg').Pool and import { Pool } from 'pg' in this
  // worker will resolve to SchemaAwarePool.
  pg.Pool = SchemaAwarePool;
}
