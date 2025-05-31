import React, { useState, useEffect } from "react";
import { useSession } from "../../context/SessionContext";
import { IoNotifications } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import Cat from "../../assets/images/Cat.jpg";
import { VscUnverified } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { getAverageRating } from "../../hooks/ratingService";
import { FaStar } from "react-icons/fa";

const SmallProfile = ({ userData, listings }) => {
  const { user } = useSession();
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRating = async () => {
      if (user?.uid) {
        const { averageRating, totalRatings } = await getAverageRating(user.uid);
        setAverageRating(averageRating);
        setTotalRatings(totalRatings);
        setIsLoading(false);
      }
    };
    fetchRating();
  }, [user?.uid]);

  const pendingBookings = listings.filter((listing) =>
    listing.bookings.some((booking) => booking.bookingStatus === "Pending")
  );

  const pendingCount = pendingBookings.length;

  const handleNotificationClick = () => {
    navigate("/bookings");
  };

  return (
    <div className="w-auto flex flex-row gap-5 font-jakarta justify-end px-5 items-end">
      <div
        className="relative cursor-pointer"
        onClick={handleNotificationClick}
      >
        <IoNotifications className="text-gray-500 w-6 h-6" />
        {/* Show red badge with pendingCount */}
        {pendingCount > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-xs flex items-center justify-center">
            {pendingCount}
          </div>
        )}
      </div>
      <div className="flex flex-row gap-6">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <label className="font-semibold text-sm">{user.displayName}</label>
            {!isLoading && averageRating > 0 && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">
                  {averageRating.toFixed(1)} ({totalRatings})
                </span>
                <FaStar className="text-yellow-400 w-4 h-4" />
              </div>
            )}
          </div>
          <div className="flex flex-row gap-2 items-center">
            <label className="text-gray-600 text-sm">
              {user.displayRole || "Vehicle Owner"}
            </label>
            {userData?.businessVerified ? (
              <MdVerified className="text-red-400 w-5 h-5" />
            ) : (
              <VscUnverified className="w-5 h-5" />
            )}
          </div>
        </div>

        <img
          className="rounded-full w-10 h-10 border-gray-400 border object-cover"
          src={userData?.personalProfile || user?.profilePicture || Cat}
          onError={(e) => (e.target.src = Cat)} // ✅ Fallback if URL fails
          alt="Profile Picture"
        />
      </div>
    </div>
  );
};

export default SmallProfile;
