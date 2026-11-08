'use strict';
const path = require('path');

/**
 * Every setting the app reads from the outside world lives here, and nowhere else. Each has a sensible default so a
 * fresh checkout runs without a .env file; deployment overrides any of them through environment variables.
 */
function loadSettings(env = process.env) {
  return Object.freeze({
    port: Number(env.PORT || 3000),
    mongoUri: env.MONGO_URI || 'mongodb://127.0.0.1:27017/lockerline',
    timezone: env.LOCKER_TZ || 'Asia/Kolkata',
    seedDir: env.SEED_DIR || path.join(__dirname, '..', 'seed'),
    freeWindowHours: Number(env.FREE_WINDOW_HOURS || 48),
    codeHashKey: env.CODE_HASH_KEY || 'lockerline-development-key',
  });
}

module.exports = { loadSettings };