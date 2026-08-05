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

function readVercelEnvFile(filePath, envVarName) {
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const envLine = fileContent
    .split(/\r?\n/)
    .find((line) => line.trim().startsWith(`${envVarName}=`));

  if (!envLine) {
    return undefined;
  }

  return envLine.slice(envLine.indexOf('=') + 1);
}

function resolveApiBaseUrl(config) {
  const directValue = process.env[config.envVarName];

  if (directValue) {
    return directValue;
  }

  const vercelEnvFileByTarget = {
    development: path.join(__dirname, '..', '.vercel', '.env.preview.local'),
    homologation: path.join(__dirname, '..', '.vercel', '.env.preview.local'),
    production: path.join(__dirname, '..', '.vercel', '.env.production.local'),
  };

  return readVercelEnvFile(vercelEnvFileByTarget[environmentTarget], config.envVarName);
}

const rawApiBaseUrl = resolveApiBaseUrl(targetConfig);

if (!rawApiBaseUrl) {
  console.error(
    `[set-env] Missing ${targetConfig.envVarName} for ${environmentTarget}. ` +
      'Set it in your deploy platform environment settings, export it locally before running the command, ' +
      'or ensure the matching .vercel/.env.*.local file contains it when using `vercel build`.',
  );
  process.exit(1);
}

function normalizeApiBaseUrl(value) {
  const trimmedValue = value.trim();
  const sanitizedValue = trimmedValue.replace(/^(['"])(.*)\1$/, '$2').trim();

  if (!sanitizedValue) {
    console.error('[set-env] API base URL is empty after trimming.');
    process.exit(1);
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(sanitizedValue);
  } catch {
    console.error(
      '[set-env] API base URL must be an absolute URL including protocol (for example, https://api.aquatrack.io). ' +
        'Check whether the configured secret includes quotes, a secret name/alias, or a value without https://.',
    );
    process.exit(1);
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    console.error(
      `[set-env] API base URL must use http or https. Received protocol: ${parsedUrl.protocol}`,
    );
    process.exit(1);
  }

  return sanitizedValue.replace(/\/+$/, '');
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
