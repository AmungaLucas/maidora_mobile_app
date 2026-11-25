import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import ScreenContainer, { Heading } from '../../components/ScreenContainer';
import TextField from '../../components/TextField';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

export default function VerifyOtpScreen({ navigation, route }) {
  const data = route.params; const [code,setCode]=useState(''); const [error,setError]=useState('');
  const verify = () => {
    if (code !== '123456') return setError('Demo code is 123456. Real OTP delivery is not connected yet.');
    navigation.replace(data.role === 'maid' ? 'MaidDashboard' : 'EmployerDashboard', { ...data, profileCompleted: false, phoneVerified: data.method === 'phone', emailVerified: data.method === 'email', kycStatus: 'not_submitted' });
  };
  return <ScreenContainer><Heading title="Enter your verification code" subtitle={'We sent a code to ' + (data.method === 'phone' ? data.phone : data.email)} /><TextField label="6-digit code" value={code} onChangeText={v=>{setCode(v.replace(/\D/g,'').slice(0,6));setError('');}} keyboardType="number-pad" placeholder="123456" />{!!error && <Text style={styles.error}>{error}</Text>}<Text style={styles.note}>Demo mode: use 123456. No real SMS or email is sent.</Text><Button title="Verify and continue" onPress={verify} /><Button title="Choose another method" secondary onPress={()=>navigation.goBack()} /></ScreenContainer>;
}
const styles=StyleSheet.create({error:{color:colors.danger,fontSize:12},note:{color:colors.muted,fontSize:12,marginVertical:12}});