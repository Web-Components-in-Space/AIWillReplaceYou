/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import fs from 'fs';

const env = JSON.parse(fs.readFileSync('aws-creds.json', 'utf-8'));

const mode = process.env.MODE || 'dev';
if (!['dev', 'prod'].includes(mode)) {
  throw new Error(`MODE must be "dev" or "prod", was "${mode}"`);
}

export default {
  plugins: [
    {
      name: 'environment',
      serve(context) {
        if (context.path === '/environment.js') {
          return `export default { 
              label: "${env.label}",
              bucket: "${env.bucket}",
              album: "${env.album}",
              region: "${env.region}",
              poolid: "${env.poolid}",
           }`;
        }
      },
    },
  ],
  nodeResolve: {exportConditions: mode === 'dev' ? ['development'] : []},
  preserveSymlinks: true
};
