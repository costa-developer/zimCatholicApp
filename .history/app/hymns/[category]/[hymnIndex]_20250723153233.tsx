// app/hymns/[id].tsx
import { sanity } from '@/lib/sanity';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COLORS = {
  background: '#1C1C1C',
  card: '#321a0c',
  text: '#fff3e0',
  subtitle: '#c59152',
  secondcolor: '#492916',
  active: '#FFD700',
};

export default function HymnDetailScreen() {
  const { category, hymnIndex } = useLocalSearchParams<{ category: string; hymnIndex: string }>();
  const router = useRouter();

  const [hymn, setHymn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category || hymnIndex === undefined) return;

    const query = `*[_type == "hymn" && "${category}" in category] | order(title asc) {
      _id,
      title,
      author,
      lyrics,
      category
    }`;

    sanity
      .fetch(query)
      .then((data) => {
        const index = Number(hymnIndex);
        if (index < 0 || index >= data.length) {
          setHymn(null);
        } else {
          setHymn(data[index]);
        }
      })
      .catch((err) => {
        console.error('Error fetching hymns:', err);
        setHymn(null);
      })
      .finally(() => setLoading(false));
  }, [category, hymnIndex]);

  router.replace({
    pathname: '/hymns',
    params: { category },
  });
  
  

  if (loading) {
    return (
      <View style={[styles.screenContainer, { backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: COLORS.text }}>Loading...</Text>
      </View>
    );
  }

  if (!hymn) {
    return (
      <View style={[styles.screenContainer, { backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: COLORS.active, fontSize: 24, fontWeight: 'bold' }}>Hymn not found.</Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: COLORS.secondcolor, borderColor: COLORS.active }]}
          onPress={handleGoBack}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Back to Hymns"
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          <Text style={{ color: COLORS.text, marginLeft: 10 }}>Back to Hymns</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.screenContainer, { backgroundColor: COLORS.background }]}>
      <TouchableOpacity
        style={[styles.backButtonTop, { backgroundColor: COLORS.secondcolor, shadowColor: COLORS.secondcolor }]}
        onPress={handleGoBack}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.title, { color: COLORS.text }]} accessibilityRole="header">
          {hymn.title}
        </Text>
        <Text style={[styles.author, { color: COLORS.subtitle }]}>
          by {hymn.author || 'Unknown'}
        </Text>

        <View style={styles.lyricsContainer} accessible={true} accessibilityLabel={`Lyrics for ${hymn.title}`}>
          <Text style={[styles.lyrics, { color: COLORS.text }]} selectable>
            {hymn.lyrics}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    paddingBottom: 48,
    paddingTop: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 1,
  },
  author: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 28,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  lyricsContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  lyrics: {
    fontSize: 20,
    lineHeight: 36,
    whiteSpace: 'pre-wrap', // preserve formatting
    fontWeight: '400',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 30,
    borderWidth: 1,
    marginTop: 12,
  },
  backButtonText: {
    fontSize: 18,
    marginLeft: 12,
    fontWeight: '700',
  },
  backButtonTop: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight! + 8 : 30,
    left: 12,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(73, 41, 22, 0.8)', // your secondcolor with transparency
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#492916',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 6,
  },
  
});
