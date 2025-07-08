// app/(tabs)/prayers.tsx
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const prayerCategories = [
  { id: 'daily', title: 'Daily Prayers' },
  { id: 'mass', title: 'Mass Prayers' },
  { id: 'rosary', title: 'Rosary Prayers' },
];

export default function PrayersScreen() {
  const router = useRouter();

  const onCategoryPress = (categoryId: string) => {
    router.push(`/prayers/${categoryId}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Prayer Categories</Text>
      <FlatList
        data={prayerCategories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onCategoryPress(item.id)} style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  item: { padding: 15, backgroundColor: '#eee', borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 18 },
});
