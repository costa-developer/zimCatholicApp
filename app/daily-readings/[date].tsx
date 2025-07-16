// app/(tabs)/daily-readings/[date].tsx

import { DailyReadings, readingsData } from '@/data/readingsData';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ReadingDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();

  if (!date || !(date in readingsData)) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No readings found for this date.</Text>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.backLink}>← Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const dailyReadings: DailyReadings = readingsData[date];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.dateHeader}>📖 Readings for {date}</Text>

      <ReadingSection section={dailyReadings.firstReading} />
      <ReadingSection section={dailyReadings.responsorialPsalm} />
      {dailyReadings.secondReading && <ReadingSection section={dailyReadings.secondReading} />}
      <ReadingSection section={dailyReadings.gospel} />
    </ScrollView>
  );
}

function ReadingSection({ section }: { section: { title: string; content: string } }) {
  return (
    <View style={styles.readingCard}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionContent}>{section.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    flex: 1,
    backgroundColor: '#02070f',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  dateHeader: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F4A261',
    marginBottom: 28,
    textAlign: 'center',
  },
  readingCard: {
    backgroundColor: '#0e121a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#F4A261',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F4A261',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 16,
    color: '#dddddd',
    lineHeight: 26,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#02070f',
  },
  errorText: {
    fontSize: 18,
    color: '#aaaaaa',
    marginBottom: 16,
    textAlign: 'center',
  },
  backLink: {
    color: '#F4A261',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
