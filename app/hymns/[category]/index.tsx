import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const hymnData = {
  entrance: [
    'COME BLESS THE LORD.',
    'HAIL CHRIST, OUR ROYAL PRIEST AND ...',
    'LORD, WE GATHER AT YOUR ALTAR.',
    'ARISE: COME TO YOUR GOD.',
    'AROUND THE ALTAR WE SING.',
    'WE COME TO YOU, LORD JESUS.',
    'TAKE YOUR STEPS TO THE ALTAR.',
    'ALL THE EARTH PROCLAIM THE LORD',
    'WE SHALL GO UP WITH JOY',
  ],
  communion: ['COMMUNION SONG 1', 'COMMUNION SONG 2'],
  recessional: ['RECESSIONAL SONG 1', 'RECESSIONAL SONG 2'],
};

export default function HymnsListScreen() {
  const { category } = useLocalSearchParams();
  const hymns = hymnData[category] || [];

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHymns, setFilteredHymns] = useState(hymns);

  useEffect(() => {
    const filtered = hymns.filter((item) =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredHymns(filtered);
  }, [searchQuery, hymns]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{category?.toString().toUpperCase()} HYMNS</Text>

      <TextInput
        placeholder="Search hymns..."
        placeholderTextColor="#999"
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredHymns}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => router.push(`/hymns/${category}/${index}`)}
          >
            <View style={styles.itemContainer}>
              <View style={styles.circle}>
                <Text style={styles.number}>{index + 1}</Text>
              </View>
              <Text style={styles.itemText}>{item}</Text>
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
    backgroundColor: '#121212', // Deep dark background
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#ffffff',
    textAlign: 'center',
  },
  searchInput: {
    height: 44,
    backgroundColor: '#1e1e1e',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 20,
    color: '#fff',
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#1f1f1f',
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0A8754',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  number: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemText: {
    fontSize: 16,
    color: '#f0f0f0',
    flexShrink: 1,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 40,
  },
});
