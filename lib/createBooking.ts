import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../app/firebaseConfig";
import { SLOT_CAPACITY } from "../constants/timeSlots";

type CreateBookingParams = {
  customerName: string;
  email: string;
  date: string;
  timeSlot: string;
};

function convertTo24Hour(time: string) {
  const [timePart, modifier] = time.split(" ");
  const [rawHours, rawMinutes] = timePart.split(":").map(Number);

  let hours = rawHours;
  const minutes = rawMinutes;

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
}

function buildBookingTimestamp(date: string, timeSlot: string): Timestamp {
  const [year, month, day] = date.split("-").map(Number);
  const { hours, minutes } = convertTo24Hour(timeSlot);

  const bookingDate = new Date(year, month - 1, day, hours, minutes);

  return Timestamp.fromDate(bookingDate);
}

export async function createBooking({
  customerName,
  email,
  date,
  timeSlot,
}: CreateBookingParams) {
  try {
    const user = auth.currentUser;
    console.log("createBooking started");
    console.log("auth user:", user?.uid, user?.email);

    if (!user) throw new Error("Must be logged in");

    const bookingsRef = collection(db, "bookings");
    console.log("bookingsRef ready");

    const bookingQuery = query(
      bookingsRef,
      where("date", "==", date),
      where("timeSlot", "==", timeSlot),
      where("status", "==", "upcoming")
    );

    console.log("query built");

    const snapshot = await getDocs(bookingQuery);
    console.log("query success, count:", snapshot.size);

    const count = snapshot.size;
    const capacity = SLOT_CAPACITY[timeSlot] ?? 1;

    if (count >= capacity) {
      throw new Error("This slot is full");
    }

    const bookingDateTime = buildBookingTimestamp(date, timeSlot);
    console.log("timestamp built");

    const newBooking = {
      userId: user.uid,
      customerName,
      email,
      date,
      timeSlot,
      bookingDateTime,
      status: "upcoming",
      createdAt: serverTimestamp(),
    };

    console.log("about to add doc", newBooking);

    const docRef = await addDoc(bookingsRef, newBooking);
    console.log("doc added:", docRef.id);

    return docRef.id;
  } catch (error: any) {
    console.log("createBooking failed:", error);
    throw error;
  }


}