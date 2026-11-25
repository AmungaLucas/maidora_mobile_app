import React, { useState } from 'react';
import { Text, Pressable, StyleSheet, View } from 'react-native';
import ScreenContainer, { Heading } from '../../components/ScreenContainer';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

const WORK_ARRANGEMENTS = ['Live-in', 'Live-out', 'Either'];
const EMPLOYER_TYPES = ['Individual / Household', 'Family', 'Company / Organisation'];

export default function ProfileSetupScreen({ navigation, route, role }) {
  const data = route.params || {};
  const initial = data.location || {};

  const [dob, setDob] = useState('');
  const [county, setCounty] = useState(initial.county || '');
  const [town, setTown] = useState(initial.town || '');
  const [area, setArea] = useState(initial.area || '');
  const [employerType, setEmployerType] = useState('Individual / Household');
  const [arrangement, setArrangement] = useState('Either');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');

  const isMaid = role === 'maid';

  const finish = () => {
    if (!county.trim() || !town.trim()) {
      setError('A county and town are required. You can enter them manually.');
      return;
    }

    if (isMaid && !dob.trim()) {
      setError('Please enter your date of birth.');
      return;
    }

    setError('');

    navigation.replace(isMaid ? 'MaidDashboard' : 'EmployerDashboard', {
      ...data,
      profileCompleted: true,
      profileLocation: {
        county,
        town,
        area,
        latitude: initial.latitude || null,
        longitude: initial.longitude || null,
        source: initial.source || 'manual',
      },
      dob,
      experience,
      arrangement,
      employerType,
      kycStatus: 'not_submitted',
    });
  };

  return (
    <ScreenContainer contentStyle={styles.content}>
      <Text style={styles.step}>
        {isMaid ? 'MAID' : 'EMPLOYER'} PROFILE · FINAL STEP
      </Text>

      <Heading
        title={isMaid ? 'A little about you' : 'Set up your hiring profile'}
        subtitle="Your location is prefilled when available. Please confirm it or enter it manually."
      />

      {isMaid ? (
        <View>
          <TextField
            label="Date of birth"
            value={dob}
            onChangeText={setDob}
            placeholder="DD/MM/YYYY"
          />
          <TextField
            label="Years of experience (optional)"
            value={experience}
            onChangeText={setExperience}
            placeholder="e.g. 2"
          />
        </View>
      ) : null}

      <View style={styles.locationHeader}>
        <Text style={styles.section}>Your marketplace location</Text>
        <Text style={styles.source}>
          {initial.source === 'gps' ? 'GPS detected' : 'Manual entry'}
        </Text>
      </View>

      <TextField label="County *" value={county} onChangeText={setCounty} placeholder="e.g. Nairobi" />
      <TextField label="Town *" value={town} onChangeText={setTown} placeholder="e.g. Embakasi" />
      <TextField label="Area / Neighbourhood" value={area} onChangeText={setArea} placeholder="e.g. Donholm" />

      {isMaid ? (
        <View>
          <Text style={styles.section}>Preferred work arrangement</Text>
          <View style={styles.row}>
            {WORK_ARRANGEMENTS.map(option => {
              const selected = arrangement === option;

              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => setArrangement(option)}
                  style={[styles.segment, selected && styles.active]}
                >
                  <Text style={[styles.choiceText, selected && styles.selectedChoiceText]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.section}>I am hiring as</Text>
          {EMPLOYER_TYPES.map(option => {
            const selected = employerType === option;

            return (
              <Pressable
                key={option}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setEmployerType(option)}
                style={[styles.option, selected && styles.active]}
              >
                <Text style={styles.choiceText}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Complete profile" onPress={finish} />

      <Text style={styles.note}>
        Identity verification (KYC) is optional. You can complete it later to receive your verified badge.
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 48 },
  step: {
    color: colors.forest,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 14,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  section: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
    marginTop: 8,
    marginBottom: 10,
  },
  source: { fontSize: 11, color: colors.success },
  row: { flexDirection: 'row', gap: 7, marginBottom: 14 },
  segment: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 11,
    alignItems: 'center',
  },
  option: {
    padding: 13,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 11,
    marginBottom: 8,
  },
  active: { borderColor: colors.forest, backgroundColor: colors.sage },
  choiceText: { color: colors.ink, fontWeight: '700' },
  selectedChoiceText: { color: colors.forest },
  error: { color: colors.danger, fontSize: 12, marginTop: 8 },
  note: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 14 },
});
