import React, { useState } from "react";
import { BiSolidCoinStack } from "react-icons/bi";
import checkout from "../../utils/checkout";
import Visa from "../../assets/images/Visa.png";
import PayMaya from "../../assets/images/PayMaya.png";
import Mastercard from "../../assets/images/Mastercard.png";
import Gcash from "../../assets/images/Gcash.png";

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
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Wallet Balance</h2>
          <div className="w-full flex justify-between">
            <div className="flex flex-row items-center gap-2">
              <BiSolidCoinStack className="w-6 h-6 text-yellow-400" />
              <label>₱ {userData.walletBalance || (0).toFixed(2)}</label>
            </div>
            <form onSubmit={TopUp} className="flex flex-row gap-2 items-center">
              <label className="text-xs text-gray-400">Min: ₱20.00</label>
              <input
                value={totalTopup}
                onChange={(e) => setTotalTopUp(Number(e.target.value))}
                type="number"
                min={20}
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
          <div className="flex flex-col mt-5 gap-2">
            <div className="w-full justify-center flex">
              <label className="text-xl font-semibold">We Accept</label>
            </div>
            <div className="flex justify-evenly flex-wrap">
              <img
                className="w-16 h-16 object-contain rounded-md"
                src={Gcash}
              />
              <img
                className="w-16 h-16 object-contain rounded-md"
                src={PayMaya}
              />
              <img className="w-16 h-16 object-contain rounded-md" src={Visa} />
              <img
                className="w-16 h-16 object-contain rounded-md"
                src={Mastercard}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
