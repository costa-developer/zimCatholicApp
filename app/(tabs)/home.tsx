import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Lora_700Bold } from '@expo-google-fonts/lora';
import { useFonts } from 'expo-font';

const coreActions = [
  { icon: 'videocam-outline', label: 'Livestream', route: '/livestream' },
  { icon: 'calendar-outline', label: 'Events', route: '/events' },
  { icon: 'book-outline', label: 'Daily Reading', route: '/readings' },
  { icon: 'chatbubbles-outline', label: 'Prayer Requests', route: '/prayer-requests' },
  { icon: 'information-circle-outline', label: 'About Us', route: '/about' },
];

export default function HomeScreen() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Lora_700Bold,
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return <Text style={{ fontSize: 16, textAlign: 'center' }}>Loading fonts...</Text>;
  }

  const handlePress = (route: string) => {
    router.push(route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.churchName}>Christ Sanctuary</Text>
          <Text style={styles.welcomeMessage}>Welcome Home.</Text>
        </View>
        <TouchableOpacity onPress={() => handlePress('/profile')}>
          <Image
            source={require('../../assets/images/a.jpg')}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Today's Inspiration</Text>
        <TouchableOpacity
          style={styles.featuredCardTouchable}
          onPress={() => handlePress('/sermons/great-is-thy-faithfulness')}
        >
          <ImageBackground
            source={require('../../assets/images/a.jpg')}
            style={styles.featuredImage}
            imageStyle={styles.featuredImageStyle}
          >
            <View style={styles.featuredOverlay}>
              <Text style={styles.featuredTag}>HYMN SPOTLIGHT</Text>
              <Text style={styles.featuredTitle}>"Great Is Thy Faithfulness"</Text>
              <Text style={styles.featuredSubtitle}>English • 4 Verses • Hymn #245</Text>
              <View style={styles.playButton}>
                <Ionicons name="play-circle" size={40} color={COLORS.secondary} />
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.coreActionsGrid}>
          {coreActions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionButton}
              onPress={() => handlePress(item.route)}
            >
              <Ionicons name={item.icon as any} size={30} color={COLORS.primary} />
              <Text style={styles.actionLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>From Our Community</Text>
        <TouchableOpacity
          style={styles.parishCard}
          onPress={() => handlePress('/daily-gospel')}
        >
          <Image
            source={require('../../assets/images/a.jpg')}
            style={styles.parishImage}
          />
          <View style={styles.parishInfo}>
            <Text style={styles.parishTag}>DAILY GOSPEL</Text>
            <Text style={styles.parishTitle}>Matthew 5:1–12</Text>
            <Text style={styles.parishDetails}>Beatitudes • Reflection • 3 min read</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.parishCard}
          onPress={() => handlePress('/events')}
        >
          <Image
            source={require('../../assets/images/a.jpg')}
            style={styles.parishImage}
          />
          <View style={styles.parishInfo}>
            <Text style={styles.parishTag}>UPCOMING EVENT</Text>
            <Text style={styles.parishTitle}>Community Potluck & Fellowship</Text>
            <Text style={styles.parishDetails}>Sat, July 20th • 6:00 PM • Church Hall</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  background: '#02070f',
  surface: '#0a0f1a',
  cardBackground: '#111827',
  primary: '#F4A261',
  secondary: '#FFD700',
  headingText: '#ffffff',
  secondaryText: '#cccccc',
  border: '#1f2937',
  overlay: 'rgba(0, 0, 0, 0.6)',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  churchName: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: COLORS.secondaryText,
    marginBottom: 2,
  },
  welcomeMessage: {
    fontSize: 26,
    fontFamily: 'Lora_700Bold',
    color: COLORS.headingText,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Lora_700Bold',
    color: COLORS.headingText,
    marginTop: 26,
    marginBottom: 14,
  },
  featuredCardTouchable: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.cardBackground,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
    marginBottom: 20,
  },
  featuredImage: {
    height: 250,
    justifyContent: 'flex-end',
  },
  featuredImageStyle: {
    borderRadius: 20,
  },
  featuredOverlay: {
    backgroundColor: COLORS.overlay,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    minHeight: 120,
    position: 'relative',
  },
  featuredTag: {
    color: COLORS.primary,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  featuredTitle: {
    color: COLORS.headingText,
    fontSize: 24,
    fontFamily: 'Lora_700Bold',
    marginBottom: 4,
  },
  featuredSubtitle: {
    color: COLORS.secondaryText,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  playButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  coreActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    width: '48%',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  actionLabel: {
    color: COLORS.headingText,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 8,
    textAlign: 'center',
  },
  parishCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 18,
    padding: 15,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  parishImage: {
    width: 90,
    height: 90,
    borderRadius: 15,
    marginRight: 15,
  },
  parishInfo: {
    flex: 1,
  },
  parishTag: {
    color: COLORS.primary,
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  parishTitle: {
    fontSize: 18,
    fontFamily: 'Lora_700Bold',
    color: COLORS.headingText,
    marginBottom: 2,
  },
  parishDetails: {
    color: COLORS.secondaryText,
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
  },
});
