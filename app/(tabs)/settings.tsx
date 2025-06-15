// app/(tabs)/settings.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch } from 'react-native';
import { useTicketContext } from '../../context/TicketContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { clearAllData } from '../../utils/storage';
import { exportToCSV } from '../../utils/csvParser';
import * as Sharing from 'expo-sharing';

export default function SettingsScreen() {
  const { resetAll, lots } = useTicketContext();
  const [autoSortNumbers, setAutoSortNumbers] = React.useState(false);
  const [showCompletedTickets, setShowCompletedTickets] = React.useState(true);
  
  const backgroundColor = useThemeColor({ light: '#f2f2f7', dark: '#000000' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  const cardBackground = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
  
  const handleResetAll = () => {
    Alert.alert(
      'Reiniciar todo',
      '¿Estás seguro de que deseas eliminar todos los boletos y números del sorteo? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Reiniciar', 
          style: 'destructive',
          onPress: () => {
            resetAll();
            clearAllData();
            Alert.alert('Reiniciado', 'Todos los datos han sido eliminados');
          } 
        }
      ]
    );
  };
  
  const handleExportCSV = async () => {
    if (lots.length === 0) {
      Alert.alert('Error', 'No hay boletos para exportar');
      return;
    }
    
    const allTickets = lots.flatMap(lot => 
      lot.tickets.map(ticket => ({
        ...ticket,
        lotNumber: lot.id
      }))
    );
    
    const fileUri = await exportToCSV(allTickets);
    
    if (fileUri) {
      const canShare = await Sharing.isAvailableAsync();
      
      if (canShare) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Error', 'No es posible compartir archivos en este dispositivo');
      }
    } else {
      Alert.alert('Error', 'No se pudo exportar los boletos');
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: textColor }]}>Ajustes</Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Visualización</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: textColor }]}>Mostrar boletos completados</Text>
              <Text style={styles.settingDescription}>
                Muestra u oculta los boletos que ya tienen todos los números
              </Text>
            </View>
            <Switch
              value={showCompletedTickets}
              onValueChange={setShowCompletedTickets}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={showCompletedTickets ? '#2196F3' : '#f4f3f4'}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingTitle, { color: textColor }]}>Ordenar números automáticamente</Text>
              <Text style={styles.settingDescription}>
                Ordena los números de menor a mayor al ingresar boletos
              </Text>
            </View>
            <Switch
              value={autoSortNumbers}
              onValueChange={setAutoSortNumbers}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={autoSortNumbers ? '#2196F3' : '#f4f3f4'}
            />
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Datos</Text>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleExportCSV}>
            <Ionicons name="cloud-download-outline" size={24} color="#2196F3" />
            <Text style={styles.actionButtonText}>Exportar boletos a CSV</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleResetAll}>
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            <Text style={[styles.actionButtonText, { color: '#FF3B30' }]}>Reiniciar todos los datos</Text>
          </TouchableOpacity>
        </View>
        
        <View style={[styles.section, { backgroundColor: cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Acerca de</Text>
          <Text style={[styles.aboutText, { color: textColor }]}>
            Aplicación de Bingo para ayudar a gestionar boletos de sorteo.
          </Text>
          <Text style={[styles.versionText, { color: textColor }]}>Versión 1.0.0</Text>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 8,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  actionButtonText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#2196F3',
  },
  aboutText: {
    fontSize: 14,
    padding: 16,
    textAlign: 'center',
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
    paddingBottom: 16,
    opacity: 0.7,
  },
});