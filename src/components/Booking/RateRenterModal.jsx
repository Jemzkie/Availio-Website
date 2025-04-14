import React, { useState } from "react";
import { markRatingToRenter } from "../../hooks/bookingService";
import { Star } from "lucide-react";

const RateRenterModal = ({ isOpen, onClose, booking }) => {
  const [hoverRating, setHoverRating] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !booking) return null;

  const handleSubmit = async () => {
    if (!selectedRating) {
      setError("Please select a rating before submitting.");
      return;
    }
    setError("");
    setLoading(true);
    const success = await markRatingToRenter(
      booking.bookingId,
      selectedRating,
      details
    );
    setLoading(false);
    if (success) {
      onClose();
      window.location.reload();
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const full = i <= (hoverRating ?? selectedRating);
      const half = !full && i - 0.5 === (hoverRating ?? selectedRating);
      const fillColor = full || half ? "text-yellow-400" : "text-gray-300";

      stars.push(
        <div key={i} className="relative cursor-pointer">
          {/* Left half (0.5 star) */}
          <div
            onMouseEnter={() => setHoverRating(i - 0.5)}
            onMouseLeave={() => setHoverRating(null)}
            onClick={() => setSelectedRating(i - 0.5)}
            className="absolute left-0 w-1/2 h-full z-10"
          />
          {/* Right half (1 star) */}
          <div
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(null)}
            onClick={() => setSelectedRating(i)}
            className="absolute right-0 w-1/2 h-full z-10"
          />
          <Star
            className={`w-8 h-8 ${fillColor} pointer-events-none`}
            fill={
              (hoverRating ?? selectedRating) >= i - 0.5
                ? "currentColor"
                : "none"
            }
          />
        </div>
      );
    }
    return stars;
  };

  return (
    <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl animate-fade-in">
        <h2 className="text-xl font-semibold text-center mb-4">
          Rate Your Renter
        </h2>

        <div className="flex justify-center space-x-1 mb-6">
          {renderStars()}
        </div>

        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Enter extra description..."
          className="w-full border rounded-md border-gray-400 min-h-32 max-h-32 p-2 mb-3"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {loading && (
          <p className="text-center text-sm text-gray-500 mb-2">
            Submitting...
          </p>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer border border-gray-400 rounded-md hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium cursor-pointer bg-[#141414] duration-300 text-white rounded-md hover:bg-[#E60000]"
            disabled={loading}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RateRenterModal;
