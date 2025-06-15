import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { TabBarBackground } from '../../components/ui/TabBarBackground';
import { useThemeColor } from '../../hooks/useThemeColor';

export default function TabLayout() {
  const tabBackgroundColor = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
  const tabActiveTintColor = useThemeColor({ light: '#007AFF', dark: '#0A84FF' }, 'tint');
  const tabInactiveTintColor = useThemeColor({ light: '#8E8E93', dark: '#8E8E93' }, 'tabIconDefault');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tabActiveTintColor,
        tabBarInactiveTintColor: tabInactiveTintColor,
        tabBarBackground: () => <TabBarBackground backgroundColor={tabBackgroundColor} />,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          marginTop: Platform.OS === 'ios' ? 0 : -1,
        },
      }}
      initialRouteName="home" // Establece "home" como la ruta inicial
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Sorteo',
          tabBarIcon: ({ color }) => <FontAwesome name="search" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="manage"
        options={{
          title: 'Gestionar',
          tabBarIcon: ({ color }) => <FontAwesome name="list" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color }) => <FontAwesome name="gear" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
