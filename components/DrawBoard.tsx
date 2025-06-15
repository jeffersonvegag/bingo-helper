// components/DrawBoard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useTicketContext } from '../context/TicketContext';
import { useThemeColor } from '../hooks/useThemeColor';

export const DrawBoard: React.FC = () => {
  const { drawnNumbers, addDrawnNumber, removeDrawnNumber, resetDrawnNumbers } = useTicketContext();
  const [inputNumber, setInputNumber] = useState('');
  
  const backgroundColor = useThemeColor({ light: '#f2f2f7', dark: '#1c1c1e' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  
  const handleAddNumber = () => {
    const num = parseInt(inputNumber);
    if (isNaN(num) || num < 1 || num > 90) {
      Alert.alert('Número inválido', 'Por favor ingresa un número entre 1 y 90');
      return;
    }
    
    if (drawnNumbers.includes(num)) {
      Alert.alert('Número duplicado', 'Este número ya ha sido ingresado');
      return;
    }
    
    addDrawnNumber(num);
    setInputNumber('');
  };
  
  const handleRemoveNumber = (number: number) => {
    Alert.alert(
      'Eliminar número',
      `¿Estás seguro de eliminar el número ${number}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => removeDrawnNumber(number) }
      ]
    );
  };
  
  const handleReset = () => {
    Alert.alert(
      'Reiniciar sorteo',
      '¿Estás seguro de reiniciar todos los números del sorteo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reiniciar', onPress: resetDrawnNumbers }
      ]
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Números del sorteo</Text>
        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { color: textColor, borderColor: textColor }]}
          value={inputNumber}
          onChangeText={setInputNumber}
          placeholder="Ingresa un número"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={2}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddNumber}>
          <Text style={styles.addButtonText}>Añadir</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.subtitle, { color: textColor }]}>
        {drawnNumbers.length} números ingresados
      </Text>
      
      <ScrollView style={styles.numbersContainer}>
        <View style={styles.numbersGrid}>
          {drawnNumbers.map(number => (
            <TouchableOpacity
              key={number}
              style={styles.numberBubble}
              onLongPress={() => handleRemoveNumber(number)}
            >
              <Text style={styles.numberText}>
                {number < 10 ? `0${number}` : number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  numbersContainer: {
    flex: 1,
  },
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  numberBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 6,
  },
  numberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
});