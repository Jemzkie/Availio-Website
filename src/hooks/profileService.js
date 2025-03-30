import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebaseConfig";

// ✅ Update User Profile
export const updateUserProfile = async (userId, updatedData) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const userRef = doc(db, "users", userId);

    // ✅ If there's an image, upload to Firebase Storage
    if (updatedData.profilePicture) {
      const imageRef = ref(storage, `profile_pictures/${userId}`);
      await uploadBytes(imageRef, updatedData.profilePicture);
      const imageUrl = await getDownloadURL(imageRef);
      updatedData.profilePicture = imageUrl;
    }

    // ✅ Update Firestore document with new data
    await updateDoc(userRef, updatedData);

    return { success: true, message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message };
  }
};

// ✅ Get User Profile
export const getUserProfile = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() };
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { success: false, error: error.message };
  }
};
