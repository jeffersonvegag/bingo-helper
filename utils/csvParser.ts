// utils/csvParser.ts
import { Ticket } from '../types';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';

export const parseCSVString = (csvContent: string): Ticket[] => {
  const tickets: Ticket[] = [];
  
  // Dividir por líneas
  const lines = csvContent.split('\n');
  
  // Procesar cada línea
  lines.forEach((line, lineIndex) => {
    if (line.trim() === '') return;
    
    // Dividir la línea por comas o punto y coma
    const parts = line.includes(';') ? line.split(';') : line.split(',');
    
    if (parts.length < 3) return; // Necesitamos al menos lote, posición y un número
    
    const lotNumber = parseInt(parts[0].trim());
    const position = parseInt(parts[1].trim());
    
    if (isNaN(lotNumber) || isNaN(position)) return;
    
    // Los números comienzan desde el índice 2
    const numbers: number[] = [];
    for (let i = 2; i < parts.length && numbers.length < 7; i++) {
      const num = parseInt(parts[i].trim());
      if (!isNaN(num) && num >= 1 && num <= 90 && !numbers.includes(num)) {
        numbers.push(num);
      }
    }
    
    // Solo crear el ticket si tiene 7 números
    if (numbers.length === 7) {
      tickets.push({
        id: `import-${Date.now()}-${lineIndex}`,
        lotNumber,
        position,
        numbers
      });
    }
  });
  
  return tickets;
};

export const importCSVFile = async (): Promise<Ticket[] | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'text/csv',
      copyToCacheDirectory: true
    });
    
    if (result.canceled) {
      return null;
    }
    
    const fileUri = result.assets[0].uri;
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    return parseCSVString(fileContent);
  } catch (e) {
    console.error('Error importing CSV file:', e);
    return null;
  }
};

export const exportToCSV = async (tickets: Ticket[]): Promise<string | null> => {
  try {
    let csvContent = 'Lote,Posición,Número1,Número2,Número3,Número4,Número5,Número6,Número7\n';
    
    tickets.forEach(ticket => {
      const row = [
        ticket.lotNumber,
        ticket.position,
        ...ticket.numbers
      ].join(',');
      csvContent += row + '\n';
    });
    
    const fileUri = FileSystem.documentDirectory + 'boletos_bingo.csv';
    await FileSystem.writeAsStringAsync(fileUri, csvContent);
    
    return fileUri;
  } catch (e) {
    console.error('Error exporting to CSV:', e);
    return null;
  }
};