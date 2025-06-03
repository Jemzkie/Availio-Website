import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveBookingsForUser } from '../../hooks/bookingService';
import { useSession } from '../../context/SessionContext';

const BookingBanner = ({ userId }) => {
  const [activeBookings, setActiveBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSession();

  useEffect(() => {
    const fetchActiveBookings = async () => {
      if (userId && user) {
        console.log('Fetching active bookings for user:', userId);
        const bookings = await getActiveBookingsForUser(userId, user.uid);
        console.log('Active bookings:', bookings);
        setActiveBookings(bookings);
        setLoading(false);
      }
    };

    fetchActiveBookings();
  }, [userId, user]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleBannerClick = (booking) => {
    // Store the status in localStorage before navigation
    localStorage.setItem('bookingFilterStatus', booking.bookingStatus);
    // Navigate to the bookings page without query parameters
    navigate('/bookings');
  };

  if (loading) {
    console.log('BookingBanner: Loading state');
    return null;
  }

  if (activeBookings.length === 0) {
    console.log('BookingBanner: No active bookings');
    return null;
  }

  console.log('BookingBanner: Rendering with bookings:', activeBookings);

  return (
    <div className="flex gap-2 items-center">
      {activeBookings.map((booking) => (
        <div
          key={booking.id}
          onClick={() => handleBannerClick(booking)}
          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-blue-200 transition-colors flex items-center gap-2"
        >
          <span>{booking.vehicleName}</span>
          <span className="text-blue-600">•</span>
          <span>{formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}</span>
        </div>
      ))}
    </div>
  );
};

export default BookingBanner; 