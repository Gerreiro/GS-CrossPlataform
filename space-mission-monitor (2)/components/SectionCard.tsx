import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
  accentColor?: string;
}

export function SectionCard({ title, children, style, accentColor = '#00ff88' }: SectionCardProps) {
  return (
    <View style={[styles.card, { borderColor: accentColor + '30' }, style]}>
      <View style={[styles.titleRow, { borderBottomColor: accentColor + '30' }]}>
        <View style={[styles.accent, { backgroundColor: accentColor }]} />
        <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0d0d2b',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
    overflow: 'hidden',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
  },
  accent: {
    width: 3,
    height: 14,
    borderRadius: 2,
    marginRight: 8,
  },
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
});
