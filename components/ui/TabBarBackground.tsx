import { View } from 'react-native';

export function TabBarBackground({ backgroundColor }: { backgroundColor: string }) {
  return <View style={{ flex: 1, backgroundColor }} />;
}

export function useBottomTabOverflow() {
  return 0;
}