/**
 * EKAM Onboarding Wizard — 8-step character creation
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '../../core/theme';
import { useStore } from '../../core/store/useStore';
import { Difficulty } from '../../core/gamification/types';
import GlowCard from '../../components/GlowCard';
import AnimatedButton from '../../components/AnimatedButton';
import ProgressBar from '../../components/ProgressBar';

const TOTAL_STEPS = 8;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const AVATARS = ['🧘', '🥷', '🦁', '🐉', '🔥', '⚡', '🌟', '🎯', '🛡️', '🗡️', '🧙', '🦅'];

const DIFFICULTY_OPTIONS: Array<{
  value: Difficulty;
  label: string;
  emoji: string;
  description: string;
  color: string;
}> = [
  {
    value: 'easy',
    label: 'Easy',
    emoji: '🌱',
    description: 'Gentle progression. Great for building consistency without pressure.',
    color: Colors.difficultyEasy,
  },
  {
    value: 'normal',
    label: 'Normal',
    emoji: '⚔️',
    description: 'Balanced challenge. Rewards discipline with steady growth.',
    color: Colors.difficultyMedium,
  },
  {
    value: 'hardcore',
    label: 'Hardcore',
    emoji: '💀',
    description: 'Punishing but rewarding. Miss a day and feel the pain.',
    color: Colors.difficultyHard,
  },
];

const SKILLS = [
  { id: 'mind', name: 'Mind', icon: '🧠' },
  { id: 'discipline', name: 'Discipline', icon: '⚔️' },
  { id: 'wellness', name: 'Wellness', icon: '💪' },
  { id: 'wisdom', name: 'Wisdom', icon: '📖' },
  { id: 'wealth', name: 'Wealth', icon: '💰' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const loginWithOnboarding = useStore((s) => s.loginWithOnboarding);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🧘');
  const [masterObjective, setMasterObjective] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [goodHabitName, setGoodHabitName] = useState('');
  const [goodHabitSkill, setGoodHabitSkill] = useState('discipline');
  const [badHabitName, setBadHabitName] = useState('');
  const [badHabitSkill, setBadHabitSkill] = useState('discipline');

  const canProceed = useCallback(() => {
    switch (step) {
      case 0: return name.trim().length >= 2;
      case 1: return !!avatar;
      case 2: return masterObjective.trim().length >= 3;
      case 3: return !!difficulty;
      case 4: return goodHabitName.trim().length >= 2;
      case 5: return badHabitName.trim().length >= 2;
      default: return true;
    }
  }, [step, name, avatar, masterObjective, difficulty, goodHabitName, badHabitName]);

  const nextStep = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    const initialHabits: Array<{
      title: string;
      type: 'good' | 'bad';
      skillId: string;
    }> = [];

    if (goodHabitName.trim()) {
      initialHabits.push({
        title: goodHabitName.trim(),
        type: 'good',
        skillId: goodHabitSkill,
      });
    }
    if (badHabitName.trim()) {
      initialHabits.push({
        title: badHabitName.trim(),
        type: 'bad',
        skillId: badHabitSkill,
      });
    }

    loginWithOnboarding({
      name: name.trim(),
      avatar,
      difficulty,
      masterObjective: masterObjective.trim(),
      initialHabits,
    });

    router.replace('/(tabs)');
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return <StepName name={name} setName={setName} />;
      case 1:
        return <StepAvatar avatar={avatar} setAvatar={setAvatar} />;
      case 2:
        return <StepObjective objective={masterObjective} setObjective={setMasterObjective} />;
      case 3:
        return <StepDifficulty difficulty={difficulty} setDifficulty={setDifficulty} />;
      case 4:
        return (
          <StepGoodHabit
            habitName={goodHabitName}
            setHabitName={setGoodHabitName}
            skillId={goodHabitSkill}
            setSkillId={setGoodHabitSkill}
          />
        );
      case 5:
        return (
          <StepBadHabit
            habitName={badHabitName}
            setHabitName={setBadHabitName}
            skillId={badHabitSkill}
            setSkillId={setBadHabitSkill}
          />
        );
      case 6:
        return (
          <StepReview
            name={name}
            avatar={avatar}
            difficulty={difficulty}
            masterObjective={masterObjective}
            goodHabit={goodHabitName}
            badHabit={badHabitName}
          />
        );
      case 7:
        return <StepWelcome name={name} avatar={avatar} />;
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <ProgressBar value={(step + 1) / TOTAL_STEPS} />
        <Text style={styles.stepIndicator}>
          {step + 1} / {TOTAL_STEPS}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          key={step}
          entering={FadeInRight.duration(300)}
          exiting={FadeOutLeft.duration(200)}
          style={styles.stepWrapper}
        >
          {renderStepContent()}
        </Animated.View>
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 && step < TOTAL_STEPS - 1 && (
          <AnimatedButton
            title="Back"
            variant="ghost"
            onPress={prevStep}
          />
        )}
        <View style={styles.footerSpacer} />
        {step < TOTAL_STEPS - 1 ? (
          <AnimatedButton
            title="Continue"
            variant="primary"
            onPress={nextStep}
            disabled={!canProceed()}
          />
        ) : (
          <AnimatedButton
            title="Enter EKAM"
            variant="primary"
            icon="🚀"
            onPress={handleComplete}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Step Components ───────────────────────────────────────────────

function StepName({ name, setName }: { name: string; setName: (v: string) => void }) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepEmoji}>✍️</Text>
      <Text style={styles.stepTitle}>What shall we call you?</Text>
      <Text style={styles.stepSubtitle}>Choose a name for your character</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name..."
        placeholderTextColor={Colors.textTertiary}
        autoFocus
        maxLength={20}
      />
    </View>
  );
}

function StepAvatar({
  avatar,
  setAvatar,
}: {
  avatar: string;
  setAvatar: (v: string) => void;
}) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.selectedAvatar}>{avatar}</Text>
      <Text style={styles.stepTitle}>Choose your avatar</Text>
      <Text style={styles.stepSubtitle}>This will represent you on your journey</Text>
      <View style={styles.avatarGrid}>
        {AVATARS.map((a) => (
          <Pressable
            key={a}
            onPress={() => setAvatar(a)}
            style={[
              styles.avatarCell,
              avatar === a && styles.avatarSelected,
            ]}
          >
            <Text style={styles.avatarEmoji}>{a}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function StepObjective({
  objective,
  setObjective,
}: {
  objective: string;
  setObjective: (v: string) => void;
}) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepEmoji}>🎯</Text>
      <Text style={styles.stepTitle}>Your master objective</Text>
      <Text style={styles.stepSubtitle}>
        What is the one thing you want to achieve above all else?
      </Text>
      <TextInput
        style={[styles.input, styles.inputMultiline]}
        value={objective}
        onChangeText={setObjective}
        placeholder="e.g., Build a life of discipline and freedom..."
        placeholderTextColor={Colors.textTertiary}
        multiline
        maxLength={200}
      />
    </View>
  );
}

function StepDifficulty({
  difficulty,
  setDifficulty,
}: {
  difficulty: Difficulty;
  setDifficulty: (v: Difficulty) => void;
}) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepEmoji}>⚡</Text>
      <Text style={styles.stepTitle}>Choose your difficulty</Text>
      <Text style={styles.stepSubtitle}>This affects XP curves and HP penalties</Text>
      <View style={styles.difficultyList}>
        {DIFFICULTY_OPTIONS.map((opt) => (
          <GlowCard
            key={opt.value}
            selected={difficulty === opt.value}
            glowColor={opt.color}
            onPress={() => setDifficulty(opt.value)}
            style={styles.difficultyCard}
          >
            <View style={styles.difficultyHeader}>
              <Text style={styles.difficultyEmoji}>{opt.emoji}</Text>
              <Text style={[styles.difficultyLabel, { color: opt.color }]}>
                {opt.label}
              </Text>
            </View>
            <Text style={styles.difficultyDesc}>{opt.description}</Text>
          </GlowCard>
        ))}
      </View>
    </View>
  );
}

function StepGoodHabit({
  habitName,
  setHabitName,
  skillId,
  setSkillId,
}: {
  habitName: string;
  setHabitName: (v: string) => void;
  skillId: string;
  setSkillId: (v: string) => void;
}) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepEmoji}>✅</Text>
      <Text style={styles.stepTitle}>Your first good habit</Text>
      <Text style={styles.stepSubtitle}>
        A daily practice you want to build
      </Text>
      <TextInput
        style={styles.input}
        value={habitName}
        onChangeText={setHabitName}
        placeholder="e.g., Meditate for 10 minutes"
        placeholderTextColor={Colors.textTertiary}
        maxLength={50}
      />
      <Text style={styles.skillLabel}>Related skill</Text>
      <View style={styles.skillRow}>
        {SKILLS.map((s) => (
          <Pressable
            key={s.id}
            onPress={() => setSkillId(s.id)}
            style={[
              styles.skillChip,
              skillId === s.id && styles.skillChipSelected,
            ]}
          >
            <Text style={styles.skillChipIcon}>{s.icon}</Text>
            <Text
              style={[
                styles.skillChipText,
                skillId === s.id && styles.skillChipTextSelected,
              ]}
            >
              {s.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function StepBadHabit({
  habitName,
  setHabitName,
  skillId,
  setSkillId,
}: {
  habitName: string;
  setHabitName: (v: string) => void;
  skillId: string;
  setSkillId: (v: string) => void;
}) {
  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepEmoji}>🚫</Text>
      <Text style={styles.stepTitle}>Your first bad habit to break</Text>
      <Text style={styles.stepSubtitle}>
        Each time you slip, your character takes HP damage
      </Text>
      <TextInput
        style={styles.input}
        value={habitName}
        onChangeText={setHabitName}
        placeholder="e.g., Doomscrolling social media"
        placeholderTextColor={Colors.textTertiary}
        maxLength={50}
      />
      <Text style={styles.skillLabel}>Related skill</Text>
      <View style={styles.skillRow}>
        {SKILLS.map((s) => (
          <Pressable
            key={s.id}
            onPress={() => setSkillId(s.id)}
            style={[
              styles.skillChip,
              skillId === s.id && styles.skillChipSelected,
            ]}
          >
            <Text style={styles.skillChipIcon}>{s.icon}</Text>
            <Text
              style={[
                styles.skillChipText,
                skillId === s.id && styles.skillChipTextSelected,
              ]}
            >
              {s.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function StepReview({
  name,
  avatar,
  difficulty,
  masterObjective,
  goodHabit,
  badHabit,
}: {
  name: string;
  avatar: string;
  difficulty: Difficulty;
  masterObjective: string;
  goodHabit: string;
  badHabit: string;
}) {
  const diffOption = DIFFICULTY_OPTIONS.find((d) => d.value === difficulty)!;

  return (
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>Review your character</Text>
      <Text style={styles.stepSubtitle}>Make sure everything looks right</Text>

      <GlowCard glowColor={Colors.primary} selected style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewAvatar}>{avatar}</Text>
          <View style={styles.reviewNameBlock}>
            <Text style={styles.reviewName}>{name}</Text>
            <Text style={[styles.reviewDifficulty, { color: diffOption.color }]}>
              {diffOption.emoji} {diffOption.label}
            </Text>
          </View>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>MASTER OBJECTIVE</Text>
          <Text style={styles.reviewValue}>{masterObjective}</Text>
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewLabel}>HABITS</Text>
          {goodHabit ? (
            <Text style={styles.reviewValue}>✅ {goodHabit}</Text>
          ) : null}
          {badHabit ? (
            <Text style={styles.reviewValue}>🚫 {badHabit}</Text>
          ) : null}
        </View>

        <View style={styles.reviewStats}>
          <View style={styles.reviewStat}>
            <Text style={styles.reviewStatValue}>Lv 1</Text>
            <Text style={styles.reviewStatLabel}>Level</Text>
          </View>
          <View style={styles.reviewStat}>
            <Text style={styles.reviewStatValue}>1000</Text>
            <Text style={styles.reviewStatLabel}>HP</Text>
          </View>
          <View style={styles.reviewStat}>
            <Text style={styles.reviewStatValue}>0</Text>
            <Text style={styles.reviewStatLabel}>Coins</Text>
          </View>
        </View>
      </GlowCard>
    </View>
  );
}

function StepWelcome({ name, avatar }: { name: string; avatar: string }) {
  return (
    <View style={styles.stepContent}>
      <Animated.Text
        entering={FadeIn.delay(200).duration(600)}
        style={styles.welcomeAvatar}
      >
        {avatar}
      </Animated.Text>
      <Animated.Text
        entering={FadeIn.delay(500).duration(600)}
        style={styles.welcomeTitle}
      >
        Your journey begins, {name}
      </Animated.Text>
      <Animated.Text
        entering={FadeIn.delay(800).duration(600)}
        style={styles.welcomeSubtitle}
      >
        Every quest completed, every habit honored, every page written{'\n'}
        brings you closer to mastery.
      </Animated.Text>
      <Animated.View
        entering={FadeIn.delay(1200).duration(600)}
        style={styles.welcomeStats}
      >
        <View style={styles.welcomeStat}>
          <Text style={styles.welcomeStatIcon}>⚔️</Text>
          <Text style={styles.welcomeStatText}>Complete quests to earn XP</Text>
        </View>
        <View style={styles.welcomeStat}>
          <Text style={styles.welcomeStatIcon}>🔥</Text>
          <Text style={styles.welcomeStatText}>Build streaks for multipliers</Text>
        </View>
        <View style={styles.welcomeStat}>
          <Text style={styles.welcomeStatIcon}>💎</Text>
          <Text style={styles.welcomeStatText}>Earn EKAM tokens daily</Text>
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  stepIndicator: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  stepWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: 40,
    paddingTop: Spacing.md,
  },
  footerSpacer: {
    flex: 1,
  },

  // Step content
  stepContent: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  stepEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  stepTitle: {
    ...Typography.headlineLg,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  stepSubtitle: {
    ...Typography.bodyMd,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },

  // Input
  input: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    ...Typography.bodyLg,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // Avatar grid
  selectedAvatar: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
    width: '100%',
  },
  avatarCell: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: Colors.primary,
    ...Elevation.glow(Colors.primary),
  },
  avatarEmoji: {
    fontSize: 32,
  },

  // Difficulty
  difficultyList: {
    width: '100%',
    gap: Spacing.md,
  },
  difficultyCard: {
    width: '100%',
  },
  difficultyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  difficultyEmoji: {
    fontSize: 24,
  },
  difficultyLabel: {
    ...Typography.titleLg,
  },
  difficultyDesc: {
    ...Typography.bodyMd,
    color: Colors.textTertiary,
  },

  // Skill selector
  skillLabel: {
    ...Typography.labelMd,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  skillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    width: '100%',
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  skillChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  skillChipIcon: {
    fontSize: 14,
  },
  skillChipText: {
    ...Typography.labelMd,
    color: Colors.textTertiary,
  },
  skillChipTextSelected: {
    color: Colors.primary,
  },

  // Review
  reviewCard: {
    width: '100%',
    marginTop: Spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  reviewAvatar: {
    fontSize: 48,
  },
  reviewNameBlock: {
    flex: 1,
  },
  reviewName: {
    ...Typography.headlineLg,
    color: Colors.textPrimary,
  },
  reviewDifficulty: {
    ...Typography.titleSm,
  },
  reviewSection: {
    marginBottom: Spacing.md,
  },
  reviewLabel: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
    letterSpacing: 1.5,
  },
  reviewValue: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  reviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
  },
  reviewStat: {
    alignItems: 'center',
  },
  reviewStatValue: {
    ...Typography.titleLg,
    color: Colors.primary,
  },
  reviewStatLabel: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
  },

  // Welcome (final step)
  welcomeAvatar: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  welcomeTitle: {
    ...Typography.displayMd,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  welcomeSubtitle: {
    ...Typography.bodyLg,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: 24,
  },
  welcomeStats: {
    width: '100%',
    gap: Spacing.md,
  },
  welcomeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceContainerLow,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  welcomeStatIcon: {
    fontSize: 24,
  },
  welcomeStatText: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
    flex: 1,
  },
});
