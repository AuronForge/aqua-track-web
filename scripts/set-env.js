#!/usr/bin/env node
/**
 * Injects build-time configuration into src/environments/environment.production.ts.
 *
 * Angular's environment files are plain TS objects compiled into the bundle,
 * they are not read at runtime like Next.js `process.env`. To let Vercel's
 * Environment Variables (configured per-project, optionally marked
 * "Sensitive") control the API URL without hardcoding it in the repo, this
 * script runs before `ng build` and rewrites environment.production.ts using
 * whatever value Vercel injects into the build environment.
 *
 * Required env var:
 *   API_BASE_URL - e.g. https://api.aquatrack.io or a Cloudflare Tunnel URL
 *
 * Optional:
 *   APP_VERSION  - falls back to the version in package.json
 */
const fs = require('node:fs');
const path = require('node:path');

const targetFile = path.join(__dirname, '..', 'src', 'environments', 'environment.production.ts');

const apiBaseUrl = process.env.API_BASE_URL;

if (!apiBaseUrl) {
  console.error(
    '[set-env] Missing API_BASE_URL environment variable. ' +
      'Set it in Vercel Project Settings -> Environment Variables (Production) ' +
      'or export it locally before running `npm run build:prod`.'
  );
  process.exit(1);
}

const packageJson = require('../package.json');
const appVersion = process.env.APP_VERSION || packageJson.version || '0.0.0';

const fileContent = `// This file is generated at build time by scripts/set-env.js.
// Do not edit by hand — values come from environment variables (API_BASE_URL, APP_VERSION).
export const environment = {
  production: true,
  apiBaseUrl: '${apiBaseUrl}',
  appName: 'AquaTrack',
  appVersion: '${appVersion}',
};
`;

fs.writeFileSync(targetFile, fileContent);

console.log(`[set-env] environment.production.ts written with apiBaseUrl=${apiBaseUrl}`);
