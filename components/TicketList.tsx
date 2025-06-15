// components/TicketList.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTicketContext } from '../context/TicketContext';
import { TicketCard } from './ui/TicketCard';
import { useThemeColor } from '../hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export const TicketList: React.FC = () => {
  const { lots, matchingResults } = useTicketContext();
  const [selectedLot, setSelectedLot] = useState<number | null>(null);
  
  const backgroundColor = useThemeColor({ light: '#f2f2f7', dark: '#1c1c1e' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  
  // Obtener todos los boletos (aplanados)
  const allTickets = lots.flatMap(lot => lot.tickets.map(ticket => ({
    ...ticket,
    lotNumber: lot.id
  })));
  
  // Filtrar por lote si hay uno seleccionado
  const filteredTickets = selectedLot
    ? allTickets.filter(ticket => ticket.lotNumber === selectedLot)
    : allTickets;
  
  // Obtener información de coincidencias para cada boleto
  const ticketsWithMatches = filteredTickets.map(ticket => {
    const matchResult = matchingResults.find(
      r => r.lotNumber === ticket.lotNumber && r.position === ticket.position
    );
    
    return {
      ...ticket,
      matchedNumbers: matchResult?.matchedNumbers || [],
      matchCount: matchResult?.matchCount || 0
    };
  });
  
  // Ordenar por lote y posición
  const sortedTickets = [...ticketsWithMatches].sort((a, b) => {
    if (a.lotNumber !== b.lotNumber) {
      return a.lotNumber - b.lotNumber;
    }
    return a.position - b.position;
  });
  
  const handleViewTicket = (ticketId: string) => {
    router.push({
      pathname: '/modals/ticket-details',
      params: { id: ticketId }
    });
  };
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.filterContainer}>
        <Text style={[styles.filterLabel, { color: textColor }]}>Filtrar por lote:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedLot === null && styles.filterButtonSelected
            ]}
            onPress={() => setSelectedLot(null)}
          >
            <Text style={selectedLot === null ? styles.filterTextSelected : styles.filterText}>
              Todos
            </Text>
          </TouchableOpacity>
          
          {lots.map(lot => (
            <TouchableOpacity
              key={lot.id}
              style={[
                styles.filterButton,
                selectedLot === lot.id && styles.filterButtonSelected
              ]}
              onPress={() => setSelectedLot(lot.id)}
            >
              <Text style={selectedLot === lot.id ? styles.filterTextSelected : styles.filterText}>
                Lote {lot.id}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {sortedTickets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: textColor }]}>
            No hay boletos{selectedLot ? ` en el lote ${selectedLot}` : ''}. Añade boletos desde la pantalla "Gestionar".
          </Text>
        </View>
      ) : (
        <FlatList
          data={sortedTickets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TicketCard
              lotNumber={item.lotNumber}
              position={item.position}
              numbers={item.numbers}
              matchedNumbers={item.matchedNumbers}
              onPress={() => handleViewTicket(item.id)}
            />
          )}
          ListHeaderComponent={
            <Text style={[styles.listHeader, { color: textColor }]}>
              {sortedTickets.length} boletos{selectedLot ? ` en lote ${selectedLot}` : ''}
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    marginRight: 8,
  },
  filterButtonSelected: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#000000',
  },
  filterTextSelected: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listHeader: {
    padding: 16,
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
  },
});