import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export const getAverageRating = async (vehicleId) => {
  try {
    const ratingsRef = collection(db, "vehicles", vehicleId, "ratings");
    const ratingsSnapshot = await getDocs(ratingsRef);
    
    if (ratingsSnapshot.empty) {
      return { averageRating: 0, totalRatings: 0 };
    }

    let totalRating = 0;
    let count = 0;

    ratingsSnapshot.forEach((doc) => {
      const rating = doc.data().rating;
      if (rating) {
        totalRating += rating;
        count++;
      }
    });

    const averageRating = count > 0 ? totalRating / count : 0;
    return { averageRating, totalRatings: count };
  } catch (error) {
    console.error("Error fetching average rating:", error);
    return { averageRating: 0, totalRatings: 0 };
  }
}; 