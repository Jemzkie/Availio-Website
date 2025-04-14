import React, { useEffect } from "react";

const AlertModal = ({ isOpen, onClose, message, type }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/10 z-50"
      onClick={onClose} // close when background is clicked
    >
      <div
        className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full text-center animate-fade-in"
        onClick={(e) => e.stopPropagation()} // prevent modal click from closing
      >
        <h2
          className={`text-lg font-semibold mb-2 ${
            type === "error" ? "text-red-600" : "text-green-600"
          }`}
        >
          {type === "error" ? "Error" : "Success"}
        </h2>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default AlertModal;
