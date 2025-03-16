// Import polyfills before anything else
import './src/utils/global-polyfills';
import { registerRootComponent } from 'expo';

// Now import the app
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
