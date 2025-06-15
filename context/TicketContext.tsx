// context/TicketContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket, Lot, MatchingResult } from '../types';
import { loadTickets, saveTickets, loadDrawnNumbers, saveDrawnNumbers } from '../utils/storage';
import { findMatchingTickets } from '../utils/matchingLogic';

interface TicketContextType {
  lots: Lot[];
  drawnNumbers: number[];
  matchingResults: MatchingResult[];
  addTicket: (lotNumber: number, position: number, numbers: number[]) => void;
  addLot: (lotNumber: number, tickets: Ticket[]) => void;
  removeLot: (lotNumber: number) => void;
  removeTicket: (ticketId: string) => void;
  importTickets: (tickets: Ticket[]) => void;
  addDrawnNumber: (number: number) => void;
  removeDrawnNumber: (number: number) => void;
  resetDrawnNumbers: () => void;
  resetAll: () => void;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [lots, setLots] = useState<Lot[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [matchingResults, setMatchingResults] = useState<MatchingResult[]>([]);

  // Cargar datos guardados al iniciar
  useEffect(() => {
    const loadSavedData = async () => {
      const savedLots = await loadTickets();
      if (savedLots) {
        setLots(savedLots);
      }
      
      const savedDrawnNumbers = await loadDrawnNumbers();
      if (savedDrawnNumbers) {
        setDrawnNumbers(savedDrawnNumbers);
      }
    };
    
    loadSavedData();
  }, []);

  // Guardar boletos cuando cambian
  useEffect(() => {
    saveTickets(lots);
  }, [lots]);

  // Guardar números del sorteo cuando cambian
  useEffect(() => {
    saveDrawnNumbers(drawnNumbers);
  }, [drawnNumbers]);

  // Calcular resultados cuando cambian los números o boletos
  useEffect(() => {
    const allTickets = lots.flatMap(lot => lot.tickets);
    const results = findMatchingTickets(allTickets, drawnNumbers);
    setMatchingResults(results);
  }, [lots, drawnNumbers]);

// context/TicketContext.tsx (modificación parcial)

  // Modificar la función addTicket para manejar actualizaciones
// Modificación parcial para el método addTicket en context/TicketContext.tsx
  const addTicket = (lotNumber: number, position: number, numbers: number[]) => {
    // No hacer nada si no hay números o si hay menos de 7
    if (!numbers || numbers.length !== 7) {
      return;
    }
    
    setLots(prevLots => {
      const newLots = [...prevLots];
      const lotIndex = newLots.findIndex(lot => lot.id === lotNumber);
      
      // Si el lote existe
      if (lotIndex >= 0) {
        // Buscar si ya existe un boleto en esa posición
        const existingTicketIndex = newLots[lotIndex].tickets.findIndex(
          t => t.position === position
        );
        
        if (existingTicketIndex >= 0) {
          // Actualizar boleto existente
          newLots[lotIndex].tickets[existingTicketIndex].numbers = [...numbers];
        } else {
          // Añadir nuevo boleto al lote existente
          newLots[lotIndex].tickets.push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            lotNumber,
            position,
            numbers: [...numbers]
          });
        }
      } else {
        // Crear nuevo lote con el boleto
        newLots.push({
          id: lotNumber,
          tickets: [{
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            lotNumber,
            position,
            numbers: [...numbers]
          }]
        });
      }
      
      return newLots;
    });
  };
  const addLot = (lotNumber: number, tickets: Ticket[]) => {
    setLots(prevLots => {
      const existingLotIndex = prevLots.findIndex(lot => lot.id === lotNumber);
      
      if (existingLotIndex >= 0) {
        // Si el lote ya existe, reemplazar sus boletos
        const newLots = [...prevLots];
        newLots[existingLotIndex].tickets = tickets;
        return newLots;
      } else {
        // Si el lote no existe, añadirlo
        return [...prevLots, { id: lotNumber, tickets }];
      }
    });
  };

  const removeLot = (lotNumber: number) => {
    setLots(prevLots => prevLots.filter(lot => lot.id !== lotNumber));
  };

// Actualización para el método removeTicket en TicketContext.tsx
  const removeTicket = (ticketId: string) => {
    setLots(prevLots => {
      // Hacer una copia profunda para asegurar que se apliquen los cambios
      const newLots = JSON.parse(JSON.stringify(prevLots));
      
      for (let i = 0; i < newLots.length; i++) {
        const lot = newLots[i];
        const ticketIndex = lot.tickets.findIndex(t => t.id === ticketId);
        
        if (ticketIndex >= 0) {
          // Eliminar el boleto
          lot.tickets.splice(ticketIndex, 1);
          break;
        }
      }
      
      // Eliminar lotes vacíos
      return newLots.filter(lot => lot.tickets.length > 0);
    });
  };

  const importTickets = (tickets: Ticket[]) => {
    // Agrupar boletos por lote
    const lotMap = new Map<number, Ticket[]>();
    
    tickets.forEach(ticket => {
      if (!lotMap.has(ticket.lotNumber)) {
        lotMap.set(ticket.lotNumber, []);
      }
      lotMap.get(ticket.lotNumber)?.push(ticket);
    });
    
    // Actualizar lotes
    setLots(prevLots => {
      const newLots = [...prevLots];
      
      lotMap.forEach((tickets, lotNumber) => {
        const existingLotIndex = newLots.findIndex(lot => lot.id === lotNumber);
        
        if (existingLotIndex >= 0) {
          // Añadir boletos al lote existente, evitando duplicados por posición
          const existingTickets = newLots[existingLotIndex].tickets;
          
          tickets.forEach(newTicket => {
            const existingIndex = existingTickets.findIndex(t => t.position === newTicket.position);
            if (existingIndex >= 0) {
              // Reemplazar boleto existente
              existingTickets[existingIndex] = newTicket;
            } else {
              // Añadir nuevo boleto
              existingTickets.push(newTicket);
            }
          });
        } else {
          // Crear nuevo lote
          newLots.push({
            id: lotNumber,
            tickets
          });
        }
      });
      
      return newLots;
    });
  };

  const addDrawnNumber = (number: number) => {
    if (!drawnNumbers.includes(number)) {
      setDrawnNumbers(prev => [...prev, number]);
    }
  };

  const removeDrawnNumber = (number: number) => {
    setDrawnNumbers(prev => prev.filter(num => num !== number));
  };

  const resetDrawnNumbers = () => {
    setDrawnNumbers([]);
  };

  const resetAll = () => {
    setLots([]);
    setDrawnNumbers([]);
    setMatchingResults([]);
  };

  return (
    <TicketContext.Provider value={{
      lots,
      drawnNumbers,
      matchingResults,
      addTicket,
      addLot,
      removeLot,
      removeTicket,
      importTickets,
      addDrawnNumber,
      removeDrawnNumber,
      resetDrawnNumbers,
      resetAll
    }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTicketContext = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTicketContext must be used within a TicketProvider');
  }
  return context;
};