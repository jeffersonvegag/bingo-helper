// app/modals/import-csv.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useTicketContext } from '../../context/TicketContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { parseCSVString, importCSVFile } from '../../utils/csvParser';
import { Ionicons } from '@expo/vector-icons';

export default function ImportCSVScreen() {
  const { importTickets } = useTicketContext();
  const [csvContent, setCsvContent] = useState('');
  
  const backgroundColor = useThemeColor({ light: '#f2f2f7', dark: '#000000' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  const cardBackground = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
  
  const handleImportCSV = async () => {
    const tickets = parseCSVString(csvContent);
    
    if (tickets.length === 0) {
      Alert.alert(
        'Error de formato',
        'No se pudo importar ningún boleto. Asegúrate de que el formato sea correcto:\nLote,Posición,Número1,Número2,Número3,Número4,Número5,Número6,Número7'
      );
      return;
    }
    
    importTickets(tickets);
    Alert.alert(
      'Importación exitosa',
      `Se han importado ${tickets.length} boletos correctamente`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };
  
  const handleSelectFile = async () => {
    const tickets = await importCSVFile();
    
    if (!tickets) {
      return; // Usuario canceló o hubo un error
    }
    
    if (tickets.length === 0) {
      Alert.alert(
        'Error de formato',
        'No se pudo importar ningún boleto. Asegúrate de que el formato sea correcto:\nLote,Posición,Número1,Número2,Número3,Número4,Número5,Número6,Número7'
      );
      return;
    }
    
    importTickets(tickets);
    Alert.alert(
      'Importación exitosa',
      `Se han importado ${tickets.length} boletos correctamente`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.title, { color: textColor }]}>Importar boletos desde CSV</Text>
          <Text style={[styles.description, { color: textColor }]}>
            Puedes importar boletos desde un archivo CSV o pegando el contenido directamente.
            El formato debe ser:
          </Text>
          <View style={[styles.formatBox, { backgroundColor: cardBackground }]}>
            <Text style={[styles.formatText, { color: textColor }]}>
              Lote,Posición,Número1,Número2,Número3,Número4,Número5,Número6,Número7
            </Text>
            <Text style={[styles.formatText, { color: textColor }]}>
              1,1,5,12,27,34,45,67,89
            </Text>
            <Text style={[styles.formatText, { color: textColor }]}>
              1,2,8,15,22,39,51,62,77
            </Text>
          </View>
        </View>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity 
            style={[styles.fileButton, { backgroundColor: cardBackground }]}
            onPress={handleSelectFile}
          >
            <Ionicons name="document-outline" size={24} color="#2196F3" />
            <Text style={styles.fileButtonText}>Seleccionar archivo CSV</Text>
          </TouchableOpacity>
          
          <Text style={[styles.orText, { color: textColor }]}>O</Text>
          
          <Text style={[styles.inputLabel, { color: textColor }]}>
            Pega el contenido CSV aquí:
          </Text>
          <TextInput
            style={[
              styles.textInput, 
              { 
                color: textColor, 
                borderColor: textColor,
                backgroundColor: cardBackground
              }
            ]}
            value={csvContent}
            onChangeText={setCsvContent}
            placeholder="Lote,Posición,Número1,Número2,..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={6}
          />
          
          <TouchableOpacity 
            style={[
              styles.importButton,
              { opacity: csvContent.trim().length > 0 ? 1 : 0.5 }
            ]}
            onPress={handleImportCSV}
            disabled={csvContent.trim().length === 0}
          >
            <Text style={styles.importButtonText}>Importar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  formatBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  formatText: {
    fontFamily: 'SpaceMono',
    fontSize: 12,
    marginBottom: 4,
  },
  optionsContainer: {
    padding: 16,
  },
  fileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  fileButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    height: 150,
    textAlignVertical: 'top',
  },
  importButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  importButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#2196F3',
    fontSize: 16,
  },
});