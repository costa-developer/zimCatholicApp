// Imports for Sanity client, types, icons, routing, and React Native components
import { sanity } from '@/lib/sanity';
import { Hymn } from '@/types/hymn';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// Main detail screen component for rendering hymn lyrics
export default function HymnDetailScreen() {
  // Retrieve route params (category and hymn ID)
  const { category, hymnId } = useLocalSearchParams<{ category: string; hymnId: string }>();
  const router = useRouter();

  // Local state for fetched hymn data and loading indicator
  const [hymn, setHymn] = useState<Hymn | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch hymn by ID on component mount
  useEffect(() => {
    if (!hymnId) return;

    const query = `*[_type == "hymn" && _id == $id][0] {
      _id,
      title,
      author,
      lyrics,
      category
    }`;

    // Sanity client fetch
    sanity
      .fetch(query, { id: hymnId })
      .then((data) => {
        setHymn(data ?? null);
      })
      .catch((err) => {
        console.error('Error fetching hymn:', err);
        setHymn(null);
      })
      .finally(() => setLoading(false));
  }, [hymnId]);

  // Return user to previous hymn category screen
  const handleGoBack = () => {
    router.replace({
      pathname: '/hymns', 
      params: { category },
    });
  };

  // Loading state display while fetching data
  if (loading) {
    return (
      <View style={[styles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: COLORS.text }}>Loading...</Text>
      </View>
    );
  }

  // Error state if no hymn found
  if (!hymn) {
    return (
      <View style={[styles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
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

  // Render hymn content
  return (
    <View style={styles.screenContainer}>
      {/* Floating back button (top left corner) */}
      <TouchableOpacity
        style={styles.backButtonTop}
        onPress={handleGoBack}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
      </TouchableOpacity>

      {/* Main scrollable content area */}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hymn title */}
        <Text style={styles.title} accessibilityRole="header">
          {hymn.title}
        </Text>

        {/* Author (if available) */}
        <Text style={styles.author}>
          by {hymn.author || 'Unknown'}
        </Text>

        {/* Hymn lyrics */}
        <View
          style={styles.lyricsContainer}
          accessible={true}
          accessibilityLabel={`Lyrics for ${hymn.title}`}
        >
          <Text style={styles.lyrics} selectable>
            {hymn.lyrics}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// App-wide color scheme used for styling
const COLORS = {
  background: '#2e1a10',
  card: '#3e2616', 
  secondcolor: '#5a3b23',
  text: '#fff3e0', 
  subtitle: '#e0a060', 
  active: '#f9cc48',     
};

// Stylesheet scoped to this screen only
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    paddingBottom: 60,
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: COLORS.text,
    letterSpacing: 1.2,
  },
  author: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: COLORS.subtitle,
    marginBottom: 24,
  },
  lyricsContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  lyrics: {
    fontSize: 18,
    lineHeight: 30,
    fontWeight: '400',
    color: COLORS.text,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.active,
    marginTop: 20,
    backgroundColor: COLORS.secondcolor,
  },
  backButtonTop: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight! + 8 : 30,
    left: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(90, 59, 35, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.secondcolor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
  },
});
