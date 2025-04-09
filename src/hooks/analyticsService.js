import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  orderBy,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Timestamp } from "firebase/firestore";

export const fetchBookingStatus = async (uid) => {
  try {
    // Step 1: Get vehicles owned by the owner
    const vehicleSnapshot = await getDocs(
      query(collection(db, "vehicles"), where("ownerId", "==", uid))
    );

    const vehicles = vehicleSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const vehicleIdSet = new Set(vehicles.map((v) => v.id));

    const bookingSnapshot = await getDocs(query(collection(db, "bookings")));
    let completed = 0;
    let cancel = 0;
    let pending = 0;

    for (const bookingDoc of bookingSnapshot.docs) {
      const booking = bookingDoc.data();
      const vehicleId = booking.vehicleId;

      if (vehicleIdSet.has(vehicleId)) {
        const vehicle = vehicles.find((v) => v.id === vehicleId);

        if (booking.bookingStatus === "Completed") {
          completed++;
        }
        if (booking.bookingStatus === "Pending") {
          pending++;
        }
        if (booking.bookingStatus === "Cancel") {
          cancel++;
        }
      }
    }

    return { completed, pending, cancel };
  } catch (error) {
    console.error(error);
    return { completed: 0, pending: 0, cancel: 0 };
  }
};

export const fetchEarningSummary = async (uid) => {
  try {
    // Step 1: Get all vehicles owned by the user
    const vehicleSnapshot = await getDocs(
      query(collection(db, "vehicles"), where("ownerId", "==", uid))
    );

    const vehicles = vehicleSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const vehicleIdSet = new Set(vehicles.map((v) => v.id));

    // Step 2: Get all completed bookings
    const bookingSnapshot = await getDocs(
      query(
        collection(db, "bookings"),
        where("bookingStatus", "==", "Completed")
      )
    );

    const monthlyEarnings = Array(12).fill(0);

    bookingSnapshot.forEach((doc) => {
      const booking = doc.data();

      if (vehicleIdSet.has(booking.vehicleId)) {
        const completedAt = booking.completedAt?.seconds
          ? new Date(booking.completedAt.seconds * 1000)
          : null;

        if (completedAt) {
          const month = completedAt.getMonth(); // 0-11
          monthlyEarnings[month] += booking.totalPrice || 0;
        }
      }
    });

    return monthlyEarnings;
  } catch (error) {
    console.error("Error fetching earning summary:", error);
    return [];
  }
};

export const fetchIncomeandExpenses = async (uid) => {
  try {
    // Step 1: Get vehicles owned by the owner
    const vehicleSnapshot = await getDocs(
      query(collection(db, "vehicles"), where("ownerId", "==", uid))
    );

    const vehicles = vehicleSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const vehicleIdSet = new Set(vehicles.map((v) => v.id));

    // Step 2: Get all bookings with "Completed" status and calculate total income
    const bookingSnapshot = await getDocs(
      query(
        collection(db, "bookings"),
        where("bookingStatus", "==", "Completed")
      )
    );

    let totalIncome = 0;
    let incomeYesterday = 0;
    let incomeLastWeek = 0;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1); // Set yesterday's date
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    // Convert to Firestore Timestamps
    const yesterdayTimestamp = Timestamp.fromDate(yesterday);
    const lastWeekTimestamp = Timestamp.fromDate(lastWeek);

    for (const bookingDoc of bookingSnapshot.docs) {
      const booking = bookingDoc.data();
      const vehicleId = booking.vehicleId;

      // Only continue if the booking is for an owner's vehicle
      if (vehicleIdSet.has(vehicleId)) {
        const vehicle = vehicles.find((v) => v.id === vehicleId);

        // Get renter info
        const renterRef = doc(db, "users", booking.renterId);
        const renterSnap = await getDoc(renterRef);
        const renter = renterSnap.exists() ? renterSnap.data() : null;

        // Accumulate total income for completed bookings
        totalIncome += booking.totalPrice;

        // Accumulate income for yesterday
        if (
          booking.completedAt >= yesterdayTimestamp &&
          booking.completedAt < today.getTime()
        ) {
          incomeYesterday += booking.totalPrice;
        }

        // Accumulate income for the last week (7 days)
        if (
          booking.completedAt >= lastWeekTimestamp &&
          booking.completedAt < today.getTime()
        ) {
          incomeLastWeek += booking.totalPrice;
        }
      }
    }

    // Step 3: Get expenses (Commission Fee transactions)
    const transactionSnapshot = await getDocs(
      query(
        collection(db, "transactions"),
        where("type", "==", "Commission Fee"),
        where("userId", "==", uid)
      )
    );

    let totalExpenses = 0;
    let expenseYesterday = 0;
    let expenseLastWeek = 0;

    for (const transactionDoc of transactionSnapshot.docs) {
      const transaction = transactionDoc.data();
      totalExpenses += transaction.amount;

      if (transaction.createdAt >= yesterdayTimestamp < today.getTime()) {
        expenseYesterday += transaction.amount;
      }

      if (
        transaction.createdAt >= lastWeekTimestamp &&
        transaction.createdAt < today.getTime()
      ) {
        expenseLastWeek += transaction.amount;
      }
    }

    return {
      totalIncome,
      incomeYesterday,
      incomeLastWeek,
      totalExpenses,
      expenseYesterday,
      expenseLastWeek,
    };
  } catch (error) {
    console.error("Error Fetching Income and Expenses:", error);
    return {
      totalIncome: 0,
      incomeYesterday: 0,
      incomeLastWeek: 0,
      totalExpenses: 0,
      expenseYesterday: 0,
      expenseLastWeek: 0,
    };
  }
};
