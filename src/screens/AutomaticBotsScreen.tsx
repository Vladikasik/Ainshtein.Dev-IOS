import React from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlitchText from '../components/GlitchText';
import GlitchContainer from '../components/GlitchContainer';
import { devTheme, neonGlow } from '../utils/devTheme';

const AutomaticBotsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <GlitchContainer style={styles.headerContainer} intensity="medium">
          <Ionicons name="hardware-chip-outline" size={60} color={devTheme.neonGreen} />
          <GlitchText 
            text="AUTOMATED TRADING BOTS" 
            style={styles.headerTitle}
            intensity="high"
          />
          <GlitchText 
            text="COMING SOON IN v0.2.0" 
            style={styles.headerVersion}
            intensity="medium"
          />
          <GlitchText 
            text="Our neural network-powered trading algorithms are currently in development. Deploy autonomous trading strategies with just a few taps." 
            style={styles.headerDescription}
            intensity="low"
          />
        </GlitchContainer>
        
        <GlitchContainer style={styles.statsContainer} intensity="low">
          <GlitchText text="SYSTEM STATUS" style={styles.sectionTitle} intensity="medium" />
          
          <View style={styles.statRow}>
            <GlitchText text="DEVELOPMENT PROGRESS:" style={styles.statLabel} intensity="low" />
            <GlitchText text="73%" style={styles.statValue} intensity="medium" />
          </View>
          
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '73%' }]} />
          </View>
          
          <View style={styles.statRow}>
            <GlitchText text="ESTIMATED RELEASE:" style={styles.statLabel} intensity="low" />
            <GlitchText text="Q2 2025" style={styles.statValue} intensity="medium" />
          </View>
          
          <View style={styles.statRow}>
            <GlitchText text="BUILD VERSION:" style={styles.statLabel} intensity="low" />
            <GlitchText text="0.1.85-alpha" style={styles.statValue} intensity="medium" />
          </View>
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
    padding: 16,
    paddingBottom: 130, // Increased bottom padding for floating tab bar
    paddingHorizontal: 16, // Consistent horizontal padding
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: devTheme.neonGreen,
    marginTop: 8, // Add margin at the top
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: devTheme.neonGreen,
    marginTop: 16,
    textAlign: 'center',
    ...neonGlow.medium,
  },
  headerVersion: {
    fontSize: 14,
    color: devTheme.toxicGreen,
    marginTop: 4,
    marginBottom: 16,
    ...neonGlow.small,
  },
  headerDescription: {
    fontSize: 14,
    color: devTheme.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: devTheme.neonGreen,
    marginBottom: 15,
    ...neonGlow.small,
  },
  statsContainer: {
    marginBottom: 20,
    padding: 16, // Add consistent padding
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: devTheme.textMuted,
  },
  statValue: {
    fontSize: 14,
    color: devTheme.neonGreen,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  progressBar: {
    height: 4,
    backgroundColor: `${devTheme.darkGreen}60`,
    borderRadius: 2,
    marginBottom: 15,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: devTheme.neonGreen,
    borderRadius: 2,
  },
});

export default AutomaticBotsScreen; 