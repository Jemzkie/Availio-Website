import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  registerUser,
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
} from "../hooks/userService";
import logo from "../assets/images/logo.png";
import back from "../assets/images/back.png";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Footer from "../components/General/Footer";

function Register() {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value.trim() });
  };

  // Validate email format
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // Validate phone format (simple check for digits)
  const validatePhone = (phone) => /^\d{10,15}$/.test(phone);

  // Handle registration
  const handleRegister = async () => {
    setError("");
    setLoading(true);

    let isMounted = true; // Track if component is still mounted

    if (
      !userData.firstName ||
      !userData.lastName ||
      !userData.email ||
      !userData.phone ||
      !userData.password
    ) {
      if (isMounted) setError("Please fill all fields.");
      return;
    }

    const response = await registerUser(userData.email, userData.password, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
    });

    if (isMounted) {
      setLoading(false);
      if (response.success) {
        navigate("/dashboard");
      } else {
        setError(response.error);
      }
    }

    return () => {
      isMounted = false;
    };
  };

  const handleSocialLogin = async (provider) => {
    // try {
    //   setError("");
    //   setLoading(true);
    //   let response;
    //   if (provider === "google") {
    //     response = await signInWithGoogle();
    //   } else if (provider === "facebook") {
    //     response = await signInWithFacebook();
    //   } else if (provider === "apple") {
    //     response = await signInWithApple();
    //   } else {
    //     throw new Error("Invalid authentication provider.");
    //   }
    //   if (response?.success) {
    //     navigate("/dashboard");
    //   } else {
    //     setError(response?.error || "Something went wrong.");
    //   }
    // } catch (error) {
    //   console.error("Social login error:", error); // Log to debug
    //   setError(error.message || "Login failed.");
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <div>
      <div className="w-full h-auto flex flex-col p-16 gap-5">
        <img className="w-[360px]" src={logo} />
        <div className="w-full flex flex-row gap-5">
          <div className="w-1/2 h-full mt-20">
            <label className="text-5xl font-semibold">Sign Up</label>
            <label className="text-xl flex flex-col mt-10 text-[#E60000]">
              Let’s get you all setup so you can access your personal account.
            </label>
            <div className="flex flex-row w-full gap-5 mt-5">
              <div className="relative w-2/3">
                <label className="absolute -top-3 px-2 left-6 bg-white">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  onChange={handleChange}
                  className="w-full placeholder:text-gray-300 py-5 px-10 rounded-lg border border-solid"
                />
              </div>
              <div className="relative w-2/3">
                <label className="absolute -top-3 px-2 left-6 bg-white">
                  Last Name
                </label>
                <input
                  className="w-full placeholder:text-gray-300 py-5 px-10 rounded-lg border border-solid"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex flex-row w-full gap-5 mt-5">
              <div className="relative w-2/3">
                <label className="absolute -top-3 px-2 left-6 bg-white">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  onChange={handleChange}
                  className="w-full placeholder:text-gray-300 py-5 px-10 rounded-lg border border-solid"
                  placeholder="Enter your Email Address"
                />
              </div>
              <div className="relative w-2/3">
                <label className="absolute -top-3 px-2 left-6 bg-white">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  onChange={handleChange}
                  className="w-full placeholder:text-gray-300 py-5 px-10 rounded-lg border border-solid"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <div className="flex flex-col gap-5 mt-5">
              <div className="relative">
                <label className="absolute -top-3 px-2 left-6 bg-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  onChange={handleChange}
                  className="w-full placeholder:text-gray-300 py-5 px-10 rounded-lg border border-solid"
                  placeholder="•••••••••••••••••••••••••"
                />
              </div>
              <div className="relative">
                <label className="absolute -top-3 px-2 left-6 bg-white">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  onChange={handleChange}
                  className="w-full placeholder:text-gray-300 py-5 px-10 rounded-lg border border-solid"
                  placeholder="•••••••••••••••••••••••••"
                />
              </div>
            </div>
            <div className="flex flex-row justify-between mt-5">
              <div className="justify-center items-center gap-2 flex">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                  className="w-5 h-5"
                />

                <label className="font-semibold">
                  I agree to all the
                  <label className="font-semibold text-[#E60000]">
                    {" "}
                    Terms{" "}
                  </label>
                  and{" "}
                  <label className="font-semibold text-[#E60000]">
                    {" "}
                    Privacy Policies
                  </label>
                </label>
              </div>
            </div>
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-5 px-10 rounded-lg bg-[#2E709E] text-white font-semibold font-roboto mt-5 cursor-pointer"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
            <div className="justify-center items-center flex gap-2 mt-5">
              <label>Already have an account?</label>
              <Link
                className="text-center text-[#E60000] font-semibold"
                to="/login"
              >
                Login
              </Link>
            </div>

            <div className="flex flex-row justify-center items-center gap-5 mt-10">
              <div className="w-64 h-[1px] border border-gray-200"></div>
              <label className="text-gray-400">Or Sign up with</label>
              <div className="w-64 h-[1px] border border-gray-200"></div>
            </div>

            <div className="flex flex-row gap-5 justify-center mt-10">
              <div className="border-2 w-48 h-16 rounded-xl flex justify-center items-center border-[#2E709E] cursor-pointer">
                <FaFacebook
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={loading}
                  className="w-10 h-10"
                />
              </div>
              <div className="border-2 w-48 h-16 rounded-xl flex justify-center items-center border-[#2E709E] cursor-pointer">
                <FcGoogle
                  onClick={handleSocialLogin("google")}
                  disabled={loading}
                  className="w-10 h-10"
                />
              </div>
              <div className="border-2 w-48 h-16 rounded-xl flex justify-center items-center border-[#2E709E] cursor-pointer">
                <FaApple
                  onClick={() => handleSocialLogin("apple")}
                  disabled={loading}
                  className="w-10 h-10"
                />
              </div>
            </div>
          </div>
          <div className="w-1/2 h-full">
            <img src={back} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Register;
