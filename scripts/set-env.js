#!/usr/bin/env node
/**
 * Injects build-time configuration into Angular environment files.
 *
 * Angular environment files are compiled into the bundle, they are not read at
 * runtime like Next.js `process.env`. This script rewrites the target
 * environment file before `ng serve` / `ng build` so deploy environments can
 * provide the API URL through secrets or environment variables.
 *
 * Usage:
 *   node scripts/set-env.js development
 *   node scripts/set-env.js homologation
 *   node scripts/set-env.js production
 *
 * Required env vars by target:
 *   development  -> DEVELOPMENT_API_BASE_URL
 *   homologation -> HOMOLOGATION_API_BASE_URL
 *   production   -> API_BASE_URL
 *
 * Optional:
 *   APP_VERSION - falls back to the version in package.json
 */
const fs = require('node:fs');
const path = require('node:path');

const environmentTarget = process.argv[2];

const targetConfigs = {
  development: {
    fileName: 'environment.development.ts',
    envVarName: 'DEVELOPMENT_API_BASE_URL',
    production: false,
  },
  homologation: {
    fileName: 'environment.homologation.ts',
    envVarName: 'HOMOLOGATION_API_BASE_URL',
    production: false,
  },
  production: {
    fileName: 'environment.production.ts',
    envVarName: 'API_BASE_URL',
    production: true,
  },
};

if (!environmentTarget || !targetConfigs[environmentTarget]) {
  console.error(
    `[set-env] Invalid or missing target environment. Use one of: ${Object.keys(targetConfigs).join(', ')}`,
  );
  process.exit(1);
}

const targetConfig = targetConfigs[environmentTarget];
const targetFile = path.join(__dirname, '..', 'src', 'environments', targetConfig.fileName);
const rawApiBaseUrl = process.env[targetConfig.envVarName];

if (!rawApiBaseUrl) {
  console.error(
    `[set-env] Missing ${targetConfig.envVarName} environment variable for ${environmentTarget}. ` +
      'Set it in your deploy platform environment settings or export it locally before running the command.',
  );
  process.exit(1);
}

function normalizeApiBaseUrl(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    console.error('[set-env] API base URL is empty after trimming.');
    process.exit(1);
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(trimmedValue);
  } catch {
    console.error(
      `[set-env] API base URL must be an absolute URL including protocol (for example, https://api.aquatrack.io). Received: ${trimmedValue}`,
    );
    process.exit(1);
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    console.error(
      `[set-env] API base URL must use http or https. Received protocol: ${parsedUrl.protocol}`,
    );
    process.exit(1);
  }

  return trimmedValue.replace(/\/+$/, '');
}

const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl);
const packageJson = require('../package.json');
const appVersion = process.env.APP_VERSION || packageJson.version || '0.0.0';

const fileContent = `// This file is generated at build time by scripts/set-env.js.
// Do not edit by hand - values come from environment variables.
export const environment = {
  production: ${targetConfig.production},
  apiBaseUrl: '${apiBaseUrl}',
  appName: 'AquaTrack',
  appVersion: '${appVersion}',
};
`;

fs.writeFileSync(targetFile, fileContent);

console.log(
  `[set-env] ${targetConfig.fileName} written with ${targetConfig.envVarName}=${apiBaseUrl}`,
);
