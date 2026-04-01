import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../core/theme';
import { useStore } from '../../core/store/useStore';

export default function HabitsScreen() {
  const habits = useStore((s) => s.habits);
  const checkInHabit = useStore((s) => s.checkInHabit);
  const character = useStore((s) => s.character);

  const goodHabits = habits.filter((h) => h.type === 'good');
  const badHabits = habits.filter((h) => h.type === 'bad');
  const today = new Date().toISOString().split('T')[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Habits</Text>

      {/* Daily XP Bar */}
      <View style={styles.xpBar}>
        <Text style={styles.xpLabel}>Daily XP: {character.exp}/{character.expToNextLevel}</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${(character.exp / character.expToNextLevel) * 100}%` }]} />
        </View>
      </View>

      {/* Good Habits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Good Habits</Text>
        {goodHabits.length === 0 ? (
          <Text style={styles.emptyText}>No good habits yet. Add one to start earning XP!</Text>
        ) : (
          goodHabits.map((habit) => {
            const checkedToday = habit.lastCheckIn === today;
            return (
              <Pressable
                key={habit.id}
                style={[styles.habitCard, styles.goodHabitCard]}
                onPress={() => !checkedToday && checkInHabit(habit.id)}
              >
                <View style={styles.habitInfo}>
                  <Text style={styles.habitTitle}>{habit.title}</Text>
                  <Text style={styles.habitReward}>+{habit.expReward} XP  +{habit.coinReward} Coins</Text>
                </View>
                <View style={[styles.checkCircle, checkedToday && styles.checkCircleChecked]}>
                  {checkedToday && <Text style={styles.checkMark}>✓</Text>}
                </View>
              </Pressable>
            );
          })
        )}
      </View>

      {/* Bad Habits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bad Habits</Text>
        {badHabits.length === 0 ? (
          <Text style={styles.emptyText}>No bad habits tracked. Add one to stay accountable.</Text>
        ) : (
          badHabits.map((habit) => {
            const checkedToday = habit.lastCheckIn === today;
            return (
              <Pressable
                key={habit.id}
                style={[styles.habitCard, styles.badHabitCard]}
                onPress={() => !checkedToday && checkInHabit(habit.id)}
              >
                <View style={styles.habitInfo}>
                  <Text style={styles.habitTitle}>{habit.title}</Text>
                  <Text style={styles.habitPenalty}>-{habit.hpPenalty} HP</Text>
                </View>
                <Text style={styles.skullIcon}>{checkedToday ? '💀' : '⚠️'}</Text>
              </Pressable>
            );
          })
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 60 },
  title: { ...Typography.displaySm, color: Colors.primary, marginBottom: Spacing.lg },

  xpBar: { marginBottom: Spacing.xl },
  xpLabel: { ...Typography.labelMd, color: Colors.textSecondary, marginBottom: Spacing.xs, textTransform: 'uppercase' },
  barTrack: { height: 8, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4, backgroundColor: Colors.xp },

  section: { marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.headlineSm, color: Colors.textPrimary, marginBottom: Spacing.md },
  emptyText: { ...Typography.bodyMd, color: Colors.textTertiary, fontStyle: 'italic' },

  habitCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    marginBottom: Spacing.sm, borderLeftWidth: 3,
  },
  goodHabitCard: { borderLeftColor: Colors.success },
  badHabitCard: { borderLeftColor: Colors.danger },
  habitInfo: { flex: 1 },
  habitTitle: { ...Typography.titleSm, color: Colors.textPrimary },
  habitReward: { ...Typography.labelSm, color: Colors.success, marginTop: 2 },
  habitPenalty: { ...Typography.labelSm, color: Colors.danger, marginTop: 2 },
  checkCircle: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 2, borderColor: Colors.success,
    justifyContent: 'center', alignItems: 'center',
  },
  checkCircleChecked: { backgroundColor: Colors.success },
  checkMark: { color: '#fff', fontSize: 16, fontWeight: '700' },
  skullIcon: { fontSize: 24 },
});
