// Enhanced: Responsive + Light/Dark Theme + Font Scaling (with react-native-responsive-fontsize)

import { hymns } from '@/data/hymns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
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

export default function HymnsListScreen() {
  const { category: categoryFromParams } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const COLORS = colorScheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFromParams || 'all');
  const [filteredHymns, setFilteredHymns] = useState([]);

  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const scrollOffsetY = useRef(0);

  useEffect(() => {
    const filtered = hymns.filter((h) => {
      const categoryMatch = selectedCategory === 'all' || h.category === selectedCategory;
      const searchMatch = h.title.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });
    setFilteredHymns(filtered);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    setSelectedCategory(categoryFromParams || 'all');
  }, [categoryFromParams]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const diff = currentOffset - scrollOffsetY.current;

    if (diff > 0 && currentOffset > 0) {
      Animated.timing(headerTranslateY, {
        toValue: -HEADER_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (diff < 0) {
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    scrollOffsetY.current = currentOffset;
  };

  return (
    <View style={[styles.container, { backgroundColor: COLORS.background }]}> 
      <Animated.View
        style={[styles.header, { transform: [{ translateY: headerTranslateY }], backgroundColor: COLORS.card }]}
      >
        <Text style={[styles.heading, { color: COLORS.text }]}>{selectedCategory.toUpperCase()} HYMNS</Text>

        <TextInput
          placeholder="Search hymns..."
          placeholderTextColor={COLORS.subtitle}
          style={[styles.searchInput, { backgroundColor: COLORS.secondcolor, color: COLORS.text }]}
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
                style={[styles.categoryButton, { backgroundColor: isActive ? COLORS.subtitle : COLORS.secondcolor }]}
                onPress={() => setSelectedCategory(cat.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    color: isActive ? COLORS.card : COLORS.text,
                    fontWeight: isActive ? 'bold' : '500',
                    fontSize: RFValue(13, SCREEN_HEIGHT),
                  }}
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

      <FlatList
        data={filteredHymns}
        keyExtractor={(_, index) => index.toString()}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT + 10 * scale, paddingBottom: 40 * scale, paddingHorizontal: 16 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => router.push(`/hymns/${item.category}/${index}`)}
            activeOpacity={0.85}
            style={styles.itemTouchable}
          >
            <View style={[styles.itemContainer, { backgroundColor: COLORS.secondcolor }]}>
              <View style={[styles.circle, { backgroundColor: COLORS.subtitle }]}>
                <Text style={[styles.number, { color: COLORS.card }]}>{index + 1}</Text>
              </View>
              <Text style={[styles.itemText, { color: COLORS.text }]}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
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
    paddingTop: 16 * scale,
    paddingBottom: 8 * scale,
    zIndex: 10,
    elevation: 10,
  },
  heading: {
    fontSize: RFValue(22, SCREEN_HEIGHT),
    fontWeight: '700',
    marginBottom: 6 * scale,
    textAlign: 'center',
    letterSpacing: 1,
  },
  searchInput: {
    height: 40 * scale,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: RFValue(15, SCREEN_HEIGHT),
    marginBottom: 10 * scale,
  },
  categoryFilter: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    marginBottom: 12 * scale,
    paddingBottom: 6,
  },
  categoryButton: {
    paddingHorizontal: 12 * scale,
    paddingVertical: 8 * scale,
    borderRadius: 18,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 36 * scale,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
});