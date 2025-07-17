import { hymns } from '@/data/hymns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Constants
const HEADER_HEIGHT = 140; // Adjust for your header total height (title + search + categories)

const categories = [
  { id: 'all', label: 'Show All' },
  { id: 'advent', label: 'Advent' },
  { id: 'ordinary', label: 'Ordinary Time' },
  { id: 'easter', label: 'Easter' },
  { id: 'christmas', label: 'Christmas' },
];

export default function HymnsListScreen() {
  const { category: categoryFromParams } = useLocalSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromParams || 'all');
  const [filteredHymns, setFilteredHymns] = useState([]);

  // Animated values for header
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const scrollOffsetY = useRef(0);

  // Filter hymns based on category and search
  useEffect(() => {
    const filtered = hymns.filter((h) => {
      const categoryMatch = selectedCategory === 'all' || h.category === selectedCategory;
      const searchMatch = h.title.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });
    setFilteredHymns(filtered);
  }, [searchQuery, selectedCategory]);

  // Update selectedCategory when URL param changes
  useEffect(() => {
    setSelectedCategory(categoryFromParams || 'all');
  }, [categoryFromParams]);

  // Scroll event handler to show/hide header
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - scrollOffsetY.current;

    if (diff > 0 && currentOffset > 0) {
      // Scrolling down - hide header
      Animated.timing(headerTranslateY, {
        toValue: -HEADER_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (diff < 0) {
      // Scrolling up - show header
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    scrollOffsetY.current = currentOffset;
  };

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <Text style={styles.heading}>{selectedCategory.toUpperCase()} HYMNS</Text>

        <TextInput
          placeholder="Search hymns..."
          placeholderTextColor="#c59152"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryFilter}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  isActive && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* Hymns List */}
      <FlatList
        data={filteredHymns}
        keyExtractor={(_, index) => index.toString()}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 10, paddingBottom: 40 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
          onPress={() => router.push(`/hymns/${item.category}/${index}`)}

            activeOpacity={0.85}
            style={styles.itemTouchable}
          >
            <View style={styles.itemContainer}>
              <View style={styles.circle}>
                <Text style={styles.number}>{index + 1}</Text>
              </View>
              <Text style={styles.itemText}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const COLORS = {
  background: '#1C1C1C',
  card: '#321a0c',
  secondcolor: '#492916',
  text: '#fff3e0',
  subtitle: '#c59152',
  active: '#FFD700',
  inactive: '#999',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
    zIndex: 10,
    elevation: 10,
  },
  heading: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
  },
  searchInput: {
    height: 40,
    backgroundColor: COLORS.secondcolor,
    borderRadius: 10,
    paddingHorizontal: 14,
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 10,
  },
  categoryFilter: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.secondcolor,
    borderWidth: 1,
    borderColor: COLORS.secondcolor,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
    minWidth: 100,
  },
  categoryButtonActive: {
    backgroundColor: COLORS.subtitle,
    borderColor: COLORS.subtitle,
  },
  categoryText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: COLORS.card,
    fontWeight: 'bold',
  },
  itemTouchable: {
    borderRadius: 10,
    marginBottom: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondcolor,
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  circle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.subtitle,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  number: {
    color: COLORS.card,
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.text,
    flexShrink: 1,
    fontWeight: '500',
    lineHeight: 22,
  },
});
