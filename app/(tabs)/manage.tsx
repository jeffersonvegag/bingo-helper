// app/(tabs)/manage.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, TextInput, Modal } from 'react-native';
import { useTicketContext } from '../../context/TicketContext';
import { LotCard } from '../../components/ui/LotCard';
import { useThemeColor } from '../../hooks/useThemeColor';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ManageScreen() {
  const { lots, removeLot, addLot } = useTicketContext();
  const [highlightedLotId, setHighlightedLotId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newLotNumber, setNewLotNumber] = useState('');
  
  const backgroundColor = useThemeColor({ light: '#f2f2f7', dark: '#000000' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  const modalBgColor = useThemeColor({ light: 'white', dark: '#1c1c1e' }, 'background');

  const handleAddTicket = () => {
    router.push('/modals/add-ticket');
  };
  
  const handleImportCSV = () => {
    router.push('/modals/import-csv');
  };
  
  const handleAddLot = () => {
    // Mostrar modal en lugar de Alert.prompt
    setNewLotNumber('');
    setModalVisible(true);
  };

  const createNewLot = () => {
    const lotNumber = parseInt(newLotNumber);
    if (isNaN(lotNumber) || lotNumber <= 0) {
      Alert.alert('Error', 'Por favor ingresa un número de lote válido');
      return;
    }
    
    // Verificar si el lote ya existe
    if (lots.some(lot => lot.id === lotNumber)) {
      Alert.alert('Error', `El lote ${lotNumber} ya existe`);
      return;
    }
    
    // Crear un nuevo lote vacío
    addLot(lotNumber, []);
    setModalVisible(false);
  };
  
  const handleDeleteLot = (lotNumber: number) => {
    Alert.alert(
      'Eliminar lote',
      `¿Estás seguro de eliminar el lote ${lotNumber} y todos sus boletos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => removeLot(lotNumber) }
      ]
    );
  };
  
  const handleEditLot = (lotNumber: number) => {
    // Navegar a la pantalla de edición de boletos para este lote
    router.push({
      pathname: '/modals/lot-tickets',
      params: { lotId: lotNumber }
    });
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: textColor }]}>
          Lotes ({lots.length})
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addLotButton} onPress={handleAddLot}>
            <Text style={styles.addLotButtonText}>Agregar Lote</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddTicket}>
            <Text style={styles.addButtonText}>Añadir boleto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.importButton} onPress={handleImportCSV}>
            <Text style={styles.importButtonText}>Importar CSV</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {lots.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: textColor }]}>
            No hay lotes registrados. Comienza añadiendo un lote o un boleto.
          </Text>
        </View>
      ) : (
        <FlatList
          data={lots.sort((a, b) => a.id - b.id)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const isHighlighted = highlightedLotId === item.id;
            
            return (
              <View style={[
                isHighlighted ? styles.highlightedLot : null
              ]}>
                <LotCard
                  lotNumber={item.id}
                  ticketsCount={item.tickets.length}
                  onDelete={() => handleDeleteLot(item.id)}
                  onEdit={() => handleEditLot(item.id)}
                />
              </View>
            );
          }}
        />
      )}

      {/* Modal para agregar nuevo lote */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: modalBgColor }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Nuevo Lote</Text>
            <Text style={[styles.modalSubtitle, { color: textColor }]}>Ingresa el número del nuevo lote:</Text>
            
            <TextInput
              style={[styles.modalInput, { color: textColor, borderColor: textColor }]}
              keyboardType="number-pad"
              value={newLotNumber}
              onChangeText={setNewLotNumber}
              placeholder="Número de lote"
              placeholderTextColor="#999"
            />
            
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity 
                style={styles.modalCancelButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalCreateButton} 
                onPress={createNewLot}
              >
                <Text style={styles.modalCreateButtonText}>Crear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  addLotButton: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  addLotButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  importButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  importButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  highlightedLot: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  // Estilos para el modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  modalCancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  modalCreateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  modalCreateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});