import { readingsData } from '@/data/readingsData';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

// --- Types and Interfaces ---
interface ColorsType {
  primaryBackground: string;
  secondaryBackground: string;
  tertiaryBackground: string;
  accentLight: string;
  accentDark: string;
  todayAccent: string;
  textPrimary: string;
  textSecondary: string;
  textDisabled: string;
  textSelected: string;
  gradientStart: string;
  gradientEnd: string;
  shadowLight: string;
  shadowDark: string;
}

interface TypographyType {
  title: { fontSize: number; fontWeight: string; fontFamily: string };
  subtitle: { fontSize: number; fontWeight: string; fontFamily: string };
  body: { fontSize: number; fontWeight: string; lineHeight: number };
  button: { fontSize: number; fontWeight: string; textTransform: string };
}

interface SpacingType {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

interface BorderRadiusType {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

interface Reading {
  firstReading: { content: string };
}

interface ReadingsData {
  [date: string]: Reading;
}

// --- Design Tokens ---
const Colors: ColorsType = {
  primaryBackground: '#121212',
  secondaryBackground: '#1E1E2D',
  tertiaryBackground: 'rgba(255, 255, 255, 0.1)',
  accentLight: '#FFCA28',
  accentDark: '#FFB300',
  todayAccent: '#FF5722',
  textPrimary: '#E0E0E0',
  textSecondary: '#B0B0B0',
  textDisabled: '#666666',
  textSelected: '#121212',
  gradientStart: '#1E1E2D',
  gradientEnd: '#2A2A4A',
  shadowLight: 'rgba(255, 202, 40, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
};

const Typography: TypographyType = {
  title: { fontSize: 28, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  subtitle: { fontSize: 18, fontWeight: '600', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
  button: { fontSize: 16, fontWeight: '700', textTransform: 'uppercase' },
};

const Spacing: SpacingType = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const BorderRadius: BorderRadiusType = {
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};

// --- Helper Functions ---
const truncateContent = (content: string, limit: number): string => {
  if (content.length <= limit) return content;
  const lastSpaceIndex = content.lastIndexOf(' ', limit);
  return content.slice(0, lastSpaceIndex > -1 ? lastSpaceIndex : limit) + '...';
};

// --- Component ---
const DailyReadingsScreen: React.FC = () => {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);
  const initialDate = readingsData[today] ? today : Object.keys(readingsData)[0] || today;
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const dayPressAnim = useRef(new Animated.Value(1)).current;
  const todayPulseAnim = useRef(new Animated.Value(1)).current;

  // Animation for reading preview
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [selectedDate]);

  // Today pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(todayPulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(todayPulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    ).start();
  }, []);

  // Marked dates for calendar
  const markedDates = useMemo(
    () =>
      Object.keys(readingsData).reduce((acc: Record<string, any>, date: string) => {
        acc[date] = {
          marked: true,
          dotColor: Colors.accentDark,
          activeOpacity: 0,
        };
        if (date === selectedDate) {
          acc[date] = {
            ...acc[date],
            selected: true,
            selectedColor: Colors.accentLight,
            selectedTextColor: Colors.textSelected,
          };
        }
        if (date === today) {
          acc[date] = {
            ...acc[date],
            customStyles: {
              container: { borderColor: Colors.todayAccent, borderWidth: 2 },
              text: { color: Colors.todayAccent },
            },
          };
        }
        return acc;
      }, {}),
    [selectedDate, today],
  );

