import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Animated,
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CyberButton from 'react-native-cyberpunk-button';
import GlitchText from '../components/GlitchText';
import GlitchContainer from '../components/GlitchContainer';
import { devTheme, neonGlow } from '../utils/devTheme';

const { width } = Dimensions.get('window');

// Matrix code rain effect
const MatrixCodeRain = () => {
  const [columns, setColumns] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    const numColumns = Math.floor(width / 20); // Approx character width
    const newColumns = [];
    
    for (let i = 0; i < numColumns; i++) {
      const speed = Math.random() * 200 + 50; // Random speed between 50-250ms
      const delay = Math.random() * 5000; // Random delay for start
      const columnOpacity = Math.random() * 0.5 + 0.1; // Random opacity between 0.1-0.6
      
      newColumns.push(
        <MatrixColumn 
          key={i} 
          index={i} 
          speed={speed} 
          delay={delay}
          opacity={columnOpacity}
        />
      );
    }
    
    setColumns(newColumns);
  }, []);
  
  return (
    <View style={styles.matrixBackground} pointerEvents="none">
      {columns}
    </View>
  );
};

// Single matrix code column
const MatrixColumn = ({ index, speed, delay, opacity }: { index: number; speed: number; delay: number; opacity: number }) => {
  const characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
  const columnChars = Array.from({ length: 15 }, () => characters.charAt(Math.floor(Math.random() * characters.length)));
  const position = useRef(new Animated.Value(-300)).current;
  const [currentChars, setCurrentChars] = useState(columnChars);
  
  useEffect(() => {
    // Start animation after delay
    const timeoutId = setTimeout(() => {
      Animated.loop(
        Animated.timing(position, {
          toValue: 1000,
          duration: speed * 20,
          useNativeDriver: true,
        })
      ).start();
      
      // Change characters periodically
      const intervalId = setInterval(() => {
        setCurrentChars(prevChars => {
          const newChars = [...prevChars];
          const randomIndex = Math.floor(Math.random() * newChars.length);
          newChars[randomIndex] = characters.charAt(Math.floor(Math.random() * characters.length));
          return newChars;
        });
      }, 200);
      
      return () => clearInterval(intervalId);
    }, delay);
    
    return () => {
      clearTimeout(timeoutId);
      position.stopAnimation();
    };
  }, []);
  
  return (
    <Animated.View 
      style={{
        position: 'absolute',
        left: index * 20,
        transform: [{ translateY: position }],
        opacity,
      }}
    >
      {currentChars.map((char, i) => (
        <GlitchText 
          key={i} 
          text={char} 
          style={[styles.matrixChar, { color: i === 0 ? devTheme.neonGreen : `rgba(0, 255, 0, ${0.8 - i * 0.05})` }]}
          intensity="low"
        />
      ))}
    </Animated.View>
  );
};

const AutomaticBotsScreen: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  
  // References for CyberButtons
  const marketBtnRef = useRef<any>(null);
  const scheduledBtnRef = useRef<any>(null);
  const riskBtnRef = useRef<any>(null);
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Matrix code rain background */}
      <MatrixCodeRain />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
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
        
        <GlitchContainer style={styles.featuresContainer} intensity="low">
          <GlitchText text="PLANNED FEATURES" style={styles.sectionTitle} intensity="medium" />
          
          <View style={styles.featureItemWrapper}>
            <GlitchContainer 
              style={styles.featureItem} 
              intensity="low"
              onPress={() => {
                setActiveFeature(0);
                marketBtnRef.current?.animate();
              }}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="trending-up-outline" size={30} color={devTheme.toxicGreen} />
              </View>
              <View style={styles.featureContent}>
                <GlitchText text="MARKET ANALYSIS AI" style={styles.featureTitle} intensity="medium" />
                <GlitchText 
                  text="Real-time market condition analysis using advanced pattern recognition algorithms." 
                  style={styles.featureDescription}
                  intensity="low"
                />
                <View style={styles.buttonContainer}>
                  <CyberButton 
                    ref={marketBtnRef}
                    disableAutoAnimation
                    label="TECHNICAL PREVIEW_"
                    fontSize={12}
                    style={{ marginTop: 10 }}
                    mainColor={devTheme.neonGreen}
                    textColor={devTheme.darkestBg}
                    borderWidth={1}
                  />
                </View>
              </View>
            </GlitchContainer>
            
            <GlitchContainer 
              style={styles.featureItem} 
              intensity="low"
              onPress={() => {
                setActiveFeature(1);
                scheduledBtnRef.current?.animate();
              }}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="timer-outline" size={30} color={devTheme.glitchBlue} />
              </View>
              <View style={styles.featureContent}>
                <GlitchText text="SCHEDULED OPERATIONS" style={styles.featureTitle} intensity="medium" />
                <GlitchText 
                  text="Set up complex transaction schedules based on time, price triggers, or market events." 
                  style={styles.featureDescription}
                  intensity="low"
                />
                <View style={styles.buttonContainer}>
                  <CyberButton 
                    ref={scheduledBtnRef}
                    disableAutoAnimation
                    label="ADVANCED SETTINGS_"
                    fontSize={12}
                    style={{ marginTop: 10 }}
                    mainColor={devTheme.glitchBlue}
                    textColor={devTheme.darkestBg}
                    borderWidth={1}
                  />
                </View>
              </View>
            </GlitchContainer>
            
            <GlitchContainer 
              style={styles.featureItem} 
              intensity="low"
              onPress={() => {
                setActiveFeature(2);
                riskBtnRef.current?.animate();
              }}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="shield-checkmark-outline" size={30} color={devTheme.glitchPink} />
              </View>
              <View style={styles.featureContent}>
                <GlitchText text="RISK MANAGEMENT" style={styles.featureTitle} intensity="medium" />
                <GlitchText 
                  text="Advanced stop-loss algorithms with dynamic position sizing and portfolio protection." 
                  style={styles.featureDescription}
                  intensity="low"
                />
                <View style={styles.buttonContainer}>
                  <CyberButton 
                    ref={riskBtnRef}
                    disableAutoAnimation
                    label="SECURITY PROTOCOLS_"
                    fontSize={12}
                    style={{ marginTop: 10 }}
                    mainColor={devTheme.glitchPink}
                    textColor={devTheme.darkestBg}
                    borderWidth={1}
                  />
                </View>
              </View>
            </GlitchContainer>
          </View>
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
    backgroundColor: devTheme.darkestBg,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 80, // Extra padding for footer
  },
  matrixBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  matrixChar: {
    fontSize: 16,
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 30,
    borderWidth: 1,
    borderColor: devTheme.neonGreen,
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
  featuresContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: devTheme.neonGreen,
    marginBottom: 15,
    ...neonGlow.small,
  },
  featureItemWrapper: {
    gap: 15,
  },
  featureItem: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: devTheme.darkGreen,
    padding: 15,
  },
  activeFeature: {
    borderColor: devTheme.neonGreen,
    backgroundColor: `${devTheme.darkGreen}40`,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: `${devTheme.codeBg}80`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    borderWidth: 1,
    borderColor: devTheme.darkGreen,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: devTheme.textPrimary,
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 13,
    color: devTheme.textSecondary,
    lineHeight: 18,
  },
  buttonContainer: {
    alignItems: 'flex-start',
  },
  statsContainer: {
    marginBottom: 20,
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