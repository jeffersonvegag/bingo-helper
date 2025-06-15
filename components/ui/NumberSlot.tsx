// components/ui/NumberSlot.tsx
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

interface NumberSlotProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  index: number;
  isMatched?: boolean;
  isMissing?: boolean;
  isEditable?: boolean;
}

export const NumberSlot: React.FC<NumberSlotProps> = ({
  value,
  onChange,
  onClear,
  index,
  isMatched = false,
  isMissing = false,
  isEditable = true
}) => {
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  
  // Determinar el color del slot basado en si está acertado o no
  const slotColor = isMatched ? '#4CAF50' : isMissing ? '#FF5252' : '#E0E0E0';
  const textInputColor = isMatched ? '#FFFFFF' : isMissing ? '#FFFFFF' : textColor;
  
  return (
    <View style={styles.container}>
      <Text style={[styles.index, { color: textColor }]}>{index + 1}</Text>
      <View style={[styles.inputContainer, { backgroundColor: slotColor }]}>
        {isEditable ? (
          <TextInput
            style={[styles.input, { color: textInputColor }]}
            value={value}
            onChangeText={onChange}
            keyboardType="number-pad"
            maxLength={2}
            placeholder="00"
            placeholderTextColor="#999"
          />
        ) : (
          <Text style={[styles.value, { color: textInputColor }]}>
            {value || '00'}
          </Text>
        )}
      </View>
      {isEditable && onClear && (
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearButtonText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  index: {
    width: 20,
    fontSize: 14,
    textAlign: 'center',
  },
  inputContainer: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
  input: {
    height: '100%',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});