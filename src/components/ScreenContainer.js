import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export default function ScreenContainer({ children, scroll = true }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>
        {scroll ? <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>{children}</ScrollView> : <View style={styles.content}>{children}</View>}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
export function ScreenContent({ children, style }) {
  return <View style={[styles.content, style]}>{children}</View>;
}
export function Heading({ title, subtitle }) {
  return <View style={styles.heading}><Text style={styles.title}>{title}</Text>{!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}</View>;
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white }, flex: { flex: 1 },
  scroll: { flexGrow: 1 }, content: { flex: 1, paddingHorizontal: 23, paddingTop: 22, paddingBottom: 32 },
  heading: { marginTop: 8, marginBottom: 22 }, title: { color: colors.ink, fontSize: 27, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 7 },
});