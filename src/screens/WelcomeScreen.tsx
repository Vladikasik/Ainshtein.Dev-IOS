import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  TouchableOpacity, 
  Vibration 
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import GlitchText from '../components/GlitchText';
import NeonButton from '../components/NeonButton';
import MatrixRain from '../components/MatrixRain';
import { devTheme, neonGlow } from '../utils/devTheme';
import { RootStackParamList } from '../navigation/types';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const [showContent, setShowContent] = useState(false);
  const [welcomeSequence, setWelcomeSequence] = useState(0);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const glitchAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Startup animation sequence
  useEffect(() => {
    // Boot-up sequence
    setTimeout(() => {
      setWelcomeSequence(1);
      Vibration.vibrate(100);
      
      setTimeout(() => {
        setWelcomeSequence(2);
        Vibration.vibrate(50);
        
        setTimeout(() => {
          setWelcomeSequence(3);
          setShowContent(true);
          
          // Fade in content
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }).start();
          
          // Start pulse animation
          Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.05,
                duration: 1500,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
              }),
            ])
          ).start();
          
          // Occasional glitch effect
          setInterval(() => {
            if (Math.random() > 0.7) {
              Animated.sequence([
                Animated.timing(glitchAnim, {
                  toValue: 1,
                  duration: 100,
                  useNativeDriver: true,
                }),
                Animated.timing(glitchAnim, {
                  toValue: 0,
                  duration: 100,
                  useNativeDriver: true,
                }),
              ]).start();
            }
          }, 3000);
        }, 1000);
      }, 1000);
    }, 1000);
  }, []);
  
  // Handle enter button press
  const handleEnter = () => {
    Vibration.vibrate([0, 30, 50, 30]);
    navigation.navigate('Main');
  };
  
  return (
    <View style={styles.container}>
      {/* Matrix background animation */}
      <MatrixRain opacity={0.2} />
      
      {/* Loading sequence */}
      {!showContent && (
        <View style={styles.bootScreen}>
          <GlitchText 
            text={welcomeSequence === 0 ? "BOOTING SYSTEM..." : 
                welcomeSequence === 1 ? "INITIALIZING..." : 
                "LOADING AINSHTEIN.DEV..."}
            style={styles.bootText}
            intensity="high"
          />
        </View>
      )}
      
      {/* Main welcome content */}
      {showContent && (
        <Animated.View 
          style={[
            styles.contentContainer, 
            { 
              opacity: fadeAnim,
              transform: [
                { scale: pulseAnim },
                { translateX: glitchAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0, -5, 0],
                })},
              ],
            }
          ]}
        >
          <View style={styles.logoContainer}>
            <Ionicons name="code-slash-outline" size={80} color={devTheme.neonGreen} />
            <GlitchText 
              text="AINSHTEIN.DEV" 
              style={styles.logoText}
              intensity="low"
            />
          </View>
          
          <View style={styles.descriptionContainer}>
            <GlitchText 
              text="MOBILE CRYPTO INTERFACE" 
              style={styles.descriptionText}
              intensity="medium"
            />
            <GlitchText 
              text="VERSION 0.1.3 [DEV BUILD]" 
              style={styles.versionText}
              intensity="low"
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <NeonButton 
              title="ENTER SYSTEM" 
              onPress={handleEnter}
              intensity="medium"
            />
            
            <TouchableOpacity style={styles.securityNotice}>
              <Ionicons name="warning-outline" size={14} color={devTheme.glitchPink} />
              <GlitchText 
                text="SECURITY WARNING: DEV MODE ACTIVE" 
                style={styles.securityText}
                intensity="high"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: devTheme.darkestBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bootScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  bootText: {
    color: devTheme.neonGreen,
    fontSize: 20,
    fontFamily: 'monospace',
    marginBottom: 20,
  },
  contentContainer: {
    width: width * 0.9,
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: devTheme.neonGreen,
    marginTop: 10,
    ...neonGlow.medium,
  },
  descriptionContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  descriptionText: {
    fontSize: 18,
    color: devTheme.textPrimary,
    marginBottom: 10,
  },
  versionText: {
    fontSize: 14,
    color: devTheme.textSecondary,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 46, 99, 0.1)',
    borderRadius: 4,
  },
  securityText: {
    fontSize: 12,
    color: devTheme.glitchPink,
    marginLeft: 6,
  },
});

export default WelcomeScreen; 