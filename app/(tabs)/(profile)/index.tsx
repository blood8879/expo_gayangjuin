import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { theme } from "@/constants/theme";

export default function ProfileScreen() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [pushNotification, setPushNotification] = React.useState(true);

  // 유저 정보 (더미 데이터)
  const user = {
    name: "홍길동",
    email: "user@example.com",
    bio: "취미로 전통주와 와인 만드는 것을 즐깁니다.",
    profileImage: null,
    recipes: 5,
    journals: 8,
    events: 2,
  };

  // 메뉴 아이템 컴포넌트
  const MenuItem = ({ icon, title, subtitle, onPress, showChevron = true }) => (
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

  // 토글 아이템 컴포넌트
  const ToggleItem = ({ icon, title, value, onValueChange }) => (
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
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.neutral[300], true: theme.primary.DEFAULT }}
        thumbColor="white"
      />
    </View>
  );

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
              <Ionicons name="person" size={30} color={theme.neutral[400]} />
            </View>
            <View className="flex-1 justify-center">
              <Text className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                {user.name}
              </Text>
              <Text className="text-neutral-500 dark:text-neutral-400 mb-2">
                {user.email}
              </Text>
              <TouchableOpacity className="bg-neutral-100 dark:bg-neutral-700 py-1 px-3 rounded-full self-start">
                <Text className="text-neutral-500 dark:text-neutral-300 text-xs font-medium">
                  프로필 수정
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-neutral-700 dark:text-neutral-300 mt-4 mb-5">
            {user.bio}
          </Text>

          <View className="flex-row justify-between border-t border-neutral-100 dark:border-neutral-700 pt-4">
            <View className="items-center">
              <Text className="text-neutral-900 dark:text-white font-bold text-lg">
                {user.recipes}
              </Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-xs">
                레시피
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-neutral-900 dark:text-white font-bold text-lg">
                {user.journals}
              </Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-xs">
                양조일지
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-neutral-900 dark:text-white font-bold text-lg">
                {user.events}
              </Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-xs">
                시음회
              </Text>
            </View>
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
          onPress={() => {}}
        />

        <MenuItem
          icon="beer-outline"
          title="양조일지"
          subtitle="기록한 양조일지 보기"
          onPress={() => {}}
        />

        <MenuItem
          icon="bookmark-outline"
          title="저장한 레시피"
          subtitle="다른 사용자의 레시피"
          onPress={() => {}}
        />

        {/* 설정 */}
        <Text className="text-lg font-bold text-neutral-900 dark:text-white mb-3 mt-5">
          설정
        </Text>

        <ToggleItem
          icon="notifications-outline"
          title="푸시 알림"
          value={pushNotification}
          onValueChange={setPushNotification}
        />

        <ToggleItem
          icon="moon-outline"
          title="다크 모드"
          value={darkMode}
          onValueChange={setDarkMode}
        />

        <MenuItem
          icon="shield-outline"
          title="개인정보 보호"
          subtitle="개인정보 보호 설정"
          onPress={() => {}}
        />

        <MenuItem
          icon="help-circle-outline"
          title="도움말"
          subtitle="도움말 및 지원"
          onPress={() => {}}
        />

        <MenuItem
          icon="information-circle-outline"
          title="앱 정보"
          subtitle="앱 정보 및 버전"
          onPress={() => {}}
        />

        {/* 로그아웃 버튼 */}
        <TouchableOpacity className="mt-5 mb-10">
          <View className="bg-neutral-100 dark:bg-neutral-800 rounded-[12px] py-4 flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={20} color="#f87171" />
            <Text className="ml-2 font-medium text-[#f87171]">로그아웃</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
