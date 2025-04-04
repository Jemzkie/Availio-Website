import React, { useEffect, useState } from "react";
import Ribbon from "../General/Ribbon";
import { formatDateDisplay } from "../../utils/dateDisplay";
import Wallet from "../General/Wallet";
import { FaMotorcycle } from "react-icons/fa6";

const Analytics = () => {
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      setDate(formatDateDisplay(now));
    };

    updateDate();

    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col flex-1 font-inter">
      <div className="flex w-full h-28 flex-row">
        <div className="w-3/12 bg-[#F8F7F1] flex flex-col py-10 px-5">
          <label className="text-gray-600 font-semibold text-lg">
            Todays Statistics
          </label>
          <label className="text-gray-500">{date}</label>
        </div>
        <div className="w-9/12 flex flex-row items-center justify-between p-5">
          <Wallet />
          <Ribbon />
        </div>
      </div>

      <div className="w-full flex flex-row h-full">
        <div className="w-3/12 h-full flex flex-col gap-5 bg-[#F8F7F1] px-5 pb-10">
          <div className="h-44 bg-white rounded-lg shadow-sm px-3 py-2">
            <div className="w-full flex justify-between p-2 border-b border-gray-200">
              <label className="text-gray-600 font-medium">Income</label>
              <label className="text-xs bg-gray-100 flex items-center px-4 rounded-xs text-gray-400">
                Today
              </label>
            </div>
          </div>
          <div className="h-44 bg-white rounded-lg shadow-sm px-3 py-2">
            <div className="w-full flex justify-between p-2 border-b border-gray-200">
              <label className="text-gray-600 font-medium">Expenses</label>
              <label className="text-xs bg-gray-100 flex items-center px-4 rounded-xs text-gray-400">
                Today
              </label>
            </div>
          </div>
          <div className="h-80 bg-white rounded-lg shadow-sm px-3 py-2">
            <div className="w-full flex justify-between p-2 border-b border-gray-200">
              <label className="text-gray-600 font-medium">
                Books vs Cancel
              </label>
              <label className="text-xs bg-gray-100 flex items-center px-4 rounded-xs text-gray-400">
                Today
              </label>
            </div>
          </div>
        </div>
        <div className="w-9/12 h-full px-10 py-5">
          <div className="flex gap-2 flex-col">
            <label className="font-semibold text-gray-800">
              Vehicle Availability
            </label>
            <form className="flex flex-row h-auto justify-between">
              <div className="border border-gray-200 flex items-center px-4 flex-row rounded-md">
                <FaMotorcycle className="w-6 h-6 text-gray-600" />
                <input className="px-2 py-2" placeholder="Vehicle No." />
              </div>
              <div className="border border-gray-200 flex items-center px-2 text-gray-800 rounded-md">
                <input className="px-4" type="date" />
                <input className="px-2" type="time" />
              </div>
              <button
                type="submit"
                className="px-8 text-white bg-[#E60000] rounded-sm"
              >
                Check
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
