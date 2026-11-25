import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform, StatusBar
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

const C = {
  purple: '#6B35A5',
  deep: '#482071',
  light: '#F5EFFB',
  orange: '#F59A38',
  ink: '#241B2D',
  muted: '#827889',
  line: '#E8E1ED',
  white: '#FFFFFF',
  green: '#16834A',
  paleGreen: '#E8F6EE',
};

function Button({ title, onPress, secondary = false, disabled = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, secondary && styles.buttonSecondary, disabled && { opacity: 0.5 }]}
    >
      <Text style={[styles.buttonText, secondary && styles.buttonSecondaryText]}>{title}</Text>
    </Pressable>
  );
}

function Field({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, autoCapitalize = 'sentences' }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor="#A99EAF"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize}
        style={styles.input}
      />
    </View>
  );
}

function Screen({ children, scroll = true }) {
  const content = <View style={styles.screenContent}>{children}</View>;
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />
      {scroll ? <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

function Brand({ small = false }) {
  return (
    <View style={styles.brand}>
      <View style={styles.brandMark}><Text style={styles.brandMarkText}>M</Text></View>
      <Text style={[styles.brandName, small && { fontSize: 25 }]}>maidora</Text>
      <Text style={styles.tagline}>Find. Hire. Thrive.</Text>
    </View>
  );
}

function Heading({ title, subtitle }) {
  return (
    <View style={styles.heading}>
      <Text style={styles.headingTitle}>{title}</Text>
      {!!subtitle && <Text style={styles.headingSubtitle}>{subtitle}</Text>}
    </View>
  );
}


function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Welcome'), 1400);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />
      <View style={styles.brandMark}><Text style={styles.brandMarkText}>M</Text></View>
      <Text style={styles.brandName}>maidora</Text>
      <Text style={styles.tagline}>Find. Hire. Thrive.</Text>
      <Text style={{ color: C.muted, fontSize: 11, marginTop: 42 }}>A smarter way to connect.</Text>
    </SafeAreaView>
  );
}

function WelcomeScreen({ navigation }) {
  return (
    <Screen>
      <View style={styles.welcomeHero}>
        <Brand />
        <View style={styles.heroCircle}><Text style={styles.heroEmoji}>🤝🏾</Text></View>
        <Text style={styles.heroTitle}>A better way to{ '\n' }find the right fit.</Text>
        <Text style={styles.heroCopy}>Connecting Kenyan households with domestic workers and helping people discover meaningful work.</Text>
      </View>
      <Button title="Get started" onPress={() => navigation.navigate('RoleSelection')} />
      <Button title="I already have an account · Login" secondary onPress={() => navigation.navigate('Login')} />
      <Text style={styles.legal}>By continuing, you agree to our Terms of Service and Privacy Policy.</Text>
    </Screen>
  );
}

function RoleSelectionScreen({ navigation, route }) {
  const [role, setRole] = useState('');
  const next = route.params?.next || 'Register';
  return (
    <Screen>
      <Brand small />
      <Heading title="How will you use Maidora?" subtitle="Choose the option that best describes what you're here for." />
      <Pressable onPress={() => setRole('maid')} style={[styles.roleCard, role === 'maid' && styles.roleCardActive]}>
        <Text style={styles.roleEmoji}>👩🏾‍🍳</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.roleTitle}>I'm looking for work</Text>
          <Text style={styles.roleCopy}>Create a worker profile and discover domestic work opportunities.</Text>
        </View>
        <Text style={styles.radio}>{role === 'maid' ? '●' : '○'}</Text>
      </Pressable>
      <Pressable onPress={() => setRole('employer')} style={[styles.roleCard, role === 'employer' && styles.roleCardActive]}>
        <Text style={styles.roleEmoji}>🏡</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.roleTitle}>I'm hiring</Text>
          <Text style={styles.roleCopy}>Find domestic workers, post jobs and connect with candidates.</Text>
        </View>
        <Text style={styles.radio}>{role === 'employer' ? '●' : '○'}</Text>
      </Pressable>
      <Button title="Continue" disabled={!role} onPress={() => navigation.navigate(next, { role })} />
      <Button title="Back" secondary onPress={() => navigation.goBack()} />
    </Screen>
  );
}

