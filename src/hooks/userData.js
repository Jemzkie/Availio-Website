import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

const fetchUser = async (uid) => {
  try {
    console.log("=== Fetching user data ===");
    console.log("User ID:", uid);
    
    const docRef = doc(db, "users", uid);
    console.log("Document reference:", docRef.path);
    
    const docSnap = await getDoc(docRef);
    console.log("Document exists:", docSnap.exists());

    if (docSnap.exists()) {
      const userData = docSnap.data();
      console.log("=== User Data Fields ===");
      console.log("Username:", userData.username);
      console.log("Profile Picture:", userData.profilePicture);
      console.log("First Name:", userData.firstName);
      console.log("Last Name:", userData.lastName);
      console.log("All user data:", userData);
      return userData;
    } else {
      console.log("No user document found for ID:", uid);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export default fetchUser;
