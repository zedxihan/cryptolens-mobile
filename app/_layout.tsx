import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import './globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000,
    },
  },
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins_400Regular: require('../assets/fonts/Poppins-Regular.ttf'),
    Poppins_500Medium: require('../assets/fonts/Poppins-Medium.ttf'),
    Poppins_600SemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    Poppins_700Bold: require('../assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <View
          pointerEvents="none"
          className="bg-accent/3 absolute inset-0 z-999"
          style={{
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.4)',
          }}
        />
      </View>
    </QueryClientProvider>
  );
}
