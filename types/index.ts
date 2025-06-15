// types/index.ts
export interface Ticket {
    id: string;
    lotNumber: number;
    position: number;
    numbers: number[];
  }
  
  export interface Lot {
    id: number;
    tickets: Ticket[];
  }
  
  export interface MatchingResult {
    lotNumber: number;
    position: number;
    ticketId: string;
    matchedNumbers: number[];
    missingNumbers: number[];
    matchCount: number;
  }