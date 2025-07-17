import { useFavorites } from '@/contexts/FavoritesContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const router = useRouter();

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No favorites yet.</Text>
      </View>
    );
  }

  const onPressItem = (item: any) => {
    if (item.type === 'prayer') {
      router.push(`/prayers/${item.category}/${item.id}`);
    } else if (item.type === 'hymn') {
      router.push(`/hymns/${item.id}`);
    }
  };

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onPressItem(item)} style={styles.item}>
          <Text style={styles.title}>{item.title}</Text>
          {item.category && <Text style={styles.subtitle}>Category: {item.category}</Text>}
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  emptyText: { fontSize: 18, textAlign: 'center', marginTop: 40, color: '#999' },
  item: { padding: 15, backgroundColor: '#eee', borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
});
