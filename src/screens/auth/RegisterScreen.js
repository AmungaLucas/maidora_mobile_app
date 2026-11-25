import React, { useState } from 'react';
import { Text, Pressable, StyleSheet } from 'react-native';
import ScreenContainer, { Heading } from '../../components/ScreenContainer';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { detectCurrentLocation } from '../../services/location';
import { colors } from '../../theme/colors';

export default function RegisterScreen({ navigation, route }) {
  const role = route.params?.role || 'maid';
  const [name,setName]=useState(''); const [phone,setPhone]=useState(''); const [email,setEmail]=useState('');
  const [password,setPassword]=useState(''); const [confirm,setConfirm]=useState(''); const [accepted,setAccepted]=useState(false);
  const [error,setError]=useState(''); const [loading,setLoading]=useState(false);
  const submit = async () => {
    if (!name.trim() || !phone.trim() || !email.trim() || !password || !confirm) return setError('Please complete all fields.');
    if (!/^\\+?\\d{9,15}$/.test(phone.replace(/[\\s()-]/g,''))) return setError('Enter a valid phone number, including country code.');
    if (!/^\\S+@\\S+\\.\\S+$/.test(email)) return setError('Enter a valid email address.');
    if (password.length < 8) return setError('Password must contain at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    if (!accepted) return setError('Please accept the Terms & Conditions and acknowledge the privacy notices.');
    setError(''); setLoading(true);
    try {
      // Location is requested during signup. If declined, user can enter it manually later.
      const location = await detectCurrentLocation();
      navigation.navigate('VerificationChoice', { role, name: name.trim(), phone, email, location, termsAccepted: true, termsVersion: 'v1' });
    } catch (e) {
      navigation.navigate('VerificationChoice', { role, name: name.trim(), phone, email, location: { source: 'manual' }, termsAccepted: true, termsVersion: 'v1' });
    } finally { setLoading(false); }
  };
  return <ScreenContainer><Text style={styles.step}>ACCOUNT SETUP · 1 OF 3</Text><Heading title="Create your account" subtitle={role === 'maid' ? 'Start your journey to new work opportunities.' : 'Create an account to find the right domestic worker.'} /><TextField label="Full name" value={name} onChangeText={setName} placeholder="e.g. Mary Wanjiku" /><TextField label="Phone number" value={phone} onChangeText={setPhone} placeholder="+254 7XX XXX XXX" keyboardType="phone-pad" /><TextField label="Email address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" /><TextField label="Password" value={password} onChangeText={setPassword} placeholder="At least 8 characters" secureTextEntry /><TextField label="Confirm password" value={confirm} onChangeText={setConfirm} placeholder="Enter password again" secureTextEntry /><Pressable onPress={() => setAccepted(v => !v)} style={styles.consent}><Text style={styles.check}>{accepted ? '☑' : '□'}</Text><Text style={styles.consentText}>I agree to the Terms & Conditions and acknowledge the Privacy Policy and Data Protection Notice.</Text></Pressable>{!!error && <Text style={styles.error}>{error}</Text>}<Button title="Continue" onPress={submit} loading={loading} /><Text style={styles.login}>Already have an account? <Text onPress={() => navigation.navigate('Login')} style={styles.link}>Login</Text></Text></ScreenContainer>;
}
const styles = StyleSheet.create({ step:{color:colors.forest,fontSize:11,fontWeight:'900',letterSpacing:1,marginBottom:14}, consent:{flexDirection:'row',alignItems:'flex-start',gap:10,marginVertical:8},check:{fontSize:23,color:colors.forest},consentText:{flex:1,color:colors.ink,fontSize:12,lineHeight:19},error:{color:colors.danger,fontSize:12,marginTop:7},login:{textAlign:'center',color:colors.muted,marginTop:20,fontSize:13},link:{color:colors.forest,fontWeight:'800'} });