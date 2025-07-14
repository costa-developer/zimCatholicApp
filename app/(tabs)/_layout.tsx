import { Ionicons as IoniconSet } from '@expo/vector-icons';
import type { IconProps } from '@expo/vector-icons/build/createIconSet';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

const Ionicons = IoniconSet as unknown as React.ComponentType<IconProps>;

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
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sermons"
        options={{
          title: 'Sermons',
          tabBarIcon: ({ color }) => <Ionicons name="mic-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: 'Prayer',
          tabBarIcon: ({ color }) => <Ionicons name="heart-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="give"
        options={{
          title: 'Give',
          tabBarIcon: ({ color }) => <Ionicons name="wallet-outline" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => (
            <Ionicons name="ellipsis-horizontal-circle-outline" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
