import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { auth } from "@/lib/firebaseConfig";

export default function DashboardScreen() {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email ?? null);
      } else {
        router.replace("/login");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Dashboard</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Profile</Text>
          <Text style={styles.cardText}>{userEmail || "Loading..."}</Text>
        </View>

        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/(tabs)/userBook")}
        >
          <Text style={styles.primaryButtonText}>New Booking</Text>
        </Pressable>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Bookings</Text>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.push("/(tabs)/userBookings")}
          >
            <Text style={styles.secondaryButtonText}>View Bookings</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>About Us</Text>
          <Text style={styles.cardText}>
            Fast, simple laundry booking for your local laundromat.
          </Text>
        </View>
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1E1E1E",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#1E1E1E",
  },
  cardText: {
    fontSize: 14,
    color: "#6B7280",
  },
  primaryButton: {
    backgroundColor: "#7CCBFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  secondaryButton: {
    marginTop: 10,
    backgroundColor: "#4FA9E6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});