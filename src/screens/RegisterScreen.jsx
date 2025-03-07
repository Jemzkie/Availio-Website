import React, { useState } from "react";
import logo from "../assets/images/logo.png";
import back from "../assets/images/back.png";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Footer from "../components/General/Footer";
import { Link, useNavigate } from "react-router-dom";
import {
  registerUser,
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
} from "../hooks/userService";

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

    if (!userData.firstName || !userData.lastName || !userData.email || !userData.phone || !userData.password) {
      setError("Please fill all fields.");
      return;
    }

    if (!validateEmail(userData.email)) {
      setError("Invalid email format.");
      return;
    }

    if (!validatePhone(userData.phone)) {
      setError("Phone number must be between 10-15 digits.");
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("You must agree to the terms and privacy policy.");
      return;
    }

    setLoading(true);

    const response = await registerUser(userData.email, userData.password, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
    });

    setLoading(false);

    if (response.success) {
      navigate("/dashboard");
    } else {
      setError(response.error);
    }
  };

  // Handle social sign-in
  const handleSocialLogin = async (provider) => {
    setError("");
    setLoading(true);

    let response;
    if (provider === "google") response = await signInWithGoogle();
    if (provider === "facebook") response = await signInWithFacebook();
    if (provider === "apple") response = await signInWithApple();

    setLoading(false);

    if (response.success) {
      navigate("/dashboard");
    } else {
      setError(response.error);
    }
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
                  value={userData.firstName}
                  onChange={handleChange}
                  className="w-full placeholder:text-gray-300 py-5 px-10 rounded-lg border border-solid"
                  placeholder="Enter your first name"
                />

              </div>
              <div className="relative w-2/3">
                <label className="absolute -top-3 px-2 left-6 bg-white">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleChange}
                  className="w-full placeholder:text-gray-300 py-5 px-10 rounded-lg border border-solid"
                  placeholder="Enter your last name"
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
                  value={userData.email}
                  onChange={handleChange}
                  className="w-full placeholder:text-gray-300 py-5 px-10 rounded-lg border border-solid"
                  placeholder="Enter your email address"
                />
              </div>
              <div className="relative w-2/3">
                <label className="absolute -top-3 px-2 left-6 bg-white">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={userData.phone}
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
                  value={userData.password}
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
                  value={userData.confirmPassword}
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
                className="w-5 h-5" 
                checked={agreeTerms} 
                onChange={() => setAgreeTerms(!agreeTerms)} 
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
              className="w-full py-5 px-10 rounded-lg bg-[#2E709E] text-white font-semibold font-roboto mt-5 cursor-pointer disabled:opacity-50" 
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
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
              <button 
                className="border-2 w-48 h-16 rounded-xl flex justify-center items-center border-[#2E709E] cursor-pointer disabled:opacity-50"
                onClick={() => handleSocialLogin("facebook")}
                disabled={loading}
              >
                <FaFacebook className="w-10 h-10" />
              </button>
              <button 
                className="border-2 w-48 h-16 rounded-xl flex justify-center items-center border-[#2E709E] cursor-pointer disabled:opacity-50"
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
              >
                <FcGoogle className="w-10 h-10" />
              </button>
              <button 
                className="border-2 w-48 h-16 rounded-xl flex justify-center items-center border-[#2E709E] cursor-pointer disabled:opacity-50"
                onClick={() => handleSocialLogin("apple")}
                disabled={loading}
              >
                <FaApple className="w-10 h-10" />
              </button>
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