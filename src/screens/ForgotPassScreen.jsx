import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { IoIosArrowBack } from "react-icons/io";
import { FcGoogle } from "react-icons/fc"; // Added this import
import Footer from "../components/General/Footer";
import scooterImage from "../assets/images/scooter.png";
import { MoonLoader } from "react-spinners";

const ForgotPassScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Validate email format
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div>
      <div className="w-full h-auto flex flex-col md:flex-row md:items-start items-center p-6 md:p-16 gap-5">
        {/* Left Side - Forgot Password Form */}
        <div className="md:w-1/2 w-full flex flex-col">
          <img className="w-[250px]" src={logo} alt="Logo" />
          <div className="w-full h-full md:mt-20">
            <Link
              className="hidden flex-row mb-5 items-center md:flex text-[#2E709E]"
              to="/login"
            >
              <IoIosArrowBack className="mr-1" />
              Back to login
            </Link>

            <div className="w-full md:text-left text-center">
              <h1 className="text-5xl font-semibold">Forgot Your Password?</h1>
            </div>

            <div className="w-full md:text-left text-center">
              <p className="text-xl flex flex-col mt-10 text-[#E60000]">
                {success
                  ? "Password reset link sent to your email!"
                  : "Don't worry, happens to all of us. Enter your email below to recover your password"}
              </p>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {!success ? (
              <>
                <div className="flex flex-col gap-5 mt-12">
                  <div className="relative">
                    <label className="absolute -top-3 px-2 left-6 bg-white">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.trim())}
                      className="w-full placeholder:text-gray-300 py-5 px-10 rounded-lg border border-solid"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full py-5 px-10 rounded-lg text-white font-semibold font-roboto mt-10 cursor-pointer ${
                    loading ? "bg-gray-400" : "bg-[#2E709E]"
                  }`}
                >
                  {loading ? (
                    <MoonLoader size={24} color="#ffffff" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </>
            ) : (
              <div className="mt-12 p-6 bg-green-100 text-green-800 rounded-lg">
                <p>
                  We've sent a password reset link to your email address. Please
                  check your inbox and follow the instructions.
                </p>
                <p className="mt-4">
                  Didn't receive the email?{" "}
                  <button
                    onClick={handleSubmit}
                    className="text-[#2E709E] font-semibold"
                  >
                    Resend
                  </button>
                </p>
              </div>
            )}

            <div className="flex flex-row justify-center items-center gap-5 mt-10">
              <div className="md:w-64 w-12 h-[1px] border border-gray-200"></div>
              <label className="text-gray-400">Or login with</label>
              <div className="md:w-64 w-12 h-[1px] border border-gray-200"></div>
            </div>
            <div className="flex flex-row gap-5 justify-center mt-10">
              <div className="border-2 w-48 h-16 rounded-xl flex justify-center items-center border-[#2E709E] cursor-pointer">
                <FcGoogle className="w-10 h-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Design */}
        <div className="md:w-1/2 w-full hidden md:flex flex-col items-center justify-center p-10 bg-gradient-to-b from-[#1A1919] to-[#E60000] rounded-3xl text-white">
          <div className="max-w-md text-center">
            <h2 className="text-4xl font-bold mb-6">Reset Your Password</h2>
            <img
              src={scooterImage}
              alt="Scooter"
              className="w-full h-auto mb-8 rounded-lg"
            />
            <p className="text-xl mb-8">
              Get back to your availio account quickly and securely.
            </p>

            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <span className="text-[#2E709E] font-bold">✓</span>
                  </div>
                </div>
                <p className="ml-3 text-lg">Secure password reset process</p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <span className="text-[#2E709E] font-bold">✓</span>
                  </div>
                </div>
                <p className="ml-3 text-lg">Instant email delivery</p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <span className="text-[#2E709E] font-bold">✓</span>
                  </div>
                </div>
                <p className="ml-3 text-lg">Chat with us if you need support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPassScreen;
