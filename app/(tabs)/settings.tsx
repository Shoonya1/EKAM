import { View, Text, ScrollView, StyleSheet, Pressable, Switch, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius } from '../../core/theme';
import { useStore } from '../../core/store/useStore';

export default function SettingsScreen() {
  const router = useRouter();
  const character = useStore((s) => s.character);
  const habits = useStore((s) => s.habits);
  const tasks = useStore((s) => s.tasks);
  const peharLogs = useStore((s) => s.peharLogs);
  const streakData = useStore((s) => s.streakData);
  const skills = useStore((s) => s.skills);
  const logout = useStore((s) => s.logout);

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(character.name);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [peherAlerts, setPeherAlerts] = useState(true);

  const handleSaveName = () => {
    if (nameValue.trim()) {
      useStore.setState((s) => ({
        character: { ...s.character, name: nameValue.trim() },
      }));
      setEditingName(false);
    }
  };

  const handleExportData = () => {
    const data = {
      character,
      skills,
      habits,
      tasks,
      peharLogs,
      streakData,
      exportedAt: new Date().toISOString(),
    };
    const json = JSON.stringify(data, null, 2);
    Alert.alert('Data Exported', `Your data has been prepared (${json.length} characters). Copy/share functionality coming soon.`);
  };

  const handleResetProgress = () => {
    Alert.alert(
      'Reset All Progress?',
      'This will permanently erase your character, habits, tasks, journal, and streaks. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/welcome');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>{'<'} Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Avatar</Text>
            <Text style={styles.avatarPreview}>{character.avatar}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Name</Text>
            {editingName ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.nameInput}
                  value={nameValue}
                  onChangeText={setNameValue}
                  autoFocus
                  placeholderTextColor={Colors.textTertiary}
                  onSubmitEditing={handleSaveName}
                />
                <Pressable onPress={handleSaveName} style={styles.saveButton}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={() => setEditingName(true)}>
                <Text style={styles.rowValue}>{character.name} {'>'}</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Dark Mode</Text>
            <Switch
              value={true}
              disabled
              trackColor={{ false: Colors.surfaceContainerHighest, true: Colors.primaryContainer }}
              thumbColor={Colors.primary}
            />
          </View>
          <Text style={styles.hint}>Always dark. Light mode coming soon.</Text>
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Daily Reminders</Text>
            <Switch
              value={dailyReminders}
              onValueChange={setDailyReminders}
              trackColor={{ false: Colors.surfaceContainerHighest, true: Colors.primaryContainer }}
              thumbColor={dailyReminders ? Colors.primary : Colors.textTertiary}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Peher Alerts</Text>
            <Switch
              value={peherAlerts}
              onValueChange={setPeherAlerts}
              trackColor={{ false: Colors.surfaceContainerHighest, true: Colors.primaryContainer }}
              thumbColor={peherAlerts ? Colors.primary : Colors.textTertiary}
            />
          </View>
        </View>
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.card}>
          <Pressable style={styles.actionRow} onPress={handleExportData}>
            <Text style={styles.actionText}>Export Data (JSON)</Text>
            <Text style={styles.actionArrow}>{'>'}</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.actionRow} onPress={handleResetProgress}>
            <Text style={[styles.actionText, { color: Colors.danger }]}>Reset Progress</Text>
            <Text style={[styles.actionArrow, { color: Colors.danger }]}>{'>'}</Text>
          </Pressable>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Version</Text>
            <Text style={styles.rowValue}>EKAM v1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Credits</Text>
            <Text style={styles.rowValue}>Shoonya Labs</Text>
          </View>
        </View>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.danger }]}>Danger Zone</Text>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg, paddingTop: 60 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  backButton: { width: 60 },
  backText: { ...Typography.titleSm, color: Colors.primary },
  headerTitle: { ...Typography.headlineLg, color: Colors.textPrimary },

  section: { marginBottom: Spacing.xl },
  sectionTitle: {
    ...Typography.labelMd,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },

  card: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  rowLabel: { ...Typography.titleSm, color: Colors.textPrimary },
  rowValue: { ...Typography.bodyMd, color: Colors.textSecondary },
  avatarPreview: { fontSize: 28 },

  editRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  nameInput: {
    ...Typography.bodyMd,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    minWidth: 120,
  },
  saveButton: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  saveButtonText: { ...Typography.labelMd, color: Colors.onPrimaryContainer },

  divider: {
    height: 1,
    backgroundColor: Colors.surfaceContainerHighest,
    marginVertical: Spacing.xs,
  },

  hint: {
    ...Typography.labelSm,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  actionText: { ...Typography.titleSm, color: Colors.textPrimary },
  actionArrow: { ...Typography.titleSm, color: Colors.textTertiary },

  logoutButton: {
    backgroundColor: Colors.errorContainer,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  logoutText: { ...Typography.titleSm, color: Colors.error },
});
