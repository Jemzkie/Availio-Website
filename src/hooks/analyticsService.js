import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { Timestamp } from "firebase/firestore";

export const fetchBookingStatus = async (uid) => {
  try {
    const vehicleSnapshot = await getDocs(
      query(collection(db, "vehicles"), where("ownerId", "==", uid))
    );

    const vehicles = vehicleSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const vehicleIdSet = new Set(vehicles.map((v) => v.id));

    const bookingSnapshot = await getDocs(query(collection(db, "bookings")));

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(
      startOfWeek.getDate() - ((startOfToday.getDay() + 6) % 7)
    );
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const startOfQuarter = new Date(
      now.getFullYear(),
      Math.floor(now.getMonth() / 3) * 3,
      1
    );
    const endOfQuarter = new Date(
      now.getFullYear(),
      Math.floor(now.getMonth() / 3) * 3 + 3,
      1
    );

    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

    const ranges = {
      daily: [startOfToday, endOfToday],
      weekly: [startOfWeek, endOfWeek],
      monthly: [startOfMonth, endOfMonth],
      quarterly: [startOfQuarter, endOfQuarter],
      yearly: [startOfYear, endOfYear],
    };

    const counts = {
      daily: { complete: 0, pending: 0, cancel: 0 },
      weekly: { complete: 0, pending: 0, cancel: 0 },
      monthly: { complete: 0, pending: 0, cancel: 0 },
      quarterly: { complete: 0, pending: 0, cancel: 0 },
      yearly: { complete: 0, pending: 0, cancel: 0 },
    };

    const inRange = (date, start, end) => date >= start && date < end;

    for (const bookingDoc of bookingSnapshot.docs) {
      const booking = bookingDoc.data();
      const vehicleId = booking.vehicleId;
      const status = booking.bookingStatus;

      if (!vehicleIdSet.has(vehicleId)) continue;

      let dateToCheck;

      if (status === "Complete" && booking.completedAt?.toDate) {
        dateToCheck = booking.completedAt.toDate();
      } else if (
        (status === "Pending" || status === "Cancel") &&
        booking.createdAt
      ) {
        dateToCheck = new Date(booking.createdAt);
      } else {
        continue;
      }

      const updateCount = (period) => {
        if (status === "Complete") counts[period].complete++;
        if (status === "Pending") counts[period].pending++;
        if (status === "Cancel") counts[period].cancel++;
      };

      if (inRange(dateToCheck, ...ranges.daily)) updateCount("daily");
      if (inRange(dateToCheck, ...ranges.weekly)) updateCount("weekly");
      if (inRange(dateToCheck, ...ranges.monthly)) updateCount("monthly");
      if (inRange(dateToCheck, ...ranges.quarterly)) updateCount("quarterly");
      if (inRange(dateToCheck, ...ranges.yearly)) updateCount("yearly");
    }

    return counts;
  } catch (error) {
    console.error(error);
    return {
      daily: { complete: 0, pending: 0, cancel: 0 },
      weekly: { complete: 0, pending: 0, cancel: 0 },
      monthly: { complete: 0, pending: 0, cancel: 0 },
      quarterly: { complete: 0, pending: 0, cancel: 0 },
      yearly: { complete: 0, pending: 0, cancel: 0 },
    };
  }
};

