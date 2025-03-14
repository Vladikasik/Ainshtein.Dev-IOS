import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView,
  Clipboard,
  ToastAndroid,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';

const WalletScreen: React.FC = () => {
  const { publicKey, balance, loading, error, refreshWallet } = useWallet();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshWallet();
    setRefreshing(false);
  };

  const copyToClipboard = () => {
    if (publicKey) {
      Clipboard.setString(publicKey);
      
      // Show notification based on platform
      if (Platform.OS === 'android') {
        ToastAndroid.show('Address copied to clipboard!', ToastAndroid.SHORT);
      } else {
        Alert.alert('Copied', 'Wallet address copied to clipboard!');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.walletContainer}>
          <Text style={styles.sectionTitle}>Your Wallet</Text>
          
          {loading ? (
            <ActivityIndicator size="large" color="#FF9500" />
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={24} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <>
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceLabel}>Balance:</Text>
                <Text style={styles.balanceValue}>{balance.toFixed(6)} SOL</Text>
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={handleRefresh}
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Ionicons name="refresh-outline" size={20} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
              
              <View style={styles.addressContainer}>
                <Text style={styles.addressLabel}>Public Address:</Text>
                <View style={styles.addressRow}>
                  <Text style={styles.addressValue}>
                    {publicKey ? `${publicKey.slice(0, 16)}...${publicKey.slice(-8)}` : 'Unknown'}
                  </Text>
                  <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                    <Ionicons name="copy-outline" size={20} color="#FF9500" />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
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
  walletContainer: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 18,
    color: '#888',
    marginRight: 10,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9500',
    flex: 1,
  },
  refreshButton: {
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 8,
  },
  addressContainer: {
    marginTop: 10,
  },
  addressLabel: {
    fontSize: 16,
    color: '#888',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressValue: {
    fontSize: 14,
    color: 'white',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  copyButton: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  errorText: {
    color: '#FF3B30',
    marginLeft: 10,
    fontSize: 14,
  },
});

export default WalletScreen; 