  const handleDayPress = useCallback(
    (day: DateData) => {
      setSelectedDate(day.dateString);
      Vibration.vibrate(20);
      dayPressAnim.setValue(0.85);
      Animated.spring(dayPressAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }).start();
    },
    [dayPressAnim],
  );

  const handleJumpToToday = useCallback(() => {
    setSelectedDate(today);
    Vibration.vibrate(20);
  }, [today]);

  const handleShare = useCallback(async () => {
    const reading = (readingsData as ReadingsData)[selectedDate];
    if (reading) {
      try {
        await Share.share({
          message: `Daily Reading for ${selectedDate}: ${truncateContent(reading.firstReading.content, 100)}`,
          title: `Daily Reading - ${selectedDate}`,
        });
      } catch (error) {
        console.error('Error sharing reading:', error);
      }
    }
  }, [selectedDate]);

  const reading = (readingsData as ReadingsData)[selectedDate];

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        style={styles.gradientContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.calendarWrapper}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={markedDates}
              theme={{
                backgroundColor: 'transparent',
                calendarBackground: 'transparent',
                dayTextColor: Colors.textPrimary,
                textDisabledColor: Colors.textDisabled,
                monthTextColor: Colors.accentLight,
                arrowColor: Colors.accentLight,
                todayTextColor: Colors.todayAccent,
                selectedDayBackgroundColor: Colors.accentLight,
                selectedDayTextColor: Colors.textSelected,
                textDayFontWeight: '600',
                textMonthFontWeight: '800',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 24,
                textDayHeaderFontSize: 14,
              }}
              style={styles.calendar}
              enableSwipeMonths
              renderArrow={(direction: 'left' | 'right') => (
                <Feather
                  name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
                  size={24}
                  color={Colors.accentLight}
                />
              )}
              dayComponent={({ date, state, marking }: { date: DateData; state: string; marking?: any }) => {
                const isToday = date.dateString === today;
                const isSelected = date.dateString === selectedDate;

                return (
                  <Pressable
                    onPress={() => handleDayPress(date)}
                    style={[
                      styles.dayWrapper,
                      isSelected && styles.selectedDayWrapper,
                      isToday && styles.todayDayWrapper,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Select date ${date.dateString}`}
                  >
                    <Animated.View style={{ transform: [{ scale: isToday ? todayPulseAnim : dayPressAnim }] }}>
                      <Text
                        style={[
                          styles.dayText,
                          state === 'disabled' && styles.disabledDayText,
                          isSelected && styles.selectedDayText,
                          isToday && styles.todayText,
                        ]}
                      >
                        {date.day}
                      </Text>
                    </Animated.View>
                    {marking?.marked && !isSelected && (
                      <View style={styles.dot} />
                    )}
                  </Pressable>
                );
              }}
            />
            <TouchableOpacity
              style={styles.todayButton}
              onPress={handleJumpToToday}
              accessibilityRole="button"
              accessibilityLabel="Jump to today"
            >
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
          </View>

          <Animated.View
            style={[
              styles.readingPreview,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {reading ? (
              <>
                <Text style={styles.readingTitle}>Daily Reading</Text>
                <Text style={styles.readingContentPreview}>
                  {truncateContent(reading.firstReading.content, 250)}
                </Text>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar} />
                </View>
                <View style={styles.actionContainer}>
                  <Pressable
                    style={({ pressed }: { pressed: boolean }) => [
                      styles.fab,
                      pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
                    ]}
                    onPress={() => {
                      Vibration.vibrate(20);
                      router.push(`/daily-readings/${selectedDate}`);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={`View full readings for ${selectedDate}`}
                  >
                    <Text style={styles.fabText}>Read More</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }: { pressed: boolean }) => [
                      styles.shareButton,
                      pressed && { opacity: 0.7, transform: [{ scale: 0.95 }] },
                    ]}
                    onPress={handleShare}
                    accessibilityRole="button"
                    accessibilityLabel="Share reading"
                  >
                    <Feather name="share-2" size={20} color={Colors.textPrimary} />
                  </Pressable>
                </View>
              </>
            ) : (
              <View style={styles.noReadingContainer}>
                <Feather name="book-open" size={48} color={Colors.textDisabled} style={styles.noReadingIcon} />
                <Text style={styles.noReadingText}>No readings available</Text>
                <Text style={styles.noReadingSubText}>Try another date.</Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? Spacing.xl : Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl, // Extra padding for scrollable content
  },
calendarWrapper: {
  backgroundColor: Colors.secondaryBackground,
  borderRadius: BorderRadius.lg,
  padding: Spacing.sm,
  marginBottom: Spacing.md,
  shadowColor: Colors.shadowLight,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 6,
},

calendar: {
  borderWidth: 0,
  transform: [{ scale: 0.85 }],
  alignSelf: 'center',
  marginVertical: -15,
},

  todayButton: {
    alignSelf: 'center',
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    marginTop: Spacing.sm,
  },
  todayButtonText: {
    ...Typography.button,
    color: Colors.textSelected,
  },
  dayWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    margin: Spacing.xs,
  },
  selectedDayWrapper: {
    backgroundColor: Colors.accentLight,
    shadowColor: Colors.shadowLight,
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  todayDayWrapper: {
    borderColor: Colors.todayAccent,
    borderWidth: 2,
  },
  dayText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  selectedDayText: {
    color: Colors.textSelected,
  },
  todayText: {
    color: Colors.todayAccent,
    fontWeight: '700',
  },
  disabledDayText: {
    color: Colors.textDisabled,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accentDark,
    position: 'absolute',
    bottom: 4,
  },
  readingPreview: {
    backgroundColor: Colors.tertiaryBackground,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    shadowColor: Colors.shadowDark,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: Spacing.lg,
  },
  readingTitle: {
    ...Typography.title,
    color: Colors.accentLight,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  readingContentPreview: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  progressContainer: {
    height: 4,
    backgroundColor: Colors.textDisabled,
    borderRadius: BorderRadius.sm,
    marginVertical: Spacing.md,
  },
  progressBar: {
    width: '33%',
    height: '100%',
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.sm,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fab: {
    backgroundColor: Colors.accentLight,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    shadowColor: Colors.shadowLight,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  fabText: {
    ...Typography.button,
    color: Colors.textSelected,
  },
  shareButton: {
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.secondaryBackground,
  },
  noReadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  noReadingIcon: {
    marginBottom: Spacing.md,
  },
  noReadingText: {
    ...Typography.subtitle,
    color: Colors.textDisabled,
    textAlign: 'center',
  },
  noReadingSubText: {
    ...Typography.body,
    color: Colors.textDisabled,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});

export default DailyReadingsScreen;