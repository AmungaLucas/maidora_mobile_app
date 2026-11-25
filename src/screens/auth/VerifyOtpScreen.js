import React, { useState } from 'react';
import { Text, StyleSheet, Keyboard, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ScreenContainer, { Heading } from '../../components/ScreenContainer';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

export default function VerifyOtpScreen({ navigation, route }) {
  const data = route.params || {};
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const method = data.method === 'phone' ? 'phone' : 'email';
  const destination = method === 'phone' ? data.phone : data.email;

  const verify = () => {
    Keyboard.dismiss();
    if (code.length !== 6) {
      setError('Enter all 6 digits of your verification code.');
      return;
    }
    if (code !== '123456') {
      setError('That code is incorrect. For this demo, enter 123456.');
      return;
    }

    navigation.replace(data.role === 'maid' ? 'MaidDashboard' : 'EmployerDashboard', {
      ...data,
      profileCompleted: false,
      phoneVerified: method === 'phone',
      emailVerified: method === 'email',
      kycStatus: 'not_submitted',
    });
  };

  return (
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons name={method === 'phone' ? 'message-text-outline' : 'email-check-outline'} size={30} color={colors.forest} />
      </View>
      <Text style={styles.eyebrow}>CONTACT VERIFICATION</Text>
      <Heading
        title="Enter your verification code"
        subtitle={'Enter the 6-digit code for ' + (destination || 'your selected contact') + '.'}
      />

      <TextField
        label="6-digit verification code"
        value={code}
        onChangeText={value => {
          setCode(value.replace(/\D/g, '').slice(0, 6));
          setError('');
        }}
        keyboardType="number-pad"
        placeholder="Enter code"
        autoCapitalize="none"
        returnKeyType="done"
        onSubmitEditing={verify}
      />

      {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}

      <View style={styles.demoNotice}>
        <MaterialCommunityIcons name="information-outline" size={18} color={colors.forest} />
        <Text style={styles.demoText}>
          Demo mode: use 123456. No real SMS or email is sent yet.
        </Text>
      </View>

      <Button title="Verify and continue" onPress={verify} disabled={code.length !== 6} />
      <Button title="Choose another method" secondary onPress={() => navigation.goBack()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 48 },
  iconWrap: { width: 58, height: 58, borderRadius: 18, backgroundColor: colors.sageSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  eyebrow: { color: colors.forest, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  error: { color: colors.danger, fontSize: 12, marginTop: -5, marginBottom: 8 },
  demoNotice: { flexDirection: 'row', alignItems: 'flex-start', gap: 9, backgroundColor: colors.sageSoft, padding: 13, borderRadius: 12, marginTop: 2, marginBottom: 10 },
  demoText: { flex: 1, color: colors.muted, fontSize: 12, lineHeight: 18 },
});
