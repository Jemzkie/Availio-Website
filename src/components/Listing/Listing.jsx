import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../config/firebaseConfig"; // Import Firebase Auth
import Ribbon from "../General/Ribbon";
import { MdOutlineFileUpload } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";
import { fetchVehicles } from "../../hooks/vehicleService";

const Listing = () => {
  const [listings, setListings] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const ViewData = "Listing";

  useEffect(() => {
    // ✅ Get logged-in user ID
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const vehicles = await fetchVehicles();
        // ✅ Filter listings to only the current user's
        const userListings = vehicles.filter((vehicle) => vehicle.ownerId === userId);
        setListings(userListings);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="flex flex-col flex-1 p-5">
      {/* Header Section */}
      <div className="flex w-full h-20 flex-row items-center justify-between mb-4">
        {/* ✅ Redirect to Create Listing */}
        <button
          className="w-auto text-nowrap items-center p-1 gap-2 flex flex-row text-sm px-4 font-semibold rounded-lg border border-gray-400 cursor-pointer"
          onClick={() => navigate("/create-listing")}
        >
          Upload Your Unit <MdOutlineFileUpload className="w-8 h-8" />
        </button>
        <div className="flex flex-row gap-4 items-center">
          <button className="w-auto text-nowrap items-center p-1 gap-2 flex flex-row text-sm px-4 font-semibold rounded-lg border border-gray-400 cursor-pointer">
            Brand <RiArrowDropDownLine className="w-8 h-8" />
          </button>
          <button className="w-auto text-nowrap items-center p-1 gap-2 flex flex-row text-sm px-4 font-semibold rounded-lg border border-gray-400 cursor-pointer">
            Filter <VscSettings className="w-8 h-8" />
          </button>
          <Ribbon ViewData={ViewData} />
        </div>
      </div>

      {/* ✅ Listings Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.length > 0 ? (
          listings.map((vehicle) => (
            <div
              key={vehicle.id}
              className="border rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={vehicle.images?.[0]}
                alt={vehicle.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{vehicle.name}</h3>
                <p className="text-gray-500">
                  {vehicle.model} - {vehicle.fuelType}
                </p>
                <p className="text-gray-700">
                  ${vehicle.pricePerDay} / day
                </p>
                <p className="text-gray-400">{vehicle.location}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No listings available</p>
        )}
      </div>
    </div>
  );
};

export default Listing;
