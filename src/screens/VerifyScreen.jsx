import React from "react";
import logo from "../assets/images/logo.png";
import back from "../assets/images/back.png";
import { Link } from "react-router-dom";
import Footer from "../components/General/Footer";
import { IoIosArrowBack } from "react-icons/io";
const VerifyScreen = () => {
  return (
    <div>
      <div className="w-full h-auto flex flex-col p-16 gap-5">
        <img className="w-[360px]" src={logo} />
        <div className="w-full flex flex-row gap-5">
          <div className="w-1/2 h-full mt-20">
            <Link className="flex flex-row mb-5 items-center" to="/login">
              <IoIosArrowBack />
              Back to login
            </Link>
            <label className="text-5xl font-semibold">Verify code</label>
            <label className="text-xl flex flex-col mt-10 text-[#E60000]">
              An authentication code has been sent to your email.
            </label>
            <div className="flex flex-col gap-5 mt-12">
              <div className="relative">
                <label className="absolute -top-3 px-2 left-6 bg-white">
                  Enter Code
                </label>
                <input
                  type="text"
                  className="w-full placeholder:text-gray-300 py-5 px-10 rounded-lg border border-solid"
                  placeholder="Enter the code that we sent in your email"
                />
              </div>
            </div>
            <div className="flex flex-row justify-between mt-5">
              <div className="justify-center items-center gap-2 flex">
                <label className="font-semibold">
                  Didn’t receive a code?
                  <label className="font-semibold text-[#E60000]">
                    {" "}
                    Resend
                  </label>
                </label>
              </div>
            </div>
            <button className="w-full py-5 px-10 rounded-lg bg-[#2E709E] text-white font-semibold font-roboto mt-5 cursor-pointer">
              Verify
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

export default VerifyScreen;
