import React, { useState } from 'react';
import { Text, View, StyleSheet, Keyboard } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import ChatBubble from '../../components/ChatBubble';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

const QUESTIONS = ['Your full names', 'Your phone number', 'Your email address'];

export default function RegisterScreen({ navigation, route }) {
  const role = route.params?.role || 'maid';
  const roleLabel = role === 'maid' ? 'maid' : 'employer';

  const [stage, setStage] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');

  const firstName = name.trim().split(/\s+/)[0] || 'there';

  const prompts = [
    `Welcome to Maidora! 👋 Let's set up your ${roleLabel} account. What are your full names as they appear on your ID?`,
    `Great, ${firstName}! 😊 Help us secure your account. What's your phone number?`,
    `Thanks, ${firstName}! What email address should we use for your account?`,
  ];

  const currentValue = [name, phone, email][stage] || '';

  const validate = () => {
    const value = draft.trim();
    if (stage === 0 && value.split(/\s+/).filter(Boolean).length < 2) {
      setError('Please enter your full names, including at least two names.');
      return false;
    }
    if (stage === 1 && !/^\+?\d{9,15}$/.test(value.replace(/[\s()-]/g, ''))) {
      setError('Please enter a valid phone number, e.g. +254712345678.');
      return false;
    }
    if (stage === 2 && !/^\S+@\S+\.\S+$/.test(value)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const sendAnswer = () => {
    if (!validate()) return;
    Keyboard.dismiss();

    if (stage === 0) setName(draft.trim());
    if (stage === 1) setPhone(draft.trim());
    if (stage === 2) setEmail(draft.trim());

    setDraft('');
    setError('');
    setStage(current => current + 1);
  };

  const edit = index => {
    const values = [name, phone, email];
    setDraft(values[index]);
    setStage(index);
    setError('');
  };

  const continueToPassword = () => {
    navigation.navigate('PasswordSetup', {
      role,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
    });
  };

  const goBack = () => {
    Keyboard.dismiss();
    if (stage === 0) navigation.goBack();
    else if (stage === 3) setStage(2);
    else setStage(current => current - 1);
    setError('');
  };

  return (
    <ScreenContainer contentStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.brand}>maidora</Text>
        <Text style={styles.step}>ACCOUNT SETUP · CONTACT DETAILS</Text>
      </View>

      <ChatBubble>
        Welcome to Maidora! 👋 Let's set up your {roleLabel} account.
      </ChatBubble>

      {stage >= 1 ? <ChatBubble mine>{name}</ChatBubble> : null}
      {stage >= 1 ? (
        <ChatBubble>
          Great, {firstName}! 😊 Help us secure your account. What's your phone number?
        </ChatBubble>
      ) : null}
      {stage >= 2 ? <ChatBubble mine>{phone}</ChatBubble> : null}
      {stage >= 2 ? (
        <ChatBubble>
          Thanks, {firstName}! What email address should we use for your account?
        </ChatBubble>
      ) : null}
      {stage >= 3 ? <ChatBubble mine>{email}</ChatBubble> : null}

      {stage < 3 ? (
        <View style={styles.replyArea}>
          <ChatBubble>{prompts[stage]}</ChatBubble>
          <TextField
            label={QUESTIONS[stage]}
            value={draft}
            onChangeText={value => { setDraft(value); setError(''); }}
            placeholder={
              stage === 0 ? 'e.g. Amunga Lucas' :
              stage === 1 ? '+254 7XX XXX XXX' : 'you@example.com'
            }
            autoCapitalize={stage === 2 ? 'none' : 'words'}
            keyboardType={stage === 1 ? 'phone-pad' : stage === 2 ? 'email-address' : 'default'}
            textContentType={stage === 0 ? 'name' : stage === 1 ? 'telephoneNumber' : 'emailAddress'}
            autoComplete={stage === 0 ? 'name' : stage === 1 ? 'tel' : 'email'}
            returnKeyType="send"
            onSubmitEditing={sendAnswer}
            autoFocus
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Send" onPress={sendAnswer} disabled={!draft.trim()} />
        </View>
      ) : (
        <View style={styles.reviewArea}>
          <ChatBubble>
            Almost there, {firstName}! Let's confirm we have the right details for your {roleLabel} account.
          </ChatBubble>

          <View style={styles.reviewCard}>
            <ReviewRow label="Full name" value={name} onEdit={() => edit(0)} />
            <ReviewRow label="Phone number" value={phone} onEdit={() => edit(1)} />
            <ReviewRow label="Email address" value={email} onEdit={() => edit(2)} />
          </View>

          <Button title="Continue" onPress={continueToPassword} />
        </View>
      )}

      <Button title="Back" secondary onPress={goBack} />
    </ScreenContainer>
  );
}

function ReviewRow({ label, value, onEdit }) {
  return (
    <View style={styles.reviewRow}>
      <View style={styles.reviewText}>
        <Text style={styles.reviewLabel}>{label}</Text>
        <Text style={styles.reviewValue}>{value}</Text>
      </View>
      <Text onPress={onEdit} accessibilityRole="button" style={styles.edit}>Edit</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 40 },
  header: { marginBottom: 22 },
  brand: { color: colors.forest, fontSize: 25, fontWeight: '900' },
  step: { color: colors.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 5 },
  replyArea: { marginTop: 8 },
  reviewArea: { marginTop: 8 },
  reviewCard: { borderWidth: 1, borderColor: colors.line, borderRadius: 16, paddingHorizontal: 15, paddingVertical: 4, backgroundColor: colors.white, marginBottom: 8 },
  reviewRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.line },
  reviewText: { flex: 1 },
  reviewLabel: { color: colors.muted, fontSize: 11, fontWeight: '700' },
  reviewValue: { color: colors.ink, fontSize: 14, fontWeight: '700', marginTop: 4 },
  edit: { color: colors.forest, fontSize: 13, fontWeight: '900', padding: 8 },
  error: { color: colors.danger, fontSize: 12, marginTop: -5, marginBottom: 5 },
});
