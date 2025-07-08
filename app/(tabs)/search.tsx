// app/search.tsx
import { prayersByCategory } from '@/data/prayers';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const hymnList = [
  { id: 'entrance-1', title: 'Entrance Hymn 1' },
  { id: 'communion-1', title: 'Communion Hymn 1' },
  { id: 'recessional-1', title: 'Recessional Hymn 1' },
  // Add your real hymn data here
];

// Flatten prayers into one list with category info for searching
const prayersFlatList = Object.entries(prayersByCategory).flatMap(([category, prayers]) =>
  prayers.map(prayer => ({ ...prayer, category }))
);

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filteredHymns = hymnList.filter(hymn =>
    hymn.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPrayers = prayersFlatList.filter(prayer =>
    prayer.title.toLowerCase().includes(query.toLowerCase())
  );

  const onPressItem = (type: 'hymn' | 'prayer', item: any) => {
    if (type === 'hymn') {
      router.push(`/hymns/${item.id}`); // You can customize this route as needed
    } else {
      router.push(`/prayers/${item.category}/${item.id}`);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search hymns or prayers..."
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
      />
      <FlatList
        data={[...filteredHymns, ...filteredPrayers]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onPressItem(prayersFlatList.includes(item) ? 'prayer' : 'hymn', item)}
            style={styles.item}
          >
            <Text style={styles.title}>{item.title}</Text>
            {item.category && <Text style={styles.subtitle}>Category: {item.category}</Text>}
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => <Text style={styles.noResults}>No results found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  item: {
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  noResults: { marginTop: 40, textAlign: 'center', color: '#999', fontSize: 16 },
});
