import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useWallet } from '../context/WalletContext';
import { createToken } from '../utils/wallet';
import GlitchText from '../components/GlitchText';
import NeonButton from '../components/NeonButton';
import GlitchContainer from '../components/GlitchContainer';
import FinancialCharts from '../components/FinancialCharts';
import { devTheme, neonGlow } from '../utils/devTheme';

const TokenBuyScreen: React.FC = () => {
  const { keypair, loading: walletLoading } = useWallet();
  
  const [tokenName, setTokenName] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [tokenDescription, setTokenDescription] = useState('');
  const [tokenSupply, setTokenSupply] = useState('');
  const [tokenImage, setTokenImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImagePick = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to allow access to your photos to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setTokenImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!keypair) {
      Alert.alert('Error', 'Wallet not loaded. Please try again later.');
      return;
    }

    if (!tokenName || !tokenSymbol || !tokenDescription || !tokenSupply) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (!tokenImage) {
      Alert.alert('Error', 'Please select a token image.');
      return;
    }

    try {
      setLoading(true);
      
      // Create token
      const supply = Number(tokenSupply);
      if (isNaN(supply) || supply <= 0) {
        Alert.alert('Error', 'Please enter a valid token supply.');
        setLoading(false);
        return;
      }

      const result = await createToken(
        keypair,
        tokenName,
        tokenSymbol,
        tokenDescription,
        supply
      );

      // Show success message
      Alert.alert(
        'Token Created',
        `Your token ${tokenName} (${tokenSymbol}) has been created successfully!`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setTokenName('');
              setTokenSymbol('');
              setTokenDescription('');
              setTokenSupply('');
              setTokenImage(null);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating token:', error);
      Alert.alert('Error', 'Failed to create token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
        >
          <GlitchText 
            text="TOKEN CREATION" 
            style={styles.headerText}
            intensity="medium"
          />
          
          <GlitchContainer style={styles.formContainer} intensity="low">
            <GlitchText text="CREATE NEW TOKEN" style={styles.sectionTitle} />

            <View style={styles.inputGroup}>
              <GlitchText text="TOKEN NAME" style={styles.label} intensity="low" />
              <TextInput
                style={styles.input}
                value={tokenName}
                onChangeText={setTokenName}
                placeholder="Enter token name"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <GlitchText text="TOKEN SYMBOL" style={styles.label} intensity="low" />
              <TextInput
                style={styles.input}
                value={tokenSymbol}
                onChangeText={setTokenSymbol}
                placeholder="Enter token symbol"
                placeholderTextColor="#666"
                maxLength={10}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <GlitchText text="DESCRIPTION" style={styles.label} intensity="low" />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={tokenDescription}
                onChangeText={setTokenDescription}
                placeholder="Enter token description"
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <GlitchText text="TOTAL SUPPLY" style={styles.label} intensity="low" />
              <TextInput
                style={styles.input}
                value={tokenSupply}
                onChangeText={setTokenSupply}
                placeholder="Enter total supply"
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <GlitchText text="TOKEN IMAGE" style={styles.label} intensity="low" />
              <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
                {tokenImage ? (
                  <Image source={{ uri: tokenImage }} style={styles.tokenImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={30} color={devTheme.neonGreen} />
                    <GlitchText 
                      text="UPLOAD IMAGE" 
                      style={styles.imagePlaceholderText} 
                      intensity="medium" 
                    />
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <NeonButton
              title={loading ? "CREATING..." : "CREATE TOKEN"}
              onPress={handleSubmit}
              style={styles.submitButton}
              glitchMode={true}
              intensity="medium"
            />
          </GlitchContainer>
          
          <GlitchContainer style={styles.infoContainer} intensity="low">
            <GlitchText text="TOKEN INFO" style={styles.infoTitle} />
            <View style={styles.infoItem}>
              <Ionicons name="information-circle-outline" size={20} color={devTheme.neonGreen} />
              <GlitchText 
                text="Creating a token costs 0.01 SOL for transaction fees" 
                style={styles.infoText}
                intensity="low" 
              />
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="warning-outline" size={20} color={devTheme.toxicGreen} />
              <GlitchText 
                text="Tokens created in DEV mode are on testnet only" 
                style={styles.infoText}
                intensity="medium" 
              />
            </View>
          </GlitchContainer>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  keyboardAvoidingView: {
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
  formContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: devTheme.neonGreen,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: devTheme.textMuted,
    marginBottom: 8,
  },
  input: {
    backgroundColor: devTheme.codeBg,
    borderRadius: 4,
    padding: 12,
    color: devTheme.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    borderWidth: 1,
    borderColor: devTheme.darkGreen,
  },
  textArea: {
    minHeight: 100,
  },
  imagePickerButton: {
    backgroundColor: devTheme.codeBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: devTheme.darkGreen,
    overflow: 'hidden',
  },
  tokenImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: devTheme.neonGreen,
  },
  imagePlaceholderText: {
    marginTop: 10,
    color: devTheme.textMuted,
    fontSize: 14,
  },
  submitButton: {
    marginTop: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    color: devTheme.textPrimary,
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    color: devTheme.textSecondary,
    fontSize: 14,
  },
});

export default TokenBuyScreen; 