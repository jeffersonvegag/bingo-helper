// app/modals/ticket-details.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTicketContext } from '../../context/TicketContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function TicketDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { lots, removeTicket, drawnNumbers } = useTicketContext();
  const backgroundColor = useThemeColor({ light: '#f2f2f7', dark: '#000000' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  
  // Buscar el boleto en todos los lotes
  const findTicket = () => {
    for (const lot of lots) {
      const ticket = lot.tickets.find(t => t.id === id);
      if (ticket) {
        return { ticket, lotNumber: lot.id };
      }
    }
    return null;
  };
  
  const ticketInfo = findTicket();
  
  if (!ticketInfo) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: textColor }]}>
            No se encontró el boleto.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const { ticket, lotNumber } = ticketInfo;
  
  // Calcular coincidencias
  const matchedNumbers = ticket.numbers.filter(num => drawnNumbers.includes(num));
  const missingNumbers = ticket.numbers.filter(num => !drawnNumbers.includes(num));
  
  const handleDelete = () => {
    Alert.alert(
      'Eliminar boleto',
      `¿Estás seguro de eliminar este boleto del Lote ${lotNumber}, Posición ${ticket.position}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive', 
          onPress: () => {
            removeTicket(id);
            router.back();
          }
        }
      ]
    );
  };
  
  const handleEdit = () => {
    // Aquí se podría implementar la edición del boleto
    Alert.alert('Función en desarrollo', 'La edición de boletos estará disponible próximamente.');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>
          Lote {lotNumber}, Boleto {ticket.position}
        </Text>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: textColor }]}>Estado:</Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: matchedNumbers.length === 7 ? '#4CAF50' : '#FF9800' }
          ]}>
            <Text style={styles.statusText}>
              {matchedNumbers.length === 7 
                ? '¡COMPLETO!' 
                : `${matchedNumbers.length}/7 aciertos`}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.numbersTitle, { color: textColor }]}>Números del boleto:</Text>
        <View style={styles.numbersContainer}>
          {ticket.numbers.map((number, index) => {
            const isMatched = drawnNumbers.includes(number);
            return (
              <View 
                key={index} 
                style={[
                  styles.numberBubble, 
                  { 
                    backgroundColor: isMatched ? '#4CAF50' : '#FF5252',
                  }
                ]}
              >
                <Text style={styles.numberText}>
                  {number < 10 ? `0${number}` : number}
                </Text>
              </View>
            );
          })}
        </View>
        
        {matchedNumbers.length > 0 && (
          <>
            <Text style={[styles.matchTitle, { color: textColor }]}>
              Números acertados ({matchedNumbers.length}):
            </Text>
            <View style={styles.matchContainer}>
              {matchedNumbers.map((number, index) => (
                <View key={index} style={styles.matchBubble}>
                  <Text style={styles.matchText}>
                    {number < 10 ? `0${number}` : number}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
        
        {missingNumbers.length > 0 && (
          <>
            <Text style={[styles.matchTitle, { color: textColor }]}>
              Números pendientes ({missingNumbers.length}):
            </Text>
            <View style={styles.matchContainer}>
              {missingNumbers.map((number, index) => (
                <View key={index} style={styles.missingBubble}>
                  <Text style={styles.missingText}>
                    {number < 10 ? `0${number}` : number}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="pencil-outline" size={20} color="#FFFFFF" />
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  numbersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  numberBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  numberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  matchTitle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  matchContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  matchBubble: {
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    margin: 4,
  },
  matchText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  missingBubble: {
    backgroundColor: '#FF5252',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    margin: 4,
  },
  missingText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  notFoundText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2196F3',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});