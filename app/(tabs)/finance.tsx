/**
 * Finance Screen — Six Jars Budgeting
 * Accessible via router.push('/finance') from the Home dashboard
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../../core/theme';
import { useFinanceStore } from '../../modules/finance/store';
import JarCard from '../../modules/finance/components/JarCard';
import AllocateModal from '../../modules/finance/components/AllocateModal';

export default function FinanceScreen() {
  const [showAllocate, setShowAllocate] = useState(false);

  const jars = useFinanceStore((s) => s.jars);
  const transactions = useFinanceStore((s) => s.transactions);
  const totalIncome = useFinanceStore((s) => s.totalIncome);
  const loadFinanceState = useFinanceStore((s) => s.loadFinanceState);
  const getTotalBalance = useFinanceStore((s) => s.getTotalBalance);

  useEffect(() => {
    loadFinanceState();
  }, []);

  const totalBalance = getTotalBalance();
  const recentTransactions = transactions.slice(0, 10);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Six Jars</Text>
        <Text style={styles.screenSubtitle}>Money Management System</Text>
      </View>

      {/* Total Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
        <Text style={styles.balanceAmount}>
          {'\u20B9'}
          {totalBalance.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </Text>
        <Text style={styles.incomeNote}>
          Total income allocated: {'\u20B9'}
          {totalIncome.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </Text>
      </View>

      {/* Allocate Button */}
      <TouchableOpacity
        style={styles.allocateButton}
        onPress={() => setShowAllocate(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.allocateButtonText}>+ Allocate Income</Text>
      </TouchableOpacity>

      {/* Jars Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Jars</Text>
        <View style={styles.jarGrid}>
          {jars.map((jar, index) => {
            const isLeft = index % 2 === 0;
            return (
              <View
                key={jar.id}
                style={[
                  styles.jarCell,
                  isLeft ? styles.jarCellLeft : styles.jarCellRight,
                ]}
              >
                <JarCard jar={jar} totalBalance={totalBalance} />
              </View>
            );
          })}
        </View>
      </View>

      {/* Percentage Bar Visual */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Allocation Split</Text>
        <View style={styles.splitBar}>
          {jars.map((jar) => (
            <View
              key={jar.id}
              style={[
                styles.splitSegment,
                {
                  flex: jar.percentage,
                  backgroundColor: jar.color,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.splitLegend}>
          {jars.map((jar) => (
            <View key={jar.id} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: jar.color }]}
              />
              <Text style={styles.legendText}>
                {jar.emoji} {jar.percentage}%
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {recentTransactions.map((tx) => {
            const jar = jars.find((j) => j.id === tx.jarId);
            const isIncome = tx.type === 'income';
            return (
              <View key={tx.id} style={styles.txRow}>
                <View
                  style={[
                    styles.txDot,
                    { backgroundColor: jar?.color ?? Colors.textTertiary },
                  ]}
                />
                <View style={styles.txInfo}>
                  <Text style={styles.txDescription} numberOfLines={1}>
                    {tx.description}
                  </Text>
                  <Text style={styles.txMeta}>
                    {jar?.emoji} {jar?.name} {'\u00B7'}{' '}
                    {new Date(tx.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.txAmount,
                    { color: isIncome ? Colors.success : Colors.danger },
                  ]}
                >
                  {isIncome ? '+' : '-'}
                  {'\u20B9'}
                  {tx.amount.toLocaleString()}
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Empty state */}
      {transactions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🏺</Text>
          <Text style={styles.emptyTitle}>Your jars are empty</Text>
          <Text style={styles.emptySubtitle}>
            Allocate your first income to start managing your money across 6
            jars
          </Text>
        </View>
      )}

      <View style={{ height: 100 }} />

      {/* Allocate Modal */}
      <AllocateModal
        visible={showAllocate}
        onClose={() => setShowAllocate(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: 60,
  },

  // Header
  header: {
    marginBottom: Spacing.lg,
  },
  screenTitle: {
    ...Typography.headlineLg,
    color: Colors.textPrimary,
  },
  screenSubtitle: {
    ...Typography.bodyMd,
    color: Colors.textTertiary,
    marginTop: 2,
  },

  // Balance Card
  balanceCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    marginBottom: Spacing.md,
  },
  balanceLabel: {
    ...Typography.labelMd,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    ...Typography.displayLg,
    color: Colors.primary,
  },
  incomeNote: {
    ...Typography.bodySm,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
  },

  // Allocate Button
  allocateButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  allocateButtonText: {
    ...Typography.titleMd,
    color: Colors.onPrimary,
  },

  // Sections
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  // Jar Grid
  jarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
  jarCell: {
    width: '50%',
    paddingVertical: Spacing.xs,
  },
  jarCellLeft: {
    paddingLeft: 0,
    paddingRight: Spacing.xs,
  },
  jarCellRight: {
    paddingLeft: Spacing.xs,
    paddingRight: 0,
  },

  // Split Bar
  splitBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    gap: 2,
  },
  splitSegment: {
    borderRadius: 2,
  },
  splitLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    ...Typography.labelSm,
    color: Colors.textSecondary,
  },

  // Transactions
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },
  txDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  txInfo: {
    flex: 1,
  },
  txDescription: {
    ...Typography.titleSm,
    color: Colors.textPrimary,
  },
  txMeta: {
    ...Typography.bodySm,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  txAmount: {
    ...Typography.titleSm,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    ...Typography.headlineSm,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    ...Typography.bodyMd,
    color: Colors.textTertiary,
    textAlign: 'center',
    maxWidth: 280,
  },
});
