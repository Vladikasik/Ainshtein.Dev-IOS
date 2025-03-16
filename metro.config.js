const { getDefaultConfig } = require('expo/metro-config');

// Create the default Metro config
const defaultConfig = getDefaultConfig(__dirname);

// Add Node.js polyfills for React Native
defaultConfig.resolver.extraNodeModules = {
  // Add polyfills for Node.js core modules
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer/'),
  events: require.resolve('events/'),
  util: require.resolve('util/'),
  crypto: require.resolve('react-native-crypto'),
  // Add any other modules your app might need
};

// Add support for mjs files used by some packages
defaultConfig.resolver.sourceExts.push('mjs');

module.exports = defaultConfig;
