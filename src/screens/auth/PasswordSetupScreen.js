import React, { useRef, useState } from 'react';
import { Text, View, Modal, Pressable, StyleSheet, Keyboard } from 'react-native';
import ScreenContainer, { Heading } from '../../components/ScreenContainer';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { detectCurrentLocation } from '../../services/location';
import { colors } from '../../theme/colors';

export default function PasswordSetupScreen({ navigation, route }) {
  const data = route.params || {};
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [showConsent, setShowConsent] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const confirmRef = useRef(null);

  const reviewAndContinue = () => {
    Keyboard.dismiss();
    setError('');
    if (password.length < 8) {
      setError('Your password must contain at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Your passwords do not match. Please check and try again.');
      return;
    }
    setAccepted(false);
    setShowConsent(true);
  };

  const agreeAndContinue = async () => {
    if (!accepted || loading) return;
    setShowConsent(false);
    setLoading(true);

    let location = { source: 'manual' };
    try {
      const detected = await detectCurrentLocation();
      if (detected) location = detected;
    } catch (e) {
      // Manual location entry remains available in profile setup.
    } finally {
      setLoading(false);
    }

    navigation.navigate('VerificationChoice', {
      ...data,
      location,
      termsAccepted: true,
      termsVersion: 'v1',
      privacyAcknowledged: true,
      dataProtectionAcknowledged: true,
    });
  };

  return (
    <>
      <ScreenContainer contentStyle={styles.content}>
        <Text style={styles.eyebrow}>ACCOUNT SETUP · FINAL STEP</Text>
        <Heading
          title="You're almost there!"
          subtitle="Let's secure your account with a strong password."
        />

        <View style={styles.contactDetails}>
          <Text style={styles.contactDetail}>{data.phone}</Text>
          <Text style={styles.contactDivider}>·</Text>
          <Text style={styles.contactDetail}>{data.email}</Text>
        </View>

        <TextField
          label="Create password"
          value={password}
          onChangeText={value => { setPassword(value); setError(''); }}
          placeholder="At least 8 characters"
          secureTextEntry={!showPassword}
          rightActionLabel={showPassword ? 'Hide' : 'Show'}
          onRightActionPress={() => setShowPassword(value => !value)}
          autoCapitalize="none"
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
          autoFocus
        />
        <TextField
          inputRef={confirmRef}
          label="Confirm password"
          value={confirm}
          onChangeText={value => { setConfirm(value); setError(''); }}
          placeholder="Enter your password again"
          secureTextEntry={!showConfirm}
          rightActionLabel={showConfirm ? 'Hide' : 'Show'}
          onRightActionPress={() => setShowConfirm(value => !value)}
          autoCapitalize="none"
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="done"
          onSubmitEditing={reviewAndContinue}
        />

        <Text style={styles.helper}>Use at least 8 characters. Avoid sharing your password with anyone.</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Review and continue" onPress={reviewAndContinue} loading={loading} />
        <Button title="Back" secondary onPress={() => navigation.goBack()} />
      </ScreenContainer>

      <Modal
        visible={showConsent}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConsent(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={() => setShowConsent(false)} />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <Text style={styles.modalEyebrow}>ONE LAST THING</Text>
            <Text style={styles.modalTitle}>Your privacy matters</Text>
            <Text style={styles.modalCopy}>
              Before creating your account, please read and agree to Maidora's Terms & Conditions.
              We also ask you to acknowledge our Privacy Policy and Data Protection Notice, which
              explain how your personal information is handled.
            </Text>

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: accepted }}
              onPress={() => setAccepted(value => !value)}
              style={styles.consentRow}
            >
              <View style={[styles.checkbox, accepted && styles.checked]}>
                {accepted ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={styles.consentText}>
                I agree to the Terms & Conditions and acknowledge the Privacy Policy and Data Protection Notice.
              </Text>
            </Pressable>

            <Button title="Agree and continue" onPress={agreeAndContinue} disabled={!accepted || loading} loading={loading} />
            <Button title="Not now" secondary onPress={() => setShowConsent(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 48 },
  eyebrow: { color: colors.forest, fontSize: 11, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
  contactDetails: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: -8, marginBottom: 22 },
  contactDetail: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  contactDivider: { color: colors.forest, fontSize: 16, marginHorizontal: 8 },
  helper: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: -4 },
  error: { color: colors.danger, fontSize: 12, marginTop: 8 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(10, 25, 18, 0.45)' },
  backdrop: { flex: 1 },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 30 },
  handle: { width: 42, height: 5, borderRadius: 5, backgroundColor: colors.line, alignSelf: 'center', marginBottom: 20 },
  modalEyebrow: { color: colors.forest, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  modalTitle: { color: colors.ink, fontSize: 23, fontWeight: '900', marginTop: 7 },
  modalCopy: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 10 },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 11, marginTop: 20, marginBottom: 8 },
  checkbox: { width: 22, height: 22, borderWidth: 1.5, borderColor: colors.muted, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  checked: { backgroundColor: colors.forest, borderColor: colors.forest },
  checkmark: { color: colors.white, fontSize: 14, fontWeight: '900' },
  consentText: { flex: 1, color: colors.ink, fontSize: 12, lineHeight: 19 },
});
