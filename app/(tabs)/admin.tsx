import { useFocusEffect } from "expo-router";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { db } from "../firebaseConfig";

type Booking = {
  id: string;
  customerName?: string;
  email?: string;
  date?: string;
  timeSlot?: string;
  status?: string;
};

export default function AdminScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const loadBookings = async () => {
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, orderBy("bookingDateTime", "asc"));
      const snapshot = await getDocs(q);

      const bookingList: Booking[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          customerName: data.customerName ?? "",
          email: data.email ?? "",
          date: data.date ?? "",
          timeSlot: data.timeSlot ?? "",
          status: data.status ?? "",
        };
      });

      setBookings(bookingList);

      if (!selectedDate && bookingList.length > 0) {
        setSelectedDate(bookingList[0].date ?? null);
      }
    } catch (error) {
      console.log("Error loading bookings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadBookings();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
  };

  const uniqueDates = useMemo(() => {
    return [...new Set(bookings.map((booking) => booking.date).filter(Boolean))];
  }, [bookings]);

  const bookingsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return bookings.filter((booking) => booking.date === selectedDate);
  }, [bookings, selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Admin Calendar</Text>
        <Text style={styles.subtitle}>View customer bookings by date</Text>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#4FA9E6" />
            <Text style={styles.loadingText}>Loading bookings...</Text>
          </View>
        ) : bookings.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No bookings yet</Text>
            <Text style={styles.emptyText}>
              New customer bookings will appear here.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Calendar</Text>
            <View style={styles.calendarWrap}>
              {uniqueDates.map((date) => {
                const isSelected = selectedDate === date;
                const count = bookings.filter(
                  (booking) => booking.date === date
                ).length;

                return (
                  <Pressable
                    key={date}
                    style={[
                      styles.dateCard,
                      isSelected && styles.selectedDateCard,
                    ]}
                    onPress={() => setSelectedDate(date ?? null)}
                  >
                    <Text
                      style={[
                        styles.dateText,
                        isSelected && styles.selectedDateText,
                      ]}
                    >
                      {date}
                    </Text>
                    <Text
                      style={[
                        styles.countText,
                        isSelected && styles.selectedDateText,
                      ]}
                    >
                      {count} booking{count !== 1 ? "s" : ""}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>
              {selectedDate ? `Bookings for ${selectedDate}` : "Bookings"}
            </Text>

            {bookingsForSelectedDate.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No bookings for this date.</Text>
              </View>
            ) : (
              bookingsForSelectedDate.map((item) => (
                <View key={item.id} style={styles.card}>
                  <Text style={styles.name}>{item.customerName || "No name"}</Text>
                  <Text style={styles.detail}>
                    Email: {item.email || "No email"}
                  </Text>
                  <Text style={styles.detail}>
                    Time: {item.timeSlot || "No time"}
                  </Text>
                  <Text style={styles.detail}>
                    Status: {item.status || "No status"}
                  </Text>
                </View>
              ))
            )}

            <Text style={styles.sectionTitle}>All Upcoming Bookings</Text>

            <FlatList
              data={bookings}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View style={styles.smallCard}>
                  <Text style={styles.smallCardTitle}>
                    {item.date} • {item.timeSlot}
                  </Text>
                  <Text style={styles.smallCardText}>
                    {item.customerName || "No name"}
                  </Text>
                </View>
              )}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FBFD",
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2E3A46",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7A88",
    marginBottom: 20,
  },
  centered: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#6B7A88",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E3A46",
    marginBottom: 12,
    marginTop: 10,
  },
  calendarWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
  },
  dateCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9E7F0",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
    minWidth: 130,
  },
  selectedDateCard: {
    backgroundColor: "#4FA9E6",
    borderColor: "#4FA9E6",
  },
  dateText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2E3A46",
    marginBottom: 4,
  },
  countText: {
    fontSize: 13,
    color: "#6B7A88",
  },
  selectedDateText: {
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#D9E7F0",
    marginBottom: 12,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2E3A46",
    marginBottom: 10,
  },
  detail: {
    fontSize: 15,
    color: "#6B7A88",
    marginBottom: 6,
  },
  smallCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D9E7F0",
    marginBottom: 10,
  },
  smallCardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2E3A46",
    marginBottom: 4,
  },
  smallCardText: {
    fontSize: 14,
    color: "#6B7A88",
  },
  emptyState: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D9E7F0",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2E3A46",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7A88",
  },
});