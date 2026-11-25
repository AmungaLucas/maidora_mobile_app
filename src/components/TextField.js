import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
  returnKeyType = 'next',
  onSubmitEditing,
  autoFocus = false,
  textContentType,
  autoComplete,
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor="#9AA69E"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
        textContentType={textContentType}
        autoComplete={autoComplete}
        blurOnSubmit={false}
        style={[styles.input, !editable && styles.readOnly]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 15 },
  label: { color: colors.ink, fontSize: 13, fontWeight: '700', marginBottom: 7 },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 13,
    paddingHorizontal: 14,
    color: colors.ink,
    backgroundColor: colors.white,
    fontSize: 14,
  },
  readOnly: { backgroundColor: colors.sageSoft },
});
