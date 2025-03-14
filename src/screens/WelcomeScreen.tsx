import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const navigateToMain = (initialTab: string) => {
    // Navigate to Main and then to the specific tab
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>ainshtein.dev</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigateToMain('Wallet')}
          >
            <Text style={styles.buttonText}>wallet</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigateToMain('TokenBuy')}
          >
            <Text style={styles.buttonText}>token-buy</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.disabledButton]}
            disabled={true}
          >
            <Text style={[styles.buttonText, styles.disabledText]}>automatic bots</Text>
            <Text style={styles.comingSoonText}>coming soon</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigateToMain('ContactsDonations')}
          >
            <Text style={styles.buttonText}>contacts & donations</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 60,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.7,
  },
  disabledText: {
    opacity: 0.8,
  },
  comingSoonText: {
    color: '#FF9500',
    fontSize: 12,
    marginTop: 5,
  },
});

export default WelcomeScreen; 