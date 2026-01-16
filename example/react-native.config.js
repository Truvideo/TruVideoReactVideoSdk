const path = require('path');
const pak = require('../package.json');

module.exports = {
  project: {
    ios: {
      automaticPodsInstallation: true,
    },
  },
  dependencies: {
    // Use the scoped package name to ensure consistent module naming
    [pak.name]: {
      root: path.join(__dirname, '..'),
      platforms: {
        android: {
          sourceDir: path.join(__dirname, '..', 'android'),
        },
      },
    },
    // Exclude @trunpm/truvideo-react-video-sdk from autolinking
    // This prevents the duplicate BuildConfig class error when using local development setup
    // The local module (truvideo-react-video-sdk) will be used instead
    '@trunpm/truvideo-react-video-sdk': {
      platforms: {
        android: null, // Disable autolinking for the scoped package from node_modules
      },
    },
  },
};
