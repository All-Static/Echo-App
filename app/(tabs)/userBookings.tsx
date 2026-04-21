import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { auth, db } from "@/lib/firebaseConfig";

type Booking = {
  id: string;
  customerName: string;
  email: string;
  date: string;
  timeSlot: string;
};

export default function UserBookingsScreen() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      setUserEmail(user.email?.toLowerCase() ?? null);
    });

    return unsubscribe;
  }, []);

  const fetchUserBookings = useCallback(async () => {
    if (!userEmail) return;

    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("email", "==", userEmail));
      const snapshot = await getDocs(q);

      const bookingsList: Booking[] = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Booking, "id">),
      }));

      bookingsList.sort((a, b) => {
        const first = new Date(`${a.date} ${a.timeSlot}`).getTime();
        const second = new Date(`${b.date} ${b.timeSlot}`).getTime();
        return first - second;
      });

      setBookings(bookingsList);
    } catch (error) {
      console.log("Error fetching user bookings:", error);
      Alert.alert("Error", "Could not load your bookings.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) {
      fetchUserBookings();
    }
  }, [userEmail, fetchUserBookings]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserBookings();
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      setDeletingId(bookingId);

      await deleteDoc(doc(db, "bookings", bookingId));

      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));

      Alert.alert("Booking Cancelled", "Your booking was cancelled.");
    } catch (error) {
      console.log("Error cancelling booking:", error);
      Alert.alert("Error", "Could not cancel your booking.");
    } finally {
      setDeletingId(null);
    }
  };

  const renderItem = ({ item }: { item: Booking }) => {
    const isDeleting = deletingId === item.id;

    return (
      <View style={styles.bookingCard}>
        <Text style={styles.name}>{item.customerName || "No Name"}</Text>
        <Text style={styles.detail}>Email: {item.email || "No Email"}</Text>
        <Text style={styles.detail}>Date: {item.date || "No Date"}</Text>
        <Text style={styles.detail}>Time: {item.timeSlot || "No Time"}</Text>

        <TouchableOpacity
          onPress={() => handleCancelBooking(item.id)}
          style={[styles.cancelButton, isDeleting && styles.disabledButton]}
          disabled={isDeleting}
        >
          <Text style={styles.cancelButtonText}>
            {isDeleting ? "Cancelling..." : "Cancel Booking"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>
          View and manage your upcoming laundry bookings.
        </Text>

        {loading ? (
          <Text style={styles.message}>Loading your bookings...</Text>
        ) : bookings.length === 0 ? (
          <Text style={styles.message}>You do not have any bookings yet.</Text>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FBFD",
  },
  content: {
    flex: 1,
    padding: 20,
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
  message: {
    fontSize: 16,
    color: "#6B7A88",
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 24,
  },
  bookingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D9E7F0",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E3A46",
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: "#6B7A88",
    marginBottom: 4,
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});