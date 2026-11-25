import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function ChoiceCard({ title, subtitle, icon, selected, onPress }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={[styles.card, selected && styles.active]}>
      <Text style={styles.icon}>{icon}</Text><View style={styles.copy}><Text style={styles.title}>{title}</Text>{!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}</View>
      <Text style={styles.radio}>{selected ? '●' : '○'}</Text>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: colors.line, borderRadius: 17, padding: 16, marginBottom: 12, backgroundColor: colors.white },
  active: { borderColor: colors.forest, borderWidth: 2, backgroundColor: colors.sageSoft },
  icon: { fontSize: 28 }, copy: { flex: 1 }, title: { color: colors.ink, fontWeight: '800', fontSize: 15 },
  subtitle: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 4 }, radio: { color: colors.forest, fontSize: 20 },
});