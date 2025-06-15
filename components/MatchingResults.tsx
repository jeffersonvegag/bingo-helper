// components/MatchingResults.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { useTicketContext } from '../context/TicketContext';
import { TicketCard } from './ui/TicketCard';
import { useThemeColor } from '../hooks/useThemeColor';
import { router } from 'expo-router';

export const MatchingResults: React.FC = () => {
  const { matchingResults, lots } = useTicketContext();
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  
  // Obtener números de un boleto específico
  const getTicketNumbers = (lotNumber: number, position: number) => {
    const lot = lots.find(l => l.id === lotNumber);
    if (!lot) return [];
    
    const ticket = lot.tickets.find(t => t.position === position);
    return ticket ? ticket.numbers : [];
  };
  
  // Filtrar para mostrar solo boletos con al menos una coincidencia
  const ticketsWithMatches = matchingResults.filter(result => result.matchCount > 0);
  
  // Ordenar por cantidad de coincidencias (de mayor a menor)
  const sortedResults = [...ticketsWithMatches].sort((a, b) => b.matchCount - a.matchCount);
  
  const handleViewTicket = (lotNumber: number, position: number) => {
    const lot = lots.find(l => l.id === lotNumber);
    if (!lot) return;
    
    const ticket = lot.tickets.find(t => t.position === position);
    if (ticket) {
      router.push({
        pathname: '/modals/ticket-details',
        params: { id: ticket.id }
      });
    }
  };
  
  if (sortedResults.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: textColor }]}>
          Aún no hay coincidencias. Ingresa números del sorteo para comenzar.
        </Text>
      </View>
    );
  }
  
  return (
    <FlatList
      data={sortedResults}
      keyExtractor={(item) => `${item.lotNumber}-${item.position}`}
      renderItem={({ item }) => (
        <TicketCard
          lotNumber={item.lotNumber}
          position={item.position}
          numbers={getTicketNumbers(item.lotNumber, item.position)}
          matchedNumbers={item.matchedNumbers}
          onPress={() => handleViewTicket(item.lotNumber, item.position)}
        />
      )}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={[styles.headerText, { color: textColor }]}>
            Resultados ({sortedResults.length} boletos con coincidencias)
          </Text>
          {sortedResults.length > 0 && sortedResults[0].matchCount === 7 && (
            <View style={styles.winnerBanner}>
              <Text style={styles.winnerText}>
                ¡GANADOR! Lote {sortedResults[0].lotNumber}, Boleto {sortedResults[0].position}
              </Text>
            </View>
          )}
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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
  winnerBanner: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  winnerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});