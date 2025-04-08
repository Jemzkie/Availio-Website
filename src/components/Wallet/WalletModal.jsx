import React, { useState } from "react";
import { BiSolidCoinStack } from "react-icons/bi";
import checkout from "../../hooks/checkout";
const WalletModal = ({ isOpen, setTopUpModal, user, userData }) => {
  const [totalTopup, setTotalTopUp] = useState(0);
  if (!isOpen) return null;

  const TopUp = async (e) => {
    e.preventDefault();
    try {
      const response = await checkout(totalTopup, user);

      window.location.href = response.data.data.attributes.checkout_url;
    } catch (error) {
      console.log(error);
    }
  };

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
            <label>₱ {userData.walletBalance}</label>
          </div>
          <form onSubmit={TopUp} className="flex flex-row gap-2 items-center">
            <input
              value={totalTopup}
              onChange={(e) => setTotalTopUp(Number(e.target.value))}
              type="number"
              min={0}
              className="border px-2 py-1 w-24 rounded-sm"
            />

            <button
              type="submit"
              className="text-sm px-4 text-white py-2 cursor-pointer bg-[#E60000] rounded-sm"
            >
              Top Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
