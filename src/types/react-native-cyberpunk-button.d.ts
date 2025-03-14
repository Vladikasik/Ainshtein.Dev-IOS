declare module 'react-native-cyberpunk-button' {
  import { ForwardRefExoticComponent, RefAttributes } from 'react';
  import { StyleProp, ViewStyle } from 'react-native';

  export interface CyberButtonProps {
    label: string;
    textColor?: string;
    mainColor?: string;
    style?: StyleProp<ViewStyle>;
    fontSize?: number;
    borderWidth?: number;
    disableAutoAnimation?: boolean;
    animationConfig?: {
      duration?: number;
      interval?: number;
    };
  }

  type CyberButtonComponent = ForwardRefExoticComponent<
    CyberButtonProps & RefAttributes<{ animate: () => void }>
  >;

  const CyberButton: CyberButtonComponent;

  export default CyberButton;
} 