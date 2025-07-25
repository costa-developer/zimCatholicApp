// Sanity client used to fetch hymns from the CMS
import { client } from '@/sanity';

// Type definition for hymn data
import { Hymn } from '@/types/hymn';

// React Navigation + search params
import { useLocalSearchParams, useRouter } from 'expo-router';

// Debounce utility for performance on search input
import debounce from 'lodash.debounce';

// React core and React Native components/hooks
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';

// Constants for screen dimensions and header
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // Used for responsive scaling
const HEADER_HEIGHT = 140 * scale; // Scroll-hideable header height

// List of categories for filtering hymns
const categories = [
  { id: 'all', label: 'Show All' },
  { id: 'advent', label: 'Advent' },
  { id: 'ordinary', label: 'Ordinary Time' },
  { id: 'easter', label: 'Easter' },
  { id: 'christmas', label: 'Christmas' },
];

// Light theme color set
const LIGHT_COLORS = {
  background: '#fffaf4',
  card: '#ffffff',
  secondcolor: '#f0e2d0',
  text: '#2b2b2b',
  subtitle: '#c59152',
  active: '#FFD700',
  inactive: '#999',
};

// Dark theme color set
const DARK_COLORS = {
  background: '#321a0c',
  card: '#321a0c',
  secondcolor: '#492916',
  text: '#fff3e0',
  subtitle: '#c59152',
  active: '#FFD700',
  inactive: '#999',
};

/**
 * HymnListItem
 * A component representing each hymn in the list with a fade-in animation.
 * Includes hymn title and author, number in circle, and onPress navigation.
 */
interface HymnListItemProps {
  item: Hymn;
  index: number;
  COLORS: typeof LIGHT_COLORS;
  onPress: () => void;
}

