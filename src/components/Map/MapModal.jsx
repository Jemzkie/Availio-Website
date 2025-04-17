import React, { useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 10.3157,
  lng: 123.8854,
};

const MapModal = ({ isOpen, onClose, setAddressData }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [marker, setMarker] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  const handleClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    reverseGeocode(lat, lng);
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      if (data && data.display_name) {
        setAddressData({
          lat,
          lng,
          address: data.display_name,
        });
        onClose();
      } else {
        console.error("No address found.");
      }
    } catch (error) {
      console.error("OSM Geocoding failed:", error);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMarker({ lat, lng });
        mapRef.panTo({ lat, lng });
        reverseGeocode(lat, lng);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md w-[90%] max-w-2xl space-y-4 relative">
        <h2 className="text-lg font-semibold">Pin Your Business Location</h2>

        <div className="flex justify-end">
          <button
            onClick={handleUseCurrentLocation}
            className="mb-2 px-3 py-1 text-sm bg-green-600 text-white rounded-sm"
          >
            Use My Current Location
          </button>
        </div>

        {isLoaded && (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={defaultCenter}
            onClick={handleClick}
            onLoad={(map) => setMapRef(map)}
          >
            {marker && <Marker position={marker} />}
          </GoogleMap>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-1 border border-gray-400 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
