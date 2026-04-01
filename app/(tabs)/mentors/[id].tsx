/**
 * Mentor Detail Route
 * Displays full mentor detail view with books, ideas, recommendations tabs
 */

import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../../core/theme';
import { useMentorsStore } from '../../../modules/mentors/store';
import MentorDetail from '../../../modules/mentors/components/MentorDetail';

export default function MentorDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const mentors = useMentorsStore((s) => s.mentors);
  const savedMentorIds = useMentorsStore((s) => s.savedMentorIds);
  const saveMentor = useMentorsStore((s) => s.saveMentor);
  const unsaveMentor = useMentorsStore((s) => s.unsaveMentor);

  const mentor = mentors.find((m) => m.id === id);

  if (!mentor) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Mentor not found</Text>
      </View>
    );
  }

  const isSaved = savedMentorIds.includes(mentor.id);

  const handleToggleSave = () => {
    if (isSaved) {
      unsaveMentor(mentor.id);
    } else {
      saveMentor(mentor.id);
    }
  };

  return (
    <MentorDetail
      mentor={mentor}
      isSaved={isSaved}
      onToggleSave={handleToggleSave}
      onBack={() => router.back()}
    />
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    ...Typography.headlineMd,
    color: Colors.textTertiary,
  },
});
