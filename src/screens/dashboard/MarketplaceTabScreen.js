import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer, { Heading } from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

const content = {
  Jobs: { title: 'Find jobs', subtitle: 'Search opportunities and use filters to find work that suits you.', icon: '⌕', action: 'Your job search starts here.' },
  MyApplications: { title: 'My applications', subtitle: 'Keep track of jobs you have applied for and updates from employers.', icon: '▤', action: 'Your applications will appear here.' },
  MaidChat: { title: 'Messages', subtitle: 'Your conversations with employers will appear here.', icon: '☏', action: 'Your chats will appear here.' },
  FindMaids: { title: 'Find domestic workers', subtitle: 'Search worker profiles by location, experience, skills and availability.', icon: '⌕', action: 'Discover domestic workers.' },
  MyJobs: { title: 'My jobs', subtitle: 'Create job posts and manage applicants in one place.', icon: '▣', action: 'Your job posts will appear here.' },
  EmployerChat: { title: 'Messages', subtitle: 'Chat with applicants and workers after your profile is complete.', icon: '☏', action: 'Your chats will appear here.' },
  MaidProfileTab: { title: 'My profile', subtitle: 'Manage your worker profile, work preferences and identity verification.', icon: '◉', action: 'Keep your profile up to date.' },
  EmployerProfileTab: { title: 'My profile', subtitle: 'Manage your household details, marketplace location and account settings.', icon: '◉', action: 'Keep your hiring profile up to date.' },
};

export default function MarketplaceTabScreen({ route, navigation }) {
  const data = route.params || {};
  const role = data.role || 'maid';
  const maid = role === 'maid';
  const config = content[route.name] || { title: 'Maidora', subtitle: 'Your marketplace tools.', icon: '•', action: 'Coming soon.' };
  const requiresProfile = ['MyApplications', 'MaidChat', 'MyJobs', 'EmployerChat'].includes(route.name);
  const locked = requiresProfile && !data.profileCompleted;
  const openProfile = () => navigation.getParent()?.navigate(maid ? 'MaidProfile' : 'EmployerProfile', data);
  const isProfile = route.name === 'MaidProfileTab' || route.name === 'EmployerProfileTab';

  return (
    <ScreenContainer>
      <View style={styles.topIcon}><Text style={styles.icon}>{config.icon}</Text></View>
      <Heading title={config.title} subtitle={config.subtitle} />
      {locked ? (
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Complete your profile to unlock this feature</Text>
          <Text style={styles.copy}>You can browse the marketplace now. Complete your profile before applying, posting jobs or starting conversations.</Text>
          <Button title="Complete my profile" onPress={openProfile} />
        </View>
      ) : isProfile ? (
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>{data.name || 'Maidora member'}</Text>
          <Text style={styles.copy}>{data.email || 'Add your email address'}</Text>
          <Text style={styles.copy}>{data.phone || 'Add your phone number'}</Text>
          <Text style={styles.status}>{data.profileCompleted ? '✓ Profile completed' : 'Profile not completed'}</Text>
          <Text style={styles.copy}>Identity verification: {data.kycStatus === 'verified' ? 'Verified' : 'Not yet verified'}</Text>
          <Button title={data.profileCompleted ? 'Edit profile' : 'Complete profile'} onPress={openProfile} />
          <Button title="Identity verification" secondary onPress={() => navigation.getParent()?.getParent()?.navigate('KycInfo')} />
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>{config.action}</Text>
          <Text style={styles.copy}>This section is ready for the next marketplace development step. Real listings, applications and conversations will load when the backend is connected.</Text>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topIcon: { width: 58, height: 58, borderRadius: 18, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  icon: { color: colors.forest, fontSize: 29, fontWeight: '800' },
  notice: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.sageSoft, borderRadius: 16, padding: 16 },
  noticeTitle: { color: colors.ink, fontWeight: '900', fontSize: 15 },
  copy: { color: colors.muted, fontSize: 13, lineHeight: 20, marginTop: 8 },
  empty: { borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 18 },
  emptyTitle: { color: colors.ink, fontWeight: '900', fontSize: 15 },
  panel: { borderWidth: 1, borderColor: colors.line, borderRadius: 16, padding: 18 },
  panelTitle: { color: colors.ink, fontWeight: '900', fontSize: 19 },
  status: { color: colors.success, fontSize: 12, fontWeight: '800', marginTop: 12 },
});
