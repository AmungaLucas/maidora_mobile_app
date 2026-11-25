import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import ScreenContainer, { Heading } from '../../components/ScreenContainer';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { getLatestDeviceLocation } from '../../services/location';
import { colors } from '../../theme/colors';

export default function LoginScreen({ navigation }) {
  const [identifier,setIdentifier]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState('');
  const login = async () => {
    if (!identifier.trim() || !password) return setError('Enter your phone/email and password.');
    // Authentication is not connected yet. Location is only refreshed after real auth succeeds.
    setError('Login is a UI demo. Connect the backend before authenticating users or updating their saved device location.');
  };
  return <ScreenContainer><Heading title="Welcome back" subtitle="Login to continue your Maidora journey." /><TextField label="Phone number or email" value={identifier} onChangeText={setIdentifier} placeholder="+254... or you@example.com" autoCapitalize="none" /><TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Your password" /><Text onPress={()=>navigation.navigate('ForgotPassword')} style={styles.link}>Forgot password?</Text>{!!error&&<Text style={styles.error}>{error}</Text>}<Button title="Login" onPress={login} /><Text style={styles.note}>Your device location will be refreshed after successful login, if you allow location access.</Text></ScreenContainer>;
}
const styles=StyleSheet.create({link:{textAlign:'right',color:colors.forest,fontWeight:'800',marginBottom:12},error:{color:colors.danger,fontSize:12,marginVertical:8},note:{color:colors.muted,fontSize:12,lineHeight:18,marginTop:14}});