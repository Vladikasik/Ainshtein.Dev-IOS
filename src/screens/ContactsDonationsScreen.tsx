import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  Alert,
  Clipboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ContactsDonationsScreen: React.FC = () => {
  const donationAddress = 'Your_Donation_Address_Here';

  const copyToClipboard = (text: string, message: string) => {
    Clipboard.setString(text);
    Alert.alert('Copied', message);
  };

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', `Don't know how to open this URL: ${url}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          
          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => openLink('mailto:contact@ainshtein.dev')}
          >
            <Ionicons name="mail-outline" size={24} color="#FF9500" />
            <Text style={styles.contactText}>contact@ainshtein.dev</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => openLink('https://twitter.com/ainshtein_dev')}
          >
            <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
            <Text style={styles.contactText}>@ainshtein_dev</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => openLink('https://discord.gg/ainshtein')}
          >
            <Ionicons name="logo-discord" size={24} color="#5865F2" />
            <Text style={styles.contactText}>Join our Discord</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => openLink('https://ainshtein.dev')}
          >
            <Ionicons name="globe-outline" size={24} color="#4CD964" />
            <Text style={styles.contactText}>ainshtein.dev</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Support Development</Text>
          
          <Text style={styles.donationDescription}>
            If you find this app useful, please consider supporting our development efforts with a donation.
          </Text>
          
          <View style={styles.donationContainer}>
            <Text style={styles.donationLabel}>Donation Address (SOL):</Text>
            <View style={styles.addressRow}>
              <Text style={styles.donationAddress}>
                {donationAddress.substring(0, 20)}...
              </Text>
              <TouchableOpacity 
                onPress={() => copyToClipboard(donationAddress, 'Donation address copied to clipboard!')}
              >
                <Ionicons name="copy-outline" size={20} color="#FF9500" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.supportOptions}>
            <TouchableOpacity style={styles.supportOption}>
              <Text style={styles.supportAmount}>5 SOL</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportOption}>
              <Text style={styles.supportAmount}>10 SOL</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportOption}>
              <Text style={styles.supportAmount}>25 SOL</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.supportOption}>
              <Text style={styles.supportAmount}>Custom</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <Text style={styles.aboutText}>
            Ainshtein.dev is an innovative platform for creating and managing Solana tokens and automated trading bots.
            Our mission is to make blockchain technology more accessible to everyone.
          </Text>
          
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
  sectionContainer: {
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
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  contactText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 16,
  },
  donationDescription: {
    color: '#CCC',
    fontSize: 16,
    marginBottom: 20,
  },
  donationContainer: {
    backgroundColor: '#222',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  donationLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  donationAddress: {
    color: 'white',
    fontSize: 16,
  },
  supportOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  supportOption: {
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
  },
  supportAmount: {
    color: '#FF9500',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aboutText: {
    color: '#CCC',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  versionText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ContactsDonationsScreen; 