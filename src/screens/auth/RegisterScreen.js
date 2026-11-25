import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatBubble from '../../components/ChatBubble';
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
  const [isTyping, setIsTyping] = useState(false);
  // When editing from the summary, remember which field is being changed.
  const [editingIndex, setEditingIndex] = useState(null);
  const typingTimer = useRef(null);

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  const firstName = name.trim().split(/\s+/)[0] || 'there';

  const prompts = [
    `Welcome to Maidora! 👋 Let's set up your ${roleLabel} account. What are your full names as they appear on your ID?`,
    `Great, ${firstName}! 😊 Help us secure your account. What's your phone number?`,
    `Thanks, ${firstName}! What email address should we use for your account?`,
  ];

  useEffect(() => () => {
    if (typingTimer.current) clearTimeout(typingTimer.current);
  }, []);

  useEffect(() => {
    // Keep the newest message visible as the conversation grows.
    const frame = requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    return () => cancelAnimationFrame(frame);
  }, [stage, error, isTyping]);

  const validate = () => {
    const value = draft.trim();
    const activeStage = editingIndex !== null ? editingIndex : stage;

    if (activeStage === 0 && value.split(/\s+/).filter(Boolean).length < 2) {
      setError('Please enter your full names, including at least two names.');
      return false;
    }
    if (activeStage === 1 && !/^\+?\d{9,15}$/.test(value.replace(/[\s()-]/g, ''))) {
      setError('Please enter a valid phone number, e.g. +254712345678.');
      return false;
    }
    if (activeStage === 2 && !/^\S+@\S+\.\S+$/.test(value)) {
      setError('Please enter a valid email address.');
      return false;
    }

    setError('');
    return true;
  };

  const sendAnswer = () => {
    const activeStage = editingIndex !== null ? editingIndex : stage;
    if (activeStage >= 3 || !validate()) return;

    const updatedValue = draft.trim();
    if (activeStage === 0) setName(updatedValue);
    if (activeStage === 1) setPhone(updatedValue);
    if (activeStage === 2) setEmail(updatedValue);

    setDraft('');
    setError('');

    // Editing from the summary returns directly to that summary after Maidora replies.
    const wasEditing = editingIndex !== null;
    if (wasEditing) setEditingIndex(null);
    else setStage(current => current + 1);

    setIsTyping(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => {
      setIsTyping(false);
      if (!wasEditing && activeStage < 2) requestAnimationFrame(() => inputRef.current?.focus());
      else Keyboard.dismiss();
    }, 950);
  };

  const edit = index => {
    const values = [name, phone, email];
    setEditingIndex(index);
    setDraft(values[index]);
    setError('');
    requestAnimationFrame(() => inputRef.current?.focus());
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
    if (editingIndex !== null) {
      setEditingIndex(null);
      setDraft('');
    } else if (stage === 0) {
      navigation.goBack();
    } else {
      const previousStage = stage - 1;
      const savedValues = [name, phone, email];
      setDraft(savedValues[previousStage] || '');
      setStage(previousStage);
    }
    setError('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        // The composer moves up with the keyboard on iOS. Android uses adjustResize.
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.header}>
          <Pressable onPress={goBack} hitSlop={10} style={styles.backButton}>
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.brand}>maidora</Text>
            <Text style={styles.step}>ACCOUNT SETUP · CONTACT DETAILS</Text>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messageContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          <ChatBubble>{prompts[0]}</ChatBubble>

          {stage >= 1 ? <ChatBubble mine>{name}</ChatBubble> : null}
          {stage >= 1 && !isTyping ? <ChatBubble>{prompts[1]}</ChatBubble> : null}
          {stage >= 2 ? <ChatBubble mine>{phone}</ChatBubble> : null}
          {stage >= 2 && !isTyping ? <ChatBubble>{prompts[2]}</ChatBubble> : null}
          {stage >= 3 ? <ChatBubble mine>{email}</ChatBubble> : null}

          {isTyping ? <ChatBubble>Maidora is typing…</ChatBubble> : null}

          {stage === 3 && editingIndex === null && !isTyping ? (
            <View style={styles.reviewArea}>
              <ChatBubble>
                Almost there, {firstName}! 😊 Let's confirm we have the right details for your {roleLabel} account.
              </ChatBubble>

              <ChatBubble>
                Need to change anything? Just click edit and I'll take you back to it.
              </ChatBubble>

              <View style={styles.summaryBubble}>
                <SummaryLine label="Name" value={name} onEdit={() => edit(0)} />
                <SummaryLine label="Phone number" value={phone} onEdit={() => edit(1)} />
                <SummaryLine label="Email" value={email} onEdit={() => edit(2)} last />
              </View>

              <ChatBubble>Everything okay?</ChatBubble>

              <Pressable style={styles.continueButton} onPress={continueToPassword}>
                <Text style={styles.continueText}>Yes, continue</Text>
                <Text style={styles.continueArrow}>›</Text>
              </Pressable>
            </View>
          ) : null}

          {editingIndex !== null && !isTyping ? (
            <ChatBubble>Of course! Let's update your {['name', 'phone number', 'email'][editingIndex]}.</ChatBubble>
          ) : null}
        </ScrollView>

        {stage < 3 || editingIndex !== null ? (
          <View style={styles.composerArea}>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.composer}>
              <TextInput
                ref={inputRef}
                value={draft}
                editable={!isTyping}
                onChangeText={value => { setDraft(value); setError(''); }}
                placeholder={
                  (editingIndex !== null ? editingIndex : stage) === 0 ? 'Type your full names…' :
                  (editingIndex !== null ? editingIndex : stage) === 1 ? 'Type your phone number…' : 'Type your email address…'
                }
                placeholderTextColor="#8B9991"
                style={styles.input}
                keyboardType={(editingIndex !== null ? editingIndex : stage) === 1 ? 'phone-pad' : (editingIndex !== null ? editingIndex : stage) === 2 ? 'email-address' : 'default'}
                autoCapitalize={(editingIndex !== null ? editingIndex : stage) === 2 ? 'none' : 'words'}
                autoCorrect={(editingIndex !== null ? editingIndex : stage) !== 2}
                textContentType={(editingIndex !== null ? editingIndex : stage) === 0 ? 'name' : (editingIndex !== null ? editingIndex : stage) === 1 ? 'telephoneNumber' : 'emailAddress'}
                autoComplete={(editingIndex !== null ? editingIndex : stage) === 0 ? 'name' : (editingIndex !== null ? editingIndex : stage) === 1 ? 'tel' : 'email'}
                returnKeyType="send"
                blurOnSubmit={false}
                onSubmitEditing={sendAnswer}
                autoFocus
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Send answer"
                onPress={sendAnswer}
                disabled={!draft.trim() || isTyping}
                style={({ pressed }) => [
                  styles.sendButton,
                  !draft.trim() && styles.sendButtonDisabled,
                  pressed && draft.trim() ? styles.sendButtonPressed : null,
                ]}
              >
                <Text style={styles.sendText}>Send</Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SummaryLine({ label, value, onEdit, last }) {
  return (
    <View style={[styles.summaryLine, !last && styles.summaryLineBorder]}>
      <Text style={styles.summaryLabel}>{label}: </Text>
      <Text style={styles.summaryValue}>{value}</Text>
      <Pressable onPress={onEdit} hitSlop={8} accessibilityRole="button">
        <Text style={styles.inlineEdit}>(edit)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9F7' },
  flex: { flex: 1 },
  header: {
    minHeight: 66,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.sageSoft,
    marginRight: 11,
  },
  backArrow: { color: colors.forest, fontSize: 31, lineHeight: 34, marginTop: -4 },
  headerText: { flex: 1 },
  brand: { color: colors.forest, fontSize: 20, fontWeight: '900' },
  step: { color: colors.muted, fontSize: 9, fontWeight: '800', letterSpacing: 0.8, marginTop: 3 },
  messages: { flex: 1 },
  messageContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 22, paddingBottom: 18 },
  composerArea: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 4,
    paddingLeft: 12,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    minHeight: 46,
    paddingVertical: 9,
    paddingRight: 8,
    color: colors.ink,
    fontSize: 15,
  },
  sendButton: {
    minWidth: 48,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  sendButtonDisabled: { opacity: 0.4 },
  sendButtonPressed: { opacity: 0.6 },
  sendText: { color: colors.forest, fontSize: 15, fontWeight: '800' },
  error: { color: colors.danger, fontSize: 12, marginBottom: 7, marginLeft: 5 },
  reviewArea: { marginTop: 8 },
  summaryBubble: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.sageSoft,
    borderRadius: 18,
    borderBottomLeftRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 12,
  },
  summaryLine: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', paddingVertical: 9 },
  summaryLineBorder: { borderBottomWidth: 1, borderBottomColor: colors.line },
  summaryLabel: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  summaryValue: { color: colors.ink, fontSize: 13, flexShrink: 1 },
  inlineEdit: { color: colors.forest, fontSize: 12, fontWeight: '800', marginLeft: 6 },
  continueButton: {
    minHeight: 52,
    borderRadius: 15,
    backgroundColor: colors.forest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  continueText: { color: colors.white, fontSize: 15, fontWeight: '800' },
  continueArrow: { color: colors.white, fontSize: 23, marginLeft: 8, marginTop: -2 },
});
