import React from "react";
import logo from "../assets/images/logo.png";
import back from "../assets/images/back.png";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Footer from "../components/General/Footer";
import { IoIosArrowBack } from "react-icons/io";

const ForgotPassScreen = () => {
  return (
    <div>
      <div className="w-full h-auto flex flex-col md:items-start items-center p-6 md:p-16 gap-5">
        <img className="w-[360px]" src={logo} />
        <div className="w-full flex flex-row gap-5">
          <div className="md:w-1/2 w-full h-full md:mt-20">
            <Link
              className="hidden flex-row mb-5 items-center md:flex"
              to="/login"
            >
              <IoIosArrowBack />
              Back to login
            </Link>
            <div className="w-full md:text-left text-center">
              <label className="text-5xl font-semibold">
                Forgot Your Password?
              </label>
            </div>

            <div className="w-full md:text-left text-center">
              <label className="text-xl flex flex-col mt-10 text-[#E60000]">
                Don’t worry, happens to all of us. Enter your email below to
                recover your password
              </label>
            </div>

            <div className="flex flex-col gap-5 mt-12">
              <div className="relative">
                <label className="absolute -top-3 px-2 left-6 bg-white">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full placeholder:text-gray-300 py-5 px-10 rounded-lg border border-solid"
                  placeholder="Enter your email address"
                />
              </div>
            </div>
            <button
              className="w-full py-5 px-10 rounded-lg bg-[#2E709E] text-white font-semibold font-roboto mt-10 cursor-pointer"
              to="/verify"
            >
              Submit
            </button>
            <div className="flex flex-row justify-center items-center gap-5 mt-10">
              <div className="md:w-64 w-12 h-[1px] border border-gray-200"></div>
              <label className="text-gray-400">Or login with</label>
              <div className="md:w-64 w-12 h-[1px] border border-gray-200"></div>
            </div>
            <div className="flex flex-row gap-5 justify-center mt-10">
              <div className="border-2 w-48 h-16 rounded-xl flex justify-center items-center border-[#2E709E] cursor-pointer">
                <FaFacebook className="w-10 h-10" />
              </div>
              <div className="border-2 w-48 h-16 rounded-xl flex justify-center items-center border-[#2E709E] cursor-pointer">
                <FcGoogle className="w-10 h-10" />
              </div>
              <div className="border-2 w-48 h-16 rounded-xl flex justify-center items-center border-[#2E709E] cursor-pointer">
                <FaApple className="w-10 h-10" />
              </div>
            </div>
          </div>
          <div className="md:block hidden md:w-1/2 h-full">
            <img src={back} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassScreen;
