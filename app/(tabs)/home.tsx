import { BlurView } from 'expo-blur';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const quickLinks = [
  { id: 'hymns', title: 'Hymns', description: 'Explore and sing along', icon: '🎵' },
  { id: 'prayers', title: 'Prayers', description: 'Your prayer guide in Shona', icon: '🙏' },
  { id: 'readings', title: 'Daily Readings', description: 'Daily scripture and reflections', icon: '📖' },
    { id: 'messages', title: 'Messages', description: 'Pastoral letters & leader messages', icon: '🎙️' },
  { id: 'news', title: 'News', description: 'Catholic updates and stories', icon: '🗞️' },
  { id: 'favorites', title: 'Favorites', description: 'Saved prayers & hymns', icon: '⭐' },
  { id: 'search', title: 'Search', description: 'Find prayers, hymns & readings', icon: '🔍' },
  { id: 'gallery', title: 'Gallery', description: 'View photos and videos', icon: '🖼️' },
  { id: 'about', title: 'About', description: 'Learn about this app', icon: 'ℹ️' },
  { id: 'contact', title: 'Contact', description: 'Get in touch', icon: '✉️' },
];

const thoughts = [
  "At the end of the day, be proud of who you are.",
  "Let your faith be bigger than your fears.",
  "God’s grace is sufficient for you.",
  "Faith does not make things easy, it makes them possible.",
];

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const randomThought = useMemo(() => {
    return thoughts[Math.floor(Math.random() * thoughts.length)];
  }, []);

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({ tabBarStyle: { display: 'none' } });
      return () => navigation.setOptions({ tabBarStyle: undefined });
    }, [navigation])
  );

  return (
    <ImageBackground
      source={require('../../assets/images/bac.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <BlurView intensity={40} style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            {/* Top Bar */}
            <View style={styles.topBar}>
              <Text style={styles.appName}>ZimRoma</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.shareIcon}>🔗</Text>
              </TouchableOpacity>
            </View>

            {/* Thought of the Day */}
            <View style={styles.thoughtContainer}>
              <Text style={styles.thoughtTitle}>Thought of the Day</Text>
              <Text style={styles.thoughtText}>{randomThought}</Text>
            </View>

            {/* Grid Menu */}
            <View style={styles.cardsContainer}>
              {quickLinks.map(link => (
                <TouchableOpacity
                  key={link.id}
                  style={styles.card}
                  activeOpacity={0.7}
                  onPress={() => router.push(`/${link.id}`)}
                >
                  <Text style={styles.cardIcon}>{link.icon}</Text>
                  <Text style={styles.cardTitle}>{link.title}</Text>
                  <Text style={styles.cardDescription}>{link.description}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>© 2025 Zim Catholic App</Text>
              <Text style={styles.footerText}>Version 1.0.0</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  shareIcon: {
    fontSize: 20,
    color: '#fff',
  },
  thoughtContainer: {
    marginBottom: 30,
  },
  thoughtTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fbc02d',
    marginBottom: 8,
  },
  thoughtText: {
    fontSize: 14,
    color: '#fff',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 14,
    width: '47%',
    paddingVertical: 24,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  cardIcon: {
    fontSize: 32,
    marginBottom: 10,
    color: '#fbc02d',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#fbc02d',
    textAlign: 'center',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#ddd',
    marginVertical: 2,
  },
});
