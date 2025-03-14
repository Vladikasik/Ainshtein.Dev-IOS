import { Platform } from 'react-native';

// Dev theme colors
export const devTheme = {
  // Primary colors
  neonGreen: '#00FF41',
  darkGreen: '#003B00',
  limeGreen: '#39FF14',
  toxicGreen: '#A8FF00',
  matrixGreen: '#08F26E',
  
  // Background colors
  darkBg: '#0D0208',
  darkestBg: '#000000',
  codeBg: '#111111',
  
  // Accent colors
  glitchPurple: '#9D00FF',
  glitchBlue: '#0074D9',
  glitchPink: '#FF2E63',
  
  // Text colors
  textPrimary: '#00FF41',
  textSecondary: '#08F26E',
  textMuted: '#568259',
};

// Shadow styles for neon glow effects
export const neonGlow = {
  small: {
    shadowColor: devTheme.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  medium: {
    shadowColor: devTheme.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  large: {
    shadowColor: devTheme.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15,
  },
};

// Font styles with monospace for the "hacker" look
export const devFonts = {
  monospace: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  sizes: {
    small: 12,
    medium: 16,
    large: 20,
    header: 24,
  },
};

// Utility function to create a random glitch animation delay
export const randomGlitchDelay = () => Math.random() * 3000 + 1000; // 1-4 seconds

// Dev border styles
export const devBorders = {
  thin: {
    borderWidth: 1,
    borderColor: devTheme.neonGreen,
  },
  medium: {
    borderWidth: 2,
    borderColor: devTheme.neonGreen,
  },
  thick: {
    borderWidth: 3,
    borderColor: devTheme.neonGreen,
  },
}; 