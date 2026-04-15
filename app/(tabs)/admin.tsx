import { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type BookingMap = {
  [date: string]: string[];
};

const sampleBookings: BookingMap = {
  "2026-04-14": ["9:00 AM - 2 orders", "1:00 PM - 1 order"],
  "2026-04-15": ["10:00 AM - 3 orders", "3:00 PM - 1 order"],
  "2026-04-18": ["11:00 AM - 2 orders"],
  "2026-04-22": ["9:30 AM - 1 order", "12:00 PM - 2 orders"],
};

const COLORS = {
  primary: "#7CCBFF",
  primaryDark: "#4FA9E6",
  background: "#FAF7F2",
  white: "#FFFFFF",
  text: "#1E1E1E",
  secondaryText: "#6B7280",
  border: "#E5E7EB",
  selectedText: "#FFFFFF",
  muted: "#F3F4F6",
  success: "#22C55E",
  lightBlue: "#EAF7FF",
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type CalendarDay = {
  key: string;
  dayNumber: number | null;
  fullDate: string | null;
  hasBookings: boolean;
};

export default function AdminScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthLabel = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: CalendarDay[] = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({
        key: `empty-${i}`,
        dayNumber: null,
        fullDate: null,
        hasBookings: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = formatDate(year, month, day);

      days.push({
        key: fullDate,
        dayNumber: day,
        fullDate,
        hasBookings: Boolean(sampleBookings[fullDate]),
      });
    }

    return days;
  }, [month, year]);

  const selectedBookings = selectedDate ? sampleBookings[selectedDate] || [] : [];

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Admin Calendar</Text>
        <Text style={styles.subtitle}>Manage bookings by day</Text>

        <View style={styles.headerCard}>
          <TouchableOpacity
            style={styles.monthNavButton}
            onPress={goToPreviousMonth}
            activeOpacity={0.8}
          >
            <Text style={styles.monthNavText}>{"<"}</Text>
          </TouchableOpacity>

          <Text style={styles.monthLabel}>{monthLabel}</Text>

          <TouchableOpacity
            style={styles.monthNavButton}
            onPress={goToNextMonth}
            activeOpacity={0.8}
          >
            <Text style={styles.monthNavText}>{">"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.weekHeaderRow}>
            {weekDays.map((day) => (
              <Text key={day} style={styles.weekHeaderText}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {calendarDays.map((item) => {
              if (!item.dayNumber || !item.fullDate) {
                return <View key={item.key} style={styles.emptyCell} />;
              }

              const isSelected = selectedDate === item.fullDate;

              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.dayCell, isSelected && styles.selectedDayCell]}
                  onPress={() => setSelectedDate(item.fullDate)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[styles.dayText, isSelected && styles.selectedDayText]}
                  >
                    {item.dayNumber}
                  </Text>

                  {item.hasBookings && (
                    <View
                      style={[
                        styles.bookingDot,
                        isSelected && styles.selectedBookingDot,
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>
            {selectedDate ? `Bookings for ${selectedDate}` : "Select a date"}
          </Text>

          {selectedDate ? (
            selectedBookings.length > 0 ? (
              selectedBookings.map((booking, index) => (
                <View key={`${booking}-${index}`} style={styles.bookingItem}>
                  <Text style={styles.bookingItemText}>{booking}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No bookings for this date.</Text>
            )
          ) : (
            <Text style={styles.emptyText}>
              Tap a day on the calendar to view bookings.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatDate(year: number, month: number, day: number) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

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
    color: COLORS.secondaryText,
    marginBottom: 20,
  },
  headerCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  monthNavButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  monthNavText: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  monthLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
  },
  calendarCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 16,
  },
  weekHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  weekHeaderText: {
    width: "13.5%",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.secondaryText,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emptyCell: {
    width: "13.5%",
    aspectRatio: 1,
    marginBottom: 10,
  },
  dayCell: {
    width: "13.5%",
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: COLORS.muted,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  selectedDayCell: {
    backgroundColor: COLORS.primaryDark,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  selectedDayText: {
    color: COLORS.selectedText,
  },
  bookingDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: COLORS.success,
    marginTop: 4,
  },
  selectedBookingDot: {
    backgroundColor: COLORS.white,
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
  },
  bookingItem: {
    backgroundColor: COLORS.lightBlue,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bookingItemText: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.secondaryText,
  },
});