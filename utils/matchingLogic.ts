// utils/matchingLogic.ts
import { Ticket, MatchingResult } from '../types';

export const findMatchingTickets = (tickets: Ticket[], drawnNumbers: number[]): MatchingResult[] => {
  const results: MatchingResult[] = [];
  
  tickets.forEach(ticket => {
    const matchedNumbers = ticket.numbers.filter(num => drawnNumbers.includes(num));
    const missingNumbers = ticket.numbers.filter(num => !drawnNumbers.includes(num));
    
    results.push({
      lotNumber: ticket.lotNumber,
      position: ticket.position,
      ticketId: ticket.id,
      matchedNumbers,
      missingNumbers,
      matchCount: matchedNumbers.length
    });
  });
  
  // Ordenar por cantidad de coincidencias (mayor a menor)
  results.sort((a, b) => b.matchCount - a.matchCount);
  
  return results;
};

export const hasWinningTicket = (results: MatchingResult[]): boolean => {
  return results.some(result => result.matchCount === 7); // Asumiendo que un boleto tiene 7 números
};

export const getWinningTickets = (results: MatchingResult[]): MatchingResult[] => {
  return results.filter(result => result.matchCount === 7);
};