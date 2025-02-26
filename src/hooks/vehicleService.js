import { collection, addDoc, getDocs, getDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebaseConfig.js";

// Function to add a vehicle
export const addVehicle = async (vehicleData) => {
  try {
    const { ownerId, images, name, plateNumber, model, fuelType, pricePerDay, location } = vehicleData;
    
    if (!ownerId || !images || images.length !== 4 || !name || !plateNumber || !model || !fuelType || !pricePerDay || !location) {
      throw new Error("All fields are required, including 4 images.");
    }

    const newVehicleRef = await addDoc(collection(db, "vehicles"), {
      ownerId,
      images,
      name,
      plateNumber,
      model,
      fuelType,
      pricePerDay,
      location,
      createdAt: serverTimestamp(),
    });

    return { success: true, message: "Vehicle added successfully", vehicleId: newVehicleRef.id };
  } catch (error) {
    console.error("Error adding vehicle:", error);
    return { success: false, error: error.message };
  }
};

// Function to get all vehicles
export const fetchVehicles = async () => {
  try {
    const vehiclesSnapshot = await getDocs(collection(db, "vehicles"));
    const vehicles = vehiclesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return vehicles;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
};

// Function to fetch a specific vehicle by ID
export const fetchVehicleById = async (vehicleId) => {
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);
    const vehicleSnap = await getDoc(vehicleRef);

    if (vehicleSnap.exists()) {
      return { id: vehicleSnap.id, ...vehicleSnap.data() };
    } else {
      throw new Error("Vehicle not found");
    }
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return { success: false, error: error.message };
  }
};