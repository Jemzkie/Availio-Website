import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../config/firebaseConfig";

export const updateUserProfile = async (userId, updatedData) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const userRef = doc(db, "users", userId);

    if (updatedData.businessProfile) {
      const businessImageRef = ref(
        storage,
        `profile_pictures/business/${userId}`
      );
      await uploadBytes(businessImageRef, updatedData.businessProfile);
      const businessImageUrl = await getDownloadURL(businessImageRef);
      updatedData.businessProfile = businessImageUrl;
    }

    if (updatedData.personalProfile) {
      const personalImageRef = ref(
        storage,
        `profile_pictures/personal/${userId}`
      );
      await uploadBytes(personalImageRef, updatedData.personalProfile);
      const personalImageUrl = await getDownloadURL(personalImageRef);
      updatedData.personalProfile = personalImageUrl;
    }

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
