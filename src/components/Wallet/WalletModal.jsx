import React from "react";
import { BiSolidCoinStack } from "react-icons/bi";

const WalletModal = ({ isOpen, setTopUpModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="bg-white p-5 rounded-xl shadow-lg w-md font-inter relative">
        <button
          onClick={() => setTopUpModal(false)}
          className="absolute top-2 right-2 text-gray-500 cursor-pointer hover:text-black"
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">Wallet Balance</h2>
        <div className="w-full flex justify-between">
          <div className="flex flex-row items-center gap-2">
            <BiSolidCoinStack className="w-6 h-6 text-yellow-400" />
            <label>₱2000</label>
          </div>
          <button className="text-sm px-4 text-white py-2 cursor-pointer bg-[#E60000] rounded-sm">
            Top Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
