// app/(tabs)/home.tsx

import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { useFonts } from 'expo-font';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import { Manrope_400Regular } from '@expo-google-fonts/manrope';

import { COLORS } from '@/constants/Colors';
import { STRINGS } from '@/constants/strings';

const windowWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    DMSerifDisplay_400Regular,
    Manrope_400Regular,
  });

  useEffect(() => {
    async function loadAssetsAsync() {
      await Asset.loadAsync([
        require('../../assets/images/l.jpg'),
        require('../../assets/icons/praying.png'),
        require('../../assets/icons/bible.png'),
        require('../../assets/icons/mbira.png'),
      ]);
    }
    loadAssetsAsync();
  }, []);

  const handlePress = (route: string) => {
    Haptics.selectionAsync();
    router.push(route);
  };

  if (!fontsLoaded) {
    return <Text style={{ fontSize: 16, textAlign: 'center' }}>Loading holy fonts...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ImageBackground
        source={require('../../assets/images/7.jpeg')}
        style={styles.background}
        imageStyle={{ resizeMode: 'cover' }}
      >
        <View style={styles.header}>
          <Image source={require('../../assets/icons/praying.png')} style={styles.logoImage} />
          <Text style={styles.logoText}>Zimbabwe</Text>
          <Text style={styles.logoText}>Catholic</Text>
          <Text style={styles.subtitle}>{STRINGS.peaceBeWithYou}</Text>
          <Text style={styles.dailyVerse} accessibilityLabel="Daily Bible verse">
            “Blessed are the peacemakers, for they shall be called children of God.” - Matt 5:9
          </Text>
        </View>

        <View style={styles.cardContainer}>
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
          <Ionicons name="home" size={26} color={COLORS.active} />
          <Ionicons name="heart-outline" size={26} color={COLORS.inactive} />
          <Ionicons name="calendar-outline" size={26} color={COLORS.inactive} />
          <Ionicons name="person-outline" size={26} color={COLORS.inactive} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

function MenuCard({ icon, title, subtitle, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`${title} section. ${subtitle}`}
    >
      <View style={styles.cardContent}>
        <View style={styles.sideicon}>
          <Image source={icon} style={styles.iconImage} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  background: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    marginBottom: 5,
  },
  logoImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 30,
    letterSpacing: 1,
    color: COLORS.text,
    fontFamily: 'DMSerifDisplay_400Regular',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text,
    fontFamily: 'Manrope_400Regular',
    marginTop: 4,
  },
  dailyVerse: {
    fontSize: 13,
    fontFamily: 'Manrope_400Regular',
    marginTop: 12,
    color: COLORS.text,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  cardContainer: {
    flex: 1,
    gap: 10,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 10,
  },
  card: {
    backgroundColor: COLORS.card,
    padding: 15,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: COLORS.secondcolor,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideicon: {
    backgroundColor: COLORS.icon,
    padding: 10,
    borderRadius: 10,
    borderWidth: 4,
    borderColor: COLORS.secondcolor,
    marginRight: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  iconImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  textContainer: {
    marginLeft: 20,
  },
  cardTitle: {
    fontSize: 26,
    color: COLORS.text,
    fontFamily: 'DMSerifDisplay_400Regular',
  },
  cardSubtitle: {
    fontSize: 14,
    color: COLORS.subtitle,
    fontFamily: 'Manrope_400Regular',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 14,
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