export const fetchEarningSummary = async (uid) => {
  try {
    const vehicleSnapshot = await getDocs(
      query(collection(db, "vehicles"), where("ownerId", "==", uid))
    );

    const vehicles = vehicleSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const vehicleIdSet = new Set(vehicles.map((v) => v.id));

    const bookingSnapshot = await getDocs(
      query(
        collection(db, "bookings"),
        where("bookingStatus", "==", "Complete")
      )
    );

    const transactionSnapshot = await getDocs(
      query(
        collection(db, "transactions"),
        where("userId", "==", uid),
        where("type", "==", "Commission Fee")
      )
    );

    const initPeriods = () => ({
      daily: {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
      },
      weekly: {
        "Week 1": 0,
        "Week 2": 0,
        "Week 3": 0,
        "Week 4": 0,
        "Week 5": 0,
      },
      monthly: {
        Jan: 0,
        Feb: 0,
        Mar: 0,
        Apr: 0,
        May: 0,
        Jun: 0,
        Jul: 0,
        Aug: 0,
        Sep: 0,
        Oct: 0,
        Nov: 0,
        Dec: 0,
      },
      quarterly: {
        Q1: 0,
        Q2: 0,
        Q3: 0,
        Q4: 0,
      },
    });

    const income = initPeriods();
    const expense = initPeriods();

    const weekdayMap = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const monthMap = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // INCOME
    bookingSnapshot.forEach((doc) => {
      const booking = doc.data();
      if (!vehicleIdSet.has(booking.vehicleId)) return;

      const completedAt = booking.completedAt?.seconds
        ? new Date(booking.completedAt.seconds * 1000)
        : null;

      if (!completedAt) return;

      const day = weekdayMap[completedAt.getDay()];
      const week = `Week ${Math.ceil(completedAt.getDate() / 7)}`;
      const month = monthMap[completedAt.getMonth()];
      const quarter = `Q${Math.floor(completedAt.getMonth() / 3) + 1}`;
      const price = booking.totalPrice || 0;

      income.daily[day] += price;
      income.weekly[week] += price;
      income.monthly[month] += price;
      income.quarterly[quarter] += price;
    });

    // EXPENSE
    transactionSnapshot.forEach((doc) => {
      const tx = doc.data();
      const createdAt = tx.createdAt?.toDate ? tx.createdAt.toDate() : null;
      if (!createdAt) return;

      const day = weekdayMap[createdAt.getDay()];
      const week = `Week ${Math.ceil(createdAt.getDate() / 7)}`;
      const month = monthMap[createdAt.getMonth()];
      const quarter = `Q${Math.floor(createdAt.getMonth() / 3) + 1}`;
      const amount = tx.amount || 0;

      expense.daily[day] += amount;
      expense.weekly[week] += amount;
      expense.monthly[month] += amount;
      expense.quarterly[quarter] += amount;
    });

    return { income, expense };
  } catch (error) {
    console.error("Error fetching earning summary:", error);
    return {
      income: {
        daily: {},
        weekly: {},
        monthly: {},
        quarterly: {},
      },
      expense: {
        daily: {},
        weekly: {},
        monthly: {},
        quarterly: {},
      },
    };
  }
};

