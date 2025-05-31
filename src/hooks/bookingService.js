import {
  doc,
  updateDoc,
  increment,
  addDoc,
  collection,
  Timestamp,
  query,
  where,
  getDocs,
  getDoc,
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
    const bookingDoc = await getDoc(bookingRef);
    const booking = bookingDoc.data();

    // Update the booking document
    await updateDoc(bookingRef, {
      renterRating,
      details,
    });

    // Add the rating to the owner's supplierRatings collection
    const ownerId = booking.ownerId;
    const ratingsRef = collection(db, "users", ownerId, "supplierRatings");
    await addDoc(ratingsRef, {
      rating: renterRating,
      details,
      bookingId,
      createdAt: Timestamp.now()
    });

    return true;
  } catch (error) {
    console.error("Error updating rating:", error);
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

export const getActiveBookingsForUser = async (userId, currentUserId) => {
  try {
    const bookingsRef = collection(db, "bookings");
    const q = query(
      bookingsRef,
      where("renterId", "==", userId),
      where("bookingStatus", "in", ["Pending", "On-Going"])
    );
    
    const querySnapshot = await getDocs(q);
    const activeBookings = [];
    
    for (const bookingDoc of querySnapshot.docs) {
      const bookingData = bookingDoc.data();
      // Get vehicle details
      const vehicleRef = doc(db, "vehicles", bookingData.vehicleId);
      const vehicleSnap = await getDoc(vehicleRef);
      
      if (vehicleSnap.exists()) {
        const vehicleData = vehicleSnap.data();
        // Only include bookings where the current user is the owner
        if (vehicleData.ownerId === currentUserId) {
          activeBookings.push({
            id: bookingDoc.id,
            ...bookingData,
            vehicleName: vehicleData.name
          });
        }
      }
    }
    
    return activeBookings;
  } catch (error) {
    console.error("Error getting active bookings:", error);
    return [];
  }
};
