import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { devTheme } from '../utils/devTheme';

const { width, height } = Dimensions.get('window');

// Money emojis
const MONEY_EMOJIS = ['💰', '💵', '💸', '🪙', '💎', '💲', '🤑', '💹', '💱'];

// Random number generator helper
const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Selection of random emoji
const getRandomEmoji = () => {
  return MONEY_EMOJIS[Math.floor(Math.random() * MONEY_EMOJIS.length)];
};

interface MoneyEmojiProps {
  emoji: string;
  size: number;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
  rotateDirection: 'clockwise' | 'counterclockwise';
  rotateSpeed: number;
  pulseSpeed: number;
}

const MoneyEmoji: React.FC<MoneyEmojiProps> = ({
  emoji,
  size,
  startX,
  startY,
  duration,
  delay,
  rotateDirection,
  rotateSpeed,
  pulseSpeed,
}) => {
  const posX = useRef(new Animated.Value(startX)).current;
  const posY = useRef(new Animated.Value(startY)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Movement animation
    const targetX = getRandomNumber(-100, width + 100);
    const targetY = getRandomNumber(-100, height + 100);
    
    // Fade in animation
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
    
    // Movement animation
    Animated.parallel([
      Animated.timing(posX, {
        toValue: targetX,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(posY, {
        toValue: targetY,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Rotation animation
    Animated.loop(
      Animated.timing(rotation, {
        toValue: rotateDirection === 'clockwise' ? 1 : -1,
        duration: rotateSpeed,
        useNativeDriver: true,
      })
    ).start();
    
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: pulseSpeed,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: pulseSpeed,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Fade out at the end
    Animated.timing(opacity, {
      toValue: 0,
      duration: 1000,
      delay: delay + duration - 1000, // Start fade out animation 1s before end
      useNativeDriver: true,
    }).start();
    
    return () => {
      posX.stopAnimation();
      posY.stopAnimation();
      rotation.stopAnimation();
      scale.stopAnimation();
      opacity.stopAnimation();
    };
  }, []);
  
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <Animated.View
      style={{
        position: 'absolute',
        transform: [
          { translateX: posX },
          { translateY: posY },
          { rotate: spin },
          { scale },
        ],
        opacity,
      }}
    >
      <Text style={{ fontSize: size }}>{emoji}</Text>
    </Animated.View>
  );
};

interface FlyingMoneyEmojisProps {
  count?: number;
  minSize?: number;
  maxSize?: number;
  minDuration?: number;
  maxDuration?: number;
  autoGenerate?: boolean;
  generationInterval?: number;
}

const FlyingMoneyEmojis: React.FC<FlyingMoneyEmojisProps> = ({
  count = 15,
  minSize = 20,
  maxSize = 40,
  minDuration = 5000,
  maxDuration = 15000,
  autoGenerate = true,
  generationInterval = 1000,
}) => {
  const [emojis, setEmojis] = useState<React.ReactNode[]>([]);
  const generationTimer = useRef<NodeJS.Timeout | null>(null);
  const emojiCount = useRef(0);
  
  // Generate a single random emoji
  const generateEmoji = () => {
    const emoji = getRandomEmoji();
    const size = getRandomNumber(minSize, maxSize);
    const startPosition = Math.random() > 0.5 ? 'top' : 'side';
    
    let startX = 0;
    let startY = 0;
    
    if (startPosition === 'top') {
      startX = getRandomNumber(-50, width + 50);
      startY = -100;
    } else {
      startX = Math.random() > 0.5 ? -100 : width + 100;
      startY = getRandomNumber(0, height);
    }
    
    const duration = getRandomNumber(minDuration, maxDuration);
    const delay = getRandomNumber(0, 2000);
    const rotateDirection = Math.random() > 0.5 ? 'clockwise' : 'counterclockwise';
    const rotateSpeed = getRandomNumber(3000, 8000);
    const pulseSpeed = getRandomNumber(1000, 2000);
    
    return (
      <MoneyEmoji 
        key={`emoji-${emojiCount.current++}`}
        emoji={emoji}
        size={size}
        startX={startX}
        startY={startY}
        duration={duration}
        delay={delay}
        rotateDirection={rotateDirection}
        rotateSpeed={rotateSpeed}
        pulseSpeed={pulseSpeed}
      />
    );
  };
  
  // Generate initial batch of emojis
  useEffect(() => {
    const initialEmojis = Array.from({ length: count }).map(() => generateEmoji());
    setEmojis(initialEmojis);
    
    // Setup auto-generation if enabled
    if (autoGenerate) {
      generationTimer.current = setInterval(() => {
        setEmojis(current => {
          // Remove oldest emoji if we have more than count * 1.5
          if (current.length > count * 1.5) {
            const [, ...rest] = current;
            return [...rest, generateEmoji()];
          }
          return [...current, generateEmoji()];
        });
      }, generationInterval);
    }
    
    return () => {
      if (generationTimer.current) {
        clearInterval(generationTimer.current);
      }
    };
  }, [count, autoGenerate]);
  
  return (
    <View style={styles.container} pointerEvents="none">
      {emojis}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
});

export default FlyingMoneyEmojis; 