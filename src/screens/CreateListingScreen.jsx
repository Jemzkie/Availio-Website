import React, { useState } from "react";
import { useSession } from "../context/SessionContext";
import { useNavigate } from "react-router-dom";
import { addVehicle } from "../hooks/vehicleService";
import { MdOutlineFileUpload } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";

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
    <div className="w-full h-screen flex flex-col p-16 gap-5">
      <Link to="/listing">
        <BiArrowBack className="w-10 h-10" />
      </Link>
      <div className="w-full h-screen flex flex-row gap-10 p-20">
        <div className="w-1/2">
          <div className="h-100 border border-gray-400 rounded-lg text-2xl font-semibold mb-4 flex justify-center items-center">
            <label className="flex justify-center">
              Upload Your Unit <MdOutlineFileUpload className="w-8 h-8" />
            </label>
          </div>
          <div className="flex flex-row justify-between gap-5">
            <div className="w-60 h-45 border border-black p-20 rounded-lg"></div>
            <div className="w-60 h-45 border border-black p-20 rounded-lg"></div>
            <div className="w-60 h-45 border border-black p-20 rounded-lg"></div>
          </div>
          {/* Images */}
          {/* {[0, 1, 2, 3].map((index) => (
            <input
              key={index}
              type="text"
              value={vehicleData.images[index]}
              onChange={(e) => handleImageChange(index, e.target.value)}
              placeholder={`Image URL ${index + 1}`}
              required
              className="border p-2 rounded"
            />
          ))} */}
        </div>

        <div className="w-1/2 h-150 border border-gray-400 p-20 rounded-lg">
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
              placeholder="Vehicle Plate Number"
              required
              className="border p-2 rounded"
            />

            {/* Model */}
            <input
              type="text"
              name="model"
              value={vehicleData.model}
              onChange={handleChange}
              placeholder="Vehicle Model"
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
              <option value="Unleaded">Unleaded</option>
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

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-[#141414] text-white p-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateListingScreen;
