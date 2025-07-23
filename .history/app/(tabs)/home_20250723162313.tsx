// app/(tabs)/home.tsx

import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import { Manrope_400Regular } from '@expo-google-fonts/manrope';

import { Colors } from '@/constants/Colors';
import { STRINGS } from '@/constants/strings';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const theme = useColorScheme();

  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
    Manrope_400Regular,
  });

  const [isLoading, setIsLoading] = useState(true);

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

  const handlePress = (route: string) => {
    Haptics.selectionAsync();
    router.push(route);
  };

  if (!fontsLoaded || isLoading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.secondcolor} />
        <Text style={{ marginTop: 10 }}>Loading holy fonts and assets...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.light.background} />
      <ImageBackground
        source={require('../../assets/images/b.jpg')}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover' }}
      >
        <View style={styles.overlay} />
        <View style={styles.innerWrapper}>
          <View style={styles.header}>
            <Image source={require('../../assets/icons/praying.png')} style={styles.logoImage} />
            <Text style={styles.logoText}>Zimbabwe</Text>
            <Text style={styles.logoText}>Catholic</Text>
            <Text style={styles.subtitle}>{STRINGS.peaceBeWithYou}</Text>
            <Text style={styles.dailyVerse} accessibilityLabel="Daily Bible verse">
              “Blessed are the peacemakers, for they shall be called children of God.” - Matt 5:9
            </Text>
          </View>

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

function MenuCard({ icon, title, subtitle, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

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

function NavIcon({ icon, label, onPress, active = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={active ? styles.navItemActive : styles.navItem}>
        <Ionicons name={icon} size={22} color={active ? Colors.light.active : Colors.light.inactive} />
        <Text style={styles.navLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(50, 26, 12, 0.8)', 
    zIndex: 1,
  },
  innerWrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 20,
    zIndex: 2, 
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 28,
    color: Colors.light.text,
    fontFamily: 'DMSerifDisplay_400Regular',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.light.text,
    fontFamily: 'Manrope_400Regular',
    marginTop: 4,
  },
  dailyVerse: {
    fontSize: 12,
    fontFamily: 'Manrope_400Regular',
    marginTop: 8,
    color: Colors.light.text,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 10,
    maxWidth: 320,
  },
  cardWrapper: {
    gap: 10,
    flex: 1,
    justifyContent: 'center',
    maxHeight: height * 0.4,
  },
  card: {
    backgroundColor: Colors.light.card,
    padding: 16,
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
    padding: 10,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Colors.light.secondcolor,
    marginRight: 16,
  },
  iconImage: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  textContainer: {
    flexShrink: 1,
  },
  cardTitle: {
    fontSize: 22,
    color: Colors.light.text,
    fontFamily: 'DMSerifDisplay_400Regular',
  },
  cardSubtitle: {
    fontSize: 13,
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
    backgroundColor: Colors.light.secondcolor,
    padding: 6,
    borderRadius: 50,
  },
  navLabel: {
    fontSize: 10,
    color: Colors.light.text,
    marginTop: 2,
  },
});