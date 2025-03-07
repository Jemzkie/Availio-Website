import React from "react";
import logo from "../assets/images/logo.png";
import back from "../assets/images/back.png";
import { Link } from "react-router-dom";
import Footer from "../components/General/Footer";
import { IoIosArrowBack } from "react-icons/io";
const SetPassScreen = () => {
  return (
    <div>
      <div className="w-full h-auto flex flex-col p-16 gap-5">
        <img className="w-[360px]" src={logo} />
        <div className="w-full flex flex-row gap-5">
          <div className="w-1/2 h-full mt-20">
            <label className="text-5xl font-semibold">Set a password</label>
            <label className="text-xl flex flex-col mt-10 text-[#E60000]">
              Your previous password has been reseted. Please set a new password
              for your account.
            </label>
            <div className="flex flex-col gap-5 mt-12">
              <div className="relative">
                <label className="absolute -top-3 px-2 left-6 bg-white">
                  Create Password
                </label>
                <input
                  type="email"
                  className="w-full placeholder:text-gray-300 py-5 px-10 rounded-lg border border-solid"
                  placeholder="Enter new password"
                />
              </div>
            </div>
            <div className="flex flex-col gap-5 mt-12">
              <div className="relative">
                <label className="absolute -top-3 px-2 left-6 bg-white">
                  Re-enter Password
                </label>
                <input
                  type="email"
                  className="w-full placeholder:text-gray-300 py-5 px-10 rounded-lg border border-solid"
                  placeholder="Re-enter new password"
                />
              </div>
            </div>
            <button className="w-full py-5 px-10 rounded-lg bg-[#2E709E] text-white font-semibold font-roboto mt-5 cursor-pointer">
              Set password
            </button>
          </div>
          <div className="w-1/2 h-full">
            <img src={back} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SetPassScreen;
