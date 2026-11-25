import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import { colors } from '../../theme/colors';

const maidJobs = [
  { id: 'j1', title: 'House Manager', employer: 'Private household', location: 'Kilimani, Nairobi', pay: 'KSh 18,000 / month', tag: 'Live-out', featured: true },
  { id: 'j2', title: 'Nanny', employer: 'Family household', location: 'South B, Nairobi', pay: 'KSh 15,000 / month', tag: 'Live-in' },
  { id: 'j3', title: 'Home Cleaner', employer: 'Private household', location: 'Donholm, Nairobi', pay: 'KSh 1,000 / day', tag: 'Part-time' },
];

const maidProfiles = [
  { id: 'm1', name: 'Mary Wanjiku', role: 'Housekeeping · 4 years', location: 'Donholm, Nairobi', badge: 'Identity verified' },
  { id: 'm2', name: 'Grace Achieng', role: 'Nanny · 3 years', location: 'Umoja, Nairobi', badge: 'Identity verified' },
  { id: 'm3', name: 'Jane Njeri', role: 'Cook · 5 years', location: 'Embakasi, Nairobi', badge: 'Available' },
];

function SectionTitle({ title, action, onPress }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {!!action && <Pressable onPress={onPress}><Text style={styles.seeAll}>{action}</Text></Pressable>}
    </View>
  );
}

function JobCard({ item, horizontal, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.jobCard, horizontal && styles.horizontalCard]}>
      <View style={styles.cardTop}>
        <View style={styles.cardIcon}><Text style={styles.cardIconText}>⌂</Text></View>
        <View style={styles.flex}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSub}>{item.employer}</Text>
        </View>
        {item.featured && <Text style={styles.featuredTag}>FEATURED</Text>}
      </View>
      <Text style={styles.cardMeta}>⌖  {item.location}</Text>
      <Text style={styles.pay}>{item.pay}</Text>
      <View style={styles.cardFooter}><Text style={styles.pill}>{item.tag}</Text><Text style={styles.cardLink}>View job →</Text></View>
    </Pressable>
  );
}

function MaidCard({ item, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.maidCard}>
      <View style={styles.personAvatar}><Text style={styles.personInitial}>{item.name.charAt(0)}</Text></View>
      <View style={styles.flex}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSub}>{item.role}</Text>
        <Text style={styles.cardMeta}>⌖  {item.location}</Text>
        <Text style={styles.verified}>✓ {item.badge}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

function getKycMessage(status) {
  switch (status) {
    case 'verified':
      return { title: 'Identity verified', copy: 'Your identity checks are complete. Your verified badge can help build trust.', action: 'View verification status' };
    case 'pending':
      return { title: 'Verification in review', copy: 'Your KYC submission is being reviewed. You can continue using the marketplace while you wait.', action: 'View verification status' };
    case 'rejected':
      return { title: 'Verification needs attention', copy: 'Your KYC submission was not approved. Review the feedback and next steps.', action: 'Review verification' };
    case 'resubmission_required':
      return { title: 'More information needed', copy: 'Please review the KYC feedback and submit the requested information when ready.', action: 'Update verification' };
    default:
      return { title: 'Identity verification', copy: 'KYC is optional. Complete it when you are ready to request your verified badge. It never blocks browsing.', action: 'Learn about verification' };
  }
}

