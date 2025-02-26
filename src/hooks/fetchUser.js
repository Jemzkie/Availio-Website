import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const fetchUser = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error("No user found for UID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching Firestore document:", error);
    return null;
  }
};

export default fetchUser;
