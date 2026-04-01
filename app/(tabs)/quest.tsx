/**
 * Quest Screen — Tasks, Schedule, Market
 * Ported from Solo RPG system
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Alert } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../core/theme';
import { useStore } from '../../core/store/useStore';
import { TaskDifficulty } from '../../core/gamification/types';

type Tab = 'tasks' | 'market';

const DIFFICULTY_CONFIG: Record<TaskDifficulty, { label: string; color: string; xp: number; coins: number }> = {
  easy: { label: 'Easy', color: Colors.difficultyEasy, xp: 20, coins: 10 },
  medium: { label: 'Medium', color: Colors.difficultyMedium, xp: 50, coins: 25 },
  hard: { label: 'Hard', color: Colors.difficultyHard, xp: 100, coins: 50 },
};

const MARKET_ITEMS = [
  { id: '1', name: 'Minor Potion', emoji: '🧪', cost: 50, heal: 50, rarity: 'common' },
  { id: '2', name: 'Health Potion', emoji: '❤️‍🩹', cost: 150, heal: 200, rarity: 'rare' },
  { id: '3', name: 'Mega Elixir', emoji: '✨', cost: 400, heal: 500, rarity: 'epic' },
  { id: '4', name: 'Phoenix Feather', emoji: '🔥', cost: 1000, heal: 1000, rarity: 'legendary' },
];

const RARITY_COLORS: Record<string, string> = {
  common: Colors.textTertiary,
  rare: Colors.difficultyEasy,
  epic: '#A855F7',
  legendary: Colors.primary,
};

export default function QuestScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState<TaskDifficulty>('medium');

  const tasks = useStore((s) => s.tasks);
  const character = useStore((s) => s.character);
  const addTask = useStore((s) => s.addTask);
  const completeTask = useStore((s) => s.completeTask);
  const removeTask = useStore((s) => s.removeTask);
  const buyItem = useStore((s) => s.buyItem);

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    addTask(newTaskTitle.trim(), newTaskDifficulty);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const handleBuyItem = (item: typeof MARKET_ITEMS[0]) => {
    if (character.coins < item.cost) {
      Alert.alert('Not Enough Coins', `You need ${item.cost} coins but have ${character.coins}.`);
      return;
    }
    Alert.alert('Buy Item', `Spend ${item.cost} coins on ${item.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Buy',
        onPress: () => {
          const success = buyItem(item.cost, item.heal);
          if (!success) Alert.alert('Failed', 'Not enough coins.');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Quest</Text>

      {/* Tab Switcher */}
      <View style={styles.tabRow}>
        {(['tasks', 'market'] as Tab[]).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'tasks' ? '⚔️ Tasks' : '🛒 Market'}
            </Text>
          </Pressable>
        ))}
      </View>

      {activeTab === 'tasks' ? (
        <>
          {/* Add Task */}
          {showAddTask ? (
            <View style={styles.addTaskForm}>
              <TextInput
                style={styles.addTaskInput}
                placeholder="Quest name..."
                placeholderTextColor={Colors.textTertiary}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                autoFocus
              />
              <View style={styles.difficultyRow}>
                {(Object.keys(DIFFICULTY_CONFIG) as TaskDifficulty[]).map((d) => (
                  <Pressable
                    key={d}
                    style={[
                      styles.difficultyChip,
                      { borderColor: DIFFICULTY_CONFIG[d].color },
                      newTaskDifficulty === d && { backgroundColor: DIFFICULTY_CONFIG[d].color },
                    ]}
                    onPress={() => setNewTaskDifficulty(d)}
                  >
                    <Text style={[styles.difficultyText, newTaskDifficulty === d && { color: '#000' }]}>
                      {DIFFICULTY_CONFIG[d].label}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.addTaskActions}>
                <Pressable style={styles.cancelBtn} onPress={() => setShowAddTask(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.saveBtn} onPress={handleAddTask}>
                  <Text style={styles.saveBtnText}>Add Quest</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable style={styles.addTaskButton} onPress={() => setShowAddTask(true)}>
              <Text style={styles.addTaskButtonText}>+ New Quest</Text>
            </Pressable>
          )}

          {/* Active Tasks */}
          <Text style={styles.sectionTitle}>Active ({activeTasks.length})</Text>
          {activeTasks.length === 0 ? (
            <Text style={styles.emptyText}>No active quests. Add one above!</Text>
          ) : (
            activeTasks.map((task) => {
              const config = DIFFICULTY_CONFIG[task.difficulty];
              return (
                <Pressable
                  key={task.id}
                  style={[styles.taskCard, { borderLeftColor: config.color }]}
                  onPress={() => completeTask(task.id)}
                  onLongPress={() =>
                    Alert.alert('Delete Quest', 'Remove this quest?', [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => removeTask(task.id) },
                    ])
                  }
                >
                  <View style={[styles.taskCheck, { borderColor: config.color }]} />
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    <Text style={[styles.taskReward, { color: config.color }]}>
                      +{config.xp} XP  +{config.coins} Coins
                    </Text>
                  </View>
                  <View style={[styles.diffBadge, { backgroundColor: config.color }]}>
                    <Text style={styles.diffBadgeText}>{config.label[0]}</Text>
                  </View>
                </Pressable>
              );
            })
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Completed ({completedTasks.length})</Text>
              {completedTasks.slice(0, 5).map((task) => (
                <View key={task.id} style={[styles.taskCard, styles.taskCardCompleted]}>
                  <Text style={styles.taskCheckDone}>✓</Text>
                  <Text style={styles.taskTitleDone}>{task.title}</Text>
                </View>
              ))}
            </>
          )}
        </>
      ) : (
        <>
          {/* Market */}
          <View style={styles.coinBalance}>
            <Text style={styles.coinBalanceEmoji}>🪙</Text>
            <Text style={styles.coinBalanceValue}>{character.coins}</Text>
            <Text style={styles.coinBalanceLabel}>coins available</Text>
          </View>

          <Text style={styles.sectionTitle}>Recovery Potions</Text>
          {MARKET_ITEMS.map((item) => (
            <Pressable
              key={item.id}
              style={[styles.marketCard, { borderLeftColor: RARITY_COLORS[item.rarity] }]}
              onPress={() => handleBuyItem(item)}
            >
              <Text style={styles.marketEmoji}>{item.emoji}</Text>
              <View style={styles.marketInfo}>
                <Text style={styles.marketName}>{item.name}</Text>
                <Text style={styles.marketEffect}>Restores {item.heal} HP</Text>
              </View>
              <View style={styles.marketPrice}>
                <Text style={styles.marketPriceText}>🪙 {item.cost}</Text>
                <Text style={[styles.marketRarity, { color: RARITY_COLORS[item.rarity] }]}>
                  {item.rarity.toUpperCase()}
                </Text>
              </View>
            </Pressable>
          ))}
        </>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 60 },
  title: { ...Typography.displaySm, color: Colors.primary, marginBottom: Spacing.lg },

  tabRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  tab: {
    flex: 1, paddingVertical: Spacing.md,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md, alignItems: 'center',
  },
  tabActive: { backgroundColor: Colors.primaryContainer },
  tabText: { ...Typography.titleSm, color: Colors.textSecondary },
  tabTextActive: { color: Colors.onPrimaryContainer },

  addTaskButton: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md, padding: Spacing.md,
    alignItems: 'center', marginBottom: Spacing.lg,
    borderWidth: 1, borderColor: Colors.outlineVariant, borderStyle: 'dashed',
  },
  addTaskButtonText: { ...Typography.titleSm, color: Colors.primary },

  addTaskForm: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg, padding: Spacing.lg,
    marginBottom: Spacing.lg, gap: Spacing.md,
  },
  addTaskInput: {
    ...Typography.bodyLg, color: Colors.textPrimary,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.md, padding: Spacing.md,
  },
  difficultyRow: { flexDirection: 'row', gap: Spacing.sm },
  difficultyChip: {
    flex: 1, paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md, borderWidth: 1.5, alignItems: 'center',
  },
  difficultyText: { ...Typography.labelMd, color: Colors.textSecondary },
  addTaskActions: { flexDirection: 'row', gap: Spacing.sm },
  cancelBtn: { flex: 1, padding: Spacing.md, alignItems: 'center' },
  cancelBtnText: { ...Typography.titleSm, color: Colors.textTertiary },
  saveBtn: {
    flex: 1, padding: Spacing.md, alignItems: 'center',
    backgroundColor: Colors.primaryContainer, borderRadius: BorderRadius.md,
  },
  saveBtnText: { ...Typography.titleSm, color: Colors.onPrimaryContainer },

  sectionTitle: { ...Typography.headlineSm, color: Colors.textPrimary, marginBottom: Spacing.md, marginTop: Spacing.md },
  emptyText: { ...Typography.bodyMd, color: Colors.textTertiary, fontStyle: 'italic', marginBottom: Spacing.md },

  taskCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md, padding: Spacing.md,
    marginBottom: Spacing.sm, borderLeftWidth: 3, gap: Spacing.md,
  },
  taskCardCompleted: { opacity: 0.5, borderLeftColor: Colors.success },
  taskCheck: { width: 24, height: 24, borderRadius: 12, borderWidth: 2 },
  taskCheckDone: { fontSize: 16, color: Colors.success, width: 24, textAlign: 'center' },
  taskInfo: { flex: 1 },
  taskTitle: { ...Typography.titleSm, color: Colors.textPrimary },
  taskTitleDone: { ...Typography.bodyMd, color: Colors.textTertiary, textDecorationLine: 'line-through', flex: 1 },
  taskReward: { ...Typography.labelSm, marginTop: 2 },
  diffBadge: {
    width: 28, height: 28, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center',
  },
  diffBadgeText: { ...Typography.labelSm, color: '#000', fontWeight: '700' },

  coinBalance: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  coinBalanceEmoji: { fontSize: 24 },
  coinBalanceValue: { ...Typography.headlineLg, color: Colors.coins },
  coinBalanceLabel: { ...Typography.bodyMd, color: Colors.textTertiary },

  marketCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.md, padding: Spacing.md,
    marginBottom: Spacing.sm, borderLeftWidth: 3, gap: Spacing.md,
  },
  marketEmoji: { fontSize: 28 },
  marketInfo: { flex: 1 },
  marketName: { ...Typography.titleSm, color: Colors.textPrimary },
  marketEffect: { ...Typography.bodySm, color: Colors.success, marginTop: 2 },
  marketPrice: { alignItems: 'flex-end' },
  marketPriceText: { ...Typography.titleSm, color: Colors.coins },
  marketRarity: { ...Typography.labelSm, marginTop: 2, textTransform: 'uppercase' },
});
