import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  GestureResponderEvent,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { theme } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useAuth } from "../../../contexts/AuthContext";
import { useJournals } from "@/lib/query/journalQueries";
import { useRecipes } from "@/lib/query/recipeQueries";
import Constants from "expo-constants";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  profileImage: string | null;
  recipes: number;
  journals: number;
  pushNotificationEnabled: boolean;
  // events: number;
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress: (event: GestureResponderEvent) => void;
  showChevron?: boolean;
}

interface InfoItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  iconBgColor?: string;
  iconColor?: string;
}

interface ToggleItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isLoading?: boolean;
}

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [pushNotification, setPushNotification] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isPushLoading, setIsPushLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // 앱 버전 정보
  const appVersion = Constants.expoConfig?.version || "1.0.0";

  const { user: authUser, signOut } = useAuth();
  const { data: journalsData } = useJournals();
  const { data: recipesData } = useRecipes();

  // 유저 정보 상태
  const [user, setUser] = React.useState<UserProfile>({
    name: "",
    email: "",
    bio: "",
    profileImage: null,
    recipes: 0,
    journals: 0,
    pushNotificationEnabled: false,
  });

  // Supabase에서 사용자 프로필 정보 가져오기
  const fetchUserProfile = async () => {
    if (!authUser) {
      setError("로그인이 필요합니다");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // users 테이블에서 현재 로그인한 사용자 정보 가져오기
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("full_name, email, bio, avatar_url, push_notification_enabled")
        .eq("id", authUser.id)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      if (data) {
        // 사용자가 작성한 레시피와 양조일지 개수 계산
        const recipesCount =
          recipesData?.filter((recipe) => recipe.user_id === authUser.id)
            .length || 0;

        const journalsCount =
          journalsData?.filter((journal) => journal.user_id === authUser.id)
            .length || 0;

        const userProfile: UserProfile = {
          name: data.full_name || authUser.user_metadata?.full_name || "",
          email: data.email || authUser.email || "",
          bio: data.bio || "",
          profileImage: data.avatar_url || null,
          recipes: recipesCount,
          journals: journalsCount,
          pushNotificationEnabled: data.push_notification_enabled || false,
        };

        setUser(userProfile);
        setPushNotification(data.push_notification_enabled || false);
      }
    } catch (err: any) {
      console.error("사용자 프로필 로드 오류:", err);
      setError("프로필 정보를 불러오는 데 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // 푸시 알림 설정 저장
  const handlePushNotificationChange = async (value: boolean) => {
    if (!authUser) {
      Alert.alert("오류", "로그인이 필요합니다");
      return;
    }

    try {
      setIsPushLoading(true);
      setPushNotification(value); // UI 즉시 업데이트

      const { error } = await supabase
        .from("users")
        .update({ push_notification_enabled: value })
        .eq("id", authUser.id);

      if (error) {
        throw error;
      }

      // 사용자 상태 업데이트
      setUser((prev) => ({
        ...prev,
        pushNotificationEnabled: value,
      }));
    } catch (err: any) {
      console.error("푸시 알림 설정 오류:", err);
      // 오류 발생 시 이전 값으로 되돌림
      setPushNotification(!value);
      Alert.alert("오류", "푸시 알림 설정을 저장하는 데 실패했습니다");
    } finally {
      setIsPushLoading(false);
    }
  };

  // 컴포넌트 마운트 시 사용자 정보 로드
  useEffect(() => {
    fetchUserProfile();
  }, [authUser, recipesData, journalsData]);

  // 메뉴 아이템 컴포넌트
  const MenuItem: React.FC<MenuItemProps> = ({
    icon,
    title,
    subtitle,
    onPress,
    showChevron = true,
  }) => (
    <TouchableOpacity
      className="flex-row items-center py-3 px-4 bg-white dark:bg-neutral-800 rounded-[12px] shadow-sm mb-3"
      onPress={onPress}
    >
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: "#e6f2fe" }}
      >
        <Ionicons name={icon} size={20} color="#4a91db" />
      </View>
      <View className="flex-1">
        <Text className="text-neutral-900 dark:text-white font-medium">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
            {subtitle}
          </Text>
        )}
      </View>
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color={theme.neutral[400]} />
      )}
    </TouchableOpacity>
  );

  // 정보 아이템 컴포넌트 (클릭 불가능한 정보 표시용)
  const InfoItem: React.FC<InfoItemProps> = ({
    icon,
    title,
    value,
    iconBgColor = "#e6f2fe",
    iconColor = "#4a91db",
  }) => (
    <View className="flex-row items-center py-3 px-4 bg-white dark:bg-neutral-800 rounded-[12px] shadow-sm mb-3">
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: iconBgColor }}
      >
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-neutral-900 dark:text-white font-medium">
          {title}
        </Text>
        <Text className="text-neutral-500 dark:text-neutral-400 text-xs mt-1">
          {value}
        </Text>
      </View>
    </View>
  );

  // 토글 아이템 컴포넌트
  const ToggleItem: React.FC<ToggleItemProps> = ({
    icon,
    title,
    value,
    onValueChange,
    isLoading,
  }) => (
    <View className="flex-row items-center py-3 px-4 bg-white dark:bg-neutral-800 rounded-[12px] shadow-sm mb-3">
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: "#ffeee6" }}
      >
        <Ionicons name={icon} size={20} color="#e8845e" />
      </View>
      <Text className="flex-1 text-neutral-900 dark:text-white font-medium">
        {title}
      </Text>
      {isLoading ? (
        <ActivityIndicator size="small" color={theme.primary.DEFAULT} />
      ) : (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{
            false: theme.neutral[300],
            true: theme.primary.DEFAULT,
          }}
          thumbColor="white"
        />
      )}
    </View>
  );

  // 프로필 수정 페이지로 이동
  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await signOut();
      // 로그아웃 후 로그인 화면으로 직접 이동
      router.replace("/login");
    } catch (error) {
      console.error("로그아웃 오류:", error);
      Alert.alert("오류", "로그아웃 중 문제가 발생했습니다");
    }
  };

  // 로그아웃 중 표시
  if (isLoading && !user.name) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-50 dark:bg-neutral-900">
        <ActivityIndicator size="large" color={theme.primary.DEFAULT} />
        <Text className="mt-4 text-neutral-500 dark:text-neutral-400">
          프로필 정보를 불러오는 중...
        </Text>
      </SafeAreaView>
    );
  }

  // 오류 발생 시
  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-neutral-50 dark:bg-neutral-900">
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={theme.status.error}
        />
        <Text className="mt-4 text-red-500 text-center px-4">{error}</Text>
        <TouchableOpacity
          className="mt-6 bg-primary-500 rounded-full px-6 py-3"
          onPress={fetchUserProfile}
        >
          <Text className="text-white font-medium">다시 시도</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <StatusBar style="auto" />

      {/* 헤더 */}
      <View className="px-5 pt-12 pb-4">
        <Text className="text-2xl font-bold text-neutral-900 dark:text-white">
          마이페이지
        </Text>
      </View>

      <ScrollView className="flex-1 px-5">
        {/* 프로필 카드 */}
        <View className="bg-white dark:bg-neutral-800 rounded-[16px] shadow-sm p-5 mb-6">
          <View className="flex-row">
            <View className="w-20 h-20 rounded-full bg-neutral-200 dark:bg-neutral-700 items-center justify-center mr-4">
              {user.profileImage ? (
                <Image
                  source={{ uri: user.profileImage }}
                  className="w-20 h-20 rounded-full"
                />
              ) : (
                <Ionicons name="person" size={30} color={theme.neutral[400]} />
              )}
            </View>
            <View className="flex-1 justify-center">
              <Text className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                {user.name || "이름 없음"}
              </Text>
              <Text className="text-neutral-500 dark:text-neutral-400 mb-2">
                {user.email || "이메일 없음"}
              </Text>
              <TouchableOpacity
                className="bg-neutral-100 dark:bg-neutral-700 py-1 px-3 rounded-full self-start"
                onPress={handleEditProfile}
                disabled={isLoading}
              >
                <Text className="text-neutral-500 dark:text-neutral-300 text-xs font-medium">
                  {isLoading ? "로딩중..." : "프로필 수정"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-neutral-700 dark:text-neutral-300 mt-4 mb-5">
            {user.bio || "자기소개가 없습니다."}
          </Text>

          <View className="flex-row gap-12 border-t border-neutral-100 dark:border-neutral-700 pt-4">
            <TouchableOpacity
              className="items-center"
              onPress={() => router.push("/(tabs)/(recipes)")}
            >
              <Text className="text-neutral-900 dark:text-white font-bold text-lg">
                {user.recipes}
              </Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-xs">
                레시피
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center"
              onPress={() => router.push("/(tabs)/(journals)")}
            >
              <Text className="text-neutral-900 dark:text-white font-bold text-lg">
                {user.journals}
              </Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-xs">
                양조일지
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 나의 활동 */}
        <Text className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
          나의 활동
        </Text>

        <MenuItem
          icon="book-outline"
          title="내 레시피"
          subtitle="작성한 레시피 관리"
          onPress={() => router.push("/(tabs)/(recipes)")}
        />

        <MenuItem
          icon="beer-outline"
          title="양조일지"
          subtitle="기록한 양조일지 보기"
          onPress={() => router.push("/(tabs)/(journals)")}
        />

        {/* <MenuItem
          icon="bookmark-outline"
          title="저장한 레시피"
          subtitle="다른 사용자의 레시피"
          onPress={() => {}}
        /> */}

        {/* 설정 */}
        <Text className="text-lg font-bold text-neutral-900 dark:text-white mb-3 mt-5">
          설정
        </Text>

        <ToggleItem
          icon="notifications-outline"
          title="푸시 알림"
          value={pushNotification}
          onValueChange={handlePushNotificationChange}
          isLoading={isPushLoading}
        />

        {/* TODO: 다크 모드 추가 */}
        {/* <ToggleItem
          icon="moon-outline"
          title="다크 모드"
          value={darkMode}
          onValueChange={setDarkMode}
        /> */}

        {/* TODO: 개인정보 보호 화면 추가 */}
        {/* <MenuItem
          icon="shield-outline"
          title="개인정보 보호"
          subtitle="개인정보 보호 설정"
          onPress={() => {}}
        /> */}

        {/* TODO: 도움말 화면 추가 */}
        {/* <MenuItem
          icon="help-circle-outline"
          title="도움말"
          subtitle="도움말 및 지원"
          onPress={() => {}}
        /> */}

        <InfoItem
          icon="information-circle-outline"
          title="앱 정보"
          value={`가양주인(Gayangjuin) v${appVersion}`}
          iconBgColor="#f0f4ff"
          iconColor="#7584bd"
        />

        <TouchableOpacity className="mt-5 mb-10" onPress={handleLogout}>
          <View className="bg-neutral-100 dark:bg-neutral-800 rounded-[12px] py-4 flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={20} color="#f87171" />
            <Text className="ml-2 font-medium text-[#f87171]">로그아웃</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
