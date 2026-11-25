import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import Button from '../components/Button';
import { colors } from '../theme/colors';

export default function WelcomeScreen({ navigation }) {
  return <ScreenContainer><View style={styles.hero}><View style={styles.logo}><Text style={styles.logoText}>M</Text></View><Text style={styles.brand}>maidora</Text><Text style={styles.tag}>Find. Hire. Thrive.</Text><Text style={styles.headline}>A better way to{ '\n' }find the right fit.</Text><Text style={styles.copy}>Connecting Kenyan households with domestic workers and helping people discover meaningful work.</Text></View><Button title="Get started" onPress={() => navigation.navigate('RoleSelection')} /><Button title="I already have an account · Login" secondary onPress={() => navigation.navigate('Login')} /></ScreenContainer>;
}
const styles = StyleSheet.create({ hero: { alignItems: 'center', paddingTop: 28, paddingBottom: 30 }, logo: { width: 66, height: 66, borderRadius: 22, backgroundColor: colors.forest, alignItems: 'center', justifyContent: 'center' }, logoText: { color: colors.white, fontSize: 36, fontWeight: '900' }, brand: { color: colors.forestDark, fontSize: 34, fontWeight: '900', marginTop: 9 }, tag: { color: colors.muted, fontSize: 13 }, headline: { color: colors.ink, fontSize: 32, fontWeight: '900', textAlign: 'center', marginTop: 58, lineHeight: 39 }, copy: { color: colors.muted, fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 13, maxWidth: 310 } });