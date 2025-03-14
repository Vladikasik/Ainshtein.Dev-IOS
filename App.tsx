import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WalletProvider } from './src/context/WalletContext';
import Navigation from './src/navigation/Navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <WalletProvider>
        <StatusBar style="light" />
        <Navigation />
      </WalletProvider>
    </SafeAreaProvider>
  );
}
