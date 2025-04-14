import {
  doc,
  updateDoc,
  increment,
  addDoc,
  collection,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const markBookingAsCompleted = async (bookingId) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      bookingStatus: "Complete",
      completedAt: Timestamp.now(),
    });

    return true;
  } catch (error) {
    console.error("Error updating booking status:", error);
    return false;
  }
};

export const markExtendBooking = async (
  bookingId,
  dateExtend,
  extendCommissionAmount,
  extendAmount,
  uid
) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      returnDate: dateExtend,
      totalPrice: increment(extendAmount),
    });

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      walletBalance: increment(-extendCommissionAmount),
    });

    await addDoc(collection(db, "transactions"), {
      amount: extendCommissionAmount,
      createdAt: Timestamp.now(),
      status: "paid",
      type: "Commission Fee",
      userId: uid,
    });

    return { success: true };
  } catch (error) {
    console.error("Error extending booking:", error);
    return { success: false, error: error.message };
  }
};

export const markBookingAsOngoing = async (bookingId, uid, commissionFee) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      bookingStatus: "On-Going",
      completedAt: Timestamp.now(),
    });

    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      walletBalance: increment(-commissionFee),
    });

    await addDoc(collection(db, "transactions"), {
      amount: commissionFee,
      createdAt: Timestamp.now(),
      status: "paid",
      type: "Commission Fee",
      userId: uid,
    });

    return true;
  } catch (error) {
    console.error("Error updating booking status:", error);
    return false;
  }
};

export const markRatingToRenter = async (bookingId, renterRating, details) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      renterRating,
      details,
    });
    return true;
  } catch (error) {
    console.error("Error updating booking status:", error);
    return false;
  }
};

export const markBookingAsCancelled = async (bookingId) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      bookingStatus: "Cancelled",
    });
    return true;
  } catch (error) {
    console.error("Error updating booking status:", error);
    return false;
  }
};
