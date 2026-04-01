import { Redirect } from 'expo-router';
import { useStore } from '../core/store/useStore';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../core/theme';

export default function Index() {
  const userState = useStore((s) => s.userState);
  const isLoading = useStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (userState === 'logged_out') {
    return <Redirect href="/(auth)/welcome" />;
  }

  return <Redirect href="/(tabs)" />;
}
