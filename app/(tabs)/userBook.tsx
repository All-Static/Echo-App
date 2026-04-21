import { router } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { createBooking } from "../../lib/createBooking";
import { auth } from "../../lib/firebaseConfig";

type SlotMap = {
  [date: string]: string[];
};

const availableSlots: SlotMap = {
  "2026-04-15": ["9:00 AM", "10:00 AM", "1:00 PM", "3:00 PM"],
  "2026-04-16": ["11:00 AM", "12:00 PM", "2:00 PM"],
  "2026-04-17": ["8:30 AM", "10:30 AM", "4:00 PM"],
  "2026-04-18": ["9:30 AM", "1:30 PM", "5:00 PM"],
};

export default function HomeScreen() {
  const dates = useMemo(() => Object.keys(availableSlots), []);
  const [selectedDate, setSelectedDate] = useState<string>(dates[0]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const timesForSelectedDate = availableSlots[selectedDate] || [];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const signedInEmail = user.email ?? null;
        setUserEmail(signedInEmail);

        if (!email && signedInEmail) {
          setEmail(signedInEmail);
        }
      } else {
        router.replace("/login");
      }
    });

    return unsubscribe;
  }, [email]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.log("Sign out error:", error);
      Alert.alert("Sign Out Error", "Could not sign out. Please try again.");
    }
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Missing selection", "Please choose a day and time.");
      return;
    }

    if (!customerName.trim() || !email.trim()) {
      Alert.alert("Missing info", "Please enter your name and email.");
      return;
    }

    try {
      setIsSubmitting(true);
      setIsBooked(false);

      await createBooking({
        customerName: customerName.trim(),
        email: email.trim(),
        date: selectedDate,
        timeSlot: selectedTime,
      });

      router.push("/(tabs)/userBookings");

      

      setIsBooked(true);

      Alert.alert(
        "Booking Confirmed",
        `Your laundry pickup is booked for ${selectedDate} at ${selectedTime}.`
      );

      setSelectedTime(null);
      setCustomerName("");
      setEmail(userEmail || "");
    } catch (error: any) {
      Alert.alert("Booking Error", error.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topCard}>
          <View>
            <Text style={styles.signedInLabel}>Signed in as</Text>
            <Text style={styles.signedInEmail}>
              {userEmail || "Loading..."}
            </Text>
          </View>

          <Pressable style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Book Your Laundry Pickup</Text>
        <Text style={styles.subtitle}>Choose an available day and time</Text>

        <Text style={styles.sectionTitle}>Select a Day</Text>
        <View style={styles.optionsWrap}>
          {dates.map((date) => {
            const isSelected = selectedDate === date;

            return (
              <Pressable
                key={date}
                style={[styles.optionButton, isSelected && styles.selectedButton]}
                onPress={() => {
                  setSelectedDate(date);
                  setSelectedTime(null);
                  setIsBooked(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}
                >
                  {date}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Available Times</Text>
        <View style={styles.optionsWrap}>
          {timesForSelectedDate.length > 0 ? (
            timesForSelectedDate.map((time) => {
              const isSelected = selectedTime === time;

              return (
                <Pressable
                  key={time}
                  style={[styles.optionButton, isSelected && styles.selectedButton]}
                  onPress={() => {
                    setSelectedTime(time);
                    setIsBooked(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText,
                    ]}
                  >
                    {time}
                  </Text>
                </Pressable>
              );
            })
          ) : (
            <Text style={styles.noSlotsText}>No available times for this day.</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Your Info</Text>

        <TextInput
          placeholder="Your Name"
          value={customerName}
          onChangeText={(text) => {
            setCustomerName(text);
            setIsBooked(false);
          }}
          style={styles.input}
          placeholderTextColor={COLORS.subtext}
        />

        <TextInput
          placeholder="Your Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setIsBooked(false);
          }}
          style={styles.input}
          placeholderTextColor={COLORS.subtext}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Selection</Text>
          <Text style={styles.summaryText}>
            Day: {selectedDate || "None selected"}
          </Text>
          <Text style={styles.summaryText}>
            Time: {selectedTime || "None selected"}
          </Text>
          <Text style={styles.summaryText}>
            Name: {customerName || "Not entered"}
          </Text>
          <Text style={styles.summaryText}>
            Email: {email || "Not entered"}
          </Text>
        </View>

        <Pressable
          style={[
            styles.bookButton,
            isSubmitting && styles.bookButtonDisabled,
            isBooked && styles.bookedButton,
          ]}
          onPress={handleBook}
          disabled={isSubmitting}
        >
          <Text style={styles.bookButtonText}>
            {isSubmitting ? "Booking..." : isBooked ? "Booked" : "Book Now"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  primary: "#7CCBFF",
  primaryDark: "#4FA9E6",
  background: "#F7FBFD",
  card: "#FFFFFF",
  text: "#2E3A46",
  subtext: "#6B7A88",
  border: "#D9E7F0",
  selectedText: "#FFFFFF",
  success: "#4CAF50",
  danger: "#DC2626",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  topCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  signedInLabel: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 4,
  },
  signedInEmail: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  signOutButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  signOutButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.subtext,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 10,
  },
  optionsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 18,
  },
  optionButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  optionText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "500",
  },
  selectedOptionText: {
    color: COLORS.selectedText,
  },
  noSlotsText: {
    color: COLORS.subtext,
    fontSize: 15,
  },
  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    color: COLORS.text,
    fontSize: 15,
  },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 15,
    color: COLORS.subtext,
    marginBottom: 6,
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  bookedButton: {
    backgroundColor: COLORS.success,
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});