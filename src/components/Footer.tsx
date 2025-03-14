import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import GlitchText from './GlitchText';
import { devTheme, neonGlow } from '../utils/devTheme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Footer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.footer}>
      <TouchableOpacity 
        style={styles.footerButton} 
        onPress={() => navigation.navigate('Wallet')}
      >
        <Ionicons name="wallet-outline" size={24} color={devTheme.neonGreen} />
        <GlitchText text="WALLET" style={styles.footerText} intensity="low" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.footerButton} 
        onPress={() => navigation.navigate('TokenBuy')}
      >
        <Ionicons name="cash-outline" size={24} color={devTheme.neonGreen} />
        <GlitchText text="TOKEN" style={styles.footerText} intensity="low" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.footerButton} 
        onPress={() => navigation.navigate('AutomaticBots')}
      >
        <Ionicons name="hardware-chip-outline" size={24} color={devTheme.neonGreen} />
        <GlitchText text="BOTS" style={styles.footerText} intensity="low" />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.footerButton}
        onPress={() => navigation.navigate('ContactsDonations')}
      >
        <Ionicons name="people-outline" size={24} color={devTheme.neonGreen} />
        <GlitchText text="CONTACTS" style={styles.footerText} intensity="low" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: devTheme.neonGreen,
    paddingBottom: Platform.OS === 'ios' ? 35 : 10, // Extra padding on iOS to avoid home indicator
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    shadowColor: devTheme.neonGreen,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
    // Semi-transparent backdrop
    backgroundColor: `${devTheme.darkestBg}CC`,
    // Glass effect
    backdropFilter: 'blur(10px)',
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    // Add glow effect
    ...neonGlow.small,
  },
  footerText: {
    color: devTheme.textPrimary,
    fontSize: 10,
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

export default Footer; 