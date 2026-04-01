import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '../../core/theme';
import { useStore } from '../../core/store/useStore';
import { useJournalStore } from '../../modules/journal/store';
import { getCurrentPeher, getPeherProgress } from '../../core/peher';
import { getCurrentRank, getNextRank } from '../../core/gamification';

export default function HomeScreen() {
  const router = useRouter();
  const character = useStore((s) => s.character);
  const skills = useStore((s) => s.skills);
  const streakData = useStore((s) => s.streakData);

  const journalEntries = useJournalStore((s) => s.entries);
  const habits = useStore((s) => s.habits);
  const tasks = useStore((s) => s.tasks);

  const peher = getCurrentPeher();
  const rank = getCurrentRank(character.level);
  const nextRank = getNextRank(character.level);
  const peherProgress = getPeherProgress();

  // Today's activity
  const today = new Date().toISOString().split('T')[0];
  const journalToday = journalEntries.filter((e) => e.dateKey === today).length;
  const habitsToday = habits.filter((h) => h.lastCheckIn === today).length;
  const tasksToday = tasks.filter((t) => t.completed && t.createdAt?.startsWith(today)).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Character Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>{character.avatar}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.characterName}>{character.name}</Text>
          <Text style={styles.rankText}>
            {rank.emoji} {rank.name} — Level {character.level}
          </Text>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakCount}>{streakData.currentStreak}</Text>
        </View>
      </View>

      {/* HP / EXP Bars */}
      <View style={styles.barsSection}>
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>HP</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, styles.hpFill, { width: `${(character.hp / character.maxHp) * 100}%` }]} />
          </View>
          <Text style={styles.barValue}>{character.hp}/{character.maxHp}</Text>
        </View>
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>XP</Text>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, styles.xpFill, { width: `${(character.exp / character.expToNextLevel) * 100}%` }]} />
          </View>
          <Text style={styles.barValue}>{character.exp}/{character.expToNextLevel}</Text>
        </View>
      </View>

      {/* Current Peher */}
      <View style={[styles.card, { borderLeftColor: peher.color, borderLeftWidth: 3 }]}>
        <Text style={styles.cardOverline}>CURRENT PEHER</Text>
        <Text style={styles.cardTitle}>{peher.icon} {peher.name} — {peher.meaning}</Text>
        <Text style={styles.cardSubtitle}>{peher.timeLabel}</Text>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${peherProgress * 100}%`, backgroundColor: peher.color }]} />
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🪙</Text>
          <Text style={styles.statValue}>{character.coins}</Text>
          <Text style={styles.statLabel}>COINS</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>💎</Text>
          <Text style={styles.statValue}>{character.ekamTokens}</Text>
          <Text style={styles.statLabel}>EKAM</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={styles.statValue}>{streakData.currentStreak}d</Text>
          <Text style={styles.statLabel}>STREAK</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🏆</Text>
          <Text style={styles.statValue}>{nextRank ? `Lv${nextRank.minLevel}` : 'MAX'}</Text>
          <Text style={styles.statLabel}>NEXT RANK</Text>
        </View>
      </View>

      {/* Today's Activity */}
      <View style={styles.card}>
        <Text style={styles.cardOverline}>TODAY'S ACTIVITY</Text>
        <View style={styles.activityRow}>
          <View style={styles.activityItem}>
            <Text style={styles.activityEmoji}>{'\u270D\uFE0F'}</Text>
            <Text style={styles.activityValue}>{journalToday}</Text>
            <Text style={styles.activityLabel}>Journal</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityEmoji}>{'\u2694\uFE0F'}</Text>
            <Text style={styles.activityValue}>{habitsToday}</Text>
            <Text style={styles.activityLabel}>Habits</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityEmoji}>{'\u2705'}</Text>
            <Text style={styles.activityValue}>{tasksToday}</Text>
            <Text style={styles.activityLabel}>Tasks</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <Pressable
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/peher')}
          >
            <Text style={styles.quickActionEmoji}>{'\uD83D\uDCA1'}</Text>
            <Text style={styles.quickActionLabel}>Log Idea</Text>
          </Pressable>
          <Pressable
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/quest')}
          >
            <Text style={styles.quickActionEmoji}>{'\u2694\uFE0F'}</Text>
            <Text style={styles.quickActionLabel}>New Quest</Text>
          </Pressable>
          <Pressable
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/wellness')}
          >
            <Text style={styles.quickActionEmoji}>{'\uD83E\uDDD8'}</Text>
            <Text style={styles.quickActionLabel}>Meditate</Text>
          </Pressable>
          <Pressable
            style={styles.quickActionButton}
            onPress={() => router.push('/(tabs)/mentors')}
          >
            <Text style={styles.quickActionEmoji}>{'\uD83D\uDCDA'}</Text>
            <Text style={styles.quickActionLabel}>Add Mentor</Text>
          </Pressable>
        </View>
      </View>

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        {skills.map((skill) => (
          <View key={skill.id} style={styles.skillRow}>
            <Text style={styles.skillIcon}>{skill.icon}</Text>
            <View style={styles.skillInfo}>
              <View style={styles.skillHeader}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillLevel}>Lv {skill.level}</Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${(skill.exp / skill.expToNextLevel) * 100}%`, backgroundColor: Colors.primary },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Module Navigation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Explore</Text>
        <View style={styles.moduleGrid}>
          {[
            { emoji: '⚔️', label: 'Quest', desc: 'Tasks & Market', route: '/(tabs)/quest', color: Colors.xp },
            { emoji: '💪', label: 'Wellness', desc: 'Body, Spirit, Nutrition', route: '/(tabs)/wellness', color: Colors.success },
            { emoji: '💰', label: 'Finance', desc: 'SixJars Budget', route: '/(tabs)/finance', color: Colors.difficultyEasy },
            { emoji: '📚', label: 'Mentors', desc: 'Wisdom Library', route: '/(tabs)/mentors', color: Colors.primary },
          ].map((mod) => (
            <Pressable
              key={mod.label}
              style={[styles.moduleCard, { borderLeftColor: mod.color, borderLeftWidth: 3 }]}
              onPress={() => router.push(mod.route as any)}
            >
              <Text style={styles.moduleEmoji}>{mod.emoji}</Text>
              <Text style={styles.moduleLabel}>{mod.label}</Text>
              <Text style={styles.moduleDesc}>{mod.desc}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 60 },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  avatarContainer: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.primary,
  },
  avatar: { fontSize: 28 },
  headerInfo: { flex: 1, marginLeft: Spacing.md },
  characterName: { ...Typography.headlineMd, color: Colors.textPrimary },
  rankText: { ...Typography.bodyMd, color: Colors.primary },
  streakBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  streakEmoji: { fontSize: 16, marginRight: 4 },
  streakCount: { ...Typography.titleSm, color: Colors.textPrimary },

  // Bars
  barsSection: { gap: Spacing.sm, marginBottom: Spacing.lg },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  barLabel: { ...Typography.labelMd, color: Colors.textTertiary, width: 24, textTransform: 'uppercase' },
  barTrack: { flex: 1, height: 8, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 4, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  hpFill: { backgroundColor: Colors.hp },
  xpFill: { backgroundColor: Colors.xp },
  barValue: { ...Typography.labelSm, color: Colors.textTertiary, width: 70, textAlign: 'right' },

  // Cards
  card: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  cardOverline: { ...Typography.labelSm, color: Colors.textTertiary, textTransform: 'uppercase', marginBottom: Spacing.xs },
  cardTitle: { ...Typography.headlineSm, color: Colors.textPrimary, marginBottom: Spacing.xs },
  cardSubtitle: { ...Typography.bodyMd, color: Colors.textSecondary, marginBottom: Spacing.md },

  // Stats Grid
  statsGrid: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: {
    flex: 1, backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    alignItems: 'center', gap: 4,
  },
  statEmoji: { fontSize: 20 },
  statValue: { ...Typography.titleMd, color: Colors.textPrimary },
  statLabel: { ...Typography.labelSm, color: Colors.textTertiary, textTransform: 'uppercase' },

  // Today's Activity
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.md,
  },
  activityItem: { alignItems: 'center', gap: 2 },
  activityEmoji: { fontSize: 22 },
  activityValue: { ...Typography.titleMd, color: Colors.textPrimary },
  activityLabel: { ...Typography.labelSm, color: Colors.textTertiary, textTransform: 'uppercase' },

  // Quick Actions
  quickActionsRow: { flexDirection: 'row', gap: Spacing.sm },
  quickActionButton: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    gap: 4,
  },
  quickActionEmoji: { fontSize: 22 },
  quickActionLabel: { ...Typography.labelSm, color: Colors.textSecondary, textAlign: 'center' },

  // Skills
  section: { marginBottom: Spacing.lg },
  sectionTitle: { ...Typography.headlineMd, color: Colors.textPrimary, marginBottom: Spacing.md },
  skillRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md, gap: Spacing.md },
  skillIcon: { fontSize: 24 },
  skillInfo: { flex: 1 },
  skillHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  skillName: { ...Typography.titleSm, color: Colors.textPrimary },
  skillLevel: { ...Typography.labelMd, color: Colors.primary },

  // Module grid
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  moduleCard: {
    width: '48%', backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg, padding: Spacing.md, gap: 4,
  },
  moduleEmoji: { fontSize: 24 },
  moduleLabel: { ...Typography.titleSm, color: Colors.textPrimary },
  moduleDesc: { ...Typography.labelSm, color: Colors.textTertiary },
});
