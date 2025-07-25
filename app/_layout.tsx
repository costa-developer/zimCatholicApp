// app/_layout.tsx

// Wraps the app with global providers and UI configurations.
// This acts as the root layout for all screens in the app.

import { FavoritesProvider } from '@/contexts/FavoritesContext';
import * as NavigationBar from 'expo-navigation-bar';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    // Make system background transparent for fullscreen visual effect
    SystemUI.setBackgroundColorAsync('transparent');

    // Hide Android navigation bar and allow swipe gesture to show it temporarily
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe');
    }
  }, []);

  return (
    // Provide global favorites state and render active route screen
    <FavoritesProvider>
      <StatusBar hidden translucent style="light" />
      <Slot />
    </FavoritesProvider>
  );
}
