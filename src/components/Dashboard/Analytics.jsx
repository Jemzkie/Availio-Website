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
import { Link } from "react-router-dom";

const Analytics = ({
  isOpen,
  setTopUpModal,
  userData,
  analyticsData,
  bookingStatusData,
  listingsData,
  earningData,
}) => {
  const [date, setDate] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [incomePercentage, setIncomePercentage] = useState(0);
  const [expensePercentage, setExpensePercentage] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [availabilityMessage, setAvailabilityMessage] = useState("");

  console.log(listingsData);

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

  const handleCheckAvailability = (e) => {
    e.preventDefault();

    if (!selectedVehicle || !selectedDate || !selectedTime) {
      setAvailabilityMessage("Please select vehicle, date and time.");
      return;
    }

    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const vehicle = listingsData.find((v) => v.id === selectedVehicle);

    if (!vehicle) {
      setAvailabilityMessage("Vehicle not found.");
      return;
    }

    const isUnavailable = vehicle.bookings?.some((booking) => {
      const pickup = new Date(booking.pickupDate);
      const returnTime = new Date(booking.returnDate);

      return (
        booking.bookingStatus !== "Cancelled" &&
        selectedDateTime >= pickup &&
        selectedDateTime <= returnTime
      );
    });

    if (isUnavailable) {
      setAvailabilityMessage("❌ Unavailable On This Time");
    } else {
      setAvailabilityMessage("✅ Vehicle Is Available.");
    }
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
            <form
              onSubmit={handleCheckAvailability}
              className="flex flex-row h-auto justify-between gap-2"
            >
              <div className="relative w-64">
                <div className="border border-gray-200 flex items-center px-4 rounded-md">
                  <FaMotorcycle className="w-6 h-6 text-gray-600" />
                  <select
                    className="px-2 py-2 w-full outline-none bg-transparent"
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                  >
                    <option value="">Select Vehicle</option>
                    {listingsData?.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.plateNumber ||
                          vehicle.name ||
                          "Unnamed Vehicle"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center text-gray-800">
                <input
                  className="px-4 py-2 border border-gray-200 rounded-s-md"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <input
                  className="px-4 py-2 border border-gray-200 rounded-e-md"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>

              {availabilityMessage && (
                <p
                  className={`text-sm flex items-center text-center font-medium ${
                    availabilityMessage === "✅ Vehicle Is Available."
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {availabilityMessage}
                </p>
              )}

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
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Earning</th>
                  <th className="py-3 px-6 text-left"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {listingsData && listingsData.length > 0 ? (
                  listingsData.map((listing, index) => (
                    <tr key={index}>
                      <td className="py-4 px-6">{index + 1}</td>
                      <td className="py-4 px-6">
                        <label className="px-4 py-1 rounded-sm bg-gray-200">
                          {listing.plateNumber}
                        </label>
                      </td>
                      <td className="py-4 px-6">
                        <label className="px-4 py-1 bg-green-100 rounded-md">
                          {listing.bookings?.[0]?.bookingStatus || "N/A"}
                        </label>
                      </td>
                      <td className="py-4 px-6">
                        ₱
                        {listing.bookings?.[0]?.totalPrice?.toFixed(2) ||
                          "0.00"}
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          to="/bookings"
                          className="px-4 rounded-sm text-white py-1 bg-[#E60000]"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No listings available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-5">
                <label className="">Earning Summary</label>
              </div>
            </div>
            <CustomLineChart earningData={earningData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
