import React, { useState } from 'react';
import {
  Text,
  Pressable,
  View,
  Modal,
  StyleSheet,
  Keyboard,
} from 'react-native';
import ScreenContainer, { Heading } from '../../components/ScreenContainer';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { detectCurrentLocation } from '../../services/location';
import { colors } from '../../theme/colors';

const STEPS = ['Your name', 'Phone number', 'Email address', 'Create password'];

export default function RegisterScreen({ navigation, route }) {
  const role = route.params?.role || 'maid';
  const roleLabel = role === 'maid' ? 'maid' : 'employer';

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [showConsent, setShowConsent] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const confirmPasswordRef = React.useRef(null);

  const firstName = name.trim().split(/\s+/)[0] || 'there';

  const validateCurrentStep = () => {
    setError('');

    if (step === 0 && name.trim().split(/\s+/).filter(Boolean).length < 2) {
      setError('Please enter your full name, including at least two names.');
      return false;
    }

    if (step === 1 && !/^\+?\d{9,15}$/.test(phone.replace(/[\s()-]/g, ''))) {
      setError('Enter a valid phone number, including country code, e.g. +254712345678.');
      return false;
    }

    if (step === 2 && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (step === 3) {
      if (password.length < 8) {
        setError('Your password must contain at least 8 characters.');
        return false;
      }
      if (password !== confirm) {
        setError('Your passwords do not match. Please check and try again.');
        return false;
      }
    }

    return true;
  };

  const continueStep = () => {
    Keyboard.dismiss();
    if (!validateCurrentStep()) return;

    if (step < 3) {
      setStep(current => current + 1);
      return;
    }

    setAccepted(false);
    setShowConsent(true);
  };

  const goBack = () => {
    Keyboard.dismiss();
    setError('');
    if (showConsent) {
      setShowConsent(false);
      return;
    }
    if (step > 0) {
      setStep(current => current - 1);
      return;
    }
    navigation.goBack();
  };

  const agreeAndContinue = async () => {
    if (!accepted || loading) return;

    setShowConsent(false);
    setLoading(true);

    let location = { source: 'manual' };
    try {
      // Ask for foreground location once consent is given; manual entry remains available.
      const detected = await detectCurrentLocation();
      if (detected) location = detected;
    } catch (e) {
      // Location is optional during signup. The profile form supports manual entry.
    } finally {
      setLoading(false);
    }

    navigation.navigate('VerificationChoice', {
      role,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      location,
      termsAccepted: true,
      termsVersion: 'v1',
      privacyAcknowledged: true,
      dataProtectionAcknowledged: true,
    });
  };

  const greetingTitle = [
    'Welcome to Maidora!',
    `Great, ${firstName}!`,
    'Lovely, thank you!',
    "You're almost there!",
  ][step];

  const subtitles = [
    `Let's set up your ${roleLabel} account. What are your full names as they appear on your ID?`,
    `Help us secure your account, ${firstName}. What's your phone number?`,
    `Thanks, ${firstName}! What email address should we use for your account?`,
    "Let's secure your account with a strong password. You'll use it to sign in to Maidora.",
  ];

  const renderStepField = () => {
    if (step === 0) {
      return (
        <TextField
          label="Full names"
          value={name}
          onChangeText={value => { setName(value); setError(''); }}
          placeholder="e.g. Mary Wanjiku Kamau"
          autoCapitalize="words"
          textContentType="name"
          autoComplete="name"
          returnKeyType="next"
          onSubmitEditing={continueStep}
          autoFocus
        />
      );
    }

    if (step === 1) {
      return (
        <TextField
          label="Phone number"
          value={phone}
          onChangeText={value => { setPhone(value); setError(''); }}
          placeholder="+254 7XX XXX XXX"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
          returnKeyType="next"
          onSubmitEditing={continueStep}
          autoFocus
        />
      );
    }

    if (step === 2) {
      return (
        <TextField
          label="Email address"
          value={email}
          onChangeText={value => { setEmail(value); setError(''); }}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
          autoComplete="email"
          returnKeyType="next"
          onSubmitEditing={continueStep}
          autoFocus
        />
      );
    }

    return (
      <View>
        <View style={styles.contactSummary}>
          <Text style={styles.summaryLabel}>YOUR ACCOUNT DETAILS</Text>
          <Text style={styles.summaryValue}>{phone}</Text>
          <Text style={styles.summaryValue}>{email}</Text>
        </View>
        <TextField
          label="Create password"
          value={password}
          onChangeText={value => { setPassword(value); setError(''); }}
          placeholder="At least 8 characters"
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current?.focus()}
          autoFocus
        />
        <TextField
          inputRef={confirmPasswordRef}
          label="Confirm password"
          value={confirm}
          onChangeText={value => { setConfirm(value); setError(''); }}
          placeholder="Enter your password again"
          secureTextEntry
          autoCapitalize="none"
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="done"
          onSubmitEditing={continueStep}
        />
        <Text style={styles.helper}>Use at least 8 characters. Avoid sharing your password with anyone.</Text>
      </View>
    );
  };

  return (
    <>
      <ScreenContainer contentStyle={styles.screenContent}>
        <View style={styles.progressHeader}>
          <Text style={styles.stepCount}>STEP {step + 1} OF 4</Text>
          <Text style={styles.stepName}>{STEPS[step]}</Text>
        </View>

        <View style={styles.progressTrack}>
          {STEPS.map((item, index) => (
            <View
              key={item}
              style={[styles.progressSegment, index <= step && styles.progressSegmentActive]}
            />
          ))}
        </View>

        <Heading title={greetingTitle} subtitle={subtitles[step]} />

        {renderStepField()}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          title={step === 3 ? 'Review and continue' : 'Continue'}
          onPress={continueStep}
          loading={loading}
        />
        <Button title="Back" secondary onPress={goBack} />
        <Text style={styles.footerNote}>Your details are used to create and secure your Maidora account.</Text>
      </ScreenContainer>

      <Modal
        visible={showConsent}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConsent(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackdrop} onPress={() => setShowConsent(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetEyebrow}>ONE LAST THING</Text>
            <Text style={styles.sheetTitle}>Your privacy matters</Text>
            <Text style={styles.sheetCopy}>
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
              <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
                {accepted ? <Text style={styles.checkmark}>✓</Text> : null}
              </View>
              <Text style={styles.consentText}>
                I agree to the Terms & Conditions and acknowledge the Privacy Policy and Data Protection Notice.
              </Text>
            </Pressable>

            <Button
              title="Agree and continue"
              onPress={agreeAndContinue}
              disabled={!accepted || loading}
              loading={loading}
            />
            <Button title="Not now" secondary onPress={() => setShowConsent(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  screenContent: { paddingBottom: 48 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepCount: { color: colors.forest, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  stepName: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  progressTrack: { flexDirection: 'row', gap: 6, marginTop: 12, marginBottom: 22 },
  progressSegment: { flex: 1, height: 4, borderRadius: 4, backgroundColor: colors.line },
  progressSegmentActive: { backgroundColor: colors.forest },
  contactSummary: {
    backgroundColor: colors.sageSoft,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  summaryLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1, marginBottom: 7 },
  summaryValue: { color: colors.ink, fontSize: 13, fontWeight: '700', marginTop: 3 },
  helper: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: -4 },
  error: { color: colors.danger, fontSize: 12, lineHeight: 18, marginTop: 2, marginBottom: 4 },
  footerNote: { color: colors.muted, fontSize: 11, lineHeight: 17, textAlign: 'center', marginTop: 18 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(10, 25, 18, 0.45)' },
  modalBackdrop: { flex: 1 },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 30,
  },
  sheetHandle: { width: 42, height: 5, borderRadius: 5, backgroundColor: colors.line, alignSelf: 'center', marginBottom: 20 },
  sheetEyebrow: { color: colors.forest, fontSize: 10, fontWeight: '900', letterSpacing: 1.2 },
  sheetTitle: { color: colors.ink, fontSize: 23, fontWeight: '900', marginTop: 7 },
  sheetCopy: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 10 },
  consentRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 11, marginTop: 20, marginBottom: 8 },
  checkbox: { width: 22, height: 22, borderWidth: 1.5, borderColor: colors.muted, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: colors.forest, borderColor: colors.forest },
  checkmark: { color: colors.white, fontSize: 14, fontWeight: '900' },
  consentText: { flex: 1, color: colors.ink, fontSize: 12, lineHeight: 19 },
});
