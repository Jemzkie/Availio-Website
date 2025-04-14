import React, { useState, useEffect } from "react";
import Wallet from "../General/Wallet";
import Ribbon from "../General/Ribbon";
import { MoonLoader } from "react-spinners";
const Booking = ({
  isOpen,
  setTopUpModal,
  userData,
  bookingData,
  listingsData,
  handleConfirmClick,
  handleOngoingClick,
  handleCancelClick,
  handleExtendClick,
  handleRatingClick,
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
        <Ribbon listings={listingsData} userData={userData} />
      </div>

      <div className="flex flex-row gap-5 w-full h-auto px-5 mb-4">
        {["Pending", "On-Going", "Cancelled", "Complete"].map((status) => (
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

      <div className="flex flex-col gap-4 px-5 pb-20">
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
                          : booking.bookingStatus === "Cancelled"
                          ? "bg-red-100 text-red-600"
                          : booking.bookingStatus === "On-Going"
                          ? "bg-orange-100 text-orange-600"
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
                {booking.bookingStatus === "Complete" ? (
                  booking.renterRating ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <span>Rated</span>
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleRatingClick(booking)}
                      className="bg-[#E60000] px-4 py-2 cursor-pointer text-white rounded-md"
                    >
                      Rate Renter
                    </button>
                  )
                ) : booking.bookingStatus === "Cancelled" ? null : (
                  <>
                    {booking.bookingStatus === "On-Going" ? (
                      <>
                        <button
                          className="bg-[#E60000] px-4 py-2 cursor-pointer text-white rounded-md"
                          onClick={() => handleConfirmClick(booking)}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleExtendClick(booking)}
                          className="border border-gray-400 cursor-pointer px-4 py-2 rounded-md"
                        >
                          Extend
                        </button>
                      </>
                    ) : (
                      <button
                        className="bg-[#E60000] px-4 py-2 cursor-pointer text-white rounded-md"
                        onClick={() => handleOngoingClick(booking)}
                      >
                        Confirm
                      </button>
                    )}

                    {confirmCancel ? null : booking.bookingStatus ===
                      "On-Going" ? null : (
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
