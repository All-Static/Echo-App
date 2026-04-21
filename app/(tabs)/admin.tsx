import { collection, deleteDoc, doc, getDocs, query } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../lib/firebaseConfig";

type Booking = {
  id: string;
  customerName: string;
  email: string;
  date: string;
  timeSlot: string;
};

export default function AdminScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      console.log("Fetching bookings...");

      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef);
      const snapshot = await getDocs(q);

      const bookingsList: Booking[] = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Booking, "id">),
      }));

      setBookings(bookingsList);
      console.log("Bookings loaded:", bookingsList);
    } catch (error) {
      console.log("Error fetching bookings:", error);
      Alert.alert("Error", "Could not load bookings.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    console.log("ADMIN SCREEN LOADED");
    fetchBookings();
  }, [fetchBookings]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleDeleteBooking = async (bookingId: string) => {
    console.log("handleDeleteBooking fired:", bookingId);

    try {
      setDeletingId(bookingId);

      await deleteDoc(doc(db, "bookings", bookingId));

      console.log("Delete successful:", bookingId);

      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));

      Alert.alert("Deleted", "Booking was deleted.");
    } catch (error) {
      console.log("Delete error:", error);
      Alert.alert("Error", "Could not delete booking.");
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
          onPress={() => {
            console.log("Delete button pressed:", item.id);
            handleDeleteBooking(item.id);
          }}
          style={[styles.deleteButton, isDeleting && styles.disabledButton]}
          disabled={isDeleting}
        >
          <Text style={styles.deleteButtonText}>
            {isDeleting ? "Deleting..." : "Delete Booking"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Bookings</Text>

      {loading ? (
        <Text style={styles.message}>Loading bookings...</Text>
      ) : bookings.length === 0 ? (
        <Text style={styles.message}>No bookings found.</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF7F2",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1E1E1E",
  },
  listContent: {
    paddingBottom: 24,
  },
  message: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 20,
  },
  bookingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E1E1E",
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  deleteButton: {
    marginTop: 12,
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});