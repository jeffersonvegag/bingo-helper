// components/ui/NumberButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface NumberButtonProps {
  number: number;
  isSelected?: boolean;
  onPress?: () => void;
  size?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const NumberButton: React.FC<NumberButtonProps> = ({
  number,
  isSelected = false,
  onPress,
  size = 44,
  style,
  textStyle
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: isSelected ? '#007AFF' : '#E0E0E0' 
        },
        style
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text 
        style={[
          styles.text, 
          { 
            fontSize: size * 0.4,
            color: isSelected ? '#FFFFFF' : '#000000' 
          },
          textStyle
        ]}
      >
        {number < 10 ? `0${number}` : number}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  text: {
    fontWeight: 'bold',
  },
});