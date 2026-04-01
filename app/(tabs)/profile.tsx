import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '../../core/theme';
import { useStore } from '../../core/store/useStore';
import { getCurrentRank, DEFAULT_RANKS } from '../../core/gamification';

export default function ProfileScreen() {
  const router = useRouter();
  const character = useStore((s) => s.character);
  const skills = useStore((s) => s.skills);
  const streakData = useStore((s) => s.streakData);
  const currentRank = getCurrentRank(character.level);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Settings Gear */}
      <View style={styles.settingsRow}>
        <View style={{ flex: 1 }} />
        <Pressable
          style={styles.settingsButton}
          onPress={() => router.push('/(tabs)/settings')}
        >
          <Text style={styles.settingsIcon}>{'\u2699\uFE0F'}</Text>
        </Pressable>
      </View>

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarRing}>
          <Text style={styles.avatar}>{character.avatar}</Text>
        </View>
        <Text style={styles.name}>{character.name}</Text>
        <Text style={styles.rankBadge}>{currentRank.emoji} {currentRank.name} — Level {character.level}</Text>
      </View>

      {/* Skills Radar (simplified as bars) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skill Pillars</Text>
        {skills.map((skill) => (
          <View key={skill.id} style={styles.skillBar}>
            <View style={styles.skillLabelRow}>
              <Text style={styles.skillIcon}>{skill.icon}</Text>
              <Text style={styles.skillName}>{skill.name}</Text>
              <Text style={styles.skillLevel}>Lv {skill.level}</Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[styles.barFill, { width: `${(skill.exp / skill.expToNextLevel) * 100}%` }]}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Rank Ladder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rank Ladder</Text>
        <View style={styles.rankLadder}>
          {[...DEFAULT_RANKS].reverse().map((rank) => {
            const isCurrentOrBelow = character.level >= rank.minLevel;
            const isCurrent = rank.name === currentRank.name;
            return (
              <View key={rank.name} style={[styles.rankRow, isCurrent && styles.rankRowActive]}>
                <Text style={[styles.rankEmoji, !isCurrentOrBelow && styles.rankLocked]}>{rank.emoji}</Text>
                <Text style={[styles.rankName, !isCurrentOrBelow && styles.rankLocked]}>{rank.name}</Text>
                <Text style={styles.rankLevel}>Lv {rank.minLevel}</Text>
                {isCurrent && <View style={styles.currentDot} />}
              </View>
            );
          })}
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsGrid}>
          {[
            { label: 'Total XP', value: `${character.exp}`, icon: '✨' },
            { label: 'EKAM Earned', value: `${character.ekamTokens}`, icon: '💎' },
            { label: 'Current Streak', value: `${streakData.currentStreak}d`, icon: '🔥' },
            { label: 'Longest Streak', value: `${streakData.longestStreak}d`, icon: '🏅' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
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

  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Spacing.sm,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: { fontSize: 20 },

  profileHeader: { alignItems: 'center', marginBottom: Spacing.xxl },
  avatarRing: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: Colors.primary,
    marginBottom: Spacing.md,
  },
  avatar: { fontSize: 40 },
  name: { ...Typography.headlineLg, color: Colors.textPrimary },
  rankBadge: { ...Typography.titleSm, color: Colors.primary, marginTop: Spacing.xs },

  section: { marginBottom: Spacing.xl },
  sectionTitle: { ...Typography.headlineSm, color: Colors.textPrimary, marginBottom: Spacing.md },

  skillBar: { marginBottom: Spacing.md },
  skillLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: Spacing.sm },
  skillIcon: { fontSize: 18 },
  skillName: { ...Typography.titleSm, color: Colors.textPrimary, flex: 1 },
  skillLevel: { ...Typography.labelMd, color: Colors.primary },
  barTrack: { height: 6, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3, backgroundColor: Colors.primary },

  rankLadder: { gap: Spacing.xs },
  rankRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md, padding: Spacing.md, gap: Spacing.md,
  },
  rankRowActive: { borderWidth: 1, borderColor: Colors.primary, backgroundColor: Colors.surfaceContainerHigh },
  rankEmoji: { fontSize: 20 },
  rankName: { ...Typography.titleSm, color: Colors.textPrimary, flex: 1 },
  rankLevel: { ...Typography.labelMd, color: Colors.textTertiary },
  rankLocked: { opacity: 0.3 },
  currentDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  statCard: {
    width: '48%', backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg, padding: Spacing.md,
    alignItems: 'center', gap: 4,
  },
  statIcon: { fontSize: 20 },
  statValue: { ...Typography.titleMd, color: Colors.textPrimary },
  statLabel: { ...Typography.labelSm, color: Colors.textTertiary, textTransform: 'uppercase' },
});
