import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type SettingSection = {
  title: string;
  settings: Setting[];
};

type Setting = {
  id: string;
  title: string;
  type: "toggle" | "button" | "info";
  value?: boolean;
  info?: string;
  icon?: keyof typeof Ionicons.glyphs;
  iconColor?: string;
  action?: () => void;
};

export default function SettingsScreen() {
  const router = useRouter();

  // 설정 상태 관리
  const [settingSections, setSettingSections] = useState<SettingSection[]>([
    {
      title: "알림 설정",
      settings: [
        {
          id: "push_notifications",
          title: "푸시 알림",
          type: "toggle",
          value: true,
        },
        {
          id: "recipe_updates",
          title: "레시피 업데이트",
          type: "toggle",
          value: true,
        },
        {
          id: "journal_reminders",
          title: "양조일지 알림",
          type: "toggle",
          value: true,
        },
        {
          id: "tasting_invites",
          title: "시음회 초대",
          type: "toggle",
          value: true,
        },
      ],
    },
    {
      title: "앱 설정",
      settings: [
        {
          id: "dark_mode",
          title: "다크 모드",
          type: "toggle",
          value: false,
        },
        {
          id: "auto_save",
          title: "자동 저장",
          type: "toggle",
          value: true,
        },
        {
          id: "language",
          title: "언어",
          type: "info",
          info: "한국어",
          icon: "language-outline",
          iconColor: "#5D3F6A",
          action: () => Alert.alert("언어 설정", "준비 중인 기능입니다."),
        },
      ],
    },
    {
      title: "계정",
      settings: [
        {
          id: "edit_profile",
          title: "프로필 편집",
          type: "button",
          icon: "person-outline",
          iconColor: "#5D3F6A",
          action: () => router.push("/profile/edit"),
        },
        {
          id: "password",
          title: "비밀번호 변경",
          type: "button",
          icon: "lock-closed-outline",
          iconColor: "#5D3F6A",
          action: () => router.push("/profile/change-password"),
        },
        {
          id: "delete_account",
          title: "계정 삭제",
          type: "button",
          icon: "trash-outline",
          iconColor: "#FF6B6B",
          action: () =>
            Alert.alert(
              "계정 삭제",
              "정말 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
              [
                { text: "취소", style: "cancel" },
                { text: "삭제", style: "destructive" },
              ]
            ),
        },
      ],
    },
    {
      title: "기타",
      settings: [
        {
          id: "privacy_policy",
          title: "개인정보 처리방침",
          type: "button",
          icon: "shield-outline",
          iconColor: "#5D3F6A",
          action: () => router.push("/legal/privacy"),
        },
        {
          id: "terms",
          title: "이용약관",
          type: "button",
          icon: "document-text-outline",
          iconColor: "#5D3F6A",
          action: () => router.push("/legal/terms"),
        },
        {
          id: "contact",
          title: "문의하기",
          type: "button",
          icon: "mail-outline",
          iconColor: "#5D3F6A",
          action: () => router.push("/support/contact"),
        },
        {
          id: "app_version",
          title: "앱 버전",
          type: "info",
          info: "1.0.0",
          icon: "information-circle-outline",
          iconColor: "#999",
        },
      ],
    },
  ]);

  // 설정 토글 변경 핸들러
  const handleToggle = (sectionIndex: number, settingIndex: number) => {
    const newSettingSections = [...settingSections];
    const setting = newSettingSections[sectionIndex].settings[settingIndex];

    if (setting.type === "toggle" && setting.value !== undefined) {
      newSettingSections[sectionIndex].settings[settingIndex].value =
        !setting.value;
      setSettingSections(newSettingSections);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        onPress: () => router.replace("/login"),
      },
    ]);
  };

  // 설정 항목 렌더링
  const renderSetting = (
    setting: Setting,
    sectionIndex: number,
    settingIndex: number
  ) => {
    switch (setting.type) {
      case "toggle":
        return (
          <View key={setting.id} style={styles.settingItem}>
            <Text style={styles.settingTitle}>{setting.title}</Text>
            <Switch
              value={setting.value}
              onValueChange={() => handleToggle(sectionIndex, settingIndex)}
              trackColor={{ false: "#D1D1D1", true: "#CABCDA" }}
              thumbColor={setting.value ? "#5D3F6A" : "#F4F3F4"}
            />
          </View>
        );

      case "button":
        return (
          <TouchableOpacity
            key={setting.id}
            style={styles.settingItem}
            onPress={setting.action}
          >
            {setting.icon && (
              <Ionicons
                name={setting.icon}
                size={22}
                color={setting.iconColor || "#333"}
                style={styles.settingIcon}
              />
            )}
            <Text style={styles.settingTitle}>{setting.title}</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        );

      case "info":
        return (
          <View key={setting.id} style={styles.settingItem}>
            {setting.icon && (
              <Ionicons
                name={setting.icon}
                size={22}
                color={setting.iconColor || "#333"}
                style={styles.settingIcon}
              />
            )}
            <Text style={styles.settingTitle}>{setting.title}</Text>
            {setting.action ? (
              <TouchableOpacity onPress={setting.action}>
                <Text style={styles.settingInfo}>{setting.info}</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.settingInfo}>{setting.info}</Text>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>설정</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {settingSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <View style={styles.sectionContent}>
              {section.settings.map((setting, settingIndex) =>
                renderSetting(setting, sectionIndex, settingIndex)
              )}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5D3F6A",
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  sectionContent: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  settingInfo: {
    fontSize: 14,
    color: "#888",
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FF6B6B",
  },
});
