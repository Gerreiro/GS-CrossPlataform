import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DataRowProps {
  label: string;
  value: string;
  mono?: boolean;
  valueColor?: string;
  last?: boolean;
}

export function DataRow({ label, value, mono, valueColor, last }: DataRowProps) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, mono && styles.mono, valueColor ? { color: valueColor } : null]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#141428',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  label: {
    color: '#667788',
    fontSize: 12,
    flex: 1,
  },
  value: {
    color: '#aabbcc',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
  },
  mono: {
    fontFamily: 'monospace',
    color: '#7799ff',
  },
});
