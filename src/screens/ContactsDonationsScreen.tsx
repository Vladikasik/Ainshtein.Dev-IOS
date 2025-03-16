import React from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  Alert,
  Clipboard,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlitchText from '../components/GlitchText';
import GlitchContainer from '../components/GlitchContainer';
import NeonButton from '../components/NeonButton';
import { devTheme, neonGlow } from '../utils/devTheme';

const ContactsDonationsScreen: React.FC = () => {
  const donationAddress = 'CLcj8RiEtay5fyoJJigx4AP5UvcM2Hr64DFubkQVT7Bi';

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
        <GlitchText 
          text="CONNECT & SUPPORT" 
          style={styles.headerText}
          intensity="medium"
        />
        
        <GlitchContainer style={styles.sectionContainer} intensity="low">
          <GlitchText text="CONTACT US" style={styles.sectionTitle} />
          
          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => openLink('mailto:contact@ainshtein.dev')}
          >
            <Ionicons name="mail-outline" size={24} color={devTheme.neonGreen} />
            <GlitchText 
              text="contact@ainshtein.dev" 
              style={styles.contactText} 
              intensity="low"
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => openLink('https://twitter.com/ainshtein_dev')}
          >
            <Ionicons name="logo-twitter" size={24} color={devTheme.glitchBlue} />
            <GlitchText 
              text="@ainshtein_dev" 
              style={styles.contactText} 
              intensity="low"
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => openLink('https://discord.gg/ainshtein')}
          >
            <Ionicons name="logo-discord" size={24} color={devTheme.glitchPurple} />
            <GlitchText 
              text="Join our Discord" 
              style={styles.contactText}
              intensity="low" 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.contactItem} 
            onPress={() => openLink('https://ainshtein.dev')}
          >
            <Ionicons name="globe-outline" size={24} color={devTheme.limeGreen} />
            <GlitchText 
              text="ainshtein.dev" 
              style={styles.contactText}
              intensity="low" 
            />
          </TouchableOpacity>
        </GlitchContainer>
        
        <GlitchContainer style={styles.sectionContainer} intensity="low">
          <GlitchText text="SUPPORT DEVELOPMENT" style={styles.sectionTitle} />
          
          <GlitchText 
            text="If you find this app useful, please consider supporting our development efforts with a donation." 
            style={styles.donationDescription}
            intensity="low" 
          />
          
          <View style={styles.donationContainer}>
            <GlitchText 
              text="Donation Address (SOL):" 
              style={styles.donationLabel}
              intensity="low" 
            />
            <View style={styles.addressRow}>
              <GlitchText 
                text={`${donationAddress.substring(0, 12)}...${donationAddress.substring(donationAddress.length - 8)}`}
                style={styles.donationAddress}
                intensity="medium" 
              />
              <TouchableOpacity 
                onPress={() => copyToClipboard(donationAddress, 'Donation address copied to clipboard!')}
                style={styles.copyButton}
              >
                <Ionicons name="copy-outline" size={20} color={devTheme.neonGreen} />
              </TouchableOpacity>
            </View>
          </View>
          
          <NeonButton
            title="COPY DONATION ADDRESS"
            onPress={() => copyToClipboard(donationAddress, 'Donation address copied to clipboard!')}
            style={styles.fullWidthButton}
            glitchMode={true}
            intensity="medium"
          />
        </GlitchContainer>
        
        <GlitchContainer style={styles.sectionContainer} intensity="low">
          <GlitchText text="ABOUT" style={styles.sectionTitle} />
          
          <GlitchText 
            text="Ainshtein.dev is an innovative platform for creating and managing Solana tokens and automated trading bots. Our mission is to make blockchain technology more accessible to everyone." 
            style={styles.aboutText}
            intensity="low" 
          />
          
          <GlitchText 
            text="VERSION 0.1.3 [DEV BUILD]" 
            style={styles.versionText}
            intensity="high" 
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
    paddingBottom: 130, // Increased bottom padding for floating tab bar
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: devTheme.neonGreen,
    textAlign: 'center',
    marginVertical: 20,
    ...neonGlow.medium
  },
  sectionContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: devTheme.darkGreen,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: devTheme.neonGreen,
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: devTheme.darkGreen,
  },
  contactText: {
    color: devTheme.textPrimary,
    fontSize: 16,
    marginLeft: 16,
  },
  donationDescription: {
    color: devTheme.textSecondary,
    fontSize: 16,
    marginBottom: 20,
  },
  donationContainer: {
    backgroundColor: devTheme.codeBg,
    borderRadius: 4,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: devTheme.darkGreen,
  },
  donationLabel: {
    color: devTheme.textMuted,
    fontSize: 14,
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  donationAddress: {
    color: devTheme.textPrimary,
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyButton: {
    padding: 8,
  },
  fullWidthButton: {
    width: '100%',
    marginTop: 10,
  },
  aboutText: {
    color: devTheme.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  versionText: {
    color: devTheme.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ContactsDonationsScreen; 