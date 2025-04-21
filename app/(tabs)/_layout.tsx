import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { theme } from "@/constants/theme";
import { Platform } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.primary.DEFAULT,
        tabBarInactiveTintColor: theme.neutral[400],
        headerShown: false,
        // 동적 라우트 탭 숨기기
        tabBarStyle: {
          backgroundColor: isDark ? theme.neutral[900] : "#fff",
          borderTopColor: isDark ? theme.neutral[800] : theme.neutral[200],
          ...Platform.select({
            ios: {
              shadowOpacity: 0.1,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: -5 },
              shadowColor: "#000",
            },
            android: {
              elevation: 5,
            },
          }),
        },
        // 탭바 라벨 표시
        tabBarShowLabel: true,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarLabel: "홈",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(recipes)/index"
        options={{
          title: "레시피",
          tabBarLabel: "레시피",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(journals)/index"
        options={{
          title: "양조일지",
          tabBarLabel: "양조일지",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="beer-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(events)/index"
        options={{
          title: "시음회",
          tabBarLabel: "시음회",
          href: null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)/index"
        options={{
          title: "마이페이지",
          tabBarLabel: "마이페이지",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
