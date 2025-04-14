import React, { useState, useEffect } from "react";
import { deleteVehicleById } from "../../hooks/vehicleService";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";
import Ribbon from "../General/Ribbon";
import { MdOutlineFileUpload } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import { ToastContainer } from "react-toastify";
import { toast, Bounce } from "react-toastify";

const Listing = ({
  listings,
  ViewData,
  userData,
  isCreateOpen,
  setIsCreateOpen,
}) => {
  const navigate = useNavigate();

  // Local state for listings
  const [localListings, setLocalListings] = useState(listings);

  // Keep localListings in sync when prop updates
  useEffect(() => {
    setLocalListings(listings);
  }, [listings]);

  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [selectedVehicleName, setSelectedVehicleName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDeleteClick = (vehicleId, vehicleName) => {
    setSelectedVehicleId(vehicleId);
    setSelectedVehicleName(vehicleName);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedVehicleId) return;

    const result = await deleteVehicleById(selectedVehicleId);
    if (result.success) {
      toast.success("Vehicle deleted successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });

      // Update listings after successful deletion
      setLocalListings((prev) =>
        prev.filter((vehicle) => vehicle.id !== selectedVehicleId)
      );
    } else {
      toast.error("Failed to delete vehicle: " + result.error, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col font-inter flex-1 p-5">
      {/* Header Section */}
      <div className="flex w-full h-20 flex-row items-center justify-between mb-4">
        <button
          className="w-auto text-nowrap items-center p-1 gap-2 flex flex-row text-sm px-4 font-semibold rounded-lg border border-gray-400 cursor-pointer"
          onClick={() => setIsCreateOpen(true)}
        >
          Upload Your Unit <MdOutlineFileUpload className="w-8 h-8" />
        </button>
        <div className="flex flex-row gap-4 items-center">
          <button className="w-auto text-nowrap items-center p-1 gap-2 flex flex-row text-sm px-4 font-semibold rounded-lg border border-gray-400 cursor-pointer">
            Brands <RiArrowDropDownLine className="w-8 h-8" />
          </button>
          <Ribbon userData={userData} ViewData={ViewData} />
        </div>
      </div>

      {localListings.length === 0 ? (
        <div className="text-4xl text-gray-600 text-center w-full h-full flex justify-center items-center">
          No listings found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {localListings.map((vehicle) => (
            <div
              key={vehicle.id}
              className="rounded-lg shadow-md overflow-hidden relative"
            >
              <MdDeleteOutline
                onClick={() => handleDeleteClick(vehicle.id, vehicle.name)}
                className="absolute top-4 right-4 w-6 h-6 text-red-600 cursor-pointer"
              />
              <img
                src={vehicle.images?.[0]}
                alt={vehicle.name}
                className="w-full h-40 object-contain"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                <p className="text-gray-500">
                  {vehicle.model} - {vehicle.fuelType}
                </p>
                <p className="text-gray-700">₱{vehicle.pricePerDay} / day</p>
                <p className="text-gray-400">{vehicle.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        vehicleName={selectedVehicleName}
      />
      <ToastContainer />
    </div>
  );
};

export default Listing;
