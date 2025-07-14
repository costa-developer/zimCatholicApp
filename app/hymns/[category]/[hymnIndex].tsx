import { hymns } from '@/data/hymns';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HymnDetailScreen() {
  const { category, hymnIndex } = useLocalSearchParams();
  const router = useRouter();

  const index = Number(hymnIndex);
  const filteredHymns = hymns.filter((h) => h.category === category);
  const hymn = filteredHymns[index];

  const handleGoBack = () => router.back();

  if (!hymn) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Hymn not found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.backButtonText}>Back to Hymns</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.backButtonTop} onPress={handleGoBack} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{hymn.title}</Text>
      <Text style={styles.author}>by {hymn.author || 'Unknown'}</Text>
      <Text style={styles.lyrics}>{hymn.lyrics}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 80, // enough space for back button
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
    textAlign: 'center',
  },
  author: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#bbb',
    marginBottom: 24,
    textAlign: 'center',
  },
  lyrics: {
    fontSize: 18,
    lineHeight: 30,
    color: '#ddd',
    whiteSpace: 'pre-wrap', // preserves line breaks (if supported)
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ff4d4f',
    marginBottom: 12,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6A0DAD',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  backButtonTop: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight! + 10 : 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(106, 13, 173, 0.75)', // purple with transparency
    padding: 10,
    borderRadius: 50,
    shadowColor: '#6A0DAD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
});
