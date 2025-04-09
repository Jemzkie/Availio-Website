import React from "react";
import { useNavigate } from "react-router-dom";
import Ribbon from "../General/Ribbon";
import { MdOutlineFileUpload } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";

import { MdDeleteOutline } from "react-icons/md";

const Listing = ({ listings, ViewData }) => {
  const navigate = useNavigate();

  const Click = () => {
    console.log("handle delete here");
  };

  return (
    <div className="flex flex-col font-inter flex-1 p-5">
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

      {listings.length === 0 ? (
        <div className="text-4xl text-gray-600 text-center w-full h-full flex justify-center items-center">
          No listings found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.length > 0
            ? listings.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="border rounded-lg shadow-md overflow-hidden relative"
                >
                  <MdDeleteOutline
                    onClick={Click}
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
                    <p className="text-gray-700">
                      ₱{vehicle.pricePerDay} / day
                    </p>
                    <p className="text-gray-400">{vehicle.location}</p>
                  </div>
                </div>
              ))
            : null}
        </div>
      )}

      {/* ✅ Listings Section */}
    </div>
  );
};

export default Listing;
