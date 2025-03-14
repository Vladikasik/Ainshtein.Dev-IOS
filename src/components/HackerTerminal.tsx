import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { devTheme, devFonts } from '../utils/devTheme';

// Types of terminal lines
type LineType = 'command' | 'output' | 'error' | 'success';

interface TerminalLine {
  text: string;
  type: LineType;
  key: string;
}

interface HackerTerminalProps {
  autoTypeText?: string[];
  initialLines?: TerminalLine[];
  autoType?: boolean;
  typingSpeed?: number;
  maxLines?: number;
  height?: number | string;
  prompt?: string;
}

const HackerTerminal: React.FC<HackerTerminalProps> = ({
  autoTypeText = [],
  initialLines = [],
  autoType = true,
  typingSpeed = 50,
  maxLines = 100,
  height = 200,
  prompt = "root@ainshtein:~$ ",
}) => {
  const [lines, setLines] = useState<TerminalLine[]>(initialLines);
  const [currentCommand, setCurrentCommand] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [commandIndex, setCommandIndex] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const blinkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Setup cursor blinking
  useEffect(() => {
    blinkTimerRef.current = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => {
      if (blinkTimerRef.current) {
        clearInterval(blinkTimerRef.current);
      }
    };
  }, []);
  
  // Auto-typing effect for commands
  useEffect(() => {
    if (!autoType || autoTypeText.length === 0 || commandIndex >= autoTypeText.length) return;
    
    const currentText = autoTypeText[commandIndex];
    
    if (typingIndex < currentText.length) {
      typingTimerRef.current = setTimeout(() => {
        setCurrentCommand(currentText.substring(0, typingIndex + 1));
        setTypingIndex(prev => prev + 1);
      }, typingSpeed + Math.random() * 50);
    } else {
      // Finished typing current command, add it to lines
      typingTimerRef.current = setTimeout(() => {
        executeCommand(currentText);
        setCurrentCommand("");
        setTypingIndex(0);
        setCommandIndex(prev => prev + 1);
      }, 500);
    }
    
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [autoType, autoTypeText, commandIndex, typingIndex]);
  
  // Simulate executing a command
  const executeCommand = (command: string) => {
    // Add the command to terminal lines
    const newLines: TerminalLine[] = [...lines, {
      text: `${prompt}${command}`,
      type: 'command',
      key: `line-${Date.now()}-${Math.random()}`
    }];
    
    // Generate fake output based on command
    if (command.toLowerCase().includes('help')) {
      newLines.push({
        text: "Available commands: wallet, token, bots, scan, connect",
        type: 'output',
        key: `line-${Date.now()}-${Math.random()}`
      });
    } else if (command.toLowerCase().includes('wallet')) {
      newLines.push({
        text: "Wallet address: CLcj8RiEtay5fyoJJigx4AP5UvcM2Hr64DFubkQVT7Bi",
        type: 'success',
        key: `line-${Date.now()}-${Math.random()}`
      });
      newLines.push({
        text: "Balance: 10.000000 SOL",
        type: 'success',
        key: `line-${Date.now()}-${Math.random()}`
      });
    } else if (command.toLowerCase().includes('scan')) {
      newLines.push({
        text: "Scanning network for vulnerabilities...",
        type: 'output',
        key: `line-${Date.now()}-${Math.random()}`
      });
      newLines.push({
        text: "ALERT: 3 security issues found!",
        type: 'error',
        key: `line-${Date.now()}-${Math.random()}`
      });
    } else if (command.trim() === '') {
      // Empty command, just add a new line
    } else {
      newLines.push({
        text: `Command not found: ${command}`,
        type: 'error',
        key: `line-${Date.now()}-${Math.random()}`
      });
    }
    
    // Limit the number of lines
    if (newLines.length > maxLines) {
      newLines.splice(0, newLines.length - maxLines);
    }
    
    setLines(newLines);
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.terminalHeader}>
        <View style={styles.terminalButton} />
        <View style={[styles.terminalButton, { backgroundColor: devTheme.toxicGreen }]} />
        <View style={[styles.terminalButton, { backgroundColor: devTheme.glitchPink }]} />
        <Text style={styles.terminalTitle}>AINSHTEIN TERMINAL</Text>
      </View>
      
      <ScrollView 
        ref={scrollViewRef}
        style={[styles.terminalContent, { height: typeof height === 'number' ? height : height }]}
        showsVerticalScrollIndicator={false}
      >
        {lines.map((line) => (
          <Text 
            key={line.key} 
            style={[
              styles.terminalText,
              line.type === 'command' && styles.commandText,
              line.type === 'error' && styles.errorText,
              line.type === 'success' && styles.successText,
            ]}
          >
            {line.text}
          </Text>
        ))}
        
        <View style={styles.currentCommandContainer}>
          <Text style={styles.promptText}>{prompt}</Text>
          <Text style={styles.commandText}>{currentCommand}</Text>
          {cursorVisible && <Text style={styles.cursor}>▌</Text>}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: devTheme.darkestBg,
    borderWidth: 1,
    borderColor: devTheme.neonGreen,
  },
  terminalHeader: {
    height: 30,
    backgroundColor: devTheme.darkBg,
    borderBottomWidth: 1,
    borderBottomColor: devTheme.neonGreen,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  terminalButton: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: devTheme.glitchPurple,
    marginRight: 6,
  },
  terminalTitle: {
    color: devTheme.neonGreen,
    fontFamily: devFonts.monospace,
    fontSize: 12,
    marginLeft: 10,
  },
  terminalContent: {
    padding: 10,
  },
  currentCommandContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  terminalText: {
    fontFamily: devFonts.monospace,
    fontSize: 13,
    color: devTheme.textSecondary,
    marginBottom: 4,
  },
  commandText: {
    color: devTheme.textPrimary,
  },
  errorText: {
    color: devTheme.glitchPink,
  },
  successText: {
    color: devTheme.matrixGreen,
  },
  promptText: {
    color: devTheme.limeGreen,
    fontFamily: devFonts.monospace,
    fontSize: 13,
  },
  cursor: {
    color: devTheme.neonGreen,
    fontFamily: devFonts.monospace,
    fontSize: 13,
  },
});

export default HackerTerminal; 