import React, { useEffect, useState } from "react";
import Ribbon from "../General/Ribbon";
import { formatDateDisplay } from "../../utils/dateDisplay";
import Wallet from "../General/Wallet";
import { FaMotorcycle } from "react-icons/fa6";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { VscSettings } from "react-icons/vsc";
import Cat from "../../assets/images/Cat.jpg";
import CustomDoughnutChart from "./DonutChart";
import { FaArrowDownLong } from "react-icons/fa6";
import { FaArrowUpLong } from "react-icons/fa6";
import { GoDash } from "react-icons/go";
import CustomLineChart from "./LineChart";

const Analytics = ({
  isOpen,
  setTopUpModal,
  userData,
  analyticsData,
  bookingStatusData,
}) => {
  const [date, setDate] = useState("");
  const [incomePercentage, setIncomePercentage] = useState(0);
  const [expensePercentage, setExpensePercentage] = useState(0);
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      setDate(formatDateDisplay(now));
    };

    updateDate();

    const interval = setInterval(updateDate, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (analyticsData) {
      const incomepercentage = calculatePercentage(
        analyticsData.incomeYesterday,
        analyticsData.totalIncome
      );
      setIncomePercentage(incomepercentage);

      const expensepercentage = calculatePercentage(
        analyticsData.expenseYesterday,
        analyticsData.totalExpenses
      );
      setExpensePercentage(expensepercentage);
    }
  }, [analyticsData]);

  const calculatePercentage = (yesterday, total) => {
    if (yesterday === 0) return total > 0 ? 100 : 0;
    const percentageDifference = ((total - yesterday) / yesterday) * 100;
    return percentageDifference.toFixed(2);
  };

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
          <Wallet
            userData={userData}
            isOpen={isOpen}
            setTopUpModal={setTopUpModal}
          />
          <Ribbon />
        </div>
      </div>

      <div className="w-full flex flex-row h-full">
        <div className="w-3/12 h-full flex flex-col gap-5 bg-[#F8F7F1] px-5 pb-10">
          <div className="h-auto bg-white rounded-lg shadow-sm px-3 pt-2 pb-4">
            <div className="w-full flex justify-between p-2 border-b border-gray-200">
              <label className="text-gray-600 font-medium">Income</label>
              <label className="text-xs bg-gray-100 flex items-center px-4 rounded-xs text-gray-400">
                Today
              </label>
            </div>
            <div className="w-full flex flex-row justify-between items-center mt-2">
              <label className="font-semibold text-2xl">
                ₱ {(analyticsData?.totalIncome).toFixed(2)}
              </label>

              {analyticsData?.totalIncome > analyticsData.incomeYesterday ? (
                <div className="flex flex-row gap-1 items-center text-green-400">
                  <FaArrowUpLong />
                  <label>{incomePercentage}%</label>
                </div>
              ) : analyticsData?.totalIncome < analyticsData.incomeYesterday ? (
                <div className="flex flex-row items-center text-red-400 gap-2">
                  <FaArrowDownLong />
                  <label>{incomePercentage}%</label>
                </div>
              ) : (
                <div className="flex flex-row items-center text-gray-400 gap-2">
                  <GoDash />
                  <label>0.00%</label>
                </div>
              )}
            </div>
            <label className="text-xs text-gray-600">
              Compared to ₱{(analyticsData?.incomeYesterday).toFixed(2)}{" "}
              Yesterday
            </label>
            <div className="flex flex-row justify-between text-gray-600 text-xs">
              <label>Last Week Income</label>
              <label>₱{(analyticsData?.incomeLastWeek).toFixed(2)}</label>
            </div>
          </div>
          <div className="h-auto bg-white rounded-lg shadow-sm px-3 pt-2 pb-4">
            <div className="w-full flex justify-between p-2 border-b border-gray-200">
              <label className="text-gray-600 font-medium">Expenses</label>
              <label className="text-xs bg-gray-100 flex items-center px-4 rounded-xs text-gray-400">
                Today
              </label>
            </div>
            <div className="w-full flex flex-row justify-between items-center mt-2">
              <label className="font-semibold text-2xl">
                ₱ {(analyticsData?.totalExpenses).toFixed(2)}
              </label>
              {analyticsData?.totalExpenses > analyticsData.expenseYesterday ? (
                <div className="flex flex-row gap-1 items-center text-green-400">
                  <FaArrowUpLong />
                  <label>{expensePercentage}%</label>
                </div>
              ) : analyticsData?.totalExpenses <
                analyticsData.expenseYesterday ? (
                <div className="flex flex-row items-center text-red-400 gap-2">
                  <FaArrowDownLong />
                  <label>{expensePercentage}%</label>
                </div>
              ) : (
                <div className="flex flex-row items-center text-gray-400 gap-2">
                  <GoDash />
                  <label>0.00%</label>
                </div>
              )}
            </div>
            <label className="text-xs text-gray-600">
              Compared to ₱{analyticsData.expenseYesterday} Yesterday
            </label>
            <div className="flex flex-row justify-between text-gray-600 text-xs">
              <label>Last Week Income</label>
              <label>₱{analyticsData.expenseLastWeek.toFixed(2)}</label>
            </div>
          </div>
          <div className="h-auto bg-white rounded-lg shadow-sm px-3 pt-2 py-4">
            <div className="w-full flex justify-between p-2 border-b border-gray-200 mb-5">
              <label className="text-gray-600 font-medium">
                Overall Status
              </label>
              <label className="text-xs bg-gray-100 flex items-center px-4 rounded-xs text-gray-400">
                Today
              </label>
            </div>
            <CustomDoughnutChart bookingStatusData={bookingStatusData} />
          </div>
        </div>
        <div className="w-9/12 h-full flex flex-col gap-12 px-10 py-5">
          <div className="flex gap-2 flex-col">
            <label className="font-semibold text-gray-600">
              Vehicle Availability
            </label>
            <form className="flex flex-row h-auto justify-between">
              <div className="border border-gray-200 flex items-center px-4 flex-row rounded-md">
                <FaMotorcycle className="w-6 h-6 text-gray-600" />
                <input className="px-2 py-2" placeholder="Vehicle No." />
                <MdOutlineKeyboardArrowDown />
              </div>
              <div className=" flex items-center  text-gray-800">
                <input
                  className="px-4 py-2 border border-gray-200 rounded-s-md"
                  type="date"
                />
                <input
                  className="px-4 py-2 border border-gray-200 rounded-e-md"
                  type="time"
                />
              </div>
              <button
                type="submit"
                className="px-8 text-white bg-[#E60000] rounded-sm"
              >
                Check
              </button>
            </form>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row items-center justify-between">
              <label className="font-semibold text-gray-600">
                Live Vehicle Status
              </label>
              <button className="flex flex-row gap-2 items-center px-4 py-1 border border-gray-600 rounded-md">
                <VscSettings className="text-gray-600" />
                <label className="text-gray-600">Filter</label>
              </button>
            </div>
            <table className="w-full border-collapse overflow-x-auto text-gray-600">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-3 px-6 text-left">No.</th>
                  <th className="py-3 px-6 text-left">Vehicle No.</th>
                  <th className="py-3 px-6 text-left">Driver</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Earning</th>
                  <th className="py-3 px-6 text-left"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="py-4 px-6">01</td>
                  <td className="py-4 px-6">
                    <label className=" px-4 py-1 rounded-sm bg-gray-200">
                      6465
                    </label>
                  </td>
                  <td className="flex flex-row gap-2 items-center py-4 px-6">
                    <img
                      src={Cat}
                      className="w-6 h-6 bg-amber-50 rounded-full"
                    />
                    <label className="text-gray-600">John Doe</label>
                  </td>
                  <td className="py-4 px-6">
                    <label className="px-4 py-1 bg-green-100 rounded-md">
                      Completed
                    </label>
                  </td>
                  <td className="py-4 px-6">₱35.44</td>
                  <td className="py-4 px-6">
                    <button className="px-4 rounded-sm text-white py-1 bg-[#E60000]">
                      Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex flex-col ">
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-5">
                <label className="">Earning Summary</label>
              </div>
            </div>
            <CustomLineChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
