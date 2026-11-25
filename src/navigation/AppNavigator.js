import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import RoleSelectionScreen from '../screens/onboarding/RoleSelectionScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PasswordSetupScreen from '../screens/auth/PasswordSetupScreen';
import VerificationChoiceScreen from '../screens/auth/VerificationChoiceScreen';
import VerifyOtpScreen from '../screens/auth/VerifyOtpScreen';
import ProfileSetupScreen from '../screens/profile/ProfileSetupScreen';
import RoleTabNavigator from './RoleTabNavigator';
import LoginScreen from '../screens/auth/LoginScreen';
import { InfoScreen, ForgotPasswordScreen } from '../screens/misc/InfoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: colors.white } }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="PasswordSetup" component={PasswordSetupScreen} />
        <Stack.Screen name="VerificationChoice" component={VerificationChoiceScreen} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
        <Stack.Screen name="MaidProfile">{props => <ProfileSetupScreen {...props} role="maid" />}</Stack.Screen>
        <Stack.Screen name="EmployerProfile">{props => <ProfileSetupScreen {...props} role="employer" />}</Stack.Screen>
        <Stack.Screen name="MaidDashboard">{props => <RoleTabNavigator {...props} role="maid" />}</Stack.Screen>
        <Stack.Screen name="EmployerDashboard">{props => <RoleTabNavigator {...props} role="employer" />}</Stack.Screen>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="KycInfo" component={InfoScreen} />
        <Stack.Screen name="ProfileRequired" component={InfoScreen} />
        <Stack.Screen name="BrowseInfo" component={InfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
