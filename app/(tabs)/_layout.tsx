// app/(tabs)/_layout.tsx

import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const COLORS = {
  background: '#02070f',
  card: '#111827',
  active: '#F4A261',
  inactive: '#888888',
  shadow: '#000000',
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopWidth: 0,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          height: 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 15,
          paddingTop: 10,
          position: 'absolute',
          elevation: 12,
          shadowColor: COLORS.shadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
        },
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home-outline" size={26} color={color} />
          ),
          tabBarStyle: {display: 'none'}
        }}
      />
      <Tabs.Screen
        name="hymns"
        options={{
          title: 'Sermons',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="microphone-outline" size={26} color={color} />
          ),
          tabBarStyle: {display: 'none'}
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: 'Prayer',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="hands-pray" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="give"
        options={{
          title: 'Give',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="wallet-outline" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="dots-horizontal-circle-outline" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
