// ===========================
// Home Screen - Zimbabwe Catholic App
// ===========================

/**
 * This file represents the home screen UI.
 * It features the main entry point into the app's core areas: Hymns, Prayers, and Readings.
 * The screen includes background imagery, custom font/text styling, and a navigation bar.
 */

// ===========================
// Imports
// ===========================

import { Ionicons } from '@expo/vector-icons'; // Icons for navigation bar
import { Asset } from 'expo-asset'; // Used for preloading image assets
import { useFonts } from 'expo-font'; // Font loading hook
import * as Haptics from 'expo-haptics'; // Provides tactile feedback
import { useRouter } from 'expo-router'; // Navigation hook for routing

import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

// Custom fonts
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import { Manrope_400Regular } from '@expo-google-fonts/manrope';

import { Colors } from '@/constants/Colors';
import { STRINGS } from '@/constants/strings';

// Screen dimensions
const { width, height } = Dimensions.get('window');


// ===========================
// Utility Component - TextStroke
// ===========================

/**
 * TextStroke renders text with a simulated stroke (outline effect)
 * Useful for enhancing visibility against complex backgrounds
 */
type TextStrokeProps = {
  text: string;
  fontSize: number;
  fontFamily: string;
  strokeColor: string;
  textColor: string;
};

function TextStroke({ text, fontSize, fontFamily, strokeColor, textColor }: TextStrokeProps) {
  const strokeWidth = Math.round(width * 0.01); // Dynamic stroke thickness based on screen width

  // Create offsets to simulate the stroke by layering multiple Text components
  const offsets: { x: number; y: number }[] = [];
  for (let x = -strokeWidth; x <= strokeWidth; x++) {
    for (let y = -strokeWidth; y <= strokeWidth; y++) {
      if (x !== 0 || y !== 0) offsets.push({ x, y });
    }
  }

  return (
    <View style={{ position: 'relative' }}>
      {/* Stroke layers */}
      {offsets.map((offset, index) => (
        <Text
          key={index}
          style={{
            position: 'absolute',
            left: offset.x,
            top: offset.y,
            color: strokeColor,
            fontSize,
            fontFamily,
          }}
        >
          {text}
        </Text>
      ))}
      {/* Main text */}
      <Text style={{ color: textColor, fontSize, fontFamily }}>{text}</Text>
    </View>
  );
}

// ===========================
// Main Home Screen Component
// ===========================

export default function HomeScreen() {
  const router = useRouter();
  const theme = useColorScheme();

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
    Manrope_400Regular,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Load essential image assets before rendering screen
  useEffect(() => {
    async function loadAssetsAsync() {
      await Asset.loadAsync([
        require('../../assets/images/l.jpg'),
        require('../../assets/icons/praying.png'),
        require('../../assets/icons/bible.png'),
        require('../../assets/icons/mbira.png'),
      ]);
      setIsLoading(false);
    }
    loadAssetsAsync();
  }, []);

  // Navigate with haptic feedback
  const handlePress = (route: string) => {
    Haptics.selectionAsync();
    router.push({ pathname: route as any });
  };

  // Show loading indicator until fonts and assets are ready
  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.secondcolor} />
        <Text style={{ marginTop: 10 }}>Loading holy fonts and assets...</Text>
      </SafeAreaView>
    );
  }

  // Render Home UI
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.light.background} />
      <ImageBackground
        source={require('../../assets/images/new.jpg')}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover' }}
      >
        {/* Overlay to darken background image */}
        <View style={styles.overlay} />

        <View style={styles.innerWrapper}>
          {/* App Title + Greeting + Daily Verse */}
          <View style={styles.header}>
            <Image source={require('../../assets/icons/praying.png')} style={styles.logoImage} />
            <TextStroke
              text="Zimbabwe"
              fontSize={width * 0.1}
              fontFamily="DMSerifDisplay_400Regular"
              strokeColor={Colors.light.icon}
              textColor={Colors.light.text}
            />
            <TextStroke
              text="Catholic"
              fontSize={width * 0.1}
              fontFamily="DMSerifDisplay_400Regular"
              strokeColor={Colors.light.icon}
              textColor={Colors.light.text}
            />
            <Text style={styles.subtitle}>{STRINGS.peaceBeWithYou}</Text>
            <Text style={styles.dailyVerse}>
              “Blessed are the peacemakers, for they shall be called children of God.” - Matt 5:9
            </Text>
          </View>

          {/* 3 Core Navigation Cards: Songs, Prayers, Readings */}
          <View style={styles.cardWrapper}>
            <MenuCard
              icon={require('../../assets/icons/mbira.png')}
              title="Songs"
              subtitle="Nziyo dzeKereke"
              onPress={() => handlePress('/hymns')}
            />
            <MenuCard
              icon={require('../../assets/icons/praying.png')}
              title="Prayers"
              subtitle="Minamato"
              onPress={() => handlePress('/prayers')}
            />
            <MenuCard
              icon={require('../../assets/icons/bible.png')}
              title="Readings"
              subtitle="Verenga Bhaibheri"
              onPress={() => handlePress('/readings')}
            />
          </View>

          {/* Bottom Tab Navigation */}
          <View style={styles.navBar}>
            <NavIcon icon="home" label="Home" active onPress={() => handlePress('/home')} />
            <NavIcon icon="heart-outline" label="Favorites" onPress={() => handlePress('/favorites')} />
            <NavIcon icon="calendar-outline" label="Calendar" onPress={() => handlePress('/calendar')} />
            <NavIcon icon="person-outline" label="Profile" onPress={() => handlePress('/profile')} />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

