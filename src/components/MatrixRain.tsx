import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { devTheme } from '../utils/devTheme';

const { width, height } = Dimensions.get('window');

// Characters used in the matrix rain
const MATRIX_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,./<>?";

// Column properties
const COLUMN_WIDTH = 14;
const NUM_COLUMNS = Math.floor(width / COLUMN_WIDTH);

interface MatrixRainProps {
  opacity?: number;
  color?: string;
  fadeHeight?: number;
  charChanged?: (char: string, col: number, row: number) => void;
}

interface RainColumn {
  chars: string[];
  speeds: number[];
  opacities: Animated.Value[];
  positions: number[];
  length: number;
  key: string;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ 
  opacity = 0.15,
  color = devTheme.neonGreen,
  fadeHeight = 12,
}) => {
  const [columns, setColumns] = useState<RainColumn[]>([]);
  const animationRef = useRef<number>();
  const lastUpdateTime = useRef(Date.now());

  // Initialize columns
  useEffect(() => {
    const initialColumns: RainColumn[] = [];
    
    for (let i = 0; i < NUM_COLUMNS; i++) {
      // Random length for each column
      const length = Math.floor(Math.random() * 12) + 6;
      const chars: string[] = [];
      const speeds: number[] = [];
      const opacities: Animated.Value[] = [];
      const positions: number[] = [];
      
      for (let j = 0; j < length; j++) {
        chars.push(getRandomChar());
        speeds.push(Math.random() * 0.4 + 0.1); // Speed varies by character
        opacities.push(new Animated.Value(Math.max(0, 1 - j / fadeHeight)));
        positions.push(-j * COLUMN_WIDTH); // Start above the screen
      }
      
      initialColumns.push({
        chars,
        speeds,
        opacities,
        positions,
        length,
        key: `col-${i}`,
      });
      
      // Start at random positions on first render
      setTimeout(() => {
        initialColumns[i].positions = initialColumns[i].positions.map(_ => 
          Math.random() * height * 2
        );
        setColumns([...initialColumns]);
      }, 100);
    }
    
    setColumns(initialColumns);
    
    // Start animation
    const animate = () => {
      const now = Date.now();
      const delta = (now - lastUpdateTime.current) / 30; // Time-based animation
      lastUpdateTime.current = now;
      
      setColumns(prevColumns => {
        return prevColumns.map(column => {
          const newPositions = [...column.positions];
          const newChars = [...column.chars];
          
          for (let i = 0; i < column.length; i++) {
            // Move character down
            newPositions[i] += column.speeds[i] * delta * COLUMN_WIDTH;
            
            // Reset when it goes off screen
            if (newPositions[i] > height + COLUMN_WIDTH * 4) {
              newPositions[i] = -COLUMN_WIDTH;
              newChars[i] = getRandomChar();
            }
            
            // Randomly change characters as they fall
            if (Math.random() < 0.02) {
              newChars[i] = getRandomChar();
            }
          }
          
          return {
            ...column,
            positions: newPositions,
            chars: newChars,
          };
        });
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Random character generator
  const getRandomChar = () => {
    return MATRIX_CHARS.charAt(Math.floor(Math.random() * MATRIX_CHARS.length));
  };
  
  return (
    <View style={[styles.container, { opacity }]} pointerEvents="none">
      {columns.map((column, colIndex) => (
        <View key={column.key} style={[styles.column, { left: colIndex * COLUMN_WIDTH }]}>
          {column.chars.map((char, charIndex) => (
            <Animated.Text
              key={`${column.key}-${charIndex}`}
              style={[
                styles.matrixChar,
                { 
                  top: column.positions[charIndex],
                  opacity: column.opacities[charIndex],
                  color,
                }
              ]}
            >
              {char}
            </Animated.Text>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  column: {
    position: 'absolute',
    top: 0,
    height: height,
    width: COLUMN_WIDTH,
  },
  matrixChar: {
    position: 'absolute',
    fontSize: 14,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
});

export default MatrixRain; 