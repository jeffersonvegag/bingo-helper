// components/TicketForm.tsx (con modificaciones)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';
import { NumberSlot } from './ui/NumberSlot';

interface TicketFormProps {
  initialLotNumber?: number;
  initialPosition?: number;
  initialNumbers?: number[];
  onSubmit: (lotNumber: number, position: number, numbers: number[]) => void;
  onCancel?: () => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({
  initialLotNumber = 1,
  initialPosition = 1,
  initialNumbers = Array(7).fill(0),
  onSubmit,
  onCancel
}) => {
  const [lotNumber, setLotNumber] = useState(initialLotNumber.toString());
  const [position, setPosition] = useState(initialPosition.toString());
  const [numbers, setNumbers] = useState<string[]>(
    initialNumbers.map(num => num > 0 ? num.toString() : '')
  );
  
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  
  const validateForm = (): boolean => {
    // Validar número de lote
    const lotNum = parseInt(lotNumber);
    if (isNaN(lotNum) || lotNum <= 0) {
      Alert.alert('Error', 'El número de lote debe ser un número positivo');
      return false;
    }
    
    // Validar posición
    const pos = parseInt(position);
    if (isNaN(pos) || pos <= 0) {
      Alert.alert('Error', 'La posición debe ser un número positivo');
      return false;
    }
    
    // Validar números del boleto
    const validNumbers = numbers
      .map(numStr => numStr.trim())
      .filter(numStr => numStr !== '')
      .map(numStr => parseInt(numStr));
    
    if (validNumbers.length !== 7) {
      Alert.alert('Error', 'El boleto debe tener exactamente 7 números');
      return false;
    }
    
    // Verificar que todos los números estén entre 1 y 90
    for (const num of validNumbers) {
      if (isNaN(num) || num < 1 || num > 90) {
        Alert.alert('Error', 'Todos los números deben estar entre 1 y 90');
        return false;
      }
    }
    
    // Verificar que no haya números repetidos
    const uniqueNumbers = new Set(validNumbers);
    if (uniqueNumbers.size !== validNumbers.length) {
      Alert.alert('Error', 'No puede haber números repetidos en el boleto');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      const validLotNumber = parseInt(lotNumber);
      const validPosition = parseInt(position);
      const validNumbers = numbers
        .map(numStr => numStr.trim())
        .filter(numStr => numStr !== '')
        .map(numStr => parseInt(numStr));
      
      onSubmit(validLotNumber, validPosition, validNumbers);
    }
  };
  
  const handleNumberChange = (index: number, value: string) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
  };
  
  const clearNumber = (index: number) => {
    const newNumbers = [...numbers];
    newNumbers[index] = '';
    setNumbers(newNumbers);
  };
  
  const incrementLot = () => {
    const current = parseInt(lotNumber) || 0;
    setLotNumber((current + 1).toString());
  };
  
  const decrementLot = () => {
    const current = parseInt(lotNumber) || 2;
    if (current > 1) {
      setLotNumber((current - 1).toString());
    }
  };
  
  const incrementPosition = () => {
    const current = parseInt(position) || 0;
    setPosition((current + 1).toString());
  };
  
  const decrementPosition = () => {
    const current = parseInt(position) || 2;
    if (current > 1) {
      setPosition((current - 1).toString());
    }
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Datos del boleto</Text>
      
      <View style={styles.rowContainer}>
        {/* Número de lote */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: textColor }]}>Número de lote:</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity style={styles.counterButton} onPress={decrementLot}>
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.counterValue, { color: textColor }]}>{lotNumber}</Text>
            <TouchableOpacity style={styles.counterButton} onPress={incrementLot}>
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Posición en el lote */}
        <View style={styles.fieldContainer}>
          <Text style={[styles.label, { color: textColor }]}>Posición:</Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity style={styles.counterButton} onPress={decrementPosition}>
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.counterValue, { color: textColor }]}>{position}</Text>
            <TouchableOpacity style={styles.counterButton} onPress={incrementPosition}>
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      <Text style={[styles.label, { color: textColor, marginTop: 16 }]}>
        Números del boleto (7 números del 1 al 90):
      </Text>
      
      <View style={styles.numbersContainer}>
        {numbers.map((num, index) => (
          <NumberSlot
            key={index}
            value={num}
            onChange={(value) => handleNumberChange(index, value)}
            onClear={() => clearNumber(index)}
            index={index}
          />
        ))}
      </View>
      
      <View style={styles.buttonsContainer}>
        {onCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Guardar boleto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fieldContainer: {
    flex: 1,
    marginBottom: 16,
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  counterValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    minWidth: 30,
    textAlign: 'center',
  },
  numbersContainer: {
    marginVertical: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});