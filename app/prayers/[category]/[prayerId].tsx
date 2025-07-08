import { useFavorites } from '@/contexts/FavoritesContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const prayerTexts: Record<string, string> = {
  'our-father': `Our Father, who art in heaven, hallowed be thy name...`,
  'hail-mary': `Hail Mary, full of grace, the Lord is with thee...`,
  'gloria': `Glory to God in the highest, and on earth peace...`,
  'creed': `I believe in one God, the Father Almighty...`,
  'hail-holy-queen': `Hail, Holy Queen, Mother of Mercy...`,
  'fatima-prayer': `O my Jesus, forgive us our sins, save us from the fires of hell...`,
};

export default function PrayerDetailScreen() {
  const { prayerId, category } = useLocalSearchParams();
  
  if (!prayerId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Prayer ID not specified</Text>
      </View>
    );
  }

  const content = prayerTexts[prayerId];
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!content) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Prayer not found</Text>
      </View>
    );
  }

  const favorite = isFavorite(prayerId);

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{prayerId.replace(/-/g, ' ')}</Text>
        <TouchableOpacity
          onPress={() =>
            toggleFavorite({
              id: prayerId,
              title: prayerId.replace(/-/g, ' '),
              category: category || '',
              type: 'prayer',
            })
          }
        >
          <MaterialIcons name={favorite ? 'favorite' : 'favorite-border'} size={28} color={favorite ? 'red' : 'gray'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.content}>{content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  content: { fontSize: 18, lineHeight: 28 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
});
