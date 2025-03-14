import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList, TabParamList } from './types';
import WelcomeScreen from '../screens/WelcomeScreen';
import WalletScreen from '../screens/WalletScreen';
import TokenBuyScreen from '../screens/TokenBuyScreen';
import AutomaticBotsScreen from '../screens/AutomaticBotsScreen';
import ContactsDonationsScreen from '../screens/ContactsDonationsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Main tab navigation component
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#000',
          borderTopColor: '#333',
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#FF9500',
        tabBarInactiveTintColor: '#888',
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
          title: 'Your Wallet',
        }}
      />
      <Tab.Screen
        name="TokenBuy"
        component={TokenBuyScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
          title: 'Create Token',
        }}
      />
      <Tab.Screen
        name="AutomaticBots"
        component={AutomaticBotsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hardware-chip-outline" size={size} color={color} />
          ),
          title: 'Automatic Bots',
        }}
      />
      <Tab.Screen
        name="ContactsDonations"
        component={ContactsDonationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
          title: 'Contacts & Donations',
        }}
      />
    </Tab.Navigator>
  );
};

// Root navigation
const Navigation = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if it's the first launch
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        
        if (hasLaunched === null) {
          // First time launching, show welcome screen
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('hasLaunched', 'true');
        } else {
          // Not first launch, skip welcome screen
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
        // Default to not showing welcome screen if there's an error
        setIsFirstLaunch(false);
      }
    };
    
    checkFirstLaunch();
  }, []);

  // Wait until we know if it's the first launch
  if (isFirstLaunch === null) {
    return null; // Or a loading indicator
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isFirstLaunch ? 'Welcome' : 'Main'}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation; 