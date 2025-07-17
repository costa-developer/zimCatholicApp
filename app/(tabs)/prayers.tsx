// app/(tabs)/prayers.tsx
import { prayerCategories } from '@/data/prayersData';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PrayersScreen() {
  const router = useRouter();

  const onPress = (id: string) => {
    router.push(`/prayers/${id}`);  // pushes main category id
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Prayer Categories</Text>
      <FlatList
        data={prayerCategories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPress(item.id)} style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  item: { backgroundColor: '#eee', padding: 15, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 18 },
});
