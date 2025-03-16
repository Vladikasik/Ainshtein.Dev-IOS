import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, Dimensions, Platform } from 'react-native';
import { devTheme } from '../utils/devTheme';
import GlitchText from './GlitchText';

const { width, height } = Dimensions.get('window');

// Matrix code rain effect
const MatrixCodeRain = () => {
  const [columns, setColumns] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    const numColumns = Math.floor(width / 16); // Fewer columns (was 12)
    const newColumns = [];
    
    for (let i = 0; i < numColumns; i++) {
      const speed = Math.random() * 200 + 150; // Slower speed (was 150 + 50)
      const delay = Math.random() * 4000; // Increased delay (was 2000)
      const columnOpacity = Math.random() * 0.2 + 0.1; // Even lower opacity
      
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
  const columnChars = Array.from({ length: 18 }, () => characters.charAt(Math.floor(Math.random() * characters.length))); // Fewer characters (was 20)
  const position = useRef(new Animated.Value(-400)).current;
  const [currentChars, setCurrentChars] = useState(columnChars);
  
  useEffect(() => {
    // Start animation after delay
    const timeoutId = setTimeout(() => {
      Animated.loop(
        Animated.timing(position, {
          toValue: height + 400,
          duration: speed * 30, // Slower animation (was 20)
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
      }, 300); // Slower character change (was 150)
      
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
        left: index * 16, // Adjusted spacing (was 12)
        transform: [{ translateY: position }],
        opacity,
        zIndex: 1,
      }}
    >
      {currentChars.map((char, i) => (
        <GlitchText 
          key={i} 
          text={char} 
          style={[
            styles.matrixChar, 
            { 
              color: i === 0 ? devTheme.neonGreen : `rgba(0, 255, 0, ${0.8 - i * 0.05})`, // Reduced brightness
              textShadowColor: i === 0 ? devTheme.neonGreen : 'transparent',
              textShadowRadius: i === 0 ? 2 : 0, // Reduced glow (was 3 for first 3 chars)
              textShadowOffset: { width: 0, height: 0 },
            }
          ]}
          intensity={i === 0 ? "low" : "low"} // Reduced glitch intensity (was "medium" for first char)
        />
      ))}
    </Animated.View>
  );
};

interface ScreenBackgroundProps {
  children: React.ReactNode;
}

/**
 * A wrapper component that provides a matrix rain background for screens
 */
const ScreenBackground: React.FC<ScreenBackgroundProps> = ({ 
  children
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.matrixContainer}>
        <MatrixCodeRain />
      </View>
      <View style={styles.childrenContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: devTheme.darkestBg, // More solid background
  },
  matrixContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  childrenContainer: {
    flex: 1,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  matrixBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 1,
  },
  matrixChar: {
    fontSize: 18, // Slightly smaller text (was 20)
    lineHeight: 20, // Adjusted line height (was 22)
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

export default ScreenBackground; 