function RegisterScreen({ navigation, route }) {
  const role = route.params?.role || 'maid';
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!name.trim() || !phone.trim() || !email.trim() || !password || !confirm) return setError('Please complete all fields.');
    if (!/^\+?\d{9,15}$/.test(phone.replace(/[\s()-]/g, ''))) return setError('Enter a valid phone number, including country code.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.');
    if (password.length < 8) return setError('Password must contain at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setError('');
    navigation.navigate('VerificationChoice', { role, name: name.trim(), phone, email });
  };

  return (
    <Screen>
      <Text style={styles.step}>ACCOUNT SETUP · 1 OF 3</Text>
      <Heading title="Create your account" subtitle={role === 'maid' ? 'Start your journey to new work opportunities.' : 'Create an account to find the right domestic worker.'} />
      <Field label="Full name" value={name} onChangeText={setName} placeholder="e.g. Mary Wanjiku" />
      <Field label="Phone number" value={phone} onChangeText={setPhone} placeholder="+254 7XX XXX XXX" keyboardType="phone-pad" />
      <Field label="Email address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
      <Field label="Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry />
      <Field label="Confirm password" value={confirm} onChangeText={setConfirm} placeholder="Enter password again" secureTextEntry />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button title="Continue" onPress={submit} />
      <Text style={styles.switchText}>Already have an account? <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Login</Text></Text>
      <Text style={styles.legal}>Your details are kept private and used to set up your Maidora account.</Text>
    </Screen>
  );
}

function VerificationChoiceScreen({ navigation, route }) {
  const { role, name, phone, email } = route.params;
  const go = (method) => navigation.navigate('VerifyOtp', { role, name, phone, email, method });
  return (
    <Screen>
      <View style={styles.iconCircle}><Text style={styles.iconCircleText}>✓</Text></View>
      <Heading title="Verify your account" subtitle="Choose where you'd like us to send your one-time verification code." />
      <Pressable style={styles.choiceCard} onPress={() => go('phone')}>
        <Text style={styles.choiceIcon}>📱</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.choiceTitle}>Verify with phone</Text>
          <Text style={styles.choiceValue}>{phone}</Text>
          <Text style={styles.choiceHint}>A code will be sent by SMS.</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
      <Pressable style={styles.choiceCard} onPress={() => go('email')}>
        <Text style={styles.choiceIcon}>✉️</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.choiceTitle}>Verify with email</Text>
          <Text style={styles.choiceValue}>{email}</Text>
          <Text style={styles.choiceHint}>A code will be sent to your inbox.</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
      <Text style={styles.helper}>You only need to verify one contact method to continue. You can verify the other one later in Settings.</Text>
      <Button title="Back" secondary onPress={() => navigation.goBack()} />
    </Screen>
  );
}

function VerifyOtpScreen({ navigation, route }) {
  const { role, name, phone, email, method } = route.params;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const destination = method === 'phone' ? phone : email;
  const verify = () => {
    if (code !== '123456') return setError('That code is incorrect. For this demo, use 123456.');
    navigation.navigate(role === 'maid' ? 'MaidOnboarding' : 'EmployerOnboarding', {
      role, name, phone, email,
      phoneVerified: method === 'phone',
      emailVerified: method === 'email',
    });
  };
  return (
    <Screen>
      <View style={styles.iconCircle}><Text style={styles.iconCircleText}>{method === 'phone' ? '✉' : '✓'}</Text></View>
      <Heading title="Enter your verification code" subtitle={'We sent a code to ' + destination} />
      <Field label="6-digit verification code" value={code} onChangeText={(v) => { setCode(v.replace(/\D/g, '').slice(0, 6)); setError(''); }} placeholder="123456" keyboardType="number-pad" />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Text style={styles.demoNote}>Development demo: use 123456. No real SMS or email is sent yet.</Text>
      <Button title="Verify and continue" onPress={verify} />
      <Text style={styles.switchText}>Didn't receive a code? <Text style={styles.link} onPress={() => setError('Demo mode: no message is sent. Use 123456 to continue.')}>Resend code</Text></Text>
      <Button title="Choose another method" secondary onPress={() => navigation.goBack()} />
    </Screen>
  );
}

