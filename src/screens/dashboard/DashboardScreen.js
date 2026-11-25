import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import ScreenContainer, { Heading } from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { getLatestDeviceLocation } from '../../services/location';
import { colors } from '../../theme/colors';

export default function DashboardScreen({ route, navigation, role }) {
  const data = route.params || {};
  const maid = role === 'maid';
  const name = data.name || (maid ? 'Maidora member' : 'Employer');
  const [latestLocation, setLatestLocation] = useState(null);

  useEffect(() => {
    let active = true;
    getLatestDeviceLocation().then(value => { if (active) setLatestLocation(value); }).catch(() => {});
    return () => { active = false; };
  }, []);

  const openProfile = () => navigation.navigate(maid ? 'MaidProfile' : 'EmployerProfile', data);
  const actions = maid
    ? [['🔎', 'Browse jobs', true], ['📝', 'Apply for jobs', !!data.profileCompleted], ['💬', 'Messages', !!data.profileCompleted]]
    : [['👩🏾', 'Browse maids', true], ['＋', 'Post a job', !!data.profileCompleted], ['💬', 'Messages', !!data.profileCompleted]];

  const openAction = (label, enabled) => {
    if (!enabled) {
      navigation.navigate('ProfileRequired', { message: 'Complete your profile first to unlock this feature. Your welcome bonus will remain available.' });
      return;
    }
    navigation.navigate('BrowseInfo', { role, label, profileLocation: data.profileLocation });
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>MAIDORA · {maid ? 'MAID' : 'EMPLOYER'} ACCOUNT</Text>
          <Text style={styles.greeting}>Hello, {name.split(' ')[0]} 👋</Text>
          <Text style={styles.sub}>{maid ? 'Your next opportunity could be here.' : 'Let’s find the right help for your home.'}</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text></View>
      </View>

      {!data.profileCompleted && (
        <View style={styles.profileNotice}>
          <Text style={styles.noticeTitle}>Finish setting up your profile</Text>
          <Text style={styles.noticeCopy}>You can browse Maidora now. Complete your profile to apply for jobs, post jobs or start chats.</Text>
          <Pressable onPress={openProfile}><Text style={styles.noticeLink}>Complete my profile →</Text></Pressable>
        </View>
      )}

      <View style={styles.kyc}>
        <Text style={styles.kycTitle}>🛡️ Identity verification</Text>
        <Text style={styles.kycCopy}>KYC is optional. Complete it later to request your verified badge. It will not block browsing.</Text>
        <Pressable onPress={() => navigation.navigate('KycInfo')}><Text style={styles.kycLink}>Learn about verification →</Text></Pressable>
      </View>

      <View style={styles.bonus}>
        <Text style={styles.bonusTitle}>Welcome to Maidora</Text>
        <Text style={styles.bonusCopy}>{maid ? 'Browse available jobs. Your application allowance will be available when your profile is complete.' : 'Your welcome bonus is reserved. Complete your profile to unlock posting and chat.'}</Text>
      </View>

      <Heading title={maid ? 'Explore Maidora' : 'Discover domestic workers'} subtitle="Browsing is available now. Some actions unlock after profile completion." />
      {actions.map(([icon, label, enabled]) => (
        <Pressable key={label} onPress={() => openAction(label, enabled)} style={styles.action}>
          <Text style={styles.actionIcon}>{icon}</Text>
          <Text style={styles.actionText}>{label}</Text>
          {!enabled && <Text style={styles.lockText}>Profile required</Text>}
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      ))}
      <Pressable onPress={openProfile} style={styles.action}>
        <Text style={styles.actionIcon}>👤</Text>
        <Text style={styles.actionText}>{data.profileCompleted ? 'Edit my profile' : 'My profile'}</Text>
        <Text style={styles.arrow}>›</Text>
      </Pressable>

      <Text style={styles.location}>Marketplace location: {data.profileLocation?.area || data.profileLocation?.town || 'Confirm in profile setup'}{latestLocation ? ' · Device location refreshed' : ''}</Text>
      <Button title="Log out (demo)" secondary onPress={() => navigation.popToTop()} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerCopy: { flex: 1 },
  eyebrow: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  greeting: { fontSize: 27, fontWeight: '900', color: colors.ink, marginTop: 7 },
  sub: { color: colors.muted, fontSize: 12, marginTop: 4 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  avatarText: { color: colors.forest, fontSize: 20, fontWeight: '900' },
  profileNotice: { backgroundColor: colors.sageSoft, borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 16, marginBottom: 12 },
  noticeTitle: { fontWeight: '900', color: colors.ink, fontSize: 14 },
  noticeCopy: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 6 },
  noticeLink: { color: colors.forest, fontWeight: '900', fontSize: 12, marginTop: 10 },
  kyc: { backgroundColor: colors.warning, borderRadius: 16, padding: 16, marginBottom: 12 },
  kycTitle: { fontWeight: '900', color: colors.ink, fontSize: 14 },
  kycCopy: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 6 },
  kycLink: { color: colors.forest, fontWeight: '800', fontSize: 12, marginTop: 9 },
  bonus: { backgroundColor: colors.forestDark, borderRadius: 16, padding: 18, marginBottom: 18 },
  bonusTitle: { color: colors.white, fontSize: 18, fontWeight: '900' },
  bonusCopy: { color: '#E3EEE7', fontSize: 12, lineHeight: 18, marginTop: 6 },
  action: { flexDirection: 'row', alignItems: 'center', padding: 16, borderWidth: 1, borderColor: colors.line, borderRadius: 14, marginBottom: 9 },
  actionIcon: { fontSize: 22, marginRight: 13 },
  actionText: { flex: 1, color: colors.ink, fontWeight: '800' },
  lockText: { color: colors.muted, fontSize: 10, marginRight: 8 },
  arrow: { fontSize: 24, color: colors.forest },
  location: { color: colors.muted, fontSize: 11, marginTop: 12 },
});