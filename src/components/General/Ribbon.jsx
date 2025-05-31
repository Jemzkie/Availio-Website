import React, { useEffect, useState } from "react";
import { IoNotifications, IoSearch } from "react-icons/io5";
import Cat from "../../assets/images/Cat.jpg";
import { useSession } from "../../context/SessionContext";
import { MdVerified } from "react-icons/md";
import { VscUnverified } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { getAverageRating } from "../../hooks/ratingService";
import { FaStar } from "react-icons/fa";

const Ribbon = ({ listings, userData, setSearchInput }) => {
  const { user } = useSession();
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    
    const fetchData = async () => {
      try {
        const { averageRating, totalRatings } = await getAverageRating(user.uid);
        setAverageRating(averageRating);
        setTotalRatings(totalRatings);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.uid]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setSearchInput(val);
  };

  const pendingBookings = listings?.filter((listing) =>
    listing.bookings?.some((booking) => booking.bookingStatus === "Pending")
  ) || [];

  const pendingCount = pendingBookings.length;

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  if (!user) return null;

  return (
    <div className="h-20 w-auto flex font-jakarta flex-row justify-end items-center px-4">
      <div className="flex gap-12 justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <div className="relative">
            <div
              className="relative cursor-pointer"
              onClick={handleNotificationClick}
            >
              <IoNotifications className="text-gray-500 w-6 h-6" />
              {pendingCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-xs flex items-center justify-center">
                  {pendingCount}
                </div>
              )}
            </div>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Notifications</h3>
                  {pendingCount > 0 ? (
                    <div className="text-sm text-gray-600">
                      You have {pendingCount} pending booking{pendingCount !== 1 ? 's' : ''}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">No new notifications</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="border border-gray-400 flex flex-row items-center px-5 py-2 rounded-lg">
            <input
              type="text"
              name="searchBar"
              value={inputValue}
              onChange={handleInputChange}
              className="w-60 text-gray-500"
              placeholder="Search here"
            />
            <IoSearch className="text-gray-500 w-6 h-6" />
          </div>
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
            onError={(e) => (e.target.src = Cat)}
            alt="Profile Picture"
          />
        </div>
      </div>
    </div>
  );
};

export default Ribbon;
