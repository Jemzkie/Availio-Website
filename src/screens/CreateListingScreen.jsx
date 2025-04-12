import React, { useState } from "react";
import { useSession } from "../context/SessionContext";
import { useNavigate } from "react-router-dom";
import { addVehicle } from "../hooks/vehicleService";
import { MdOutlineFileUpload } from "react-icons/md";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import { storage } from "../config/firebaseConfig";
import Menu from "../components/General/Menu";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CreateListingScreen = () => {
  const { user } = useSession(); // ✅ Get logged-in user info
  const navigate = useNavigate();
  const ViewData = "Listing";

  const [vehicleData, setVehicleData] = useState({
    images: ["", "", "", ""],
    name: "",
    model: "",
    fuelType: "",
    pricePerDay: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (index, file) => {
    if (!file) return;

    const storageRef = ref(storage, `vehicleImages/${Date.now()}_${file.name}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const updatedImages = [...vehicleData.images];
      updatedImages[index] = downloadURL;
      setVehicleData((prev) => ({ ...prev, images: updatedImages }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Image upload failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      alert("You need to be logged in to add a vehicle.");
      return;
    }

    const newVehicle = {
      ...vehicleData,
      ownerId: user.uid,
    };

    const result = await addVehicle(newVehicle);
    if (result.success) {
      alert("Vehicle listed successfully!");
      navigate("/listing");
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <div className="flex flex-row w-full">
      <Menu ViewData={ViewData} />
      <div className="h-auto flex flex-col gap-5 p-5 flex-1">
        <Link className="w-10 h-10" to="/listing">
          <BiArrowBack className="w-full h-full" />
        </Link>
        <div className="w-full h-auto flex flex-col gap-10 ">
          <div className="w-full flex flex-row flex-wrap justify-center gap-5">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="relative flex-1 h-60 border p-2 border-black rounded-lg flex items-center justify-center"
              >
                {vehicleData.images[index] ? (
                  <div className="relative w-full h-full">
                    <img
                      src={vehicleData.images[index]}
                      alt={`Uploaded ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedImages = [...vehicleData.images];
                        updatedImages[index] = "";
                        setVehicleData((prev) => ({
                          ...prev,
                          images: updatedImages,
                        }));
                      }}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-800"
                      title="Remove Image"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex items-center justify-center w-full h-full border-2 border-dashed border-gray-400 rounded-md">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageChange(index, e.target.files[0])
                      }
                    />
                    <MdOutlineFileUpload className="text-3xl text-gray-500" />
                  </label>
                )}
              </div>
            ))}
          </div>

          <div className="w-full h-auto  flex flex-col  rounded-lg">
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

              {/* Vehicle Type */}
              <select
                name="vehicleType"
                value={vehicleData.vehicleType}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              >
                <option value="">Select Vehicle Type</option>
                <option value="2 Wheels">2 Wheels</option>
                <option value="4 Wheels">4 Wheels</option>
              </select>

              {/* Fuel Type */}
              <select
                name="fuelType"
                value={vehicleData.fuelType}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              >
                <option value="">Select Fuel Type</option>
                <option value="Gas">Gas</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
              </select>

              {/* Transmission Type */}
              <select
                name="transmissionType"
                value={vehicleData.transmissonType}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              >
                <option value="">Select Transmission Type</option>
                <option value="Petrol">Automatic</option>
                <option value="Diesel">Manual</option>
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
                className="bg-[#141414] text-white p-2 rounded hover:bg-[#E60000]"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListingScreen;