export const fetchIncomeandExpenses = async (uid) => {
  try {
    const vehicleSnapshot = await getDocs(
      query(collection(db, "vehicles"), where("ownerId", "==", uid))
    );

    const vehicles = vehicleSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const vehicleIdSet = new Set(vehicles.map((v) => v.id));

    const bookingSnapshot = await getDocs(
      query(
        collection(db, "bookings"),
        where("bookingStatus", "==", "Complete")
      )
    );

    let totalIncome = 0;
    let incomeToday = 0;
    let incomeYesterday = 0;
    let incomeLastWeek = 0;
    let incomeThisWeek = 0;
    let incomeLastMonth = 0;
    let incomeThisMonth = 0;
    let incomeLastQuarter = 0;
    let incomeThisQuarter = 0;
    let incomeLastYear = 0;
    let incomeThisYear = 0;

    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    startOfThisWeek.setHours(0, 0, 0, 0);
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
    const endOfLastWeek = new Date(startOfThisWeek);

    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const quarter = Math.floor(today.getMonth() / 3);
    const startOfThisQuarter = new Date(today.getFullYear(), quarter * 3, 1);
    const startOfLastQuarter = new Date(
      today.getFullYear(),
      (quarter - 1) * 3,
      1
    );
    const endOfLastQuarter = new Date(startOfThisQuarter);

    const startOfThisYear = new Date(today.getFullYear(), 0, 1);
    const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    const endOfLastYear = new Date(startOfThisYear);

    const timestamps = {
      startOfToday: Timestamp.fromDate(startOfToday),
      startOfYesterday: Timestamp.fromDate(startOfYesterday),
      startOfLastWeek: Timestamp.fromDate(startOfLastWeek),
      endOfLastWeek: Timestamp.fromDate(endOfLastWeek),
      startOfThisWeek: Timestamp.fromDate(startOfThisWeek),
      startOfLastMonth: Timestamp.fromDate(startOfLastMonth),
      endOfLastMonth: Timestamp.fromDate(endOfLastMonth),
      startOfThisMonth: Timestamp.fromDate(startOfThisMonth),
      startOfLastQuarter: Timestamp.fromDate(startOfLastQuarter),
      endOfLastQuarter: Timestamp.fromDate(endOfLastQuarter),
      startOfThisQuarter: Timestamp.fromDate(startOfThisQuarter),
      startOfLastYear: Timestamp.fromDate(startOfLastYear),
      endOfLastYear: Timestamp.fromDate(endOfLastYear),
      startOfThisYear: Timestamp.fromDate(startOfThisYear),
    };

    for (const bookingDoc of bookingSnapshot.docs) {
      const booking = bookingDoc.data();
      const vehicleId = booking.vehicleId;

      if (vehicleIdSet.has(vehicleId)) {
        totalIncome += booking.totalPrice;

        const completedAt = booking.completedAt;

        if (completedAt >= timestamps.startOfToday) {
          incomeToday += booking.totalPrice;
        }

        if (
          completedAt >= timestamps.startOfYesterday &&
          completedAt < timestamps.startOfToday
        ) {
          incomeYesterday += booking.totalPrice;
        }

        if (
          completedAt >= timestamps.startOfLastWeek &&
          completedAt < timestamps.endOfLastWeek
        ) {
          incomeLastWeek += booking.totalPrice;
        }

        if (completedAt >= timestamps.startOfThisWeek) {
          incomeThisWeek += booking.totalPrice;
        }

        if (
          completedAt >= timestamps.startOfLastMonth &&
          completedAt < timestamps.endOfLastMonth
        ) {
          incomeLastMonth += booking.totalPrice;
        }

        if (completedAt >= timestamps.startOfThisMonth) {
          incomeThisMonth += booking.totalPrice;
        }

        if (
          completedAt >= timestamps.startOfLastQuarter &&
          completedAt < timestamps.endOfLastQuarter
        ) {
          incomeLastQuarter += booking.totalPrice;
        }

        if (completedAt >= timestamps.startOfThisQuarter) {
          incomeThisQuarter += booking.totalPrice;
        }

        if (
          completedAt >= timestamps.startOfLastYear &&
          completedAt < timestamps.endOfLastYear
        ) {
          incomeLastYear += booking.totalPrice;
        }

        if (completedAt >= timestamps.startOfThisYear) {
          incomeThisYear += booking.totalPrice;
        }
      }
    }

    const transactionSnapshot = await getDocs(
      query(
        collection(db, "transactions"),
        where("type", "==", "Commission Fee"),
        where("userId", "==", uid)
      )
    );

    let totalExpenses = 0;
    let expenseToday = 0;
    let expenseYesterday = 0;
    let expenseLastWeek = 0;
    let expenseThisWeek = 0;
    let expenseLastMonth = 0;
    let expenseThisMonth = 0;
    let expenseLastQuarter = 0;
    let expenseThisQuarter = 0;
    let expenseLastYear = 0;
    let expenseThisYear = 0;

    for (const transactionDoc of transactionSnapshot.docs) {
      const transaction = transactionDoc.data();
      const createdAt = transaction.createdAt;

      totalExpenses += transaction.amount;

      if (createdAt >= timestamps.startOfToday) {
        expenseToday += transaction.amount;
      }

      if (
        createdAt >= timestamps.startOfYesterday &&
        createdAt < timestamps.startOfToday
      ) {
        expenseYesterday += transaction.amount;
      }

      if (
        createdAt >= timestamps.startOfLastWeek &&
        createdAt < timestamps.endOfLastWeek
      ) {
        expenseLastWeek += transaction.amount;
      }

      if (createdAt >= timestamps.startOfThisWeek) {
        expenseThisWeek += transaction.amount;
      }

      if (
        createdAt >= timestamps.startOfLastMonth &&
        createdAt < timestamps.endOfLastMonth
      ) {
        expenseLastMonth += transaction.amount;
      }

      if (createdAt >= timestamps.startOfThisMonth) {
        expenseThisMonth += transaction.amount;
      }

      if (
        createdAt >= timestamps.startOfLastQuarter &&
        createdAt < timestamps.endOfLastQuarter
      ) {
        expenseLastQuarter += transaction.amount;
      }

      if (createdAt >= timestamps.startOfThisQuarter) {
        expenseThisQuarter += transaction.amount;
      }

      if (
        createdAt >= timestamps.startOfLastYear &&
        createdAt < timestamps.endOfLastYear
      ) {
        expenseLastYear += transaction.amount;
      }

      if (createdAt >= timestamps.startOfThisYear) {
        expenseThisYear += transaction.amount;
      }
    }

    return {
      totalIncome,
      incomeToday,
      incomeYesterday,
      incomeLastWeek,
      incomeThisWeek,
      incomeLastMonth,
      incomeThisMonth,
      incomeLastQuarter,
      incomeThisQuarter,
      incomeLastYear,
      incomeThisYear,
      totalExpenses,
      expenseToday,
      expenseYesterday,
      expenseLastWeek,
      expenseThisWeek,
      expenseLastMonth,
      expenseThisMonth,
      expenseLastQuarter,
      expenseThisQuarter,
      expenseLastYear,
      expenseThisYear,
    };
  } catch (error) {
    console.error("Error Fetching Income and Expenses:", error);
    return {
      totalIncome: 0,
      incomeToday: 0,
      incomeYesterday: 0,
      incomeLastWeek: 0,
      incomeThisWeek: 0,
      incomeLastMonth: 0,
      incomeThisMonth: 0,
      incomeLastQuarter: 0,
      incomeThisQuarter: 0,
      incomeLastYear: 0,
      incomeThisYear: 0,
      totalExpenses: 0,
      expenseToday: 0,
      expenseYesterday: 0,
      expenseLastWeek: 0,
      expenseThisWeek: 0,
      expenseLastMonth: 0,
      expenseThisMonth: 0,
      expenseLastQuarter: 0,
      expenseThisQuarter: 0,
      expenseLastYear: 0,
      expenseThisYear: 0,
    };
  }
};
