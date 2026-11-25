import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import ScreenContainer, { Heading } from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

const content = {
  Jobs: { title: 'Find jobs', subtitle: 'Search opportunities and use filters to find work that suits you.', icon: '⌕', action: 'Browse job opportunities' },
  MyApplications: { title: 'My applications', subtitle: 'Keep track of jobs you have applied for and updates from employers.', icon: '▤', action: 'Your applications will appear here' },
  MaidChat: { title: 'Messages', subtitle: 'Your conversations with employers will appear here.', icon: '☏', action: 'Your chats will appear here' },
  FindMaids: { title: 'Find domestic workers', subtitle: 'Search worker profiles by location, experience, skills and availability.', icon: '⌕', action: 'Browse worker profiles' },
  MyJobs: { title: 'My jobs', subtitle: 'Create job posts and manage applicants in one place.', icon: '▣', action: 'Manage your job posts' },
  EmployerChat: { title: 'Messages', subtitle: 'Chat with applicants and workers after your profile is complete.', icon: '☏', action: 'Your chats will appear here' },
};

export default function MarketplaceTabScreen({ route, navigation, role }) {
  const data = route.params || {};
  const config = content[route.name] || { title: 'Maidora', subtitle: 'Your marketplace tools.', icon: '•', action: 'Coming soon' };
  const maid = role === 'maid';
  const requiresProfile = ['MyApplications', 'MaidChat', 'MyJobs', 'EmployerChat'].includes(route.name);
  const locked = requiresProfile && !data.profileCompleted;
  const openProfile = () => navigation.getParent()?.navigate(maid ? 'MaidProfile' : 'EmployerProfile', data);

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
});
