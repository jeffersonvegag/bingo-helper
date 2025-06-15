// components/ui/TicketCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

interface TicketCardProps {
  lotNumber: number;
  position: number;
  numbers: number[];
  matchedNumbers: number[];
  onPress?: () => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  lotNumber,
  position,
  numbers,
  matchedNumbers,
  onPress
}) => {
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  
  const matchCount = matchedNumbers.length;
  const totalNumbers = numbers.length;
  const remaining = totalNumbers - matchCount;

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: textColor }]}>
          Lote {lotNumber}, Boleto {position}
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.matchInfo, { color: textColor }]}>
          {matchCount} números acertados {remaining > 0 ? `(faltan ${remaining})` : '¡COMPLETO!'}
        </Text>
        
        <View style={styles.numbersContainer}>
          {numbers.map((number, index) => {
            const isMatched = matchedNumbers.includes(number);
            return (
              <View 
                key={index} 
                style={[
                  styles.numberBubble, 
                  { 
                    backgroundColor: isMatched ? '#4CAF50' : '#FF5252',
                    borderColor: isMatched ? '#388E3C' : '#D32F2F'
                  }
                ]}
              >
                <Text style={styles.numberText}>
                  {number < 10 ? `0${number}` : number}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
  },
  matchInfo: {
    fontSize: 14,
    marginBottom: 8,
  },
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  numberBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderWidth: 1,
  },
  numberText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});