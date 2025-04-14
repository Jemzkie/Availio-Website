import React, { useState } from "react";
import { useSession } from "../../context/SessionContext";
import { useNavigate } from "react-router-dom";
import { addVehicle } from "../../hooks/vehicleService";
import { MdOutlineFileUpload } from "react-icons/md";
import { storage } from "../../config/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AlertModal from "./AlertModal"; // <-- Make sure path is correct

const CreateListingModal = ({ setIsCreateOpen, isCreateOpen }) => {
  if (!isCreateOpen) return null;
  const { user } = useSession();
  const navigate = useNavigate();

  const [vehicleData, setVehicleData] = useState({
    images: ["", "", "", ""],
    name: "",
    model: "",
    fuelType: "",
    pricePerDay: "",
    transmissionType: "",
    vehicleType: "",
    location: "",
    brand: "",
  });

  const [alert, setAlert] = useState({
    isOpen: false,
    message: "",
    type: "success", // or "error"
  });

  const closeAlert = () => setAlert({ ...alert, isOpen: false });

  const showAlert = (message, type = "success") => {
    setAlert({ isOpen: true, message, type });
  };

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
      showAlert("Image upload failed. Please try again.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      showAlert("You need to be logged in to add a vehicle.", "error");
      return;
    }

    const newVehicle = {
      ...vehicleData,
      ownerId: user.uid,
    };

    const result = await addVehicle(newVehicle);
    if (result.success) {
      showAlert("Vehicle listed successfully!");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      showAlert(`Error: ${result.error}`, "error");
    }
  };

  const imageLabels = ["Front", "Side 1", "Side 2", "Back"];

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-center items-center">
        <div className="bg-white p-12 rounded-xl shadow-lg w-7xl font-inter flex flex-col relative">
          <button
            onClick={() => setIsCreateOpen(false)}
            className="absolute top-4 right-4 text-gray-500 cursor-pointer hover:text-black"
          >
            ✕
          </button>
          <div className="w-full h-auto flex flex-row gap-10">
            <div className="w-full flex flex-col items-center gap-5">
              <div className="w-full max-w-lg h-80 border p-2 relative border-black rounded-lg">
                <span className="text-sm font-medium mb-1 absolute top-5 left-5 block">
                  {imageLabels[0]}
                </span>
                {vehicleData.images[0] ? (
                  <div className="relative w-full h-full">
                    <img
                      src={vehicleData.images[0]}
                      alt="Uploaded 1"
                      className="w-full h-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedImages = [...vehicleData.images];
                        updatedImages[0] = "";
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
                      onChange={(e) => handleImageChange(0, e.target.files[0])}
                    />
                    <MdOutlineFileUpload className="text-3xl text-gray-500" />
                  </label>
                )}
              </div>

              <div className="w-full flex flex-row relative flex-wrap justify-center gap-5">
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="relative w-40 h-40 border p-2 border-black rounded-lg"
                  >
                    <span className="text-sm absolute top-5 left-5 font-medium mb-1 block">
                      {imageLabels[index]}
                    </span>
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
                        <MdOutlineFileUpload className="text-2xl text-gray-500" />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full h-auto  flex flex-col  rounded-lg">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <select
                  name="brand"
                  value={vehicleData.brand}
                  onChange={handleChange}
                  required
                  className="border p-2 rounded"
                >
                  <option value="">Select Vehicle Brand</option>
                  <option value="Yamaha">Yamaha</option>
                  <option value="Honda">Honda</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="KYMCO">KYMCO</option>
                  <option value="Vespa">Vespa</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Subaru">Subaru</option>
                  <option value="Mitsubishi">Mitsubishi</option>
                </select>

                <input
                  type="text"
                  name="name"
                  value={vehicleData.name}
                  onChange={handleChange}
                  placeholder="Vehicle Name"
                  required
                  className="border p-2 rounded"
                />

                <input
                  type="text"
                  name="model"
                  value={vehicleData.model}
                  onChange={handleChange}
                  placeholder="Vehicle Model"
                  required
                  className="border p-2 rounded"
                />

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

                <select
                  name="transmissionType"
                  value={vehicleData.transmissionType}
                  onChange={handleChange}
                  required
                  className="border p-2 rounded"
                >
                  <option value="">Select Transmission Type</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>

                <input
                  type="number"
                  name="pricePerDay"
                  value={vehicleData.pricePerDay}
                  onChange={handleChange}
                  placeholder="Price Per Day"
                  required
                  className="border p-2 rounded"
                />

                <input
                  type="text"
                  name="location"
                  value={vehicleData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  required
                  className="border p-2 rounded"
                />

                <button
                  type="submit"
                  className="bg-[#141414] text-white p-2 rounded duration-300 hover:bg-[#E60000]"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Modal */}
      <AlertModal
        isOpen={alert.isOpen}
        onClose={closeAlert}
        message={alert.message}
        type={alert.type}
      />
    </>
  );
};

export default CreateListingModal;
