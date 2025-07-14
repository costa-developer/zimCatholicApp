import { hymns } from '@/data/hymns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const seasons = [
  { id: 'all', label: 'Show All' },
  { id: 'advent', label: 'Advent' },
  { id: 'christmas', label: 'Christmas' },
  { id: 'lent', label: 'Lent' },
  { id: 'easter', label: 'Easter' },
  { id: 'pentecost', label: 'Pentecost' },
];

export default function HymnsListScreen() {
  const { category } = useLocalSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('all');
  const [filteredHymns, setFilteredHymns] = useState([]);

  const hymnsByCategory =
    category === 'all' || !category
      ? hymns
      : hymns.filter((h) => h.category === category);

  useEffect(() => {
    const filtered = hymnsByCategory.filter((h) => {
      const seasonMatch =
        selectedSeason === 'all' || h.season === 'all' || h.season === selectedSeason;
      const searchMatch = h.title.toLowerCase().includes(searchQuery.toLowerCase());
      return seasonMatch && searchMatch;
    });
    setFilteredHymns(filtered);
  }, [searchQuery, selectedSeason, hymnsByCategory]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{(category || 'all').toUpperCase()} HYMNS</Text>

      <TextInput
        placeholder="Search hymns..."
        placeholderTextColor="#666"
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.seasonFilter}
      >
        {seasons.map((season) => (
          <TouchableOpacity
            key={season.id}
            style={[
              styles.seasonButton,
              selectedSeason === season.id && styles.seasonButtonActive,
            ]}
            onPress={() => setSelectedSeason(season.id)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.seasonText,
                selectedSeason === season.id && styles.seasonTextActive,
              ]}
              numberOfLines={1}
              ellipsizeMode='tail'
            >
              {season.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredHymns}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => router.push(`/hymns/${item.category}/${hymns.indexOf(item)}`)}
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
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02070f',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  searchInput: {
    height: 48,
    backgroundColor: '#0d1117',
    borderColor: '#2e3a45',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    color: '#ffffff',
    fontSize: 16,
  },
  seasonFilter: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
seasonButton: {
  paddingHorizontal: 14,
  paddingVertical: 10,    
  borderRadius: 20,
  backgroundColor: '#0d1117',
  borderWidth: 1,
  borderColor: '#2e3a45',
  marginRight: 10,
  marginBottom: 4,
  justifyContent: 'center', 
  alignItems: 'center',      
  minHeight: 40,            
  minWidth: 80,              
},

  seasonButtonActive: {
    backgroundColor: '#F4A261',
    borderColor: '#F4A261',
  },
  seasonText: {
    color: '#cccccc',
    fontSize: 14,
    fontWeight: '500',
  },
  seasonTextActive: {
    color: '#02070f',
    fontWeight: 'bold',
  },
  itemTouchable: {
    borderRadius: 10,
    marginBottom: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d1117',
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
    backgroundColor: '#F4A261',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  number: {
    color: '#02070f',
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemText: {
    fontSize: 16,
    color: '#ffffff',
    flexShrink: 1,
    fontWeight: '500',
    lineHeight: 22,
  },
  listContent: {
    paddingBottom: 40,
  },
});
