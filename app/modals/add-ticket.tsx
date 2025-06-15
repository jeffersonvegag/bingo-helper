// app/modals/add-ticket.tsx (modificaciones)
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TicketForm } from '../../components/TicketForm';
import { useTicketContext } from '../../context/TicketContext';
import { useThemeColor } from '../../hooks/useThemeColor';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTicketScreen() {
  const { addTicket, lots } = useTicketContext();
  const params = useLocalSearchParams<{ 
    lotId?: string, 
    position?: string, 
    ticketId?: string,
    edit?: string
  }>();
  
  const [initialLotNumber, setInitialLotNumber] = useState<number>(1);
  const [initialPosition, setInitialPosition] = useState<number>(1);
  const [initialNumbers, setInitialNumbers] = useState<number[]>([]);
  
  const backgroundColor = useThemeColor({ light: '#f2f2f7', dark: '#000000' }, 'background');
  
  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (params.lotId) {
      const lotNumber = parseInt(params.lotId);
      setInitialLotNumber(lotNumber);
      
      // Si estamos editando un boleto existente
      if (params.ticketId && params.edit === 'true') {
        const lot = lots.find(l => l.id === lotNumber);
        if (lot) {
          const ticket = lot.tickets.find(t => t.id === params.ticketId);
          if (ticket) {
            setInitialPosition(ticket.position);
            setInitialNumbers(ticket.numbers);
          }
        }
      } else if (params.position) {
        // Si solo se especificó una posición
        setInitialPosition(parseInt(params.position));
      }
    }
  }, [params, lots]);
  
  const handleSubmit = (lotNumber: number, position: number, numbers: number[]) => {
    addTicket(lotNumber, position, numbers);
    router.back();
  };
  
  const handleCancel = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <TicketForm
        initialLotNumber={initialLotNumber}
        initialPosition={initialPosition}
        initialNumbers={initialNumbers}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});