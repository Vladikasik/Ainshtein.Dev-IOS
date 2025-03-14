import React, { useEffect, useState, useRef } from 'react';
import { Text, Animated, StyleSheet, StyleProp, TextStyle } from 'react-native';
import { devTheme, devFonts, randomGlitchDelay } from '../utils/devTheme';

interface GlitchTextProps {
  text: string;
  style?: StyleProp<TextStyle>;
  intensity?: 'low' | 'medium' | 'high';
  glitchColors?: string[];
}

const GlitchText: React.FC<GlitchTextProps> = ({ 
  text, 
  style, 
  intensity = 'medium',
  glitchColors = [devTheme.glitchPurple, devTheme.glitchBlue, devTheme.neonGreen] 
}) => {
  const [glitching, setGlitching] = useState(false);
  const [displayText, setDisplayText] = useState(text);
  const glitchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const opacityAnim = useRef(new Animated.Value(1)).current;
  
  // Set glitch frequency based on intensity
  const glitchFrequency = {
    low: { min: 5000, max: 10000 },
    medium: { min: 2000, max: 5000 },
    high: { min: 800, max: 2000 }
  }[intensity];

  // Characters used for glitch effect
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\';
  
  useEffect(() => {
    const scheduleNextGlitch = () => {
      const delay = Math.random() * (glitchFrequency.max - glitchFrequency.min) + glitchFrequency.min;
      
      glitchTimerRef.current = setTimeout(() => {
        triggerGlitch();
        scheduleNextGlitch();
      }, delay);
    };
    
    scheduleNextGlitch();
    
    return () => {
      if (glitchTimerRef.current) {
        clearTimeout(glitchTimerRef.current);
      }
    };
  }, [text, intensity]);
  
  const triggerGlitch = () => {
    setGlitching(true);
    
    // Create a distorted version of the text
    const distortText = () => {
      const chars = text.split('');
      // Number of characters to glitch (between 1-3 based on intensity)
      const numToGlitch = Math.floor(Math.random() * 
        (intensity === 'high' ? 3 : intensity === 'medium' ? 2 : 1)) + 1;
      
      for (let i = 0; i < numToGlitch; i++) {
        const pos = Math.floor(Math.random() * text.length);
        if (chars[pos]) {
          chars[pos] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
      }
      
      return chars.join('');
    };
    
    // Opacity flicker
    Animated.sequence([
      Animated.timing(opacityAnim, {
        toValue: 0.7,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.5,
        duration: 30,
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true
      })
    ]).start();
    
    // Text distortion
    setDisplayText(distortText());
    
    setTimeout(() => {
      setDisplayText(text);
      setGlitching(false);
    }, 150);
  };
  
  return (
    <Animated.Text 
      style={[
        styles.text,
        { 
          opacity: opacityAnim,
          color: glitching ? 
            glitchColors[Math.floor(Math.random() * glitchColors.length)] : 
            devTheme.textPrimary
        },
        style
      ]}
    >
      {displayText}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: devFonts.monospace,
    color: devTheme.textPrimary,
    textShadowColor: devTheme.neonGreen,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  }
});

export default GlitchText; 