import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function ChatBubble({ children, mine = false }) {
  return <View style={[styles.bubble, mine ? styles.mine : styles.theirs]}><Text style={[styles.text, mine && styles.mineText]}>{children}</Text></View>;
}
const styles = StyleSheet.create({
  bubble: { maxWidth: '88%', paddingHorizontal: 16, paddingVertical: 13, borderRadius: 18, marginBottom: 12 },
  theirs: { alignSelf: 'flex-start', backgroundColor: colors.sageSoft, borderBottomLeftRadius: 5 },
  mine: { alignSelf: 'flex-end', backgroundColor: colors.forest, borderBottomRightRadius: 5 },
  text: { color: colors.ink, fontSize: 14, lineHeight: 21 }, mineText: { color: colors.white, fontWeight: '700' },
});