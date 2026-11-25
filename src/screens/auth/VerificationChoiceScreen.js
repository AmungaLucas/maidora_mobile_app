import React from 'react';
import { Text, Pressable, View, StyleSheet } from 'react-native';
import ScreenContainer, { Heading } from '../../components/ScreenContainer';
import Button from '../../components/Button';
import { colors } from '../../theme/colors';

export default function VerificationChoiceScreen({ navigation, route }) {
  const data = route.params;
  const go = method => navigation.navigate('VerifyOtp', { ...data, method });
  return <ScreenContainer><Heading title="Verify your contact" subtitle="Choose where you would prefer to receive your one-time verification code." />{['phone','email'].map(method => <Pressable key={method} onPress={() => go(method)} style={styles.card}><Text style={styles.icon}>{method === 'phone' ? '📱' : '✉️'}</Text><View style={{flex:1}}><Text style={styles.title}>Verify with {method}</Text><Text style={styles.value}>{method === 'phone' ? data.phone : data.email}</Text></View><Text style={styles.arrow}>›</Text></Pressable>)}<Text style={styles.note}>Only one contact needs to be verified to continue. Your other contact can be verified later.</Text><Button title="Back" secondary onPress={() => navigation.goBack()} /></ScreenContainer>;
}
const styles=StyleSheet.create({card:{flexDirection:'row',alignItems:'center',gap:13,padding:17,borderWidth:1,borderColor:colors.line,borderRadius:16,marginBottom:13},icon:{fontSize:28},title:{fontWeight:'800',color:colors.ink},value:{color:colors.muted,fontSize:12,marginTop:5},arrow:{fontSize:28,color:colors.forest},note:{color:colors.muted,fontSize:12,lineHeight:19,marginVertical:12}});