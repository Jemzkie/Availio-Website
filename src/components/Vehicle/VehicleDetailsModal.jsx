import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import { getAverageRating } from '../../hooks/ratingService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import formatTimestamp from '../../utils/formatTimestamp';

const VehicleDetailsModal = ({ isOpen, onClose, vehicle, onEdit }) => {
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!vehicle?.id) return;
      
      try {
        // Get average rating
        const { averageRating, totalRatings } = await getAverageRating(vehicle.id);
        setAverageRating(averageRating);
        setTotalRatings(totalRatings);

        // Get individual ratings
        const ratingsRef = collection(db, 'vehicles', vehicle.id, 'ratings');
        const ratingsSnapshot = await getDocs(ratingsRef);
        const ratingsData = [];

        for (const ratingDoc of ratingsSnapshot.docs) {
          const rating = ratingDoc.data();
          // Get user details
          const userRef = doc(db, 'users', rating.userId);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();

          ratingsData.push({
            id: ratingDoc.id,
            ...rating,
            user: userData
          });
        }

        setRatings(ratingsData);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchRatings();
    }
  }, [isOpen, vehicle?.id]);

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[800px] max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-semibold">{vehicle.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-8">
          {/* Left side - Vehicle Details */}
          <div className="w-1/2">
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={vehicle.images[0]}
                  alt={vehicle.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                  {vehicle.status}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Vehicle Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Model:</span> {vehicle.model}</p>
                  <p><span className="font-medium">Year:</span> {vehicle.year}</p>
                  <p><span className="font-medium">Price per Day:</span> ₱{vehicle.pricePerDay}</p>
                  <p><span className="font-medium">Description:</span> {vehicle.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Ratings */}
          <div className="w-1/2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Ratings & Reviews</h3>
                <div className="flex items-center gap-1">
                  <span className="text-lg font-medium">{averageRating.toFixed(1)}</span>
                  <FaStar className="text-yellow-400 w-5 h-5" />
                  <span className="text-gray-500">({totalRatings})</span>
                </div>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {isLoading ? (
                  <div className="text-center py-4">Loading reviews...</div>
                ) : ratings.length > 0 ? (
                  ratings.map((rating) => (
                    <div key={rating.id} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{rating.rating}</span>
                          <FaStar className="text-yellow-400 w-4 h-4" />
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(rating.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{rating.comment}</p>
                      <div className="text-xs text-gray-500">
                        <p>By: {rating.user?.username || 'Anonymous'}</p>
                        <p>{rating.user?.email || ''}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No reviews yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => onEdit(vehicle)}
            className="bg-[#E60000] text-white px-6 py-2 rounded-md hover:bg-[#cc0000] transition-colors"
          >
            Edit Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsModal; 