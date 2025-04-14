import React, { useEffect, useState } from "react";
import Ribbon from "../General/Ribbon";
import { formatDateDisplay } from "../../utils/dateDisplay";
import Wallet from "../General/Wallet";
import { FaMotorcycle } from "react-icons/fa6";
import { VscSettings } from "react-icons/vsc";
import CustomDoughnutChart from "./DonutChart";
import { FaArrowDownLong } from "react-icons/fa6";
import { FaArrowUpLong } from "react-icons/fa6";
import { GoDash } from "react-icons/go";
import CustomLineChart from "./LineChart";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast, Bounce } from "react-toastify";

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
  const [sortOrder, setSortOrder] = useState("desc");
  const [incomePercentage, setIncomePercentage] = useState(0);
  const [expensePercentage, setExpensePercentage] = useState(0);

  const [filteredIncome, setFilteredIncome] = useState(0);
  const [prevFilteredIncome, setPrevFilteredIncome] = useState(0);

  const [filteredExpense, setFilteredExpense] = useState(0);
  const [prevFilteredExpense, setPrevFilteredExpense] = useState(0);

  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [filterIndex, setFilterIndex] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 4;

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
    if (!analyticsData) return;
    let previousIncome = 0;
    let totalIncome = 0;
    let previousExpense = 0;
    let totalExpense = 0;

    const currentFilter = filterOptions[filterIndex];

    switch (currentFilter) {
      case "Daily":
        previousIncome = analyticsData.incomeYesterday;
        totalIncome = analyticsData.incomeToday;
        previousExpense = analyticsData.expenseYesterday;
        totalExpense = analyticsData.expenseToday;

        setFilteredIncome(totalIncome.toFixed(2));
        setPrevFilteredIncome(previousIncome.toFixed(2));

        setFilteredExpense(totalExpense.toFixed(2));
        setPrevFilteredExpense(previousExpense.toFixed(2));
        break;
      case "Weekly":
        previousIncome = analyticsData.incomeLastWeek;
        totalIncome = analyticsData.incomeThisWeek;
        previousExpense = analyticsData.expenseLastWeek;
        totalExpense = analyticsData.expenseThisWeek;

        setFilteredIncome(totalIncome.toFixed(2));
        setPrevFilteredIncome(previousIncome.toFixed(2));

        setFilteredExpense(totalExpense.toFixed(2));
        setPrevFilteredExpense(previousExpense.toFixed(2));
        break;
      case "Monthly":
        previousIncome = analyticsData.incomeLastMonth;
        totalIncome = analyticsData.incomeThisMonth;
        previousExpense = analyticsData.expenseLastMonth;
        totalExpense = analyticsData.expenseThisMonth;

        setFilteredIncome(totalIncome.toFixed(2));
        setPrevFilteredIncome(previousIncome.toFixed(2));

        setFilteredExpense(totalExpense.toFixed(2));
        setPrevFilteredExpense(previousExpense.toFixed(2));
        break;
      case "Quarterly":
        previousIncome = analyticsData.incomeLastQuarter;
        totalIncome = analyticsData.incomeThisQuarter;
        previousExpense = analyticsData.expenseLastQuarter;
        totalExpense = analyticsData.expenseThisQuarter;

        setFilteredIncome(totalIncome.toFixed(2));
        setPrevFilteredIncome(previousIncome.toFixed(2));

        setFilteredExpense(totalExpense.toFixed(2));
        setPrevFilteredExpense(previousExpense.toFixed(2));
        break;
      case "Yearly":
        previousIncome = analyticsData.incomeLastYear;
        totalIncome = analyticsData.incomeThisYear;
        previousExpense = analyticsData.expenseLastYear;
        totalExpense = analyticsData.expenseThisYear;

        setFilteredIncome(totalIncome.toFixed(2));
        setPrevFilteredIncome(previousIncome.toFixed(2));

        setFilteredExpense(totalExpense.toFixed(2));
        setPrevFilteredExpense(previousExpense.toFixed(2));
        break;
      default:
        break;
    }

    setIncomePercentage(calculatePercentage(previousIncome, totalIncome));
    setExpensePercentage(calculatePercentage(previousExpense, totalExpense));
  }, [analyticsData, filterIndex]);

  const calculatePercentage = (previous, total) => {
    if (previous === 0) return total > 0 ? 100 : 0;
    const percentageDifference = ((total - previous) / previous) * 100;
    return percentageDifference.toFixed(2);
  };

  const handleCheckAvailability = (e) => {
    e.preventDefault();

    if (!selectedVehicle || !selectedDate || !selectedTime) {
      toast.error("Please select vehicle, date and time.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const vehicle = listingsData.find((v) => v.id === selectedVehicle);

    if (!vehicle) {
      toast.error("Vehicle Not Found", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
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
      toast.error("Unavailable On This Time", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    } else {
      toast.success("Vehicle Is Available.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const getGroupKey = (date, filter) => {
    const jsDate = new Date(date.seconds * 1000); // assuming Firestore Timestamp
    const day = jsDate.toLocaleDateString("en-US", { weekday: "short" });
    const week = `Week ${Math.ceil(jsDate.getDate() / 7)}`;
    const month = jsDate.toLocaleString("default", { month: "short" });
    const quarter = `Q${Math.floor(jsDate.getMonth() / 3) + 1}`;
    const year = jsDate.getFullYear();

    switch (filter) {
      case "Daily":
        return day;
      case "Weekly":
        return week;
      case "Monthly":
        return month;
      case "Quarterly":
        return quarter;
      case "Yearly":
        return year;
      default:
        return month;
    }
  };

  const filterOptions = ["Monthly", "Quarterly", "Yearly", "Weekly", "Daily"];
  const handleCycle = () => {
    setFilterIndex((prevIndex) => (prevIndex + 1) % filterOptions.length);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const sortedListings = [...listingsData].sort((a, b) => {
    const bookingsA = a.bookings?.length || 0;
    const bookingsB = b.bookings?.length || 0;

    return sortOrder === "asc" ? bookingsA - bookingsB : bookingsB - bookingsA;
  });

  const indexOfLastListing = currentPage * listingsPerPage;
  const indexOfFirstListing = indexOfLastListing - listingsPerPage;
  const currentListings = sortedListings.slice(
    indexOfFirstListing,
    indexOfLastListing
  );

  const totalPages = Math.ceil(sortedListings.length / listingsPerPage);

  return (
    <div className="flex flex-col flex-1 font-inter">
      <div className="flex w-full h-28 flex-row">
        <div className="w-3/12 bg-[#F8F7F1] flex flex-col py-10 px-5">
          <label className="text-gray-600 font-semibold text-lg">
            {filterOptions[filterIndex]} Statistics
          </label>
          <label className="text-gray-500">{date}</label>
        </div>
        <div className="w-9/12 flex flex-row items-center justify-between p-5">
          <Wallet
            userData={userData}
            isOpen={isOpen}
            setTopUpModal={setTopUpModal}
          />
          <Ribbon listings={listingsData} userData={userData} />
        </div>
      </div>

      <div className="w-full flex flex-row h-full">
        <div className="w-3/12 h-full flex flex-col gap-5 bg-[#F8F7F1] px-5 pb-10">
          <button
            onClick={handleCycle}
            className="w-full py-2 hover:bg-[#E60000] cursor-pointer hover:text-white duration-300 flex items-center text-center justify-center bg-white rounded-md"
          >
            {filterOptions[filterIndex]}
          </button>
          <div className="h-auto bg-white rounded-lg shadow-sm px-3 pt-2 pb-4">
            <div className="w-full flex justify-between p-2 border-b border-gray-200 bg-white">
              <label className="text-gray-600 font-medium">Gross Profit</label>
              <label className="text-xs bg-gray-100 flex items-center px-4 rounded-xs text-gray-400">
                {filterOptions[filterIndex]}
              </label>
            </div>
            <div className="w-full flex flex-row justify-between items-center mt-2">
              <label className="font-semibold text-2xl">
                ₱ {filteredIncome}
              </label>

              {filteredIncome > prevFilteredIncome ? (
                <div className="flex flex-row gap-1 items-center text-green-400">
                  <FaArrowUpLong />
                  <label>{incomePercentage}%</label>
                </div>
              ) : filteredIncome < prevFilteredIncome ? (
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
              Compared to ₱{prevFilteredIncome} Previously
            </label>
          </div>
          <div className="h-auto bg-white rounded-lg shadow-sm px-3 pt-2 pb-4">
            <div className="w-full flex justify-between p-2 border-b border-gray-200">
              <label className="text-gray-600 font-medium">Net Profit</label>
              <label className="text-xs bg-gray-100 flex items-center px-4 rounded-xs text-gray-400">
                {filterOptions[filterIndex]}
              </label>
            </div>
            <div className="w-full flex flex-row justify-between items-center mt-2">
              <label className="font-semibold text-2xl">
                ₱ {filteredExpense}
              </label>
              {filteredExpense > prevFilteredExpense ? (
                <div className="flex flex-row gap-1 items-center text-red-400">
                  <FaArrowUpLong />
                  <label>{expensePercentage}%</label>
                </div>
              ) : filteredExpense < prevFilteredExpense ? (
                <div className="flex flex-row items-center text-green-400 gap-2">
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
              Compared to ₱{prevFilteredExpense} Previously
            </label>
          </div>
          <div className="h-auto bg-white rounded-lg shadow-sm px-3 pt-2 py-4">
            <div className="w-full flex justify-between p-2 border-b border-gray-200 mb-5">
              <label className="text-gray-600 font-medium">
                Overall Status
              </label>
              <label className="text-xs bg-gray-100 flex items-center px-4 rounded-xs text-gray-400">
                {filterOptions[filterIndex]}
              </label>
            </div>
            <CustomDoughnutChart
              filterOptions={filterOptions[filterIndex]}
              bookingStatusData={bookingStatusData}
            />
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
              <button
                onClick={toggleSortOrder}
                className="flex flex-row gap-2 items-center px-4 py-1 border border-gray-600 rounded-md"
              >
                <VscSettings className="text-gray-600" />
                <label className="text-gray-600 capitalize">
                  {sortOrder}ending
                </label>
              </button>
            </div>
            <table className="w-full border-collapse overflow-x-auto text-gray-600">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-3 px-6 text-left">No.</th>
                  <th className="py-3 px-6 text-left">Vehicle</th>
                  <th className="py-3 px-6 text-left">Usage</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Earning</th>
                  <th className="py-3 px-6 text-left"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {listingsData && listingsData.length > 0 ? (
                  currentListings.map((listing, index) => {
                    const now = new Date();
                    const groupedTotal = listing.bookings?.reduce(
                      (acc, booking) => {
                        if (
                          (booking.bookingStatus !== "Complete" &&
                            booking.bookingStatus !== "On-Going") ||
                          (!booking.completedAt &&
                            booking.bookingStatus === "Complete")
                        ) {
                          return acc;
                        }

                        const key = getGroupKey(
                          booking.completedAt || booking.startDate,
                          filterOptions[filterIndex]
                        );
                        const amount = booking.totalPrice || 0;

                        acc[key] = (acc[key] || 0) + amount;
                        return acc;
                      },
                      {}
                    );

                    const currentKey = getGroupKey(
                      { seconds: now.getTime() / 1000 },
                      filterOptions[filterIndex]
                    );
                    const filteredTotal = groupedTotal?.[currentKey] || 0;

                    const isUnavailable = listing.bookings?.some((booking) => {
                      const pickup = new Date(booking.pickupDate);
                      const returnDate = new Date(booking.returnDate);
                      return now >= pickup && now <= returnDate;
                    });

                    const status = isUnavailable ? "Unavailable" : "Available";

                    return (
                      <tr key={index}>
                        <td className="py-4 px-6">
                          {indexOfFirstListing + index + 1}
                        </td>
                        <td className="py-4 px-6">
                          <label className="px-4 py-1 rounded-sm bg-gray-200">
                            {listing.name}
                          </label>
                        </td>
                        <td className="py-4 px-6">
                          <label className="px-4 py-1 rounded-sm bg-gray-200">
                            {listing.bookings.length || 0}
                          </label>
                        </td>
                        <td className="py-4 px-6">
                          <label
                            className={`px-4 py-1 rounded-md ${
                              isUnavailable ? "bg-red-100" : "bg-green-100"
                            }`}
                          >
                            {status}
                          </label>
                        </td>
                        <td className="py-4 px-6">
                          ₱{filteredTotal.toFixed(2)}
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
                    );
                  })
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
          <div className="flex justify-center gap-2 mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded border ${
                currentPage === 1
                  ? "text-gray-400 border-gray-300"
                  : "text-black border-gray-500"
              }`}
            >
              Previous
            </button>

            <span className="px-4 py-1 text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded border ${
                currentPage === totalPages
                  ? "text-gray-400 border-gray-300"
                  : "text-black border-gray-500"
              }`}
            >
              Next
            </button>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-row justify-between">
              <div className="flex flex-row gap-5">
                <label className="">Earning Summary</label>
              </div>
            </div>
            <CustomLineChart
              filterOptions={filterOptions[filterIndex]}
              earningData={earningData}
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Analytics;
