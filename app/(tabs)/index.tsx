// app/(tabs)/home.tsx

// Cambiar por el logotipo Jeff
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawBoard } from '../../components/DrawBoard';
import { MatchingResults } from '../../components/MatchingResults';
import { useThemeColor } from '../../hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const backgroundColor = useThemeColor({ light: '#f2f2f7', dark: '#000000' }, 'background');
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <View style={styles.topSection}>
        <DrawBoard />
      </View>
      <View style={styles.bottomSection}>
        <MatchingResults />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    flex: 2,
  },
  bottomSection: {
    flex: 3,
  },
});