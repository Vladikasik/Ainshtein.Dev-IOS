import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { devTheme } from '../utils/devTheme';
import Svg, { Path, Circle, Line } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

// Function to generate random number within a range
const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

interface ChartProps {
  width: number;
  height: number;
  chartType: 'growing' | 'dumping';
  animationSpeed?: number; // in ms
  lineWidth?: number;
  pointRadius?: number;
  opacity?: number;
}

const generateInitialChartData = (steps: number, chartType: 'growing' | 'dumping') => {
  const points = [];
  const baseValue = getRandomNumber(30, 70);
  let currentValue = baseValue;
  
  for (let i = 0; i < steps; i++) {
    // For growing charts, generally trend up with occasional dips
    // For dumping charts, generally trend down with occasional spikes
    let changeRange = 0;
    
    if (chartType === 'growing') {
      // Mostly go up but with occasional dips
      changeRange = Math.random() > 0.25 ? 
        getRandomNumber(0, 10) : getRandomNumber(-5, 0);
    } else {
      // Mostly go down but with occasional spikes
      changeRange = Math.random() > 0.25 ? 
        getRandomNumber(-10, 0) : getRandomNumber(0, 5);
    }
    
    // Ensure values stay between 10 and 90
    currentValue = Math.min(Math.max(currentValue + changeRange, 10), 90);
    points.push(currentValue);
  }
  
  return points;
};

// Linear interpolation function
const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t;
};

const ChartLine: React.FC<ChartProps> = ({
  width,
  height,
  chartType,
  animationSpeed = 8000,
  lineWidth = 2,
  pointRadius = 3,
  opacity = 0.6,
}) => {
  const steps = 10; // Number of points in the chart
  const [chartData, setChartData] = useState<number[]>([]);
  const [targetData, setTargetData] = useState<number[]>([]);
  const [prevData, setPrevData] = useState<number[]>([]);
  
  const animationProgress = useRef(new Animated.Value(0)).current;
  const glowEffect = useRef(new Animated.Value(0.3)).current;
  
  useEffect(() => {
    // Generate initial data
    const initialData = generateInitialChartData(steps, chartType);
    setChartData(initialData);
    setPrevData(initialData);
    
    // Start animation
    const startNextAnimation = () => {
      // Generate new target data
      const newTargetData = generateInitialChartData(steps, chartType);
      setTargetData(newTargetData);
      setPrevData(chartData);
      
      // Animate to new data
      animationProgress.setValue(0);
      Animated.timing(animationProgress, {
        toValue: 1,
        duration: animationSpeed,
        useNativeDriver: true,
      }).start(() => {
        setChartData(newTargetData);
        startNextAnimation();
      });
    };
    
    startNextAnimation();
    
    // Start glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowEffect, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowEffect, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    return () => {
      animationProgress.stopAnimation();
      glowEffect.stopAnimation();
    };
  }, [chartType]);
  
  // No data yet, show nothing
  if (chartData.length === 0 || targetData.length === 0) {
    return null;
  }
  
  // Generate SVG path from data points
  const generatePath = () => {
    if (chartData.length === 0 || targetData.length === 0 || prevData.length === 0) return '';
    
    const stepWidth = width / (steps - 1);
    let pathData = `M 0 ${height - (prevData[0] * height / 100)}`;
    
    for (let i = 0; i < steps; i++) {
      const x = i * stepWidth;
      
      // Interpolate between prev and target based on animation progress
      const progress = animationProgress as unknown as { _value: number };
      const yValue = lerp(
        height - (prevData[i] * height / 100),
        height - (targetData[i] * height / 100),
        progress._value
      );
      
      pathData += ` L ${x} ${yValue}`;
    }
    
    return pathData;
  };
  
  const chartColor = chartType === 'growing' ? devTheme.matrixGreen : devTheme.glitchPink;
  
  return (
    <Animated.View 
      style={[
        styles.chartContainer,
        { 
          opacity: glowEffect.interpolate({
            inputRange: [0.3, 1],
            outputRange: [opacity, opacity + 0.3],
          }) 
        }
      ]}
    >
      <Svg height={height} width={width}>
        <Path
          d={generatePath()}
          fill="none"
          stroke={chartColor}
          strokeWidth={lineWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {chartData.map((point, index) => {
          const stepWidth = width / (steps - 1);
          const x = index * stepWidth;
          
          // Interpolate y value
          const progress = animationProgress as unknown as { _value: number };
          const y = lerp(
            height - (prevData[index] * height / 100),
            height - (targetData[index] * height / 100),
            progress._value
          );
          
          return (
            <Circle
              key={index}
              cx={x}
              cy={y}
              r={pointRadius}
              fill={chartColor}
            />
          );
        })}
      </Svg>
    </Animated.View>
  );
};

interface FinancialChartsProps {
  numGrowingCharts?: number;
  numDumpingCharts?: number;
  opacity?: number;
}

const FinancialCharts: React.FC<FinancialChartsProps> = ({
  numGrowingCharts = 3,
  numDumpingCharts = 3,
  opacity = 0.3,
}) => {
  // Generate random chart dimensions
  const generateRandomCharts = (count: number, chartType: 'growing' | 'dumping') => {
    return Array.from({ length: count }).map((_, index) => {
      const chartWidth = getRandomNumber(width * 0.3, width * 0.7);
      const chartHeight = getRandomNumber(height * 0.1, height * 0.25);
      const posX = getRandomNumber(0, width - chartWidth);
      const posY = getRandomNumber(0, height - chartHeight);
      const speed = getRandomNumber(5000, 15000);
      
      return (
        <View 
          key={`${chartType}-${index}`} 
          style={[
            styles.chart, 
            { 
              left: posX, 
              top: posY, 
              width: chartWidth, 
              height: chartHeight 
            }
          ]}
        >
          <ChartLine
            width={chartWidth}
            height={chartHeight}
            chartType={chartType}
            animationSpeed={speed}
            opacity={opacity}
          />
        </View>
      );
    });
  };
  
  return (
    <View style={styles.container} pointerEvents="none">
      {generateRandomCharts(numGrowingCharts, 'growing')}
      {generateRandomCharts(numDumpingCharts, 'dumping')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  chart: {
    position: 'absolute',
  },
  chartContainer: {
    flex: 1,
  },
});

export default FinancialCharts; 