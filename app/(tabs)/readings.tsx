// app/(tabs)/daily-readings.tsx
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const dailyReadings = [
  {
    date: '2025-07-08',
    title: 'Reading 1',
    content: 'This is the first daily reading content...',
  },
  {
    date: '2025-07-08',
    title: 'Reading 2',
    content: 'This is the second daily reading content...',
  },
];

export default function DailyReadingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
      {dailyReadings.map((reading, index) => (
        <View key={index} style={styles.readingContainer}>
          <Text style={styles.date}>{reading.date}</Text>
          <Text style={styles.title}>{reading.title}</Text>
          <Text style={styles.content}>{reading.content}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  readingContainer: { marginBottom: 24 },
  date: { fontSize: 14, color: '#666', marginBottom: 4 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  content: { fontSize: 16, lineHeight: 24 },
});
