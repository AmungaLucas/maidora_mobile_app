import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MarketplaceHomeScreen from '../screens/dashboard/MarketplaceHomeScreen';
import MarketplaceTabScreen from '../screens/dashboard/MarketplaceTabScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

// Both account types use the same tab-bar design. Only their destinations differ.
const maidTabs = [
  { name: 'Home', label: 'Home', icon: '⌂', component: MarketplaceHomeScreen },
  { name: 'Jobs', label: 'Jobs', icon: '⌕', component: MarketplaceTabScreen },
  { name: 'MyApplications', label: 'Applications', icon: '▤', component: MarketplaceTabScreen },
  { name: 'MaidChat', label: 'Chat', icon: '◌', component: MarketplaceTabScreen },
  { name: 'MaidProfileTab', label: 'Profile', icon: '◉', component: MarketplaceTabScreen },
];

const employerTabs = [
  { name: 'Home', label: 'Home', icon: '⌂', component: MarketplaceHomeScreen },
  { name: 'FindMaids', label: 'Find Maids', icon: '⌕', component: MarketplaceTabScreen },
  { name: 'MyJobs', label: 'My Jobs', icon: '▣', component: MarketplaceTabScreen },
  { name: 'EmployerChat', label: 'Chat', icon: '◌', component: MarketplaceTabScreen },
  { name: 'EmployerProfileTab', label: 'Profile', icon: '◉', component: MarketplaceTabScreen },
];

function TabIcon({ icon, color, focused }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <Text style={[styles.icon, { color }]}>{icon}</Text>
    </View>
  );
}

export default function RoleTabNavigator({ route, role }) {
  const insets = useSafeAreaInsets();
  const initialData = route.params || {};
  const tabs = role === 'maid' ? maidTabs : employerTabs;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: 68 + insets.bottom,
          paddingTop: 6,
          paddingBottom: Math.max(insets.bottom, 6),
          paddingHorizontal: 4,
          backgroundColor: colors.white,
          borderTopColor: colors.line,
          borderTopWidth: StyleSheet.hairlineWidth,
          elevation: 10,
          shadowColor: '#173B2D',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.07,
          shadowRadius: 8,
        },
        tabBarItemStyle: {
          paddingTop: 1,
          paddingBottom: 1,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 1,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          lineHeight: 13,
          fontWeight: '700',
          marginTop: 0,
          marginBottom: 1,
        },
      }}
    >
      {tabs.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          initialParams={{ ...initialData, role }}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={tab.icon} color={color} focused={focused} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 34,
    height: 28,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: colors.sage,
  },
  icon: {
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '700',
    textAlign: 'center',
  },
});
