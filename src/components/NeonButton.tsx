import React, { useState, useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
  Vibration,
  Dimensions,
  View,
} from 'react-native';
import { devTheme, neonGlow, devFonts } from '../utils/devTheme';

interface NeonButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  glitchMode?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

const { width } = Dimensions.get('window');

const NeonButton: React.FC<NeonButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  glitchMode = true,
  intensity = 'medium',
}) => {
  // Animated values
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const positionAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  // Track button state
  const [pressing, setPressing] = useState(false);
  const [buttonFlicker, setButtonFlicker] = useState(false);
  const flickerInterval = useRef<NodeJS.Timeout | null>(null);

  // Setup glitch animation
  useEffect(() => {
    if (glitchMode) {
      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
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

      // Random flicker effect
      const startFlicker = () => {
        const interval = Math.random() * 
          (intensity === 'high' ? 3000 : intensity === 'medium' ? 6000 : 10000) + 2000;
        
        flickerInterval.current = setTimeout(() => {
          setButtonFlicker(true);
          
          // Flicker duration
          setTimeout(() => {
            setButtonFlicker(false);
            startFlicker();
          }, Math.random() * 200 + 50);
        }, interval);
      };

      startFlicker();
    }

    return () => {
      if (flickerInterval.current) {
        clearTimeout(flickerInterval.current);
      }
    };
  }, [glitchMode, intensity]);

  const handlePress = () => {
    // Random chance of button moving when pressed
    const randomBehavior = Math.random();
    
    // Normal behavior (60% of the time)
    if (randomBehavior > 0.4 || !glitchMode) {
      onPress();
      
      // Vibration and scale animation
      Vibration.vibrate(50);
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } 
    // Button jitters side to side (20% of the time)
    else if (randomBehavior > 0.2) {
      // Jitter animation
      Animated.sequence([
        Animated.timing(positionAnim, {
          toValue: 20,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(positionAnim, {
          toValue: -20,
          duration: 100, 
          useNativeDriver: true,
        }),
        Animated.timing(positionAnim, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(positionAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Call the original onPress after jitter
        onPress();
      });
      
      Vibration.vibrate([0, 50, 50, 50]);
    }
    // Button moves away from touch (20% of the time)
    else {
      // Random direction to move
      const direction = Math.random() > 0.5 ? 1 : -1;
      const distance = direction * 100;
      
      Animated.sequence([
        Animated.timing(positionAnim, {
          toValue: distance,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(positionAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Call the original onPress after moving
        onPress();
      });
      
      Vibration.vibrate([0, 30, 30, 30]);
    }
  };

  return (
    <Animated.View
      style={[
        styles.buttonWrapper,
        {
          transform: [
            { translateX: positionAnim },
            { scale: pressing ? 0.96 : pulseAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handlePress}
        onPressIn={() => setPressing(true)}
        onPressOut={() => setPressing(false)}
        style={[
          styles.button,
          buttonFlicker && { opacity: 0.7, backgroundColor: devTheme.darkestBg },
          style,
        ]}
      >
        <Animated.View 
          style={[
            styles.glowContainer,
            {
              opacity: buttonFlicker ? 0.4 : 1,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Text
            style={[
              styles.text,
              buttonFlicker && { textShadowRadius: 0 },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    alignSelf: 'center',
    marginVertical: 10,
    // Adjust width based on screen size
    width: width < 400 ? '90%' : 300,
  },
  button: {
    backgroundColor: devTheme.darkBg,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: devTheme.neonGreen,
    overflow: 'hidden',
  },
  glowContainer: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...neonGlow.small,
  },
  text: {
    fontFamily: devFonts.monospace,
    color: devTheme.neonGreen,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textShadowColor: devTheme.neonGreen,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
    letterSpacing: 1,
  },
});

export default NeonButton; 