import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Footer: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.footer}>
      <TouchableOpacity 
        style={styles.footerButton} 
        onPress={() => navigation.navigate('Wallet')}
      >
        <Ionicons name="wallet-outline" size={24} color="white" />
        <Text style={styles.footerText}>Wallet</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.footerButton} 
        onPress={() => navigation.navigate('TokenBuy')}
      >
        <Ionicons name="cash-outline" size={24} color="white" />
        <Text style={styles.footerText}>Token</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.footerButton} 
        onPress={() => navigation.navigate('AutomaticBots')}
      >
        <Ionicons name="hardware-chip-outline" size={24} color="white" />
        <Text style={styles.footerText}>Bots</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.footerButton}
        onPress={() => navigation.navigate('ContactsDonations')}
      >
        <Ionicons name="people-outline" size={24} color="white" />
        <Text style={styles.footerText}>Contacts</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  footerText: {
    color: 'white',
    fontSize: 12,
    marginTop: 2,
  },
});

export default Footer; 