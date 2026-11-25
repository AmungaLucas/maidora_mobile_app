import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';

export default function Button({ title, onPress, secondary = false, disabled = false, loading = false }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled || loading}
      style={[styles.button, secondary && styles.secondary, (disabled || loading) && styles.disabled]}>
      {loading ? <ActivityIndicator color={secondary ? colors.forest : colors.white} /> :
        <Text style={[styles.text, secondary && styles.secondaryText]}>{title}</Text>}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: { minHeight: 52, paddingHorizontal: 18, borderRadius: 15, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  secondary: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  text: { color: colors.white, fontWeight: '800', fontSize: 15 },
  secondaryText: { color: colors.forest },
  disabled: { opacity: 0.45 },
});