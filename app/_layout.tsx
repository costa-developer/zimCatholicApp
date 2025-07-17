// app/_layout.tsx

import { FavoritesProvider } from '@/contexts/FavoritesContext';
import * as NavigationBar from 'expo-navigation-bar';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export default function RootLayout() {
  useEffect(() => {
    // Make background transparent to blend with fullscreen
    SystemUI.setBackgroundColorAsync('transparent');

    // Hide Android navigation bar
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setBehaviorAsync('overlay-swipe'); // Allows user to swipe to bring it back
    }
  }, []);

  return (
    <FavoritesProvider>
      <StatusBar hidden translucent style="light" />
      <Slot />
    </FavoritesProvider>
  );
}
