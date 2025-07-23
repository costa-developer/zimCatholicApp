import { client } from '@/sanity';
import { Hymn } from '@/types/hymn';
import { useLocalSearchParams, useRouter } from 'expo-router';
import debounce from 'lodash.debounce';
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375;
const HEADER_HEIGHT = 140 * scale;

const categories = [
  { id: 'all', label: 'Show All' },
  { id: 'advent', label: 'Advent' },
  { id: 'ordinary', label: 'Ordinary Time' },
  { id: 'easter', label: 'Easter' },
  { id: 'christmas', label: 'Christmas' },
];

const LIGHT_COLORS = {
  background: '#fffaf4',
  card: '#ffffff',
  secondcolor: '#f0e2d0',
  text: '#2b2b2b',
  subtitle: '#c59152',
  active: '#FFD700',
  inactive: '#999',
};

const DARK_COLORS = {
  background: '#1C1C1C',
  card: '#321a0c',
  secondcolor: '#492916',
  text: '#fff3e0',
  subtitle: '#c59152',
  active: '#FFD700',
  inactive: '#999',
};

// List item with press opacity feedback and author subtitle
const HymnListItem = ({ item, index, COLORS, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

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

export default function HymnsListScreen() {
  const { category: categoryFromParams } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const COLORS = colorScheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromParams || 'all');
  const [allHymns, setAllHymns] = useState<Hymn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const scrollOffsetY = useRef(0);
  const categoryScrollRef = useRef<ScrollView>(null);

  // Debounce search input for performance
  const debouncedSetSearch = useCallback(
    debounce((query) => {
      setDebouncedSearch(query);
    }, 300),
    []
  );

  const onChangeSearch = (text: string) => {
    setSearchQuery(text);
    debouncedSetSearch(text);
  };

  // Scroll category filter so selected category is visible
  const onCategoryPress = (catId: string, index: number) => {
    setSelectedCategory(catId);
    categoryScrollRef.current?.scrollTo({ x: index * 100 - 50, animated: true });
  };

  // Fetch hymns data once
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

  // Update selected category from params if changed
  useEffect(() => {
    setSelectedCategory(categoryFromParams || 'all');
  }, [categoryFromParams]);

  // Filter hymns based on category and debounced search query
  const filteredHymns = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    return allHymns.filter((hymn) => {
      const matchCategory =
        selectedCategory === 'all' || hymn.category?.includes(selectedCategory);
      const matchSearch = hymn.title.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [allHymns, debouncedSearch, selectedCategory]);

  // Animate header hide/show on scroll with shadow
  const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - scrollOffsetY.current;

    if (diff > 5 && currentOffset > HEADER_HEIGHT) {
      Animated.timing(headerTranslateY, {
        toValue: -HEADER_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else if (diff < -5) {
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
      {/* HEADER */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }],
            backgroundColor: COLORS.card,
            borderBottomColor: COLORS.active,
            // Add shadow to header for depth
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
          accessibilityLevel={1}
        >
          {selectedCategory.toUpperCase()} HYMNS
        </Text>

        <View style={styles.searchWrapper}>
          <TextInput
            placeholder="Search hymns..."
            placeholderTextColor={COLORS.subtitle}
            style={[
              styles.searchInput,
              { backgroundColor: COLORS.secondcolor, color: COLORS.text },
            ]}
            value={searchQuery}
            onChangeText={onChangeSearch}
            accessible={true}
            accessibilityLabel="Search hymns"
            accessibilityHint="Enter text to search hymns by title"
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setDebouncedSearch('');
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // larger tap area
              accessibilityRole="button"
              accessibilityLabel="Clear search text"
              style={{ paddingHorizontal: 8 }}
            >
              <Text style={[styles.clearText, { color: COLORS.subtitle }]}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

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
                    borderColor: COLORS.active,
                  },
                ]}
                onPress={() => onCategoryPress(cat.id, index)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`Filter hymns by ${cat.label}`}
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

      {/* LIST */}
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
            paddingTop: HEADER_HEIGHT + 16,
            paddingBottom: 80,
            paddingHorizontal: 16,
          }}
          renderItem={({ item, index }) => (
            <HymnListItem
              item={item}
              index={index}
              COLORS={COLORS}
              onPress={() => router.push(`/hymns/${selectedCategory}/${item._id}`)}
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
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 18 * scale,
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
  },
  searchInput: {
    height: 42 * scale,
    flex: 1,
    fontSize: RFValue(15, SCREEN_HEIGHT),
    borderRadius: 10,
  },
  clearText: {
    fontSize: RFValue(16, SCREEN_HEIGHT),
  },
  categoryFilter: {
    flexDirection: 'row',
    paddingBottom: 6,
  },
  categoryButton: {
    paddingHorizontal: 14 * scale,
    paddingVertical: 8 * scale,
    borderRadius: 18,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 38 * scale,
    minWidth: 90 * scale,
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
    fontSize: 16,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
