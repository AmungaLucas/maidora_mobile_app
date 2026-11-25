import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MarketplaceHomeScreen from '../screens/dashboard/MarketplaceHomeScreen';
import MarketplaceTabScreen from '../screens/dashboard/MarketplaceTabScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

// Both roles share one icon family and navigation style.
const maidTabs = [
  { name: 'Home', label: 'Home', icon: 'home-variant-outline', activeIcon: 'home-variant' , component: MarketplaceHomeScreen },
  { name: 'Jobs', label: 'Jobs', icon: 'briefcase-search-outline', activeIcon: 'briefcase-search', component: MarketplaceTabScreen },
  { name: 'MyApplications', label: 'Applications', icon: 'file-document-multiple-outline', activeIcon: 'file-document-multiple', component: MarketplaceTabScreen },
  { name: 'MaidChat', label: 'Chat', icon: 'message-text-outline', activeIcon: 'message-text', component: MarketplaceTabScreen },
  { name: 'MaidProfileTab', label: 'Profile', icon: 'account-circle-outline', activeIcon: 'account-circle', component: MarketplaceTabScreen },
];

const employerTabs = [
  { name: 'Home', label: 'Home', icon: 'home-variant-outline', activeIcon: 'home-variant', component: MarketplaceHomeScreen },
  { name: 'FindMaids', label: 'Find Maids', icon: 'account-search-outline', activeIcon: 'account-search', component: MarketplaceTabScreen },
  { name: 'MyJobs', label: 'My Jobs', icon: 'briefcase-check-outline', activeIcon: 'briefcase-check', component: MarketplaceTabScreen },
  { name: 'EmployerChat', label: 'Chat', icon: 'message-text-outline', activeIcon: 'message-text', component: MarketplaceTabScreen },
  { name: 'EmployerProfileTab', label: 'Profile', icon: 'account-circle-outline', activeIcon: 'account-circle', component: MarketplaceTabScreen },
];

function TabIcon({ icon, activeIcon, color, focused }) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <MaterialCommunityIcons
        name={focused ? activeIcon : icon}
        size={25}
        color={color}
      />
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
          height: 60 + insets.bottom,
          paddingTop: 2,
          paddingBottom: insets.bottom,
          paddingHorizontal: 0,
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
          paddingTop: 0,
          paddingBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
          marginBottom: 0,
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
              <TabIcon
                icon={tab.icon}
                activeIcon={tab.activeIcon}
                color={color}
                focused={focused}
              />
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
    height: 29,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: colors.sage,
  },
});
