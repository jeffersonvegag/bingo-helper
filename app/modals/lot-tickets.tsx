// app/modals/lot-tickets.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, BackHandler } from 'react-native';
import { useLocalSearchParams, router, useFocusEffect } from 'expo-router';
import { useTicketContext } from '../../context/TicketContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function LotTicketsScreen() {
  const { lotId } = useLocalSearchParams<{ lotId: string }>();
  const { lots, addTicket, removeTicket } = useTicketContext();
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);
  const [editingTickets, setEditingTickets] = useState<{[key: number]: string[][]}>({});
  const [originalValues, setOriginalValues] = useState<{[key: number]: string[][]}>({});
  const [changes, setChanges] = useState(false);
  const [duplicateNumbers, setDuplicateNumbers] = useState<{[key: number]: number[]}>({});
  
  const backgroundColor = useThemeColor({ light: '#f2f2f7', dark: '#000000' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  
  const lotNumber = parseInt(lotId || '0');
  const lot = lots.find(l => l.id === lotNumber);
  
  // Manejar el botón de retroceso
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (changes) {
          showExitConfirmation();
          return true; // Prevenir la acción predeterminada
        }
        return false; // Permitir la acción predeterminada
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [changes])
  );
  
  // Función para mostrar confirmación al salir
  const showExitConfirmation = () => {
    Alert.alert(
      "Guardar cambios",
      "¿Quiere salir sin guardar cambios?",
      [
        {
          text: "No guardar cambios",
          style: "destructive",
          onPress: () => router.back(),
          // Color naranja para este botón
        },
        {
          text: "Guardar Cambios",
          onPress: handleSaveChanges,
          // Color verde para este botón
        },
        {
          text: "Cancelar",
          style: "cancel"
        }
      ]
    );
  };
  
  // Inicializar el estado de edición con los boletos actuales
  useEffect(() => {
    if (lot) {
      const ticketsMap: {[key: number]: string[][]} = {};
      
      // Crear 10 posiciones vacías por defecto
      for (let i = 1; i <= 10; i++) {
        ticketsMap[i] = [Array(7).fill('')];
      }
      
      // Llenar con los boletos existentes
      lot.tickets.forEach(ticket => {
        const position = ticket.position;
        if (position <= 10) {
          // Convertir los números a strings
          const numbersStr = ticket.numbers.map(n => n.toString());
          
          // Crear una nueva matriz para este boleto
          const ticketMatrix = [Array(7).fill('')];
          
          // Llenar la matriz con los números existentes
          for (let i = 0; i < Math.min(numbersStr.length, 7); i++) {
            ticketMatrix[0][i] = numbersStr[i] || '';
          }
          
          ticketsMap[position] = ticketMatrix;
        }
      });
      
      setEditingTickets(ticketsMap);
      // Guardar una copia para detectar cambios
      setOriginalValues(JSON.parse(JSON.stringify(ticketsMap)));
      
      // Verificar números duplicados
      checkDuplicateNumbers(ticketsMap);
    }
  }, [lot]);
  
  // Función para verificar números duplicados en cada boleto
  const checkDuplicateNumbers = (tickets: {[key: number]: string[][]}) => {
    const duplicates: {[key: number]: number[]} = {};
    
    Object.entries(tickets).forEach(([posStr, ticketMatrix]) => {
      const position = parseInt(posStr);
      const numbers: string[] = ticketMatrix[0].filter(n => n !== '');
      
      // Encontrar duplicados
      const seen = new Set<string>();
      const dups = new Set<string>();
      
      numbers.forEach(num => {
        if (seen.has(num)) {
          dups.add(num);
        } else {
          seen.add(num);
        }
      });
      
      if (dups.size > 0) {
        duplicates[position] = Array.from(dups).map(n => parseInt(n));
      }
    });
    
    setDuplicateNumbers(duplicates);
  };
  
  const handleNumberChange = (position: number, row: number, col: number, value: string) => {
    // Validar que solo se ingresen números
    if (value !== '' && !/^\d{0,2}$/.test(value)) {
      return;
    }
    
    setEditingTickets(prev => {
      const newTickets = {...prev};
      const ticketMatrix = [...newTickets[position]];
      
      // Crear una nueva fila para no mutar el estado directamente
      const newRow = [...ticketMatrix[row]];
      newRow[col] = value;
      
      // Actualizar la matriz del boleto
      ticketMatrix[row] = newRow;
      newTickets[position] = ticketMatrix;
      
      // Verificar duplicados después de actualizar
      setTimeout(() => checkDuplicateNumbers(newTickets), 0);
      
      return newTickets;
    });
    
    // Resaltar la fila modificada si no está vacía
    setHighlightedRow(position);
    
    // Determinar si hay cambios comparando con los valores originales
    setTimeout(() => {
      setChanges(true);
      
      // Quitar el resaltado después de un segundo
      setTimeout(() => {
        setHighlightedRow(null);
      }, 1000);
    }, 0);
  };
  
  // Determinar si un boleto está vacío
  const isTicketEmpty = (position: number): boolean => {
    if (!editingTickets[position] || !editingTickets[position][0]) return true;
    
    const numbers = editingTickets[position][0].filter(n => n !== '');
    return numbers.length === 0;
  };
  
  // Determinar si un número está duplicado en un boleto
  const isNumberDuplicate = (position: number, value: string): boolean => {
    if (!value || value === '') return false;
    if (!duplicateNumbers[position]) return false;
    
    return duplicateNumbers[position].includes(parseInt(value));
  };
  
  const handleSaveChanges = () => {
    // Validar los números ingresados
    const errors = [];
    
    Object.entries(editingTickets).forEach(([posStr, ticketMatrix]) => {
      const position = parseInt(posStr);
      
      // Recopilar todos los números no vacíos
      const numbers = [];
      ticketMatrix.forEach(row => {
        row.forEach(cell => {
          if (cell.trim() !== '') {
            const num = parseInt(cell.trim());
            if (!isNaN(num) && num >= 1 && num <= 90) {
              numbers.push(num);
            } else {
              errors.push(`Posición ${position}: Número inválido ${cell}`);
            }
          }
        });
      });
      
      // Verificar duplicados
      const uniqueNumbers = new Set(numbers);
      if (uniqueNumbers.size !== numbers.length) {
        errors.push(`Posición ${position}: Hay números duplicados`);
      }
      
      // Cada boleto debe tener exactamente 7 números o ninguno
      if (numbers.length > 0 && numbers.length !== 7) {
        errors.push(`Posición ${position}: Debe tener 7 números (tiene ${numbers.length})`);
      }
    });
    
    if (errors.length > 0) {
      Alert.alert('Errores de validación', errors.join('\n'));
      return;
    }
    
    // Guardar los cambios
    Object.entries(editingTickets).forEach(([posStr, ticketMatrix]) => {
      const position = parseInt(posStr);
      
      // Recopilar todos los números no vacíos
      const numbers = [];
      ticketMatrix.forEach(row => {
        row.forEach(cell => {
          if (cell.trim() !== '') {
            numbers.push(parseInt(cell.trim()));
          }
        });
      });
      
      // Primero eliminar el boleto existente si hay uno
      if (lot) {
        const ticket = lot.tickets.find(t => t.position === position);
        if (ticket) {
          removeTicket(ticket.id);
        }
      }
      
      // Solo guardar si hay números válidos
      if (numbers.length === 7 && new Set(numbers).size === 7) {
        addTicket(lotNumber, position, numbers);
      }
    });
    
    // Actualizar los valores originales
    setOriginalValues(JSON.parse(JSON.stringify(editingTickets)));
    
    // Resaltar temporalmente para indicar que se guardó
    setHighlightedRow(-1); // -1 indica que todo se guardó
    setTimeout(() => {
      setHighlightedRow(null);
      setChanges(false);
    }, 1000);
    
    // Mostrar confirmación
    Alert.alert('Cambios guardados', 'Los boletos se han actualizado correctamente.');
    
    // Volver a la pantalla anterior
    router.back();
  };
  
  const handleClearPosition = (position: number) => {
    Alert.alert(
      'Eliminar boleto',
      `¿Estás seguro de eliminar el boleto en la posición ${position}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          onPress: () => {
            // Limpiar los números en la interfaz
            setEditingTickets(prev => {
              const newTickets = {...prev};
              newTickets[position] = [Array(7).fill('')];
              return newTickets;
            });
            
            // Eliminar el boleto de la base de datos si existe
            if (lot) {
              const ticket = lot.tickets.find(t => t.position === position);
              if (ticket) {
                removeTicket(ticket.id);
              }
            }
            
            // Actualizar duplicados
            setTimeout(() => {
              checkDuplicateNumbers({...editingTickets, [position]: [Array(7).fill('')]});
            }, 0);
            
            // Resaltar la fila
            setHighlightedRow(position);
            setTimeout(() => {
              setHighlightedRow(null);
            }, 1000);
            
            setChanges(true);
          }
        }
      ]
    );
  };
  
  const handleGoBack = () => {
    if (changes) {
      showExitConfirmation();
    } else {
      router.back();
    }
  };
  
  if (!lot) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: textColor }]}>
            No se encontró el lote.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color={textColor} />
        </TouchableOpacity>
        
        <Text style={[styles.title, { color: textColor }]}>
          Editar Boletos - Lote {lotNumber}
        </Text>
        
        <TouchableOpacity 
          style={[styles.saveButtonHeader, !changes && styles.saveButtonDisabled]} 
          onPress={handleSaveChanges}
          disabled={!changes}
        >
          <Text style={styles.saveButtonHeaderText}>Guardar</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.tableHeader}>
          <Text style={[styles.positionHeader, { color: textColor }]}>#</Text>
          {Array(7).fill(0).map((_, i) => (
            <Text key={i} style={[styles.numberHeader, { color: textColor }]}>N{i+1}</Text>
          ))}
          <Text style={[styles.actionsHeader, { color: textColor }]}>Acción</Text>
        </View>
        
        {Object.entries(editingTickets).map(([posStr, ticketMatrix]) => {
          const position = parseInt(posStr);
          const isEmpty = isTicketEmpty(position);
          const isHighlighted = highlightedRow === position || highlightedRow === -1;
          
          // No resaltar filas vacías
          const shouldHighlight = isHighlighted && !isEmpty;
          
          return (
            <View 
              key={position} 
              style={[
                styles.ticketRow,
                shouldHighlight && styles.highlightedRow
              ]}
            >
              <Text style={[styles.positionCell, { color: textColor }]}>{position}</Text>
              
              {Array(7).fill(0).map((_, col) => {
                const value = ticketMatrix[0] ? ticketMatrix[0][col] : '';
                const isDuplicate = isNumberDuplicate(position, value);
                
                return (
                  <TextInput
                    key={col}
                    style={[
                      styles.numberCell, 
                      { 
                        color: isDuplicate ? '#FF3B30' : textColor, 
                        borderColor: isDuplicate ? '#FF3B30' : '#ddd',
                        backgroundColor: isDuplicate ? 'rgba(255, 59, 48, 0.1)' : 'white'
                      }
                    ]}
                    value={value}
                    onChangeText={(newValue) => handleNumberChange(position, 0, col, newValue)}
                    keyboardType="number-pad"
                    maxLength={2}
                    placeholder="00"
                    placeholderTextColor="#999"
                  />
                );
              })}
              
              <View style={styles.actionCell}>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleClearPosition(position)}
                >
                  <Ionicons name="close-circle-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  saveButtonHeader: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonHeaderText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 8,
  },
  positionHeader: {
    width: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  numberHeader: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  actionsHeader: {
    width: 50,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  highlightedRow: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  positionCell: {
    width: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  numberCell: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    textAlign: 'center',
    marginHorizontal: 2,
    fontSize: 14,
  },
  actionCell: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    padding: 5,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
});