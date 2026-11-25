import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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

const maidCategories = [
  { label: 'House help', icon: 'home-outline' },
  { label: 'Nanny', icon: 'baby-face-outline' },
  { label: 'Cooking', icon: 'chef-hat' },
  { label: 'Cleaning', icon: 'spray-bottle' },
  { label: 'Elder care', icon: 'hand-heart-outline' },
];

const employerCategories = [
  { label: 'House help', icon: 'home-outline' },
  { label: 'Nanny', icon: 'baby-face-outline' },
  { label: 'Cook', icon: 'chef-hat' },
  { label: 'Cleaner', icon: 'spray-bottle' },
  { label: 'Caregiver', icon: 'hand-heart-outline' },
];

function SectionHeading({ title, action, onPress }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {!!action && <Pressable onPress={onPress} hitSlop={8}><Text style={styles.sectionAction}>{action}</Text></Pressable>}
    </View>
  );
}

function JobRow({ item, onPress }) {
  return (
    <Pressable style={styles.jobRow} onPress={onPress}>
      <View style={styles.listingIcon}><MaterialCommunityIcons name="briefcase-outline" size={21} color={colors.forest} /></View>
      <View style={styles.listingBody}>
        <Text style={styles.listingTitle}>{item.title}</Text>
        <Text style={styles.listingSubtitle}>{item.employer} · {item.location}</Text>
        <View style={styles.listingBottom}>
          <Text style={styles.listingPrice}>{item.pay}</Text>
          <Text style={styles.listingTag}>{item.tag}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={21} color={colors.muted} />
    </Pressable>
  );
}

function WorkerRow({ item, onPress }) {
  return (
    <Pressable style={styles.workerRow} onPress={onPress}>
      <View style={styles.workerAvatar}><Text style={styles.workerInitial}>{item.name.charAt(0)}</Text></View>
      <View style={styles.listingBody}>
        <View style={styles.nameLine}>
          <Text style={styles.listingTitle}>{item.name}</Text>
          {item.badge === 'Identity verified' && <MaterialCommunityIcons name="check-decagram" size={15} color={colors.success} />}
        </View>
        <Text style={styles.listingSubtitle}>{item.role}</Text>
        <Text style={styles.listingLocation}><MaterialCommunityIcons name="map-marker-outline" size={12} /> {item.location}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={21} color={colors.muted} />
    </Pressable>
  );
}

function CategoryShortcut({ item, onPress }) {
  return (
    <Pressable style={styles.categoryItem} onPress={onPress}>
      <View style={styles.categoryIcon}><MaterialCommunityIcons name={item.icon} size={22} color={colors.forest} /></View>
      <Text style={styles.categoryLabel}>{item.label}</Text>
    </Pressable>
  );
}

function getKycMessage(status) {
  switch (status) {
    case 'verified': return 'Your identity is verified';
    case 'pending': return 'Your identity check is being reviewed';
    case 'rejected': return 'Your identity check needs attention';
    case 'resubmission_required': return 'More information is needed for verification';
    default: return 'Get your identity verified to build trust';
  }
}

