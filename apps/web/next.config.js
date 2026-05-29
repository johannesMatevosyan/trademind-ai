//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/**
 * Recursively finds all package names under a given directory.
 * Stops descending once a package.json is found (no nested packages).
 * @param {string} dir
 * @returns {string[]}
 */
function findLocalPackages(dir) {
  const results = [];
  const pkgPath = path.join(dir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const { name } = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (name) results.push(name);
      return results; // don't recurse further into this package
    } catch {}
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
      results.push(...findLocalPackages(path.join(dir, entry.name)));
    }
  }
  return results;
}

const localPackages = findLocalPackages(path.resolve(__dirname, '../../libs'));

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // Use this to set Nx-specific options
  // See: https://nx.dev/recipes/next/next-config-setup
  nx: {},
  // Transpile local packages so Next.js reads their TypeScript source
  // directly instead of the pre-built dist/, enabling HMR on source changes.
  transpilePackages: localPackages,
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
