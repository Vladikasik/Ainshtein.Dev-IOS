import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

import { RootStackParamList, TabParamList } from './types';
import WelcomeScreen from '../screens/WelcomeScreen';
import WalletScreen from '../screens/WalletScreen';
import TokenBuyScreen from '../screens/TokenBuyScreen';
import AutomaticBotsScreen from '../screens/AutomaticBotsScreen';
import ContactsDonationsScreen from '../screens/ContactsDonationsScreen';
import WalletImportScreen from '../screens/WalletImportScreen';
import { devTheme, neonGlow, devFonts } from '../utils/devTheme';
import GlitchText from '../components/GlitchText';
import ScreenBackground from '../components/ScreenBackground';
import { useWallet } from '../context/WalletContext';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Custom theme
const DevTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: devTheme.neonGreen,
    background: 'transparent',
    card: devTheme.darkBg,
    text: devTheme.textPrimary,
    border: devTheme.darkGreen,
    notification: devTheme.glitchPink,
  }
};

// Glitchy tab icon component
const GlitchyIcon = ({ name, color, size, focused }: { name: any, color: string, size: number, focused: boolean }) => {
  return (
    <View style={[
      styles.iconContainer,
      focused && styles.focusedIcon
    ]}>
      <Ionicons 
        name={name} 
        size={size} 
        color={focused ? devTheme.neonGreen : color} 
        style={focused ? styles.glowingIcon : {}} 
      />
      {focused && (
        <View style={styles.focusedDot} />
      )}
    </View>
  );
};

// Main tab navigation component
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: devTheme.darkestBg,
          borderTopColor: devTheme.darkGreen,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          borderRadius: 8,
          borderColor: devTheme.darkGreen,
          borderWidth: 1,
          shadowColor: 'transparent',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0,
          shadowRadius: 0,
          elevation: 0,
        },
        tabBarActiveTintColor: devTheme.neonGreen,
        tabBarInactiveTintColor: devTheme.textMuted,
        headerStyle: {
          backgroundColor: 'transparent',
          borderBottomWidth: 1,
          borderBottomColor: devTheme.darkGreen,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: devTheme.neonGreen,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: devFonts.monospace,
          ...neonGlow.small,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarLabelStyle: {
          fontFamily: devFonts.monospace,
          fontSize: 10,
        }
      }}
    >
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <GlitchyIcon name="wallet-outline" size={size} color={color} focused={focused} />
          ),
          title: 'YOUR WALLET',
          headerTitle: () => (
            <GlitchText text="YOUR WALLET" style={styles.headerTitle} intensity="low" />
          ),
        }}
      />
      <Tab.Screen
        name="TokenBuy"
        component={TokenBuyScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <GlitchyIcon name="cash-outline" size={size} color={color} focused={focused} />
          ),
          title: 'CREATE TOKEN',
          headerTitle: () => (
            <GlitchText text="CREATE TOKEN" style={styles.headerTitle} intensity="low" />
          ),
        }}
      />
      <Tab.Screen
        name="AutomaticBots"
        component={AutomaticBotsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <GlitchyIcon name="hardware-chip-outline" size={size} color={color} focused={focused} />
          ),
          title: 'AUTO BOTS',
          headerTitle: () => (
            <GlitchText text="AUTOMATIC BOTS" style={styles.headerTitle} intensity="low" />
          ),
        }}
      />
      <Tab.Screen
        name="ContactsDonations"
        component={ContactsDonationsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <GlitchyIcon name="people-outline" size={size} color={color} focused={focused} />
          ),
          title: 'CONTACTS',
          headerTitle: () => (
            <GlitchText text="CONTACTS & DONATIONS" style={styles.headerTitle} intensity="low" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Root navigation
const Navigation = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const { isWalletImported, loading } = useWallet();
  
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

  // Wait until we know if it's the first launch and until wallet check is complete
  if (isFirstLaunch === null || loading) {
    return null; // Or a loading indicator
  }

  // Determine initial route
  let initialRoute: keyof RootStackParamList = 'MainTabs';
  
  if (isFirstLaunch) {
    initialRoute = 'Welcome';
  } else if (!isWalletImported) {
    initialRoute = 'ImportWallet';
  }

  return (
    <NavigationContainer theme={DevTheme}>
      <ScreenBackground>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
            animation: 'slide_from_right'
          }}
        >
          {isFirstLaunch && (
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
          )}
          {!isWalletImported && !isFirstLaunch && (
            <Stack.Screen name="ImportWallet" component={WalletImportScreen} />
          )}
          <Stack.Screen name="MainTabs" component={TabNavigator} />
        </Stack.Navigator>
      </ScreenBackground>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 18,
    color: devTheme.neonGreen,
    fontFamily: devFonts.monospace,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 32,
    height: 32,
  },
  focusedIcon: {
    backgroundColor: `${devTheme.darkBg}99`,
    borderRadius: 16,
  },
  glowingIcon: {
    textShadowColor: devTheme.neonGreen,
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
  focusedDot: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: devTheme.neonGreen,
    ...neonGlow.small,
  }
});

export default Navigation; 