const HymnListItem: React.FC<HymnListItemProps> = ({ item, index, COLORS, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Animate fade-in of each hymn item
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.itemTouchable}
      activeOpacity={0.6}
      accessibilityRole="button"
      accessibilityLabel={`Hymn titled ${item.title}, by ${item.author || 'unknown author'}`}
    >
      <Animated.View
        style={[
          styles.itemContainer,
          { backgroundColor: COLORS.secondcolor, opacity: fadeAnim },
          styles.shadow,
        ]}
      >
        <View style={[styles.circle, { backgroundColor: COLORS.subtitle }]}>
          <Text style={[styles.number, { color: COLORS.card }]}>{index + 1}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={[styles.itemText, { color: COLORS.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          {item.author ? (
            <Text
              style={[styles.authorText, { color: COLORS.inactive }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.author}
            </Text>
          ) : null}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

/**
 * Main screen to display list of hymns.
 * - Includes category filtering, search input with debounce, and animated scroll header.
 */
export default function HymnsListScreen() {
  const { category: categoryFromParams } = useLocalSearchParams<{
    category?: string;
  }>();  
  const router = useRouter();
  const colorScheme = useColorScheme(); // detect light/dark mode
  const COLORS = colorScheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromParams || 'all');
  const [allHymns, setAllHymns] = useState<Hymn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const headerTranslateY = useRef(new Animated.Value(0)).current; // controls header visibility
  const scrollOffsetY = useRef(0); // store scroll offset
  const categoryScrollRef = useRef<ScrollView>(null); // horizontal scroll ref

  // Debounce input to avoid triggering search on every keystroke
  const debouncedSetSearch = useCallback(
    debounce((query: string) => {
      setDebouncedSearch(query);
    }, 300),
    []
  );
  

  const onChangeSearch = (text: string) => {
    setSearchQuery(text);
    debouncedSetSearch(text);
  };

  // Change selected category and scroll tab bar
  const onCategoryPress = (catId: string, index: number) => {
    setSelectedCategory(catId);
    categoryScrollRef.current?.scrollTo({ x: index * 100 - 50, animated: true });
  };

  // Fetch hymns from Sanity backend on first load
  useEffect(() => {
    const fetchHymns = async () => {
      try {
        const data: Hymn[] = await client.fetch(`*[_type == "hymn"]{
          _id,
          title,
          author,
          lyrics,
          category
        }`);
        setAllHymns(data);
      } catch (err) {
        console.error('Error fetching hymns:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHymns();
  }, []);

  // Update selected category when route param changes
  useEffect(() => {
    setSelectedCategory(categoryFromParams || 'all');
  }, [categoryFromParams]);

  // Filter hymns by category and search term
  const filteredHymns = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return allHymns.filter((hymn) => {
      const matchCategory =
        selectedCategory === 'all' || hymn.category?.includes(selectedCategory);
      const matchSearch = hymn.title.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [allHymns, debouncedSearch, selectedCategory]);

  // Hide/show header on scroll
  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - scrollOffsetY.current;

    if (diff > 5 && currentOffset > HEADER_HEIGHT) {
      // scroll down → hide header
      Animated.timing(headerTranslateY, {
        toValue: -HEADER_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else if (diff < -5) {
      // scroll up → show header
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }

    scrollOffsetY.current = currentOffset;
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}>
      {/* HEADER: contains title, search bar, and category tabs */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }],
            backgroundColor: COLORS.card,
            borderBottomColor: COLORS.card,
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
              },
              android: {
                elevation: 6,
              },
            }),
          },
        ]}
      >
        <Text
          style={[styles.heading, { color: COLORS.text }]}
          accessibilityRole="header"
        >
          {selectedCategory.toUpperCase()} HYMNS
        </Text>

        {/* SEARCH BAR */}
        <View style={styles.searchWrapper}>
          <TextInput
            placeholder="Search hymns..."
            placeholderTextColor={COLORS.text}
            style={[
              styles.searchInput,
              { backgroundColor: COLORS.secondcolor, color: COLORS.text },
            ]}
            value={searchQuery}
            onChangeText={onChangeSearch}
            accessible={true}
            accessibilityLabel="Search hymns"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {/* CLEAR BUTTON */}
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setDebouncedSearch('');
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="button"
              accessibilityLabel="Clear search text"
              style={{ paddingHorizontal: 8 }}
            >
              <Text style={[styles.clearText, { color: COLORS.subtitle }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* CATEGORY TABS */}
        <ScrollView
          ref={categoryScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryFilter}
          accessibilityRole="tablist"
        >
          {categories.map((cat, index) => {
            const isActive = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor: isActive ? COLORS.subtitle : COLORS.secondcolor,
                    borderWidth: isActive ? 1 : 0,
                    borderColor: COLORS.card,
                  },
                ]}
                onPress={() => onCategoryPress(cat.id, index)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={{
                    color: isActive ? COLORS.card : COLORS.text,
                    fontWeight: isActive ? 'bold' : '500',
                    fontSize: RFValue(13, SCREEN_HEIGHT),
                  }}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* HYMN LIST OR LOADING STATE */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.subtitle} />
          <Text style={[styles.loadingText, { color: COLORS.subtitle }]}>
            Loading hymns...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredHymns}
          keyExtractor={(item) => item._id}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{
            paddingTop: HEADER_HEIGHT + 40,
            paddingBottom: 80,
            paddingHorizontal: 16,
          }}
          renderItem={({ item, index }) => (
            <HymnListItem
              item={item}
              index={index}
              COLORS={COLORS}
              onPress={() =>
                router.push(
                  `/hymns/${selectedCategory}/${item._id}` as `/hymns/${string}/${string}`
                )
              }                        
            />
          )}
          ListEmptyComponent={() => (
            <View style={{ marginTop: 100, alignItems: 'center' }}>
              <Text style={{ color: COLORS.subtitle, fontSize: 16 }}>
                No hymns found.
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 20 : 0,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 18 * scale + (Platform.OS === 'android' ? 10 : 0),
    paddingBottom: 10 * scale,
    zIndex: 10,
    elevation: 10,
    borderBottomWidth: 0.3,
  },
  heading: {
    fontSize: RFValue(22, SCREEN_HEIGHT),
    fontWeight: '700',
    marginBottom: 6 * scale,
    textAlign: 'center',
    letterSpacing: 1,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000010',
    borderRadius: 10,
    marginBottom: 10 * scale,
    paddingHorizontal: 10,
    minHeight: 44,
  },
  searchInput: {
    height: 42 * scale,
    flex: 1,
    fontSize: RFValue(15, SCREEN_HEIGHT),
    borderRadius: 10,
    padding: 5,
    textAlign: 'center',
  },
  clearText: {
    fontSize: RFValue(16, SCREEN_HEIGHT),
  },
  categoryFilter: {
    flexDirection: 'row',
    paddingBottom: 6,
    paddingHorizontal: 6,
  },
  categoryButton: {
    paddingHorizontal: 14 * scale,
    paddingVertical: 8 * scale,
    borderRadius: 18,
    marginRight: 10,
    minHeight: 38 * scale,
    minWidth: 90 * scale,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTouchable: {
    borderRadius: 10,
    marginBottom: 12 * scale,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12 * scale,
    borderRadius: 10,
  },
  circle: {
    width: 30 * scale,
    height: 30 * scale,
    borderRadius: 15 * scale,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  number: {
    fontWeight: 'bold',
    fontSize: RFValue(13, SCREEN_HEIGHT),
  },
  itemText: {
    fontSize: RFValue(15, SCREEN_HEIGHT),
    flexShrink: 1,
    fontWeight: '500',
    lineHeight: RFValue(20, SCREEN_HEIGHT),
  },
  authorText: {
    fontSize: RFValue(12, SCREEN_HEIGHT),
    fontWeight: '400',
    lineHeight: RFValue(16, SCREEN_HEIGHT),
    marginTop: 2,
    fontStyle: 'italic',
  },
  loadingContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: RFValue(16, SCREEN_HEIGHT),
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
