import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
  disabled?: boolean;
}

const VARIANTS = {
  primary: {
    bg: '#003322',
    border: '#00ff88',
    text: '#00ff88',
  },
  secondary: {
    bg: '#1a1a2a',
    border: '#3a3a5a',
    text: '#8899bb',
  },
  danger: {
    bg: '#2a0a10',
    border: '#ff3355',
    text: '#ff3355',
  },
};

export function PrimaryButton({ label, onPress, variant = 'primary', style, disabled }: PrimaryButtonProps) {
  const v = VARIANTS[variant];
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        { backgroundColor: v.bg, borderColor: v.border },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: v.text }, disabled && styles.textDisabled]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
  },
  text: {
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 12,
  },
  disabled: {
    opacity: 0.4,
  },
  textDisabled: {
    color: '#445566',
  },
});
