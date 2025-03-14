import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Animated,
  LayoutChangeEvent,
} from 'react-native';
import { devTheme, neonGlow, devBorders } from '../utils/devTheme';

interface GlitchContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: 'low' | 'medium' | 'high';
  neonEffect?: boolean;
  scanlines?: boolean;
}

const GlitchContainer: React.FC<GlitchContainerProps> = ({
  children,
  style,
  intensity = 'medium',
  neonEffect = true,
  scanlines = true,
}) => {
  // Animations
  const glitchOffsetX = useRef(new Animated.Value(0)).current;
  const glitchOpacity = useRef(new Animated.Value(0)).current;
  const scanlineAnim = useRef(new Animated.Value(0)).current;
  const borderFlickerAnim = useRef(new Animated.Value(1)).current;
  
  // Container dimensions 
  const [containerHeight, setContainerHeight] = useState(0);
  
  // Intensity settings
  const intensityConfig = {
    low: { interval: 8000, probability: 0.3, duration: 100 },
    medium: { interval: 5000, probability: 0.5, duration: 150 },
    high: { interval: 3000, probability: 0.7, duration: 200 },
  }[intensity];
  
  // Handle layout change to get container height
  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setContainerHeight(height);
  };
  
  // Setup animations
  useEffect(() => {
    // Scanline animation
    if (scanlines) {
      Animated.loop(
        Animated.timing(scanlineAnim, {
          toValue: containerHeight,
          duration: 3000,
          useNativeDriver: false,
        })
      ).start();
    }
    
    // Border flicker animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderFlickerAnim, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(borderFlickerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
    
    // Setup glitch interval
    const glitchInterval = setInterval(() => {
      // Random chance based on intensity
      if (Math.random() < intensityConfig.probability) {
        triggerGlitch();
      }
    }, intensityConfig.interval);
    
    return () => {
      clearInterval(glitchInterval);
    };
  }, [intensity, containerHeight, scanlines]);
  
  // Trigger a glitch effect
  const triggerGlitch = () => {
    // Random displacement amount
    const randomOffset = Math.random() * 8 - 4;
    
    // Trigger glitch sequence
    Animated.sequence([
      // Glitch to the side
      Animated.timing(glitchOffsetX, {
        toValue: randomOffset,
        duration: 50,
        useNativeDriver: true,
      }),
      // Show glitch overlay
      Animated.timing(glitchOpacity, {
        toValue: 0.2,
        duration: 30,
        useNativeDriver: true,
      }),
      // Move back but keep overlay
      Animated.timing(glitchOffsetX, {
        toValue: -randomOffset/2,
        duration: 40,
        useNativeDriver: true,
      }),
      // Reset position and hide overlay
      Animated.parallel([
        Animated.timing(glitchOffsetX, {
          toValue: 0,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(glitchOpacity, {
          toValue: 0,
          duration: 60,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        neonEffect && neonGlow.small,
        { 
          borderColor: devTheme.neonGreen,
          borderWidth: Animated.multiply(borderFlickerAnim, 1).interpolate({
            inputRange: [0, 1],
            outputRange: [0.5, 1],
          }),
        },
        { transform: [{ translateX: glitchOffsetX }] },
        style,
      ]}
      onLayout={onLayout}
    >
      {children}
      
      {/* Glitch overlay */}
      <Animated.View
        style={[
          styles.glitchOverlay,
          { opacity: glitchOpacity }
        ]}
      />
      
      {/* Scanlines effect */}
      {scanlines && (
        <View style={styles.scanlinesContainer} pointerEvents="none">
          {Array.from({ length: 15 }).map((_, index) => (
            <View key={index} style={styles.scanline} />
          ))}
          
          {/* Moving scanline */}
          <Animated.View
            style={[
              styles.movingScanline,
              {
                top: scanlineAnim,
              },
            ]}
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: devTheme.darkBg,
    borderRadius: 5,
    borderColor: devTheme.neonGreen,
    overflow: 'hidden',
    padding: 16,
    position: 'relative',
  },
  glitchOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: devTheme.glitchPurple,
    opacity: 0,
  },
  scanlinesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  scanline: {
    width: '120%',
    height: 1,
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    marginVertical: 4,
  },
  movingScanline: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
  },
});

export default GlitchContainer; 