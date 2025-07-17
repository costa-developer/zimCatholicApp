import { prayersBySubCategory } from '@/data/prayersList';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PrayersListScreen() {
  const router = useRouter();
  const { categoryId, subCategoryId } = useLocalSearchParams();

  const prayers = prayersBySubCategory[subCategoryId ?? ''] ?? [];

  const onPress = (prayerId: string) => {
    router.push(`/prayers/${categoryId}/${subCategoryId}/${prayerId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Prayers</Text>
      <FlatList
        data={prayers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPress(item.id)} style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.noPrayers}>No prayers found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  item: { backgroundColor: '#eee', padding: 15, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 18 },
  noPrayers: { fontSize: 16, color: 'gray', textAlign: 'center', marginTop: 40 },
});
