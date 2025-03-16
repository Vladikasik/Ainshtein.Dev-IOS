import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import * as web3 from '@solana/web3.js';

// Digital rain characters - Matrix-style
const digitalRainChars = "01101110010100111001010100110101";

export interface WalletOption {
  publicKey: string;
  balance: number;
  index: number;
  keypair: web3.Keypair;
  path: string;
}

interface WalletSelectionModalProps {
  visible: boolean;
  wallets: WalletOption[];
  onSelect: (wallet: WalletOption) => void;
  onCancel: () => void;
  loading: boolean;
}

const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({ 
  visible, 
  wallets, 
  onSelect, 
  onCancel,
  loading 
}) => {
  // Create digital rain backgrounds
  const renderDigitalRain = () => {
    return (
      <View style={styles.digitalRainContainer}>
        {[...Array(10)].map((_, i) => (
          <Text key={i} style={[
            styles.digitalRainText, 
            { left: Math.random() * Dimensions.get('window').width, opacity: 0.3 + Math.random() * 0.4 }
          ]}>
            {digitalRainChars}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {renderDigitalRain()}
          
          <Text style={styles.modalTitle}>
            <Text style={styles.titleAccent}>{'{'}</Text> 
            SELECT WALLET 
            <Text style={styles.titleAccent}>{'}'}</Text>
          </Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00FF41" />
              <Text style={styles.loadingText}>
                <Text style={styles.codeText}>{'> '}</Text>
                SCANNING BLOCKCHAIN NETWORK
              </Text>
              <Text style={styles.loadingSubtext}>DECRYPTING WALLET DATA...</Text>
            </View>
          ) : wallets.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                <Text style={styles.codeText}>{'['}</Text>
                NO WALLETS WITH BALANCE FOUND
                <Text style={styles.codeText}>{']'}</Text>
              </Text>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]} 
                onPress={onCancel}
              >
                <Text style={styles.buttonText}>{'<'} RETURN <Text style={{color: '#00FF41'}}>|</Text> {'>'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.subtitle}>
                <Text style={{color: '#00FF41'}}>{wallets.length}</Text> WALLET{wallets.length > 1 ? 'S' : ''} DETECTED
              </Text>
              <FlatList
                data={wallets}
                keyExtractor={(item) => item.publicKey}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.walletOption}
                    onPress={() => onSelect(item)}
                  >
                    <View style={styles.walletGradient}>
                      <View style={styles.walletHeader}>
                        <Text style={styles.walletIndex}>ACCOUNT_<Text style={styles.glowText}>{item.index}</Text></Text>
                        <Text style={styles.walletBalance}>
                          {item.balance.toFixed(4)} <Text style={styles.glowText}>SOL</Text>
                        </Text>
                      </View>
                      
                      <View style={styles.walletInfo}>
                        <Text style={styles.walletPath}>{item.path}</Text>
                        <Text style={styles.walletAddress}>
                          {item.publicKey.substring(0, 10)}
                          <Text style={{color: 'rgba(0, 255, 65, 0.5)'}}>...</Text>
                          {item.publicKey.substring(item.publicKey.length - 10)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
              
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={styles.cancelButtonText}>DISCONNECT</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#00FF41',
    borderRadius: 6,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
    shadowColor: '#00FF41',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  digitalRainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    opacity: 0.05,
  },
  digitalRainText: {
    position: 'absolute',
    color: '#00FF41',
    fontSize: 12,
    fontFamily: 'monospace',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: '#00FF41',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  titleAccent: {
    color: '#00FF41',
    fontSize: 26,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    color: '#CCCCCC',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  walletOption: {
    marginBottom: 12,
    borderRadius: 4,
    overflow: 'hidden',
  },
  walletGradient: {
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#00FF41',
    backgroundColor: 'rgba(0, 20, 0, 0.9)',
    borderRadius: 4,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  walletInfo: {
    flex: 1,
  },
  walletIndex: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#CCCCCC',
    fontFamily: 'monospace',
  },
  walletPath: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  walletAddress: {
    fontSize: 16,
    color: '#00FF41',
    fontFamily: 'monospace',
  },
  walletBalance: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: '#00FF41',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  button: {
    padding: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: 'rgba(0, 40, 0, 0.8)',
    borderColor: '#00FF41',
  },
  cancelButton: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderColor: '#333',
  },
  buttonText: {
    color: '#00FF41',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  cancelButtonText: {
    color: '#FF3333',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  loadingContainer: {
    padding: 30,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#00FF41',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 12,
    color: 'rgba(0, 255, 65, 0.7)',
    fontFamily: 'monospace',
  },
  codeText: {
    color: '#00FF41',
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  glowText: {
    color: '#00FF41',
    textShadowColor: '#00FF41',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
});

export default WalletSelectionModal; 