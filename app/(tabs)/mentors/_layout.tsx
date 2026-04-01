import { Stack } from 'expo-router';
import { Colors } from '../../../core/theme';

export default function MentorsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    />
  );
}
