import React from 'react';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenContainer, { Heading } from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

export default function VerificationChoiceScreen({ navigation, route }) {
  const data = route.params || {};
  const go = method => navigation.navigate('VerifyOtp', { ...data, method });

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Text style={styles.eyebrow}>ACCOUNT SECURITY</Text>
      <Heading
        title="Verify your contact"
        subtitle="Choose one contact method to verify your new Maidora account."
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={'Verify phone number ' + (data.phone || '')}
        onPress={() => go('phone')}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="cellphone" size={25} color={colors.forest} />
        </View>
        <View style={styles.cardCopy}>
          <Text style={styles.cardTitle}>Phone number</Text>
          <Text style={styles.cardValue}>{data.phone || 'No phone number provided'}</Text>
          <Text style={styles.cardHint}>Verify using your phone</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={25} color={colors.forest} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={'Verify email address ' + (data.email || '')}
        onPress={() => go('email')}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.iconWrap}>
          <MaterialCommunityIcons name="email-outline" size={25} color={colors.forest} />
        </View>
        <View style={styles.cardCopy}>
          <Text style={styles.cardTitle}>Email address</Text>
          <Text style={styles.cardValue}>{data.email || 'No email address provided'}</Text>
          <Text style={styles.cardHint}>Verify using your email</Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={25} color={colors.forest} />
      </Pressable>

      <View style={styles.note}>
        <MaterialCommunityIcons name="information-outline" size={18} color={colors.forest} />
        <Text style={styles.noteText}>
          You only need to verify one contact to continue. Your other contact can be verified later.
        </Text>
      </View>
      <Button title="Back" secondary onPress={() => navigation.goBack()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 48 },
  eyebrow: { color: colors.forest, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: colors.line, borderRadius: 16, marginBottom: 13, backgroundColor: colors.white },
  cardPressed: { backgroundColor: colors.sageSoft, borderColor: colors.forest },
  iconWrap: { width: 48, height: 48, borderRadius: 14, backgroundColor: colors.sageSoft, alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  cardCopy: { flex: 1 },
  cardTitle: { color: colors.ink, fontSize: 15, fontWeight: '800' },
  cardValue: { color: colors.muted, fontSize: 12, marginTop: 4 },
  cardHint: { color: colors.forest, fontSize: 11, fontWeight: '700', marginTop: 5 },
  note: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, backgroundColor: colors.sageSoft, padding: 13, borderRadius: 12, marginTop: 8, marginBottom: 12 },
  noteText: { flex: 1, color: colors.muted, fontSize: 12, lineHeight: 18 },
});
