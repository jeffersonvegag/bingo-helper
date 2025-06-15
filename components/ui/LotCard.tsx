// components/ui/LotCard.tsx (con modificaciones)
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

interface LotCardProps {
  lotNumber: number;
  ticketsCount: number;
  onPress?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  isEditing?: boolean;
}

export const LotCard: React.FC<LotCardProps> = ({
  lotNumber,
  ticketsCount,
  onPress,
  onDelete,
  onEdit,
  isEditing = false
}) => {
  const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
  const textColor = useThemeColor({ light: '#000000', dark: '#ffffff' }, 'text');
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.content}>
        <View style={styles.lotInfo}>
          <Text style={[styles.lotNumber, { color: textColor }]}>
            Lote {lotNumber}
          </Text>
          <Text style={[styles.ticketCount, { color: textColor }]}>
            {ticketsCount} {ticketsCount === 1 ? 'boleto' : 'boletos'}
          </Text>
        </View>
        
        <View style={styles.buttonsContainer}>
          {onEdit && (
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
              <Ionicons 
                name={isEditing ? "save-outline" : "pencil-outline"} 
                size={24} 
                color="#2196F3" 
              />
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
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
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lotInfo: {
    flex: 1,
  },
  lotNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  ticketCount: {
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
});