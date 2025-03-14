// Import polyfills before anything else
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import { registerRootComponent } from 'expo';

// Make sure crypto and Buffer are globally available
global.Buffer = Buffer;

// Now import the app
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
