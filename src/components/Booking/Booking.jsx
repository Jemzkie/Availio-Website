import React, { useState, useEffect } from "react";
import Wallet from "../General/Wallet";
import Ribbon from "../General/Ribbon";
import { MoonLoader, ClipLoader } from "react-spinners";
const Booking = ({
  isOpen,
  setTopUpModal,
  userData,
  bookingData,
  handleConfirmClick,
  handleCancelClick,
  confirmCancel,
}) => {
  const [activeFilter, setActiveFilter] = useState("Pending");
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    if (bookingData) {
      const filtered = bookingData.filter(
        (booking) =>
          booking.bookingStatus &&
          booking.bookingStatus.toLowerCase() === activeFilter.toLowerCase()
      );
      setFilteredBookings(filtered);
    }
  }, [activeFilter, bookingData]);

  return (
    <div className="flex flex-col flex-1 font-inter">
      <div className="w-full flex flex-row items-center justify-between p-5">
        <Wallet
          userData={userData}
          isOpen={isOpen}
          setTopUpModal={setTopUpModal}
        />
        <Ribbon />
      </div>

      <div className="flex flex-row gap-5 w-full h-auto px-5 mb-4">
        {["Pending", "Complete", "Cancel"].map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`px-4 py-2 rounded-md ${
              activeFilter === status
                ? "bg-[#E60000] text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 px-5">
        {!bookingData ? (
          <div className="h-96 flex items-center justify-center">
            <MoonLoader />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className=" h-96 flex items-center justify-center text-gray-600">
            No {activeFilter} Bookings Found
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="flex flex-row justify-between p-4 border-b border-gray-200"
            >
              <div className="flex flex-row gap-2">
                <img
                  className="w-40 object-contain border rounded-md border-gray-200"
                  src={booking.vehicle?.images[0]}
                />
                <div className="flex flex-col gap-1">
                  <div className="text-sm text-gray-600">
                    Vehicle: {booking.vehicle?.name || "N/A"}{" "}
                    {booking.vehicle?.model}
                  </div>
                  <div className="text-sm text-gray-600">
                    Renter: {booking.renter?.username || "N/A"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Pick-Up Date: {booking?.pickupDate || "N/A"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Return Date: {booking?.returnDate || "N/A"}
                  </div>
                  <div className="text-sm text-gray-600">
                    Status:{" "}
                    <label
                      className={`px-2 py-1 rounded-md ${
                        booking.bookingStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : booking.bookingStatus === "Cancel"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {booking.bookingStatus}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center px-6 gap-5">
                <label className="text-gray-600">
                  Amount: ₱{booking.totalPrice.toFixed(2)}
                </label>
                {booking.bookingStatus ===
                "Complete" ? null : booking.bookingStatus ===
                  "Cancel" ? null : (
                  <>
                    <button
                      className="bg-[#E60000] px-4 py-2 cursor-pointer text-white rounded-md"
                      onClick={() => handleConfirmClick(booking)}
                    >
                      Confirm
                    </button>
                    {confirmCancel ? (
                      <button className="bg-[#E60000] cursor-pointer items-center flex text-white px-8 py-2 rounded-md">
                        <ClipLoader size={24} color="#FFFFFF" />
                      </button>
                    ) : (
                      <button
                        className="border border-gray-400 px-4 py-2 cursor-pointer rounded-md"
                        onClick={() => handleCancelClick(booking)}
                      >
                        Cancel
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Booking;
