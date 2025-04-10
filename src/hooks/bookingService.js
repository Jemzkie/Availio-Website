import {
  doc,
  updateDoc,
  increment,
  addDoc,
  collection,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const markBookingAsCompleted = async (bookingId, uid, commissionFee) => {
  try {
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, {
      bookingStatus: "Complete",
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