export default function MarketplaceHomeScreen({ route, navigation, role }) {
  const data = route.params || {};
  const activeRole = data.role || role || 'maid';
  const maid = activeRole === 'maid';
  const firstName = (data.name || (maid ? 'Maidora member' : 'Maidora member')).split(' ')[0];
  const location = data.profileLocation?.area || data.profileLocation?.town || 'Set your marketplace location';
  const profileReady = !!data.profileCompleted;
  const kyc = getKycMessage(data.kycStatus);
  const openTab = name => navigation.navigate(name);
  const lockedAction = label => {
    if (!profileReady) {
      navigation.getParent()?.navigate('ProfileRequired', { message: 'Complete your profile first to unlock this feature. You can keep browsing in the meantime.' });
      return;
    }
    navigation.navigate(maid ? 'Jobs' : 'FindMaids');
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.flex}>
          <Text style={styles.eyebrow}>MAIDORA · {maid ? 'MAID' : 'EMPLOYER'}</Text>
          <Text style={styles.greeting}>Hello, {firstName} 👋</Text>
          <Text style={styles.subtitle}>{maid ? 'Your next opportunity could be closer than you think.' : 'Let’s find the right help for your home.'}</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text></View>
      </View>

      <Pressable style={styles.locationBar} onPress={() => navigation.navigate(maid ? 'MaidProfile' : 'EmployerProfile', data)}>
        <Text style={styles.locationPin}>⌖</Text>
        <View style={styles.flex}><Text style={styles.locationLabel}>YOUR AREA</Text><Text style={styles.locationValue}>{location}</Text></View>
        <Text style={styles.change}>Change</Text>
      </Pressable>

      {!profileReady && (
        <Pressable style={styles.profileNotice} onPress={() => navigation.getParent()?.navigate(maid ? 'MaidProfile' : 'EmployerProfile', data)}>
          <Text style={styles.noticeTitle}>Complete your profile</Text>
          <Text style={styles.noticeCopy}>You can browse now. Finish your profile to unlock {maid ? 'applications and chat' : 'job posting and chat'}.</Text>
          <Text style={styles.noticeLink}>Continue setup →</Text>
        </Pressable>
      )}

      <View style={styles.kycNotice}>
        <Text style={styles.kycTitle}>{kyc.title}</Text>
        <Text style={styles.noticeCopy}>{kyc.copy}</Text>
        <Pressable onPress={() => navigation.getParent()?.navigate('KycInfo', { kycStatus: data.kycStatus || 'not_submitted' })}>
          <Text style={styles.noticeLink}>{kyc.action} →</Text>
        </Pressable>
      </View>

      {!profileReady && (
        <View style={styles.bonusNotice}>
          <Text style={styles.bonusTitle}>Your welcome bonus is reserved</Text>
          <Text style={styles.bonusCopy}>
            {maid
              ? 'Complete your profile to unlock your welcome application allowance. You can explore jobs in the meantime.'
              : 'Complete your profile to unlock your welcome bonus and start posting jobs. You can browse worker profiles in the meantime.'}
          </Text>
        </View>
      )}

      <Text style={styles.demoDisclaimer}>Illustrative demo listings · Live marketplace data will appear when the backend is connected.</Text>

      {maid ? (
        <>
          <SectionTitle title="Featured jobs" action="See all" onPress={() => openTab('Jobs')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {maidJobs.filter(job => job.featured).concat(maidJobs.slice(1, 2)).map(job => <JobCard key={job.id} item={job} horizontal onPress={() => lockedAction('job')} />)}
          </ScrollView>
          <SectionTitle title="Jobs near you" action="View all" onPress={() => openTab('Jobs')} />
          <Text style={styles.sectionHint}>Opportunities around {location}.</Text>
          {maidJobs.slice(1).map(job => <JobCard key={job.id} item={job} onPress={() => lockedAction('job')} />)}
          <SectionTitle title="Recently posted" action="Browse jobs" onPress={() => openTab('Jobs')} />
          {maidJobs.map(job => <JobCard key={'recent-' + job.id} item={job} onPress={() => lockedAction('job')} />)}
          <SectionTitle title="Explore job categories" />
          <View style={styles.categories}>
            {['House help', 'Nanny', 'Cook', 'Cleaner', 'House manager', 'Elder care'].map(category => <Pressable key={category} style={styles.category} onPress={() => openTab('Jobs')}><Text style={styles.categoryText}>{category}</Text></Pressable>)}
          </View>
        </>
      ) : (
        <>
          <Pressable style={styles.postBanner} onPress={() => profileReady ? openTab('MyJobs') : lockedAction('post')}>
            <Text style={styles.postTitle}>Looking for domestic help?</Text>
            <Text style={styles.postCopy}>Create a job post and let suitable workers find you.</Text>
            <Text style={styles.postLink}>Post a job →</Text>
          </Pressable>
          <SectionTitle title="Verified maids" action="See all" onPress={() => openTab('FindMaids')} />
          <Text style={styles.sectionHint}>Browse workers whose identity checks have been completed.</Text>
          {maidProfiles.filter(person => person.badge === 'Identity verified').map(person => <MaidCard key={person.id} item={person} onPress={() => openTab('FindMaids')} />)}
          <SectionTitle title="Featured maids" action="Explore" onPress={() => openTab('FindMaids')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {maidProfiles.map(person => <Pressable key={person.id} style={styles.featuredPerson} onPress={() => openTab('FindMaids')}><View style={styles.largeAvatar}><Text style={styles.largeAvatarText}>{person.name.charAt(0)}</Text></View><Text style={styles.cardTitle}>{person.name}</Text><Text style={styles.cardSub}>{person.role}</Text><Text style={styles.verified}>✓ {person.badge}</Text></Pressable>)}
          </ScrollView>
          <SectionTitle title="Maids near you" action="View all" onPress={() => openTab('FindMaids')} />
          <Text style={styles.sectionHint}>Discover workers around {location}.</Text>
          {maidProfiles.map(person => <MaidCard key={'near-' + person.id} item={person} onPress={() => openTab('FindMaids')} />)}
          <SectionTitle title="Recently active" action="Find maids" onPress={() => openTab('FindMaids')} />
          <Text style={styles.sectionHint}>Profiles that have recently been updated will appear here.</Text>
        </>
      )}
      <View style={styles.bottomSpace} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  eyebrow: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  greeting: { color: colors.ink, fontSize: 26, fontWeight: '900', marginTop: 6 },
  subtitle: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 4, maxWidth: 270 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  avatarText: { color: colors.forest, fontWeight: '900', fontSize: 20 },
  locationBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.sageSoft, borderRadius: 13, padding: 13, marginBottom: 14, gap: 10 },
  locationPin: { color: colors.forest, fontSize: 22 },
  locationLabel: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  locationValue: { color: colors.ink, fontSize: 13, fontWeight: '700', marginTop: 3 },
  change: { color: colors.forest, fontSize: 12, fontWeight: '800' },
  profileNotice: { backgroundColor: '#F1F7F1', borderColor: colors.line, borderWidth: 1, borderRadius: 15, padding: 15, marginBottom: 12 },
  noticeTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  noticeCopy: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: 5 },
  noticeLink: { color: colors.forest, fontSize: 12, fontWeight: '900', marginTop: 9 },
  kycNotice: { backgroundColor: colors.warning, borderRadius: 15, padding: 15, marginBottom: 20 },
  kycTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  bonusNotice: { backgroundColor: colors.forestDark, borderRadius: 15, padding: 15, marginBottom: 16 },
  bonusTitle: { color: colors.white, fontSize: 14, fontWeight: '900' },
  bonusCopy: { color: '#E3EEE7', fontSize: 12, lineHeight: 18, marginTop: 6 },
  demoDisclaimer: { color: colors.muted, fontSize: 10, lineHeight: 15, marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 10 },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '900' },
  seeAll: { color: colors.forest, fontSize: 12, fontWeight: '800' },
  sectionHint: { color: colors.muted, fontSize: 12, lineHeight: 18, marginTop: -4, marginBottom: 10 },
  horizontalList: { paddingBottom: 8, paddingRight: 8 },
  jobCard: { borderWidth: 1, borderColor: colors.line, borderRadius: 15, padding: 14, marginBottom: 10, backgroundColor: colors.white },
  horizontalCard: { width: 285, marginRight: 10, marginBottom: 0 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  cardIconText: { color: colors.forest, fontSize: 23, fontWeight: '900' },
  cardTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  cardSub: { color: colors.muted, fontSize: 11, marginTop: 3 },
  featuredTag: { color: colors.gold, fontSize: 9, fontWeight: '900' },
  cardMeta: { color: colors.muted, fontSize: 11, marginTop: 11 },
  pay: { color: colors.forest, fontSize: 14, fontWeight: '900', marginTop: 8 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  pill: { overflow: 'hidden', backgroundColor: colors.sageSoft, color: colors.forest, fontSize: 10, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 20 },
  cardLink: { color: colors.forest, fontSize: 11, fontWeight: '800' },
  postBanner: { backgroundColor: colors.forestDark, borderRadius: 16, padding: 18, marginBottom: 18 },
  postTitle: { color: colors.white, fontSize: 17, fontWeight: '900' },
  postCopy: { color: '#E3EEE7', fontSize: 12, lineHeight: 18, marginTop: 5 },
  postLink: { color: '#FFFFFF', fontSize: 12, fontWeight: '900', marginTop: 11 },
  maidCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 14, padding: 12, marginBottom: 9, gap: 11 },
  personAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  personInitial: { color: colors.forest, fontWeight: '900', fontSize: 19 },
  verified: { color: colors.success, fontSize: 10, fontWeight: '800', marginTop: 5 },
  arrow: { color: colors.forest, fontSize: 24 },
  featuredPerson: { width: 180, borderWidth: 1, borderColor: colors.line, borderRadius: 15, padding: 13, marginRight: 10 },
  largeAvatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  largeAvatarText: { color: colors.forest, fontSize: 22, fontWeight: '900' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  category: { borderWidth: 1, borderColor: colors.line, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 9 },
  categoryText: { color: colors.ink, fontSize: 11, fontWeight: '700' },
  bottomSpace: { height: 16 },
});
