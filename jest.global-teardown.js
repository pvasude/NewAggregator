'use strict';
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const SCHEMA_FILE = path.join(__dirname, '.jest-schema');

module.exports = async function globalTeardown() {
  // globalTeardown runs in the main Jest process where process.env still holds
  // the original (schema-less) base URL — exactly what we need to connect and drop.
  const baseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
  if (!baseUrl) return;

  let schema;
  try {
    schema = fs.readFileSync(SCHEMA_FILE, 'utf8').trim();
  } catch {
    return;
  }
  if (!schema) return;

  const client = new Client({ connectionString: baseUrl });
  await client.connect();
  try {
    await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
  } finally {
    await client.end();
  }

  try {
    fs.unlinkSync(SCHEMA_FILE);
  } catch {}
};