function MaidOnboardingScreen({ navigation, route }) {
  const { name, phone, email, phoneVerified, emailVerified } = route.params;
  const [dob, setDob] = useState('');
  const [county, setCounty] = useState('');
  const [town, setTown] = useState('');
  const [arrangement, setArrangement] = useState('Either');
  const [experience, setExperience] = useState('');
  const [error, setError] = useState('');
  const finish = () => {
    if (!dob.trim() || !county.trim() || !town.trim()) return setError('Please add your date of birth, county and town.');
    navigation.replace('MaidDashboard', { name, phone, email, phoneVerified, emailVerified, county, town });
  };
  return (
    <Screen>
      <Text style={styles.step}>MAID PROFILE · 2 OF 3</Text>
      <Heading title="A little about you" subtitle="These details help employers discover opportunities that suit you. You can update them later." />
      <Field label="Date of birth" value={dob} onChangeText={setDob} placeholder="DD/MM/YYYY" />
      <Field label="County" value={county} onChangeText={setCounty} placeholder="e.g. Kiambu" />
      <Field label="Town / Area" value={town} onChangeText={setTown} placeholder="e.g. Thika" />
      <Field label="Years of experience (optional)" value={experience} onChangeText={setExperience} placeholder="e.g. 2 years" />
      <Text style={styles.label}>Preferred work arrangement</Text>
      <View style={styles.segmentRow}>
        {['Live-in', 'Live-out', 'Either'].map(item => (
          <Pressable key={item} onPress={() => setArrangement(item)} style={[styles.segment, arrangement === item && styles.segmentActive]}>
            <Text style={[styles.segmentText, arrangement === item && styles.segmentTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button title="Complete profile" onPress={finish} />
      <Text style={styles.helper}>Identity verification (KYC) is optional at this stage. You can complete it later to earn a verified badge.</Text>
    </Screen>
  );
}

function EmployerOnboardingScreen({ navigation, route }) {
  const { name, phone, email, phoneVerified, emailVerified } = route.params;
  const [county, setCounty] = useState('');
  const [town, setTown] = useState('');
  const [employerType, setEmployerType] = useState('Individual / Household');
  const [error, setError] = useState('');
  const finish = () => {
    if (!county.trim() || !town.trim()) return setError('Please add your county and town / area.');
    navigation.replace('EmployerDashboard', { name, phone, email, phoneVerified, emailVerified, county, town });
  };
  return (
    <Screen>
      <Text style={styles.step}>EMPLOYER PROFILE · 2 OF 3</Text>
      <Heading title="Set up your profile" subtitle="Tell us a little about where you're hiring." />
      <Field label="County" value={county} onChangeText={setCounty} placeholder="e.g. Nairobi" />
      <Field label="Town / Area" value={town} onChangeText={setTown} placeholder="e.g. Westlands" />
      <Text style={styles.label}>I am hiring as</Text>
      <View style={styles.segmentColumn}>
        {['Individual / Household', 'Family', 'Company / Organisation'].map(item => (
          <Pressable key={item} onPress={() => setEmployerType(item)} style={[styles.segment, employerType === item && styles.segmentActive]}>
            <Text style={[styles.segmentText, employerType === item && styles.segmentTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button title="Complete profile" onPress={finish} />
      <Text style={styles.helper}>You can add more hiring preferences from your dashboard.</Text>
    </Screen>
  );
}

function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = () => {
    if (!identifier.trim() || !password) return setError('Enter your phone/email and password.');
    setError('Login is not connected to a backend yet. Registration demo is available from Get started.');
  };
  return (
    <Screen>
      <Brand small />
      <Heading title="Welcome back" subtitle="Login to continue your Maidora journey." />
      <Field label="Phone number or email" value={identifier} onChangeText={setIdentifier} placeholder="+254... or you@example.com" autoCapitalize="none" />
      <Field label="Password" value={password} onChangeText={setPassword} placeholder="Your password" secureTextEntry />
      <Text style={styles.linkRight} onPress={() => navigation.navigate('ForgotPassword')}>Forgot password?</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button title="Login" onPress={login} />
      <Text style={styles.switchText}>New to Maidora? <Text style={styles.link} onPress={() => navigation.navigate('RoleSelection')}>Create account</Text></Text>
    </Screen>
  );
}

function ForgotPasswordScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [notice, setNotice] = useState('');
  return (
    <Screen>
      <Heading title="Reset your password" subtitle="Enter the phone number or email associated with your account. We'll help you verify ownership before you choose a new password." />
      <Field label="Phone number or email" value={identifier} onChangeText={setIdentifier} placeholder="Enter phone or email" autoCapitalize="none" />
      {!!notice && <Text style={styles.successText}>{notice}</Text>}
      <Button title="Continue" onPress={() => setNotice('Password recovery will be connected when the backend and OTP service are ready.')} />
      <Button title="Back to login" secondary onPress={() => navigation.goBack()} />
    </Screen>
  );
}

function DashboardScreen({ route, navigation, role }) {
  const data = route.params || {};
  const name = data.name || (role === 'maid' ? 'Mary' : 'Jane');
  const isMaid = role === 'maid';
  return (
    <Screen>
      <View style={styles.dashboardTop}>
        <View>
          <Text style={styles.mutedSmall}>MAIDORA · {isMaid ? 'MAID ACCOUNT' : 'EMPLOYER ACCOUNT'}</Text>
          <Text style={styles.greeting}>Hello, {name.split(' ')[0]} 👋🏾</Text>
          <Text style={styles.subGreeting}>{isMaid ? 'Your next opportunity could be here.' : 'Let’s find the right help for your home.'}</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text></View>
      </View>
      <View style={styles.bonusCard}>
        <Text style={styles.bonusEyebrow}>WELCOME TO MAIDORA</Text>
        <Text style={styles.bonusTitle}>{isMaid ? 'Your journey starts here' : 'Your welcome bonus is ready'}</Text>
        <Text style={styles.bonusCopy}>{isMaid ? 'Complete your profile and explore available jobs.' : 'You have 2 free job posts and 2 free chat initiations.'}</Text>
      </View>
      <Heading title={isMaid ? 'Your next steps' : 'What would you like to do?'} subtitle={isMaid ? 'Make the most of your Maidora profile.' : 'Get started with Maidora.'} />
      <View style={styles.actionGrid}>
        {(isMaid ? [['🔎', 'Browse jobs'], ['📝', 'My applications'], ['🛡️', 'Get verified'], ['👤', 'My profile']] : [['👩🏾', 'Browse maids'], ['＋', 'Post a job'], ['💬', 'Messages'], ['👤', 'My profile']]).map(([icon, label]) => (
          <View key={label} style={styles.actionTile}><Text style={styles.actionIcon}>{icon}</Text><Text style={styles.actionLabel}>{label}</Text></View>
        ))}
      </View>
      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Account verification</Text>
        <Text style={styles.statusCopy}>Phone: {data.phoneVerified ? 'Verified' : 'Not verified'}  ·  Email: {data.emailVerified ? 'Verified' : 'Not verified'}</Text>
        <Text style={styles.statusCopy}>Identity verification: Not submitted</Text>
        <Text style={styles.statusHint}>KYC is optional. Complete it later to receive your verified badge.</Text>
      </View>
      <Button title="Back to welcome (demo)" secondary onPress={() => navigation.popToTop()} />
    </Screen>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: C.white } }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="VerificationChoice" component={VerificationChoiceScreen} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
        <Stack.Screen name="MaidOnboarding" component={MaidOnboardingScreen} />
        <Stack.Screen name="EmployerOnboarding" component={EmployerOnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="MaidDashboard">
          {props => <DashboardScreen {...props} role="maid" />}
        </Stack.Screen>
        <Stack.Screen name="EmployerDashboard">
          {props => <DashboardScreen {...props} role="employer" />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <AppNavigator />
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.white },
  scrollContent: { flexGrow: 1 },
  screenContent: { flex: 1, paddingHorizontal: 24, paddingTop: 22, paddingBottom: 34 },
  brand: { alignItems: 'center', marginTop: 14, marginBottom: 28 },
  brandMark: { width: 62, height: 62, borderRadius: 20, backgroundColor: C.purple, alignItems: 'center', justifyContent: 'center', marginBottom: 8, transform: [{ rotate: '-5deg' }] },
  brandMarkText: { color: C.white, fontSize: 34, fontWeight: '900' },
  brandName: { color: C.deep, fontSize: 34, fontWeight: '900', letterSpacing: -1.5 },
  tagline: { color: C.muted, fontSize: 13, marginTop: 1 },
  welcomeHero: { alignItems: 'center', paddingTop: 8, paddingBottom: 28 },
  heroCircle: { width: 150, height: 150, borderRadius: 75, backgroundColor: C.light, alignItems: 'center', justifyContent: 'center', marginBottom: 26, borderWidth: 1, borderColor: '#E9DDF5' },
  heroEmoji: { fontSize: 72 },
  heroTitle: { color: C.ink, fontSize: 32, fontWeight: '900', lineHeight: 38, textAlign: 'center', letterSpacing: -0.8 },
  heroCopy: { color: C.muted, fontSize: 15, lineHeight: 23, textAlign: 'center', marginTop: 12, maxWidth: 310 },
  heading: { marginTop: 8, marginBottom: 22 },
  headingTitle: { color: C.ink, fontSize: 27, fontWeight: '800', letterSpacing: -0.6 },
  headingSubtitle: { color: C.muted, fontSize: 14, lineHeight: 21, marginTop: 7 },
  button: { backgroundColor: C.purple, paddingVertical: 16, borderRadius: 14, alignItems: 'center', marginTop: 12 },
  buttonText: { color: C.white, fontSize: 15, fontWeight: '800' },
  buttonSecondary: { backgroundColor: C.white, borderWidth: 1, borderColor: C.line },
  buttonSecondaryText: { color: C.deep },
  legal: { color: '#A59BAA', fontSize: 11, textAlign: 'center', lineHeight: 17, marginTop: 20 },
  roleCard: { flexDirection: 'row', alignItems: 'center', padding: 17, borderRadius: 18, borderWidth: 1, borderColor: C.line, marginBottom: 14, gap: 13 },
  roleCardActive: { borderColor: C.purple, backgroundColor: C.light, borderWidth: 2 },
  roleEmoji: { fontSize: 34 },
  roleTitle: { color: C.ink, fontSize: 16, fontWeight: '800' },
  roleCopy: { color: C.muted, fontSize: 12, lineHeight: 18, marginTop: 4 },
  radio: { color: C.purple, fontSize: 23, paddingLeft: 4 },
  step: { color: C.purple, fontSize: 11, fontWeight: '900', letterSpacing: 1.1, marginBottom: 14 },
  fieldWrap: { marginBottom: 15 },
  label: { color: C.ink, fontSize: 13, fontWeight: '700', marginBottom: 7 },
  input: { height: 53, borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 14, color: C.ink, fontSize: 14, backgroundColor: C.white },
  error: { color: '#C0392B', fontSize: 12, marginTop: 6, lineHeight: 18 },
  switchText: { color: C.muted, textAlign: 'center', fontSize: 13, marginTop: 20 },
  link: { color: C.purple, fontWeight: '800' },
  iconCircle: { width: 74, height: 74, borderRadius: 37, backgroundColor: C.light, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: 14 },
  iconCircleText: { color: C.purple, fontSize: 34, fontWeight: '800' },
  choiceCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 17, marginBottom: 13, gap: 13 },
  choiceIcon: { fontSize: 28 },
  choiceTitle: { color: C.ink, fontSize: 15, fontWeight: '800' },
  choiceValue: { color: C.deep, fontSize: 13, marginTop: 5, fontWeight: '600' },
  choiceHint: { color: C.muted, fontSize: 11, marginTop: 3 },
  chevron: { color: C.purple, fontSize: 28 },
  helper: { color: C.muted, fontSize: 12, lineHeight: 19, marginVertical: 16 },
  demoNote: { backgroundColor: '#FFF5E8', color: '#87520F', padding: 12, borderRadius: 10, fontSize: 12, lineHeight: 18, marginBottom: 10 },
  successText: { color: C.green, fontSize: 13, marginVertical: 12 },
  linkRight: { color: C.purple, fontSize: 13, textAlign: 'right', fontWeight: '700', marginBottom: 12 },
  segmentRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  segmentColumn: { gap: 8, marginBottom: 18 },
  segment: { borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 12, flex: 1, alignItems: 'center' },
  segmentActive: { backgroundColor: C.light, borderColor: C.purple },
  segmentText: { color: C.muted, fontSize: 12, fontWeight: '700' },
  segmentTextActive: { color: C.deep },
  dashboardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  mutedSmall: { color: C.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  greeting: { color: C.ink, fontSize: 27, fontWeight: '900', marginTop: 7 },
  subGreeting: { color: C.muted, fontSize: 13, marginTop: 4 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.light, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: C.purple, fontSize: 20, fontWeight: '900' },
  bonusCard: { backgroundColor: C.deep, borderRadius: 18, padding: 20, marginBottom: 26 },
  bonusEyebrow: { color: '#DCC8F0', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  bonusTitle: { color: C.white, fontSize: 21, fontWeight: '900', marginTop: 8 },
  bonusCopy: { color: '#E9DDF5', fontSize: 13, lineHeight: 19, marginTop: 7 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },
  actionTile: { width: '48%', minHeight: 102, backgroundColor: C.light, borderRadius: 15, padding: 15, justifyContent: 'center' },
  actionIcon: { fontSize: 25, marginBottom: 8 },
  actionLabel: { color: C.deep, fontSize: 13, fontWeight: '800' },
  statusCard: { borderWidth: 1, borderColor: C.line, borderRadius: 15, padding: 16, marginBottom: 12 },
  statusTitle: { color: C.ink, fontWeight: '800', fontSize: 14, marginBottom: 8 },
  statusCopy: { color: C.muted, fontSize: 12, lineHeight: 19 },
  statusHint: { color: C.purple, fontSize: 11, lineHeight: 17, marginTop: 8 },
});
