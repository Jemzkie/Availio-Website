import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const fetchOwnerTransaction = async (uid) => {
  try {
    const transactionCollection = collection(db, "transactions");
    const q = query(
      transactionCollection,
      where("userId", "==", uid),
      where("status", "==", "paid"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    const transactions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return transactions;
  } catch (error) {
    console.error("Error Fetching Transactions: ", error);
    return [];
  }
};
