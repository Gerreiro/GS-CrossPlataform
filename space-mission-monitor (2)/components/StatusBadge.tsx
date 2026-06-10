import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SensorStatus } from '../context/MissionContext';

interface StatusBadgeProps {
  status: SensorStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG = {
  normal:   { color: '#00ff88', label: '● NOMINAL' },
  warning:  { color: '#ffcc00', label: '⚠ ATENÇÃO' },
  critical: { color: '#ff3355', label: '✖ CRÍTICO' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { color, label } = STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { borderColor: color + '50', backgroundColor: color + '15' }]}>
      <Text style={[styles.text, { color }, size === 'sm' && styles.textSm]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  textSm: {
    fontSize: 9,
  },
});
