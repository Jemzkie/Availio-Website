import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const checkUserBan = async (userId) => {
  try {
    const bansRef = collection(db, "bans");
    const q = query(bansRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const banDoc = querySnapshot.docs[0];
      return {
        isBanned: true,
        banData: {
          reason: banDoc.data().reason,
          bannedAt: banDoc.data().bannedAt,
          bannedBy: banDoc.data().bannedBy
        }
      };
    }
    
    return { isBanned: false };
  } catch (error) {
    console.error("Error checking user ban:", error);
    return { isBanned: false };
  }
}; 