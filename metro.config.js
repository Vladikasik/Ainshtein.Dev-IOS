const { getDefaultConfig } = require('expo/metro-config');
const crypto = require('crypto');

// Get the default Metro configuration
const defaultConfig = getDefaultConfig(__dirname);

// Add all necessary polyfills for Solana web3.js
defaultConfig.resolver.extraNodeModules = {
  crypto: require.resolve('react-native-crypto'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer'),
  'react-native-get-random-values': require.resolve('react-native-get-random-values'),
  uuid: require.resolve('uuid'),
};

// Add support for mjs files used by some packages
defaultConfig.resolver.sourceExts.push('mjs');

module.exports = defaultConfig;
