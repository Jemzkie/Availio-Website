import React, { useState, useMemo } from "react";
import Ribbon from "../General/Ribbon";
import { MdOutlineFileUpload } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { deleteVehicle } from "../../hooks/vehicleService";

const Listing = ({
  listings,
  ViewData,
  userData,
  setIsCreateOpen,
  setSearchInput,
  searchInput,
  setListings,
}) => {
  const [selectedBrand, setSelectedBrand] = useState("");

  const brandOptions = useMemo(() => {
    const allBrands = listings?.map((l) => l.brand).filter(Boolean);
    return [...new Set(allBrands)];
  }, [listings]);

  const filteredListings = listings?.filter((listing) => {
    const matchesSearch = listing?.name
      ?.toLowerCase()
      .includes(searchInput?.toLowerCase() || "");
    const matchesBrand = selectedBrand
      ? listing?.brand === selectedBrand
      : true;
    return matchesSearch && matchesBrand;
  });

  return (
    <div className="flex flex-col font-inter flex-1 p-5">
      {/* Header Section */}
      <div className="flex w-full h-20 flex-row items-center justify-between mb-4">
        {/* ✅ Redirect to Create Listing */}
        <button
          className="w-auto text-nowrap items-center p-1 gap-2 flex flex-row text-sm px-4 font-semibold rounded-lg border border-gray-400 cursor-pointer"
          onClick={() => setIsCreateOpen(true)}
        >
          Upload Your Unit <MdOutlineFileUpload className="w-8 h-8" />
        </button>
        <div className="flex flex-row gap-4 items-center">
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
          <Ribbon
            setSearchInput={setSearchInput}
            userData={userData}
            ViewData={ViewData}
          />
        </div>
      </div>

      {filteredListings?.length === 0 ? (
        <div className="text-4xl text-gray-600 text-center w-full h-full flex justify-center items-center">
          No Vehicle Found, Try Adding One!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredListings?.length > 0
            ? filteredListings?.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="rounded-lg shadow-md overflow-hidden relative"
                >
                  <MdDeleteOutline
                    onClick={async () => {
                      const confirmDelete = window.confirm(
                        `Are you sure you want to delete "${vehicle.name}"?`
                      );
                      if (confirmDelete) {
                        const success = await deleteVehicle(vehicle.id);
                        if (success) {
                          setListings((prevListings) =>
                            prevListings.filter((v) => v.id !== vehicle.id)
                          );
                        }
                      }
                    }}
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
    </div>
  );
};

export default Listing;
