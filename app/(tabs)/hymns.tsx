import { useRouter } from 'expo-router';
import {
    Dimensions,
    FlatList,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const CARD_WIDTH = (Dimensions.get('window').width - 48) / 2;

const hymnCategories = [
  { id: 'entrance', title: 'Entrance Hymns', image: require('../../assets/images/a.jpg') },
  { id: 'communion', title: 'Communion Hymns', image: require('../../assets/images/b.jpg') },
  { id: 'recessional', title: 'Recessional Hymns', image: require('../../assets/images/c.jpg') },
  { id: 'offertory', title: 'Offertory Hymns', image: require('../../assets/images/d.jpg') },
  { id: 'thanksgiving', title: 'Thanksgiving Hymns', image: require('../../assets/images/e.jpg') },
  { id: 'marian', title: 'Marian Hymns', image: require('../../assets/images/f.jpg') },
  { id: 'adoration', title: 'Adoration Hymns', image: require('../../assets/images/j.jpg') },
  { id: 'holyspirit', title: 'Holy Spirit Hymns', image: require('../../assets/images/k.jpg') },
];


export default function HymnsScreen() {
  const router = useRouter();

  const onCategoryPress = (categoryId: string) => {
    router.push(`/hymns/${categoryId}`);
  };

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <ImageBackground
        source={require('../../assets/images/pastor.jpg')}
        style={styles.hero}
        imageStyle={{ opacity: 0.9 }}
      >
        <Text style={styles.heroText}>HYMNS</Text>
      </ImageBackground>

      <View style={{ height: 24 }} />

      {/* Categories Grid */}
      <FlatList
        data={hymnCategories}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onCategoryPress(item.id)} activeOpacity={0.85}>
            <ImageBackground
              source={item.image}
              style={styles.card}
              imageStyle={{ borderRadius: 12 }}
            >
              <View style={styles.overlay}>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
            </ImageBackground>
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
    backgroundColor: '#121212',
  },
  hero: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    width: CARD_WIDTH,
    height: 120,
    justifyContent: 'flex-end',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#333',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 10,
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  listContent: {
    paddingBottom: 30,
  },
});
