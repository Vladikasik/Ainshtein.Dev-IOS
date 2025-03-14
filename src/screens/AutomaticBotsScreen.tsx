import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AutomaticBotsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.comingSoonContainer}>
          <Ionicons name="rocket-outline" size={60} color="#FF9500" />
          <Text style={styles.comingSoonTitle}>Coming Soon!</Text>
          <Text style={styles.comingSoonDescription}>
            We're working hard to bring you automatic trading bots. Stay tuned for updates!
          </Text>
          
          <View style={styles.featureContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="trending-up-outline" size={30} color="#4CD964" />
              <Text style={styles.featureTitle}>Market Trading</Text>
              <Text style={styles.featureDescription}>
                Automatically trade based on market conditions and trends.
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="timer-outline" size={30} color="#5AC8FA" />
              <Text style={styles.featureTitle}>Scheduled Transactions</Text>
              <Text style={styles.featureDescription}>
                Set up recurring buys and sells at predetermined times.
              </Text>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark-outline" size={30} color="#FF2D55" />
              <Text style={styles.featureTitle}>Risk Management</Text>
              <Text style={styles.featureDescription}>
                Configure stop-loss and take-profit levels to protect your investments.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  comingSoonContainer: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  comingSoonTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 8,
  },
  comingSoonDescription: {
    fontSize: 16,
    color: '#CCC',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  featureContainer: {
    width: '100%',
  },
  featureItem: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#AAA',
    textAlign: 'center',
  },
});

export default AutomaticBotsScreen; 