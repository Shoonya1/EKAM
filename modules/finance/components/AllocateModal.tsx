/**
 * AllocateModal — Modal for allocating income across 6 jars
 * Shows amount input and a preview of how income will be split
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../../core/theme';
import { useFinanceStore } from '../store';

interface AllocateModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AllocateModal({ visible, onClose }: AllocateModalProps) {
  const [amountText, setAmountText] = useState('');
  const jars = useFinanceStore((s) => s.jars);
  const allocateIncome = useFinanceStore((s) => s.allocateIncome);

  const amount = parseFloat(amountText) || 0;

  const handleAllocate = () => {
    if (amount <= 0) return;
    allocateIncome(amount);
    setAmountText('');
    onClose();
  };

  const handleClose = () => {
    setAmountText('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.backdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handleClose}
          />
        </View>

        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Title */}
          <Text style={styles.title}>Allocate Income</Text>
          <Text style={styles.subtitle}>
            Enter amount to distribute across your 6 jars
          </Text>

          {/* Amount Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>{'\u20B9'}</Text>
            <TextInput
              style={styles.input}
              value={amountText}
              onChangeText={setAmountText}
              placeholder="0"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="numeric"
              autoFocus
            />
          </View>

          {/* Breakdown Preview */}
          {amount > 0 && (
            <View style={styles.breakdownSection}>
              <Text style={styles.breakdownTitle}>ALLOCATION PREVIEW</Text>
              {jars.map((jar) => {
                const allocation =
                  Math.round((amount * jar.percentage) / 100 * 100) / 100;
                return (
                  <View key={jar.id} style={styles.breakdownRow}>
                    <View style={styles.breakdownLeft}>
                      <View
                        style={[styles.colorDot, { backgroundColor: jar.color }]}
                      />
                      <Text style={styles.breakdownLabel}>
                        {jar.emoji} {jar.name}
                      </Text>
                    </View>
                    <View style={styles.breakdownRight}>
                      <Text style={styles.breakdownPercent}>
                        {jar.percentage}%
                      </Text>
                      <Text
                        style={[styles.breakdownAmount, { color: jar.color }]}
                      >
                        {'\u20B9'}
                        {allocation.toLocaleString()}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.button, amount <= 0 && styles.buttonDisabled]}
            onPress={handleAllocate}
            disabled={amount <= 0}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              Allocate {'\u20B9'}
              {amount > 0 ? amount.toLocaleString() : '0'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  sheet: {
    backgroundColor: Colors.surfaceContainerLow,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.headlineMd,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.bodyMd,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  currencySymbol: {
    ...Typography.displayMd,
    color: Colors.primary,
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    ...Typography.displayMd,
    color: Colors.textPrimary,
    padding: 0,
  },
  breakdownSection: {
    marginBottom: Spacing.lg,
  },
  breakdownTitle: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownLabel: {
    ...Typography.bodyMd,
    color: Colors.textPrimary,
  },
  breakdownRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  breakdownPercent: {
    ...Typography.labelMd,
    color: Colors.textTertiary,
  },
  breakdownAmount: {
    ...Typography.titleSm,
    minWidth: 80,
    textAlign: 'right',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    ...Typography.titleMd,
    color: Colors.onPrimary,
  },
});
