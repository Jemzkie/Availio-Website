import React, { useEffect, useState } from "react";
import Menu from "../components/General/Menu";
import { fetchVehicles } from "../hooks/vehicleService";
import Loader from "../components/General/Loader";
import { useSession } from "../context/SessionContext";
import fetchUser from "../hooks/userData";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaStar } from "react-icons/fa";
import { getAverageRating } from "../hooks/ratingService";
import VehicleDetailsModal from "../components/Vehicle/VehicleDetailsModal";
import { MdOutlineFileUpload, MdDeleteOutline } from "react-icons/md";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { deleteVehicleById } from "../hooks/vehicleService";
import ConfirmDeleteModal from "../components/Listing/ConfirmDeleteModal";
import Ribbon from "../components/General/Ribbon";
import CreateListingModal from "../components/Listing/CreateListingModal";
import EditVehicleModal from "../components/Listing/EditVehicleModal";

const ListingScreen = () => {
  const ViewData = "Listing";
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const { user } = useSession();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [selectedVehicleName, setSelectedVehicleName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedVehicleForEdit, setSelectedVehicleForEdit] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRequest = await fetchUser(user.uid);
        setUserData(userRequest);

        const vehiclesData = await fetchVehicles();
        const userVehicles = vehiclesData.filter(vehicle => vehicle.ownerId === user.uid);
        
        const vehiclesWithRatings = await Promise.all(
          userVehicles.map(async (vehicle) => {
            const { averageRating, totalRatings } = await getAverageRating(vehicle.id);
            return {
              ...vehicle,
              averageRating: averageRating || 0,
              totalRatings: totalRatings || 0
            };
          })
        );
        
        setVehicles(vehiclesWithRatings);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading vehicles:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user.uid]);

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicleForEdit(vehicle);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (vehicleId, vehicleName) => {
    setSelectedVehicleId(vehicleId);
    setSelectedVehicleName(vehicleName);
    setIsDeleteModalOpen(true);
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

      setVehicles((prev) =>
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

    setIsDeleteModalOpen(false);
  };

  const handleEditSuccess = async () => {
    // Refresh the vehicles list after successful edit
    const vehiclesData = await fetchVehicles();
    const userVehicles = vehiclesData.filter(vehicle => vehicle.ownerId === user.uid);
    
    const vehiclesWithRatings = await Promise.all(
      userVehicles.map(async (vehicle) => {
        const { averageRating, totalRatings } = await getAverageRating(vehicle.id);
        return {
          ...vehicle,
          averageRating: averageRating || 0,
          totalRatings: totalRatings || 0
        };
      })
    );
    
    setVehicles(vehiclesWithRatings);
  };

  const brandOptions = [...new Set(vehicles.map((v) => v.brand).filter(Boolean))];

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.name
      ?.toLowerCase()
      .includes(searchInput?.toLowerCase() || "");
    const matchesBrand = selectedBrand
      ? vehicle.brand === selectedBrand
      : true;
    return matchesSearch && matchesBrand;
  });

  if (isLoading) {
    return <Loader ViewData={ViewData} />;
  }

  return (
    <div className="w-full flex flex-col h-auto">
      <div className="flex flex-row">
        <Menu ViewData={ViewData} />
        <div className="flex flex-col font-inter flex-1 p-5">
          {/* Header Section */}
          <div className="flex w-full h-20 flex-row items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCreateOpen(true)}
                className="w-auto text-nowrap items-center p-1 gap-2 flex flex-row text-sm px-4 font-semibold rounded-lg border border-gray-400 cursor-pointer"
              >
                Upload Your Unit <MdOutlineFileUpload className="w-8 h-8" />
              </button>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="border px-3 py-2 rounded-md text-gray-700 bg-white"
              >
                <option value="">All Brands</option>
                {brandOptions.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <Ribbon
                listings={vehicles}
                userData={userData}
                setSearchInput={setSearchInput}
              />
            </div>
          </div>

          {filteredVehicles.length === 0 ? (
            <div className="text-4xl text-gray-600 text-center w-full h-full flex justify-center items-center">
              No Vehicle Found, Try Adding One!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="rounded-lg shadow-md overflow-hidden relative cursor-pointer"
                  onClick={() => handleVehicleClick(vehicle)}
                >
                  <MdDeleteOutline
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(vehicle.id, vehicle.name);
                    }}
                    className="absolute top-4 right-4 w-6 h-6 text-red-600 cursor-pointer z-10"
                  />
                  <img
                    src={vehicle.images?.[0]}
                    alt={vehicle.name}
                    className="w-full h-40 object-contain"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">{vehicle.averageRating.toFixed(1)}</span>
                        <FaStar className="text-yellow-400 w-4 h-4" />
                        <span className="text-sm text-gray-500">({vehicle.totalRatings})</span>
                      </div>
                    </div>
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

          <CreateListingModal
            isCreateOpen={isCreateOpen}
            setIsCreateOpen={setIsCreateOpen}
          />

          <VehicleDetailsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            vehicle={selectedVehicle}
            onEdit={handleEditVehicle}
          />

          <EditVehicleModal
            isEditOpen={isEditOpen}
            setIsEditOpen={setIsEditOpen}
            vehicleId={selectedVehicleForEdit?.id}
            onSuccess={handleEditSuccess}
          />

          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onCancel={() => setIsDeleteModalOpen(false)}
            onConfirm={confirmDelete}
            vehicleName={selectedVehicleName}
          />

          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default ListingScreen;
