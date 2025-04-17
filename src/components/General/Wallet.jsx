import React, { useEffect } from "react";
import { FaWallet } from "react-icons/fa";
import { BiSolidCoinStack } from "react-icons/bi";
const Wallet = ({ isOpen, setTopUpModal, userData }) => {
  useEffect(() => {
    if (!userData) {
      return;
    }
  }, [userData]);

  return (
    <button
      onClick={() => setTopUpModal(true)}
      className="px-4 py-2 flex flex-row items-center cursor-pointer gap-5 border rounded-lg border-gray-400"
    >
      <div className="flex flex-row items-center gap-2">
        <BiSolidCoinStack className="text-yellow-400" />
        <label className="cursor-pointer">
          ₱ {userData?.walletBalance || (0).toFixed(2)}
        </label>
      </div>

      <FaWallet />
    </button>
  );
};

export default Wallet;
