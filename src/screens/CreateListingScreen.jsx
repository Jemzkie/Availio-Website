import React, { useState } from "react";
import { useSession } from "../context/SessionContext";
import { useNavigate } from "react-router-dom";
import { addVehicle } from "../hooks/vehicleService";

const CreateListingScreen = () => {
  const { user } = useSession(); // ✅ Get logged-in user info
  const navigate = useNavigate();

  const [vehicleData, setVehicleData] = useState({
    images: ["", "", "", ""],
    name: "",
    plateNumber: "",
    model: "",
    fuelType: "",
    pricePerDay: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...vehicleData.images];
    updatedImages[index] = value;
    setVehicleData((prev) => ({ ...prev, images: updatedImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      alert("You need to be logged in to add a vehicle.");
      return;
    }

    const newVehicle = {
      ...vehicleData,
      ownerId: user.uid, // ✅ Use logged-in user's ID as ownerId
    };

    const result = await addVehicle(newVehicle);
    if (result.success) {
      alert("Vehicle listed successfully!");
      navigate("/listing"); // ✅ Redirect to listing page after success
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Upload Your Unit</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Vehicle Name */}
        <input
          type="text"
          name="name"
          value={vehicleData.name}
          onChange={handleChange}
          placeholder="Vehicle Name"
          required
          className="border p-2 rounded"
        />

        {/* Plate Number */}
        <input
          type="text"
          name="plateNumber"
          value={vehicleData.plateNumber}
          onChange={handleChange}
          placeholder="Plate Number"
          required
          className="border p-2 rounded"
        />

        {/* Model */}
        <input
          type="text"
          name="model"
          value={vehicleData.model}
          onChange={handleChange}
          placeholder="Model"
          required
          className="border p-2 rounded"
        />

        {/* Fuel Type */}
        <select
          name="fuelType"
          value={vehicleData.fuelType}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        >
          <option value="">Select Fuel Type</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Electric">Electric</option>
        </select>

        {/* Price Per Day */}
        <input
          type="number"
          name="pricePerDay"
          value={vehicleData.pricePerDay}
          onChange={handleChange}
          placeholder="Price Per Day"
          required
          className="border p-2 rounded"
        />

        {/* Location */}
        <input
          type="text"
          name="location"
          value={vehicleData.location}
          onChange={handleChange}
          placeholder="Location"
          required
          className="border p-2 rounded"
        />

        {/* Images */}
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            type="text"
            value={vehicleData.images[index]}
            onChange={(e) => handleImageChange(index, e.target.value)}
            placeholder={`Image URL ${index + 1}`}
            required
            className="border p-2 rounded"
          />
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateListingScreen;
