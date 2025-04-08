import React, { useState } from "react";
import { BiSolidCoinStack } from "react-icons/bi";
import { useSession } from "../../context/SessionContext";
import axios from "axios";
const WalletModal = ({ isOpen, setTopUpModal }) => {
  const [totalTopup, setTotalTopUp] = useState(0);
  if (!isOpen) return null;

  const { user } = useSession();

  const checkout = async (e) => {
    e.preventDefault();
    const encodedKey = btoa(import.meta.env.VITE_PAYMONGO_SECRET_KEY);

    const response = await axios.post(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        data: {
          attributes: {
            billing: {
              name: user.displayName,
              email: user.email,
              phone: user.phoneNumber,
            },
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            payment_method_types: ["gcash"],
            line_items: [
              {
                currency: "PHP",
                amount: totalTopup * 100,
                description: "Top Up Wallet Balance",
                name: "Top Up Wallet Balance",
                quantity: 1,
              },
            ],
            description: "Top Up Wallet Balance",
            success_url: "https://scootergaming.vercel.app/dashboard",
            cancel_url: "https://scootergaming.vercel.app/dashboard",
            metadata: {
              user_id: user.uid,
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${encodedKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    window.location.href = response.data.data.attributes.checkout_url;
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
            <label>₱2000</label>
          </div>
          <form
            onSubmit={checkout}
            className="flex flex-row gap-2 items-center"
          >
            <input
              value={totalTopup}
              onChange={(e) => setTotalTopUp(Number(e.target.value))}
              type="number"
              min={0}
              className="border px-2 w-20"
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
