import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "../contexts/AuthContext";
import { useColorScheme } from "../hooks/useColorScheme";
import { MenuProvider } from "react-native-popup-menu";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { queryClient } from "../lib/query/queryClient";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import ErrorBoundaryComponent from "../components/ErrorBoundary";

export { ErrorBoundary } from "expo-router";

// 사용자 정의 ErrorBoundary도 내보내기
export function CustomErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return <ErrorBoundaryComponent error={error} retry={retry} />;
}

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    try {
      initializeKakaoSDK("6c58516c278c4c86f674c30fa5efbfbe");
    } catch (error) {
      console.error("Kakao SDK 초기화 오류:", error);
    }
  }, []);

  useEffect(() => {
    if (error) {
      console.error("폰트 로딩 오류:", error);
      // 프로덕션에서는 에러를 throw하지 않고 로그만 출력
      if (__DEV__) {
        throw error;
      }
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch((err) => {
        console.error("SplashScreen 숨김 오류:", err);
      });
    }
  }, [loaded]);

  if (!loaded && !error) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <MenuProvider>
              <View style={{ flex: 1 }}>
                <StatusBar style={isDark ? "light" : "dark"} />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: {
                      backgroundColor: isDark ? "#121212" : "#F8FAFC",
                    },
                    animation: "slide_from_right",
                  }}
                >
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="journals"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="login" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="adult-verification"
                    options={{ headerShown: false }}
                  />
                </Stack>
              </View>
            </MenuProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