// ===========================
// Reusable Component - MenuCard
// ===========================

/**
 * MenuCard: Used on home screen for navigation to main sections
 * Includes animation on press for better UX
 */
type MenuCardProps = {
  icon: any;
  title: string;
  subtitle: string;
  onPress: () => void;
};

function MenuCard({ icon, title, subtitle, onPress }: MenuCardProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Shrinks the card when pressed in
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  // Returns the card to normal size
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      accessibilityLabel={`${title} section. ${subtitle}`}
      accessibilityRole="button"
      style={{ width: '100%', alignItems: 'center' }}
    >
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.cardContent}>
          <View style={styles.sideicon}>
            <Image source={icon} style={styles.iconImage} />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>{title}</Text>
            <Text style={styles.cardSubtitle}>{subtitle}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ===========================
// Reusable Component - NavIcon
// ===========================

/**
 * NavIcon: Bottom navigation icon and label
 */
type NavIconProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  active?: boolean;
};

function NavIcon({ icon, label, onPress, active = false }: NavIconProps) {
  return (
    <TouchableOpacity onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      <View style={active ? styles.navItemActive : styles.navItem}>
        <Ionicons
          name={icon}
          size={width * 0.055}
          color={active ? Colors.light.active : Colors.light.inactive}
        />
        <Text style={styles.navLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(50, 26, 12, 0.7)',
    zIndex: 1,
  },
  innerWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: height * 0.05,
    paddingBottom: height * 0.015,
    paddingHorizontal: width * 0.05,
    zIndex: 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoImage: {
    width: width * 0.13,
    height: width * 0.13,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: width * 0.035,
    color: Colors.light.text,
    fontFamily: 'Manrope_400Regular',
    marginTop: 4,
  },
  dailyVerse: {
    fontSize: width * 0.03,
    fontFamily: 'Manrope_400Regular',
    marginTop: 8,
    color: Colors.light.text,
    textAlign: 'center',
    lineHeight: width * 0.045,
    paddingHorizontal: 10,
    maxWidth: 320,
  },
  cardWrapper: {
    gap: 10,
    flex: 1,
    justifyContent: 'center',
    maxHeight: height * 0.45,
  },
  card: {
    backgroundColor: Colors.light.card,
    padding: width * 0.04,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.light.secondcolor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    maxWidth: 400,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideicon: {
    backgroundColor: Colors.light.icon,
    padding: width * 0.025,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Colors.light.secondcolor,
    marginRight: 16,
  },
  iconImage: {
    width: width * 0.09,
    height: width * 0.09,
    resizeMode: 'contain',
  },
  textContainer: {
    flexShrink: 1,
  },
  cardTitle: {
    fontSize: width * 0.06,
    color: Colors.light.text,
    fontFamily: 'DMSerifDisplay_400Regular',
  },
  cardSubtitle: {
    fontSize: width * 0.035,
    color: Colors.light.subtitle,
    fontFamily: 'Manrope_400Regular',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: Colors.light.card,
    borderRadius: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navItemActive: {
    alignItems: 'center',
    padding: 6,
    borderRadius: 50,
  },
  navLabel: {
    fontSize: width * 0.03,
    color: Colors.light.text,
    marginTop: 2,
  },
});
