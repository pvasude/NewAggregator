'use strict';
const { config } = require('dotenv');
const path = require('path');

config({ path: path.join(__dirname, '.env') });

const testDbUrl = process.env.TEST_DATABASE_URL;
if (testDbUrl) {
  process.env.DATABASE_URL = testDbUrl;
}
