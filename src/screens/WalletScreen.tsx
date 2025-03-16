import React, { useState } from 'react';
import { 
  View, 
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
import GlitchText from '../components/GlitchText';
import NeonButton from '../components/NeonButton';
import GlitchContainer from '../components/GlitchContainer';
import HackerTerminal from '../components/HackerTerminal';
import { devTheme, neonGlow } from '../utils/devTheme';

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
        <GlitchText 
          text="AINSHTEIN WALLET" 
          style={styles.headerText}
          intensity="medium"
        />
        
        <GlitchContainer style={styles.walletContainer} intensity="low">
          <GlitchText text="YOUR WALLET" style={styles.sectionTitle} />
          
          {loading ? (
            <ActivityIndicator size="large" color={devTheme.neonGreen} />
          ) : error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={24} color={devTheme.glitchPink} />
              <GlitchText text={error} style={styles.errorText} intensity="high" />
            </View>
          ) : (
            <>
              <View style={styles.balanceContainer}>
                <GlitchText text="Balance:" style={styles.balanceLabel} />
                <GlitchText 
                  text={`${balance.toFixed(6)} SOL`} 
                  style={styles.balanceValue}
                  intensity="low" 
                />
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={handleRefresh}
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <ActivityIndicator size="small" color={devTheme.neonGreen} />
                  ) : (
                    <Ionicons name="refresh-outline" size={20} color={devTheme.neonGreen} />
                  )}
                </TouchableOpacity>
              </View>
              
              <View style={styles.addressContainer}>
                <GlitchText text="Public Address:" style={styles.addressLabel} />
                <View style={styles.addressRow}>
                  <GlitchText 
                    text={publicKey ? `${publicKey.slice(0, 16)}...${publicKey.slice(-8)}` : 'Unknown'} 
                    style={styles.addressValue}
                    intensity="low"
                  />
                  <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                    <Ionicons name="copy-outline" size={20} color={devTheme.neonGreen} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <NeonButton 
                title="Refresh Wallet" 
                onPress={handleRefresh}
                style={styles.walletButton}
              />
            </>
          )}
        </GlitchContainer>
        
        <GlitchContainer style={styles.terminalContainer}>
          <GlitchText text="TERMINAL ACCESS" style={styles.terminalTitle} />
          <HackerTerminal 
            height={200}
            autoTypeText={[
              'help',
              'wallet',
              'scan',
              'ls -la /wallet/tokens',
            ]}
          />
        </GlitchContainer>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 130,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: devTheme.neonGreen,
    textAlign: 'center',
    marginVertical: 20,
    ...neonGlow.medium
  },
  walletContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: devTheme.neonGreen,
    marginBottom: 20,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 18,
    color: devTheme.textMuted,
    marginRight: 10,
  },
  balanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: devTheme.limeGreen,
    flex: 1,
  },
  refreshButton: {
    backgroundColor: devTheme.darkBg,
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: devTheme.neonGreen,
  },
  addressContainer: {
    marginTop: 10,
  },
  addressLabel: {
    fontSize: 16,
    color: devTheme.textMuted,
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: devTheme.codeBg,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: devTheme.darkGreen,
  },
  addressValue: {
    fontSize: 14,
    color: devTheme.textPrimary,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyButton: {
    padding: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 39, 48, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
  },
  errorText: {
    color: devTheme.glitchPink,
    marginLeft: 10,
    fontSize: 14,
  },
  walletButton: {
    marginTop: 20,
  },
  terminalContainer: {
    marginBottom: 20,
  },
  terminalTitle: {
    fontSize: 18,
    color: devTheme.textPrimary,
    marginBottom: 10,
  },
});

export default WalletScreen; 