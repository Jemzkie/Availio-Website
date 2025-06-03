import React from "react";
import { useNavigate } from "react-router-dom";

const BanModal = ({ isOpen, banData, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 animate-fade-in">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Account Banned</h2>
          <div className="mb-6">
            <p className="text-gray-700 mb-2">Your account has been banned for the following reason:</p>
            <p className="text-gray-900 font-medium">{banData.reason}</p>
          </div>
          <div className="text-sm text-gray-500 mb-6">
            <p>Banned on: {banData.bannedAt.toDate().toLocaleDateString()}</p>
          </div>
          <button
            onClick={handleClose}
            className="w-full bg-[#E60000] text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanModal; 