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
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Create New Token</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Token Name</Text>
              <TextInput
                style={styles.input}
                value={tokenName}
                onChangeText={setTokenName}
                placeholder="Enter token name"
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Token Symbol</Text>
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
              <Text style={styles.label}>Description</Text>
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
              <Text style={styles.label}>Total Supply</Text>
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
              <Text style={styles.label}>Token Image</Text>
              <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
                {tokenImage ? (
                  <Image source={{ uri: tokenImage }} style={styles.tokenImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="image-outline" size={30} color="#666" />
                    <Text style={styles.imagePlaceholderText}>Upload Image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (loading || walletLoading) && styles.disabledButton,
              ]}
              onPress={handleSubmit}
              disabled={loading || walletLoading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Create Token</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  formContainer: {
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#CCC',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  textArea: {
    height: 100,
  },
  imagePickerButton: {
    backgroundColor: '#222',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#666',
    marginTop: 8,
  },
  tokenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: '#FF9500',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default TokenBuyScreen; 