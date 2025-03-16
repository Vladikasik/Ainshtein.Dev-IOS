import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Clipboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { devTheme, devFonts } from '../utils/devTheme';
import { RootStackParamList } from '../navigation/types';
import GlitchText from '../components/GlitchText';
import { useWallet } from '../context/WalletContext';

// Define navigation prop type
type ImportWalletScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ImportWallet'
>;

const WalletImportScreen = () => {
  const navigation = useNavigation<ImportWalletScreenNavigationProp>();
  const { importWallet } = useWallet();
  
  const [importType, setImportType] = useState<'seedPhrase' | 'privateKey'>('seedPhrase');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [seedPassword, setSeedPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleImport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (importType === 'seedPhrase' && !seedPhrase.trim()) {
        throw new Error('Seed phrase cannot be empty');
      }
      
      if (importType === 'privateKey' && !privateKey.trim()) {
        throw new Error('Private key cannot be empty');
      }
      
      // Call the import function from WalletContext
      if (importType === 'seedPhrase') {
        await importWallet({ 
          type: 'seedPhrase', 
          value: seedPhrase.trim(),
          password: seedPassword.trim() // Pass password (can be empty)
        });
      } else {
        // For privateKey, remove any whitespace that might have been pasted
        await importWallet({ 
          type: 'privateKey', 
          value: privateKey.trim().replace(/\s+/g, '') 
        });
      }
      
      // Navigate to main screen
      navigation.replace('MainTabs');
    } catch (err: any) {
      console.error('Import error:', err);
      setError(err.message || 'Failed to import wallet');
      Alert.alert('Import Failed', err.message || 'Failed to import wallet');
    } finally {
      setLoading(false);
    }
  };

  const handlePasteFromClipboard = async (field: 'seedPhrase' | 'privateKey' | 'seedPassword') => {
    try {
      const clipboardContent = await Clipboard.getString();
      if (!clipboardContent) {
        Alert.alert('Clipboard Empty', 'There is nothing to paste from the clipboard');
        return;
      }
      
      if (field === 'seedPhrase') {
        setSeedPhrase(clipboardContent);
      } else if (field === 'privateKey') {
        setPrivateKey(clipboardContent);
      } else if (field === 'seedPassword') {
        setSeedPassword(clipboardContent);
      }
    } catch (err) {
      console.error('Error pasting from clipboard:', err);
      Alert.alert('Paste Error', 'Could not paste from clipboard');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <GlitchText text="Import Wallet" style={styles.title} />
            <Text style={styles.subtitle}>
              Import your existing wallet to use with Ainshtein.dev
            </Text>
          </View>
          
          <View style={styles.tabSelector}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                importType === 'seedPhrase' && styles.activeTabButton
              ]}
              onPress={() => setImportType('seedPhrase')}
            >
              <Text style={[
                styles.tabButtonText,
                importType === 'seedPhrase' && styles.activeTabButtonText
              ]}>
                Seed Phrase
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tabButton,
                importType === 'privateKey' && styles.activeTabButton
              ]}
              onPress={() => setImportType('privateKey')}
            >
              <Text style={[
                styles.tabButtonText,
                importType === 'privateKey' && styles.activeTabButtonText
              ]}>
                Private Key
              </Text>
            </TouchableOpacity>
          </View>
          
          {importType === 'seedPhrase' ? (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter Your Seed Phrase</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={styles.multilineInput}
                  placeholder="Enter 12 or 24 word seed phrase..."
                  placeholderTextColor={devTheme.textSecondary}
                  value={seedPhrase}
                  onChangeText={setSeedPhrase}
                  multiline
                  numberOfLines={4}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                />
                <TouchableOpacity 
                  style={styles.pasteButton}
                  onPress={() => handlePasteFromClipboard('seedPhrase')}
                >
                  <Ionicons name="clipboard-outline" size={20} color={devTheme.neonGreen} />
                </TouchableOpacity>
              </View>
              <Text style={styles.infoText}>
                Typically 12 or 24 words separated by spaces
              </Text>
              
              <Text style={[styles.inputLabel, { marginTop: 15 }]}>Password (Optional)</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter password if your seed has one..."
                  placeholderTextColor={devTheme.textSecondary}
                  value={seedPassword}
                  onChangeText={setSeedPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                />
                <TouchableOpacity 
                  style={styles.pasteButton}
                  onPress={() => handlePasteFromClipboard('seedPassword')}
                >
                  <Ionicons name="clipboard-outline" size={20} color={devTheme.neonGreen} />
                </TouchableOpacity>
              </View>
              <Text style={styles.infoText}>
                Leave empty if your seed phrase doesn't have a password
              </Text>
            </View>
          ) : (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter Your Private Key</Text>
              <View style={styles.inputWithButton}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter private key..."
                  placeholderTextColor={devTheme.textSecondary}
                  value={privateKey}
                  onChangeText={setPrivateKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity 
                  style={styles.pasteButton}
                  onPress={() => handlePasteFromClipboard('privateKey')}
                >
                  <Ionicons name="clipboard-outline" size={20} color={devTheme.neonGreen} />
                </TouchableOpacity>
              </View>
              <Text style={styles.infoText}>
                Base58-encoded Solana private key
              </Text>
            </View>
          )}
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <TouchableOpacity 
            style={styles.importButton}
            onPress={handleImport}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.buttonText}>Importing...</Text>
            ) : (
              <>
                <Ionicons name="wallet-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Import Wallet</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.securityNote}>
            Your wallet credentials will be stored securely on this device only.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: devTheme.darkBg,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: devFonts.monospace,
    color: devTheme.neonGreen,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: devTheme.textPrimary,
    textAlign: 'center',
    fontFamily: devFonts.monospace,
  },
  tabSelector: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderColor: devTheme.darkGreen,
    borderWidth: 1,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: devTheme.darkBg,
  },
  activeTabButton: {
    backgroundColor: devTheme.darkGreen,
  },
  tabButtonText: {
    color: devTheme.textPrimary,
    fontFamily: devFonts.monospace,
  },
  activeTabButtonText: {
    color: devTheme.neonGreen,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: devTheme.textPrimary,
    marginBottom: 8,
    fontFamily: devFonts.monospace,
    fontSize: 14,
  },
  inputWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: devTheme.darkestBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: devTheme.darkGreen,
    color: devTheme.textPrimary,
    padding: 12,
    fontFamily: devFonts.monospace,
  },
  multilineInput: {
    flex: 1,
    backgroundColor: devTheme.darkestBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: devTheme.darkGreen,
    color: devTheme.textPrimary,
    padding: 12,
    height: 120,
    textAlignVertical: 'top',
    fontFamily: devFonts.monospace,
  },
  pasteButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 5,
    borderRadius: 4,
    backgroundColor: `${devTheme.darkGreen}80`,
    zIndex: 1,
  },
  infoText: {
    color: devTheme.textSecondary,
    fontSize: 12,
    marginTop: 8,
    fontFamily: devFonts.monospace,
  },
  importButton: {
    backgroundColor: devTheme.darkGreen,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: devTheme.neonGreen,
  },
  buttonText: {
    color: 'white',
    fontFamily: devFonts.monospace,
    fontSize: 16,
    marginLeft: 8,
  },
  errorText: {
    color: devTheme.glitchPink,
    marginBottom: 15,
    fontFamily: devFonts.monospace,
  },
  securityNote: {
    color: devTheme.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    fontFamily: devFonts.monospace,
    fontSize: 12,
  }
});

export default WalletImportScreen; 