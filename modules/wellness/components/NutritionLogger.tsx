/**
 * NutritionLogger — Food logging form with meal selector, food input, and add button
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Elevation } from '../../../core/theme';
import { FoodItem, MealType } from '../types';

const TEAL = '#14B8A6';

const MEAL_OPTIONS: { key: MealType; label: string; emoji: string }[] = [
  { key: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { key: 'lunch', label: 'Lunch', emoji: '☀️' },
  { key: 'dinner', label: 'Dinner', emoji: '🌙' },
  { key: 'snack', label: 'Snack', emoji: '🍎' },
];

interface NutritionLoggerProps {
  onLog: (meal: MealType, foods: FoodItem[]) => void;
}

export default function NutritionLogger({ onLog }: NutritionLoggerProps) {
  const [selectedMeal, setSelectedMeal] = useState<MealType>('breakfast');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [foods, setFoods] = useState<FoodItem[]>([]);

  const handleAddFood = () => {
    const name = foodName.trim();
    const cal = parseInt(calories, 10);
    if (!name || isNaN(cal) || cal <= 0) return;

    const item: FoodItem = {
      name,
      calories: cal,
      protein: parseInt(protein, 10) || 0,
      carbs: parseInt(carbs, 10) || 0,
      fat: parseInt(fat, 10) || 0,
      quantity: 1,
    };

    setFoods((prev) => [...prev, item]);
    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
  };

  const handleRemoveFood = (index: number) => {
    setFoods((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLog = () => {
    if (foods.length === 0) return;
    onLog(selectedMeal, foods);
    setFoods([]);
  };

  const totalCalories = foods.reduce((sum, f) => sum + f.calories * f.quantity, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Meal Selector */}
      <Text style={styles.label}>Meal</Text>
      <View style={styles.mealRow}>
        {MEAL_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.mealChip,
              selectedMeal === option.key && styles.mealChipActive,
            ]}
            onPress={() => setSelectedMeal(option.key)}
            activeOpacity={0.7}
          >
            <Text style={styles.mealEmoji}>{option.emoji}</Text>
            <Text
              style={[
                styles.mealLabel,
                selectedMeal === option.key && styles.mealLabelActive,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Food Input */}
      <Text style={styles.label}>Add Food</Text>
      <View style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="Food name"
          placeholderTextColor={Colors.textTertiary}
          value={foodName}
          onChangeText={setFoodName}
        />
        <View style={styles.macroRow}>
          <View style={styles.macroInput}>
            <Text style={styles.macroLabel}>Cal</Text>
            <TextInput
              style={styles.macroField}
              placeholder="0"
              placeholderTextColor={Colors.textTertiary}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.macroInput}>
            <Text style={styles.macroLabel}>Protein</Text>
            <TextInput
              style={styles.macroField}
              placeholder="0g"
              placeholderTextColor={Colors.textTertiary}
              value={protein}
              onChangeText={setProtein}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.macroInput}>
            <Text style={styles.macroLabel}>Carbs</Text>
            <TextInput
              style={styles.macroField}
              placeholder="0g"
              placeholderTextColor={Colors.textTertiary}
              value={carbs}
              onChangeText={setCarbs}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.macroInput}>
            <Text style={styles.macroLabel}>Fat</Text>
            <TextInput
              style={styles.macroField}
              placeholder="0g"
              placeholderTextColor={Colors.textTertiary}
              value={fat}
              onChangeText={setFat}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.addButton, (!foodName.trim() || !calories) && styles.addButtonDisabled]}
          onPress={handleAddFood}
          activeOpacity={0.7}
          disabled={!foodName.trim() || !calories}
        >
          <Text style={styles.addButtonText}>+ Add Food</Text>
        </TouchableOpacity>
      </View>

      {/* Food List */}
      {foods.length > 0 && (
        <View style={styles.foodList}>
          <Text style={styles.label}>
            Added Foods ({foods.length})
          </Text>
          {foods.map((food, index) => (
            <View key={index} style={styles.foodRow}>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodMacros}>
                  {food.calories} cal · {food.protein}g P · {food.carbs}g C · {food.fat}g F
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleRemoveFood(index)}>
                <Text style={styles.removeButton}>X</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Calories</Text>
            <Text style={styles.totalValue}>{totalCalories}</Text>
          </View>

          <TouchableOpacity
            style={styles.logButton}
            onPress={handleLog}
            activeOpacity={0.7}
          >
            <Text style={styles.logButtonText}>Log Meal</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    ...Typography.labelLg,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },

  // Meal Selector
  mealRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  mealChip: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  mealChipActive: {
    borderColor: TEAL,
    backgroundColor: TEAL + '18',
  },
  mealEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  mealLabel: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  mealLabelActive: {
    color: TEAL,
  },

  // Input
  inputCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    ...Elevation.subtle,
  },
  input: {
    ...Typography.bodyLg,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  macroRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  macroInput: {
    flex: 1,
    alignItems: 'center',
  },
  macroLabel: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  macroField: {
    ...Typography.bodyMd,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    textAlign: 'center',
    width: '100%',
  },
  addButton: {
    backgroundColor: TEAL,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.4,
  },
  addButtonText: {
    ...Typography.titleSm,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Food List
  foodList: {
    marginTop: Spacing.sm,
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    ...Typography.titleSm,
    color: Colors.textPrimary,
  },
  foodMacros: {
    ...Typography.bodySm,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  removeButton: {
    ...Typography.titleSm,
    color: Colors.danger,
    paddingHorizontal: Spacing.sm,
  },

  // Total
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.outlineVariant,
    marginTop: Spacing.sm,
  },
  totalLabel: {
    ...Typography.titleSm,
    color: Colors.textSecondary,
  },
  totalValue: {
    ...Typography.headlineMd,
    color: TEAL,
  },

  // Log Button
  logButton: {
    backgroundColor: TEAL,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  logButtonText: {
    ...Typography.titleMd,
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
