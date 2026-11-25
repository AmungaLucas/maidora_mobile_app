import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function SplashScreen({ navigation }) {
  useEffect(() => { const timer = setTimeout(() => navigation.replace('Welcome'), 1100); return () => clearTimeout(timer); }, [navigation]);
  return <View style={styles.container}><View style={styles.mark}><Text style={styles.markText}>M</Text></View><Text style={styles.brand}>maidora</Text><Text style={styles.tag}>Find. Hire. Thrive.</Text></View>;
}
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' }, mark: { width: 76, height: 76, borderRadius: 25, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center' }, markText: { color: colors.white, fontSize: 42, fontWeight: '900' }, brand: { color: colors.forestDark, fontSize: 35, fontWeight: '900', marginTop: 12 }, tag: { color: colors.muted, marginTop: 3 } });