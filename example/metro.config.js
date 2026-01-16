const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const fs = require('fs');
const escape = require('escape-string-regexp');
const pak = require('../package.json');

const root = path.resolve(__dirname, '..');
const modules = Object.keys({ ...pak.peerDependencies });

// Helper function to resolve module path (handles symlinks)
function resolveModulePath(name) {
  const modulePath = path.join(__dirname, 'node_modules', name);
  const parentModulePath = path.join(root, 'node_modules', name);
  
  try {
    if (fs.existsSync(modulePath)) {
      // Resolve symlinks to their actual path
      const resolvedPath = fs.realpathSync(modulePath);
      return resolvedPath;
    } else if (fs.existsSync(parentModulePath)) {
      return fs.realpathSync(parentModulePath);
    }
  } catch (e) {
    // If realpathSync fails, fall back to the original path
    if (fs.existsSync(modulePath)) {
      return modulePath;
    } else if (fs.existsSync(parentModulePath)) {
      return parentModulePath;
    }
  }
  return null;
}

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [root, path.join(root, 'node_modules')],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we block them at the root, and alias them to the versions in example's node_modules
  resolver: {
    // Use blockList instead of blacklistRE (deprecated)
    // Create regex patterns directly instead of using exclusionList helper
    blockList: modules.map(
      (m) =>
        new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
    ),

    // Add parent node_modules to resolver paths so Metro can find react-native
    nodeModulesPaths: [
      path.join(__dirname, 'node_modules'),
      path.join(root, 'node_modules'),
    ],

    extraNodeModules: {
      // Resolve peerDependencies
      ...modules.reduce((acc, name) => {
        const resolved = resolveModulePath(name);
        if (resolved) {
          acc[name] = resolved;
        }
        return acc;
      }, {}),
      // Explicitly resolve react-native from parent node_modules (it's a dependency, not peerDependency)
      // Always use the parent node_modules since it's symlinked
      'react-native': path.resolve(root, 'node_modules', 'react-native'),
    },
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