export default function MarketplaceHomeScreen({ route, navigation, role }) {
  const data = route.params || {};
  const activeRole = data.role || role || 'maid';
  const maid = activeRole === 'maid';
  const firstName = (data.name || 'there').split(' ')[0];
  const location = [data.profileLocation?.area, data.profileLocation?.town, data.profileLocation?.county]
    .filter(Boolean).join(', ') || 'Location not set';
  const profileReady = !!data.profileCompleted;
  const openTab = name => navigation.navigate(name);
  const browseTab = maid ? 'Jobs' : 'FindMaids';
  const lockedAction = () => {
    if (!profileReady) {
      navigation.getParent()?.navigate('ProfileRequired', {
        message: 'Complete your profile first to unlock this feature. You can keep browsing in the meantime.',
      });
      return;
    }
    openTab(browseTab);
  };
  const categories = maid ? maidCategories : employerCategories;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>MAIDORA</Text>
          <Text style={styles.greeting}>Good day, {firstName}.</Text>
          <View style={styles.locationLine}>
            <MaterialCommunityIcons name="map-marker-outline" size={15} color={colors.forest} />
            <Text numberOfLines={1} style={styles.locationText}>{location}</Text>
            <Pressable onPress={() => navigation.getParent()?.navigate(maid ? 'MaidProfile' : 'EmployerProfile', data)} hitSlop={8}>
              <Text style={styles.changeText}>Change</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text></View>
      </View>

      <Pressable style={styles.searchBar} onPress={() => openTab(browseTab)}>
        <MaterialCommunityIcons name="magnify" size={22} color={colors.muted} />
        <Text style={styles.searchPlaceholder}>{maid ? 'Search jobs, skills or locations' : 'Search workers, skills or locations'}</Text>
        <MaterialCommunityIcons name="tune-variant" size={19} color={colors.forest} />
      </Pressable>

      {!profileReady && (
        <Pressable style={styles.profilePrompt} onPress={() => navigation.getParent()?.navigate(maid ? 'MaidProfile' : 'EmployerProfile', data)}>
          <MaterialCommunityIcons name="account-check-outline" size={19} color={colors.forest} />
          <View style={styles.profilePromptBody}>
            <Text style={styles.profilePromptTitle}>Finish setting up your profile</Text>
            <Text style={styles.profilePromptCopy}>Complete it to unlock {maid ? 'applications and chat' : 'job posting and chat'}.</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={20} color={colors.forest} />
        </Pressable>
      )}

      <SectionHeading title="Explore categories" action="See all" onPress={() => openTab(browseTab)} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
        {categories.map(item => <CategoryShortcut key={item.label} item={item} onPress={() => openTab(browseTab)} />)}
      </ScrollView>

      <View style={styles.featureBanner}>
        <View style={styles.featureCopy}>
          <Text style={styles.featureEyebrow}>{maid ? 'YOUR NEXT OPPORTUNITY' : 'FIND THE RIGHT HELP'}</Text>
          <Text style={styles.featureTitle}>{maid ? 'A better opportunity starts here.' : 'The right help makes all the difference.'}</Text>
          <Text style={styles.featureSubtitle}>{maid ? 'Explore work that fits your skills and schedule.' : 'Discover trusted domestic workers around you.'}</Text>
          <Pressable style={styles.featureButton} onPress={() => openTab(browseTab)}>
            <Text style={styles.featureButtonText}>{maid ? 'Explore jobs' : 'Find workers'}</Text>
            <MaterialCommunityIcons name="arrow-right" size={16} color={colors.forestDark} />
          </Pressable>
        </View>
        <View style={styles.featureDecoration}><MaterialCommunityIcons name={maid ? 'briefcase-heart-outline' : 'account-heart-outline'} size={68} color="#D7E4D8" /></View>
      </View>

      <View style={styles.sectionIntro}>
        <SectionHeading title={maid ? 'Opportunities near you' : 'Workers near you'} action="View all" onPress={() => openTab(browseTab)} />
        <Text style={styles.sectionSubtitle}>Discover {maid ? 'jobs' : 'people'} around {location}.</Text>
      </View>

      {maid ? (
        maidJobs.map(item => <JobRow key={item.id} item={item} onPress={lockedAction} />)
      ) : (
        maidProfiles.map(item => <WorkerRow key={item.id} item={item} onPress={lockedAction} />)
      )}

      {!profileReady && (
        <View style={styles.bonusLine}>
          <MaterialCommunityIcons name="gift-outline" size={17} color={colors.gold} />
          <Text style={styles.bonusText}>Your welcome bonus is reserved until your profile is complete.</Text>
        </View>
      )}

      <Pressable style={styles.verificationLine} onPress={() => navigation.getParent()?.navigate('KycInfo', { kycStatus: data.kycStatus || 'not_submitted' })}>
        <MaterialCommunityIcons name="shield-check-outline" size={18} color={colors.forest} />
        <Text style={styles.verificationText}>{getKycMessage(data.kycStatus)}</Text>
        <MaterialCommunityIcons name="chevron-right" size={19} color={colors.muted} />
      </Pressable>

      <Text style={styles.demoDisclaimer}>Demo listings for preview · Live marketplace results will appear when connected.</Text>
      <View style={styles.bottomSpace} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 6, paddingBottom: 17 },
  headerText: { flex: 1, minWidth: 0 },
  eyebrow: { color: colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 2 },
  greeting: { color: colors.ink, fontSize: 27, fontWeight: '800', letterSpacing: -0.7, marginTop: 5 },
  locationLine: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 5 },
  locationText: { color: colors.forest, fontSize: 12, fontWeight: '700', flexShrink: 1 },
  changeText: { color: colors.forest, fontSize: 11, fontWeight: '900', paddingLeft: 4 },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  avatarText: { color: colors.forest, fontSize: 19, fontWeight: '900' },
  searchBar: { height: 50, borderRadius: 13, borderWidth: 1, borderColor: colors.line, backgroundColor: '#FAFBF9', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 10 },
  searchPlaceholder: { color: colors.muted, fontSize: 12, flex: 1 },
  profilePrompt: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.sageSoft, paddingHorizontal: 12, paddingVertical: 11, borderRadius: 11, marginTop: 14 },
  profilePromptBody: { flex: 1 },
  profilePromptTitle: { color: colors.ink, fontSize: 12, fontWeight: '800' },
  profilePromptCopy: { color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 2 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 23, marginBottom: 11 },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  sectionAction: { color: colors.forest, fontSize: 11, fontWeight: '800' },
  categoryList: { paddingRight: 4, gap: 17, paddingBottom: 2 },
  categoryItem: { width: 66, alignItems: 'center' },
  categoryIcon: { width: 49, height: 49, borderRadius: 17, backgroundColor: colors.sageSoft, alignItems: 'center', justifyContent: 'center' },
  categoryLabel: { color: colors.ink, fontSize: 10, fontWeight: '700', textAlign: 'center', marginTop: 7 },
  featureBanner: { flexDirection: 'row', backgroundColor: colors.forestDark, borderRadius: 17, padding: 17, marginTop: 23, minHeight: 177, overflow: 'hidden' },
  featureCopy: { flex: 1, zIndex: 1 },
  featureEyebrow: { color: '#C9D9C9', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  featureTitle: { color: colors.white, fontSize: 19, fontWeight: '800', lineHeight: 24, marginTop: 8, maxWidth: 225 },
  featureSubtitle: { color: '#D9E5DC', fontSize: 11, lineHeight: 16, marginTop: 5, maxWidth: 220 },
  featureButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#E7EFE6', borderRadius: 8, paddingHorizontal: 11, paddingVertical: 8, marginTop: 12 },
  featureButtonText: { color: colors.forestDark, fontSize: 10, fontWeight: '900' },
  featureDecoration: { position: 'absolute', right: -8, bottom: 7, opacity: 0.65 },
  sectionIntro: { marginTop: 1 },
  sectionSubtitle: { color: colors.muted, fontSize: 11, marginTop: -7, marginBottom: 5 },
  jobRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 11 },
  listingIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: colors.sageSoft, alignItems: 'center', justifyContent: 'center' },
  listingBody: { flex: 1, minWidth: 0 },
  listingTitle: { color: colors.ink, fontSize: 13, fontWeight: '800' },
  listingSubtitle: { color: colors.muted, fontSize: 10, marginTop: 4 },
  listingBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 7, flexWrap: 'wrap', gap: 5 },
  listingPrice: { color: colors.forest, fontSize: 11, fontWeight: '900' },
  listingTag: { color: colors.muted, fontSize: 9, backgroundColor: colors.sageSoft, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, overflow: 'hidden' },
  workerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 11 },
  workerAvatar: { width: 45, height: 45, borderRadius: 23, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  workerInitial: { color: colors.forest, fontSize: 18, fontWeight: '900' },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  listingLocation: { color: colors.muted, fontSize: 10, marginTop: 4 },
  bonusLine: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 13, marginTop: 8 },
  bonusText: { color: colors.muted, fontSize: 10, flex: 1, lineHeight: 15 },
  verificationLine: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderTopColor: colors.line, paddingVertical: 13, marginTop: 5 },
  verificationText: { color: colors.forest, fontSize: 10, fontWeight: '700', flex: 1 },
  demoDisclaimer: { color: colors.muted, fontSize: 9, lineHeight: 14, marginTop: 4 },
  bottomSpace: { height: 16 },
});
