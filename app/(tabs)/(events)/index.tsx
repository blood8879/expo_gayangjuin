import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// 이벤트(시음회) 타입 정의
type TastingEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  thumbnailUrl: string;
  isHost: boolean;
};

export default function EventsScreen() {
  const router = useRouter();

  // 더미 데이터
  const [events, setEvents] = useState<TastingEvent[]>([
    {
      id: "1",
      title: "전통 막걸리 시음회",
      date: "2023년 7월 15일 14:00",
      location: "서울 강남구 테헤란로 123",
      maxParticipants: 10,
      currentParticipants: 5,
      thumbnailUrl: "https://via.placeholder.com/150",
      isHost: true,
    },
    {
      id: "2",
      title: "수제 맥주 품평회",
      date: "2023년 7월 22일 19:00",
      location: "서울 마포구 홍대로 45",
      maxParticipants: 12,
      currentParticipants: 3,
      thumbnailUrl: "https://via.placeholder.com/150",
      isHost: false,
    },
    {
      id: "3",
      title: "과일 와인 시음회",
      date: "2023년 7월 29일 18:00",
      location: "서울 용산구 이태원로 67",
      maxParticipants: 8,
      currentParticipants: 7,
      thumbnailUrl: "https://via.placeholder.com/150",
      isHost: false,
    },
    {
      id: "4",
      title: "고급 막걸리 비교 시음",
      date: "2023년 8월 5일 15:00",
      location: "서울 종로구 북촌로 89",
      maxParticipants: 15,
      currentParticipants: 10,
      thumbnailUrl: "https://via.placeholder.com/150",
      isHost: true,
    },
  ]);

  // 이벤트 카드 렌더링 함수
  const renderEventCard = ({ item }: { item: TastingEvent }) => (
    <TouchableOpacity
      style={styles.eventCard}
      //   onPress={() => router.push(`/events/${item.id}`)}
    >
      <Image
        source={{ uri: item.thumbnailUrl }}
        style={styles.eventImage}
        resizeMode="cover"
      />
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          {item.isHost && (
            <View style={styles.hostBadge}>
              <Text style={styles.hostBadgeText}>주최자</Text>
            </View>
          )}
        </View>

        <View style={styles.eventInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{item.date}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{item.location}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.infoText}>
              {item.currentParticipants}/{item.maxParticipants} 참가자
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${
                    (item.currentParticipants / item.maxParticipants) * 100
                  }%`,
                },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round(
              (item.currentParticipants / item.maxParticipants) * 100
            )}
            %
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>시음회</Text>
        <TouchableOpacity
          style={styles.createButton}
          //   onPress={() => router.push("/events/create")}
        >
          <Ionicons name="add" size={22} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.filtersContainer}>
        <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
          <Text style={styles.activeFilterText}>전체</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>주최</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>참여</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        renderItem={renderEventCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  createButton: {
    backgroundColor: "#5D3F6A",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  filtersContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F2",
  },
  activeFilter: {
    backgroundColor: "#5D3F6A",
  },
  filterText: {
    color: "#666",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "white",
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: "100%",
    height: 150,
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  hostBadge: {
    backgroundColor: "#5D3F6A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  hostBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  eventInfo: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#EEEEEE",
    borderRadius: 4,
    marginRight: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#5D3F6A",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    width: 40,
    textAlign: "right",
  },
});
