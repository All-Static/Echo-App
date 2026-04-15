import React, { useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

  const timesForSelectedDate = availableSlots[selectedDate] || [];

  const handleBook = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Missing selection", "Please choose a day and time.");
      return;
    }

    Alert.alert(
      "Booking Confirmed",
      `Your laundry pickup is booked for ${selectedDate} at ${selectedTime}.`
    );

    // Later, this is where you would save the booking to Firebase/Firestore
    // and remove the slot from availability if needed.
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
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
                  onPress={() => setSelectedTime(time)}
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

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Your Selection</Text>
          <Text style={styles.summaryText}>
            Day: {selectedDate || "None selected"}
          </Text>
          <Text style={styles.summaryText}>
            Time: {selectedTime || "None selected"}
          </Text>
        </View>

        <Pressable style={styles.bookButton} onPress={handleBook}>
          <Text style={styles.bookButtonText}>Book Now</Text>
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
  bookButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});