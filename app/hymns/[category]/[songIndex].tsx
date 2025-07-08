import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const hymnData = {
  entrance: [
    'COME BLESS THE LORD.\n\nCome bless the Lord,\nAll you servants of the Lord...\n\n(More lyrics here)',
    'HAIL CHRIST, OUR ROYAL PRIEST AND ...\n\nLyrics go here...',
    'LORD, WE GATHER AT YOUR ALTAR.\n\nLyrics go here...',

  ],
  communion: ['COMMUNION SONG 1\n\nLyrics of communion song 1...', 'COMMUNION SONG 2\n\nLyrics...'],
  recessional: ['RECESSIONAL SONG 1\n\nLyrics...', 'RECESSIONAL SONG 2\n\nLyrics...'],
};

export default function SongDetailScreen() {
  const { category, songIndex } = useLocalSearchParams();
  const hymnList = hymnData[category] || [];
  const hymn = hymnList[parseInt(songIndex, 10)];

  if (!hymn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Hymn not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{hymn.split('\n')[0]}</Text>
      <Text style={styles.lyrics}>{hymn.split('\n').slice(1).join('\n')}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#0A8754',
  },
  lyrics: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
