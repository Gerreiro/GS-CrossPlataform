import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { MissionProvider, useMission } from '../context/MissionContext';

function TabBarIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    dashboard: '📡',
    alerts: '🚨',
    config: '⚙️',
    logs: '📋',
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
      {icons[name] ?? '●'}
    </Text>
  );
}

function AlertBadge() {
  const { unacknowledgedAlerts } = useMission();
  if (unacknowledgedAlerts === 0) return null;
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {unacknowledgedAlerts > 9 ? '9+' : unacknowledgedAlerts}
      </Text>
    </View>
  );
}

function LayoutContent() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0a0a1a" />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: '#0a0a1a' },
          headerTintColor: '#00ff88',
          headerTitleStyle: { fontWeight: 'bold', letterSpacing: 2 },
          tabBarStyle: {
            backgroundColor: '#0d0d2b',
            borderTopColor: '#1a1a3a',
            height: 60,
          },
          tabBarActiveTintColor: '#00ff88',
          tabBarInactiveTintColor: '#555577',
          tabBarLabelStyle: { fontSize: 10, letterSpacing: 1 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'DASHBOARD',
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ focused }) => <TabBarIcon name="dashboard" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="alerts"
          options={{
            title: 'ALERTAS',
            tabBarLabel: 'Alertas',
            tabBarIcon: ({ focused }) => <TabBarIcon name="alerts" focused={focused} />,
            tabBarBadge: undefined,
          }}
        />
        <Tabs.Screen
          name="config"
          options={{
            title: 'CONFIGURAÇÃO',
            tabBarLabel: 'Config',
            tabBarIcon: ({ focused }) => <TabBarIcon name="config" focused={focused} />,
          }}
        />
        <Tabs.Screen
          name="logs"
          options={{
            title: 'REGISTROS',
            tabBarLabel: 'Registros',
            tabBarIcon: ({ focused }) => <TabBarIcon name="logs" focused={focused} />,
          }}
        />
      </Tabs>
    </>
  );
}

export default function RootLayout() {
  return (
    <MissionProvider>
      <LayoutContent />
    </MissionProvider>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ff3355',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
