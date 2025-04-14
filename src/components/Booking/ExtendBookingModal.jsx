import React, { useState } from "react";
import { markExtendBooking } from "../../hooks/bookingService";
import { format, addDays, parse } from "date-fns";
import { ClipLoader } from "react-spinners";
const ExtendBookingModal = ({ isOpen, onClose, booking, userData }) => {
  const [daysToExtend, setDaysToExtend] = useState(1);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !booking) return null;

  const handleExtend = async () => {
    if (!daysToExtend || isNaN(daysToExtend) || daysToExtend < 1)
      return alert("Please enter a valid number of days to extend.");

    // Convert "2025-04-11 9:00 PM" into a Date object
    const originalDate = parse(
      booking.returnDate,
      "yyyy-MM-dd hh:mm a",
      new Date()
    );

    // Add days
    const extendedDate = addDays(originalDate, Number(daysToExtend));

    // Format as "YYYY-MM-DD hh:mm A"
    const formattedDate = format(extendedDate, "yyyy-MM-dd h:mm a");

    setLoading(true);
    const extendAmount = booking.vehicle.pricePerDay * daysToExtend;
    const extendCommissionAmount = extendAmount - extendAmount * 0.9;

    const res = await markExtendBooking(
      booking.bookingId,
      formattedDate,
      extendCommissionAmount,
      extendAmount,
      userData.uid
    );
    setLoading(false);

    if (res.success) {
      alert("Return date extended successfully!");
      window.location.reload();
    } else {
      alert("Failed to extend return date.");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[300px] space-y-4 animate-fade-in">
        <h2 className="text-lg font-bold">Extend Return Date</h2>

        <div>
          <label className="block text-sm font-medium ">
            How many days to extend?
          </label>
          <input
            type="number"
            min="1"
            value={daysToExtend}
            onChange={(e) => setDaysToExtend(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <div>
          <p className="">Make Sure You Have:</p>
          <li>Received The Extended Amount</li>
          <label>
            Total Price: ₱{daysToExtend * booking.vehicle.pricePerDay}
          </label>
        </div>

        <div>
          <p className="">Comission Deduction:</p>
          <label>₱{daysToExtend * booking.vehicle.pricePerDay * 0.1}</label>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-1 border border-gray-400 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          {loading ? (
            <div className="px-4 py-1 bg-[#E60000] text-white rounded-md flex items-center justify-center">
              <ClipLoader size={20} color="#FFFFFF" />
            </div>
          ) : (
            <button
              onClick={handleExtend}
              disabled={loading}
              className="px-4 py-1 bg-[#141414] text-white rounded duration-300 hover:bg-[#E60000]"
            >
              Extend
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtendBookingModal;
