import React from 'react';
import { Text } from 'react-native';
import ScreenContainer, { Heading } from '../../components/ScreenContainer';
import Button from '../../components/Button';

export function InfoScreen({ navigation, route }) {
  const title = route.name === 'KycInfo' ? 'Identity verification' : route.name === 'ProfileRequired' ? 'Complete your profile' : 'Coming soon';
  const message = route.params?.message || (route.name === 'KycInfo' ? 'KYC is optional. You can browse Maidora without it. Submit your ID and selfie later to request a verified badge.' : 'This marketplace feature will be connected in a future development milestone.');
  return <ScreenContainer><Heading title={title} subtitle={message} /><Button title="Go back" secondary onPress={()=>navigation.goBack()} /></ScreenContainer>;
}
export function ForgotPasswordScreen({ navigation }) {
  return <ScreenContainer><Heading title="Reset your password" subtitle="Password recovery will be connected when the authentication backend and OTP service are ready." /><Button title="Back to login" secondary onPress={()=>navigation.goBack()} /></ScreenContainer>;
}