import React from "react";
import logo from "../../assets/images/logo.png";
import { RxDashboard } from "react-icons/rx";
import { GiScooter } from "react-icons/gi";
import { TbBrandBooking } from "react-icons/tb";
import { VscAccount } from "react-icons/vsc";
import { AiFillCreditCard } from "react-icons/ai";
import { AiOutlineTransaction } from "react-icons/ai";
import { GoReport } from "react-icons/go";
import { MdLogout } from "react-icons/md";
import { Link } from "react-router-dom";

const MenuScreen = ({ ViewData }) => {
  return (
    <div className="flex flex-col w-[350px] bg-[#1A1919] min-h-screen px-4">
      <img className="w-[300px] mt-5" src={logo} />
      <Link
        to="/dashboard"
        className={`flex justify-center gap-2 items-center py-5 mt-5 ${
          ViewData === "Dashboard" ? "bg-[#E60000]" : ""
        }`}
      >
        <RxDashboard className="text-white w-6 h-6" />
        <label className="text-white text-lg">Dashboard</label>
      </Link>
      <Link
        to="/listing"
        className={`flex justify-center gap-2 items-center py-5 mt-5 ${
          ViewData === "Listing" ? "bg-[#E60000]" : ""
        }`}
      >
        <GiScooter className="text-white w-6 h-6 " />
        <label className="text-white text-lg">Listings</label>
      </Link>
      <div className="flex justify-center gap-2 items-center py-5 mt-5">
        <TbBrandBooking className="text-white w-6 h-6" />
        <label className="text-white text-lg">Bookings</label>
      </div>
      <div className="flex justify-center gap-2 items-center py-5 mt-5">
        <VscAccount className="text-white w-6 h-6" />
        <label className="text-white text-lg">Profile</label>
      </div>

      <div className="border-t border-gray-400 mt-5"></div>

      <div className="flex justify-center gap-2 items-center py-5 mt-5">
        <AiFillCreditCard className="text-white w-6 h-6" />
        <label className="text-white text-lg">Payment Details</label>
      </div>
      <div className="flex justify-center gap-2 items-center py-5 mt-5">
        <AiOutlineTransaction className="text-white w-6 h-6" />
        <label className="text-white text-lg">Transactions</label>
      </div>
      <div className="flex justify-center gap-2 items-center py-5 mt-5">
        <GoReport className="text-white w-6 h-6" />
        <label className="text-white text-lg">Scooter Report</label>
      </div>

      <div className="flex justify-center gap-2 items-center py-5 mt-20 bg-gray-700">
        <MdLogout className="text-white w-6 h-6" />
        <label className="text-white text-lg">Logout</label>
      </div>
    </div>
  );
};

export default MenuScreen;
