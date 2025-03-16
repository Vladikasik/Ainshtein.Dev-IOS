// Import polyfills and shims
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import 'react-native-polyfill-globals/auto';

// Make Buffer available globally
// @ts-ignore
global.Buffer = Buffer;

// Add any other global polyfills or shims here
console.log('Node.js polyfills initialized');

export {}; 