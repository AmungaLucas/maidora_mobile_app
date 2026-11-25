import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MarketplaceHomeScreen from '../screens/dashboard/MarketplaceHomeScreen';
import MarketplaceTabScreen from '../screens/dashboard/MarketplaceTabScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

const maidTabs = [
  { name: 'Home', label: 'Home', icon: '⌂', component: MarketplaceHomeScreen },
  { name: 'Jobs', label: 'Jobs', icon: '⌕', component: MarketplaceTabScreen },
  { name: 'MyApplications', label: 'Applications', icon: '▤', component: MarketplaceTabScreen },
  { name: 'MaidChat', label: 'Chat', icon: '☏', component: MarketplaceTabScreen },
  { name: 'MaidProfileTab', label: 'Profile', icon: '◉', component: MarketplaceTabScreen },
];

const employerTabs = [
  { name: 'Home', label: 'Home', icon: '⌂', component: MarketplaceHomeScreen },
  { name: 'FindMaids', label: 'Find Maids', icon: '⌕', component: MarketplaceTabScreen },
  { name: 'MyJobs', label: 'My Jobs', icon: '▣', component: MarketplaceTabScreen },
  { name: 'EmployerChat', label: 'Chat', icon: '☏', component: MarketplaceTabScreen },
  { name: 'EmployerProfileTab', label: 'Profile', icon: '◉', component: MarketplaceTabScreen },
];

export default function RoleTabNavigator({ route, role }) {
  const insets = useSafeAreaInsets();
  const initialData = route.params || {};
  const tabs = role === 'maid' ? maidTabs : employerTabs;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.muted,
        // Include the device's bottom safe area so tabs stay above system navigation.
        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingTop: 7,
          paddingBottom: Math.max(insets.bottom, 7),
          borderTopColor: colors.line,
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
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
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 21, fontWeight: '700' }}>{tab.icon}</Text>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
