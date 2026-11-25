import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import ScreenContainer, { Heading } from '../../components/ScreenContainer';
import ChatBubble from '../../components/ChatBubble';
import ChoiceCard from '../../components/ChoiceCard';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

export default function RoleSelectionScreen({ navigation }) {
  const [role, setRole] = useState('');
  const [showReply, setShowReply] = useState(false);
  const [fade] = useState(new Animated.Value(0));
  useEffect(() => { Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }).start(); }, [fade]);
  const choose = value => { setRole(value); setShowReply(true); };
  const explanation = role === 'maid'
    ? "Lovely! You’ll be able to build your worker profile, discover domestic jobs near you and apply for opportunities that fit your preferences."
    : "Great! You’ll be able to discover domestic workers near you, create job posts and connect with people who can help in your home.";
  return <ScreenContainer><View style={styles.top}><Text style={styles.brand}>maidora</Text><Text style={styles.step}>LET'S GET TO KNOW YOU</Text></View><Animated.View style={{ opacity: fade }}><ChatBubble>Hey there! 👋 Welcome to Maidora. How will you use Maidora?</ChatBubble></Animated.View><ChoiceCard icon="🧹" title="I'm looking for work" subtitle="I want to find domestic work opportunities." selected={role === 'maid'} onPress={() => choose('maid')} /><ChoiceCard icon="🏡" title="I'm hiring" subtitle="I need help finding a domestic worker." selected={role === 'employer'} onPress={() => choose('employer')} />{showReply && <Animated.View style={{ opacity: fade }}><ChatBubble>{explanation}</ChatBubble></Animated.View>}<View style={styles.footer}><Button title="Continue" disabled={!role} onPress={() => navigation.navigate('Register', { role })} /><Button title="Back" secondary onPress={() => navigation.goBack()} /></View></ScreenContainer>;
}
const styles = StyleSheet.create({ top: { marginBottom: 28 }, brand: { color: colors.forest, fontSize: 25, fontWeight: '900' }, step: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginTop: 5 }, footer: { marginTop: 'auto', paddingTop: 18 } });