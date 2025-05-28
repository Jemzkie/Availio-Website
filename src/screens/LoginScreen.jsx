import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/General/Footer";
import logo from "../assets/images/logo.png";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useSession } from "../context/SessionContext";
import scooterImage from "../assets/images/scooter.png"; // You'll need to add this image

import {
  loginUser,
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
} from "../hooks/userService";
import { MoonLoader } from "react-spinners";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useSession();

  // Validate email format
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    setLoading(true);

    const response = await loginUser(email.trim(), password.trim());
    setLoading(false);

    console.log(response);
    if (response.success) {
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } else {
      setError(response.error);
    }
  };

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
      <div className="w-full h-auto flex flex-col md:flex-row md:items-start items-center p-6 md:p-16 gap-5">
        {/* Left Side - Login Form (existing code) */}
        <div className="md:w-1/2 w-full flex flex-col">
          <img className="w-[250px]" src={logo} />
          <form onSubmit={handleLogin} className="w-full h-full md:mt-20">
            <div className="w-full md:text-left text-center">
              <label className="text-5xl  text-center font-semibold">
                Login
              </label>
            </div>

            <label className="text-xl flex flex-col mt-8 text-center md:text-left md:mt-10 text-[#E60000]">
              Login to access your scooter gaming account
            </label>
            {error && <p className="error-message">{error}</p>}

            <div className="flex flex-col gap-10 md:gap-5 mt-8 md:mt-12">
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
              <div className="relative">
                <label className="absolute -top-3 px-2 left-6 bg-white">
                  Password
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value.trim())}
                  type="password"
                  className="w-full placeholder:text-gray-300 py-5 px-10 rounded-lg border border-solid"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <div className="flex flex-row justify-between mt-5">
              <div className="justify-center items-center gap-2 flex">
                <input type="checkbox" className="w-5 h-5" />
                <label className="font-semibold"> Remember Me</label>
              </div>
              <Link className="text-[#E60000] font-semibold" to="/forgotpass">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 px-10 rounded-lg  text-white font-semibold font-roboto mt-5 cursor-pointer ${
                loading ? "bg-gray-400" : "bg-[#2E709E]"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="justify-center items-center flex gap-2 mt-5">
              <label>Don't have an account?</label>
              <Link
                className="text-center text-[#E60000] font-semibold"
                to="/register"
              >
                Sign up as Supplier
              </Link>
            </div>

            <div className="flex flex-row justify-center items-center gap-5 mt-10">
              <div className="md:w-64 w-12 h-[1px] border border-gray-200"></div>
              <label className="text-gray-400">Or login with</label>
              <div className="md:w-64 w-12 h-[1px] border border-gray-200"></div>
            </div>

            {loading ? (
              <div className="w-full mt-10 duration-300  rounded-lg flex items-center justify-center">
                <MoonLoader />
              </div>
            ) : (
              <div className="flex flex-row gap-5 justify-center mt-10">
                <div className="border-2 w-48 h-16 rounded-xl flex justify-center items-center border-[#2E709E] cursor-pointer">
                  <FcGoogle
                    onClick={() => handleSocialLogin("google")}
                    disabled={loading}
                    className="w-10 h-10"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="md:w-1/2 w-full hidden md:flex flex-col items-center justify-center p-10 bg-gradient-to-b from-[#1A1919] to-[#E60000] rounded-3xl text-white">
          <div className="max-w-md text-center">
            <h2 className="text-4xl font-bold mb-6">Welcome to Availio!</h2>
            <img
              src={scooterImage}
              alt="Scooter Gaming"
              className="w-full h-auto mb-8 rounded-lg"
            />
            <p className="text-xl mb-8">Check Availability. Check it with us</p>

            <div className="space-y-4 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <span className="text-[#2E709E] font-bold">✓</span>
                  </div>
                </div>
                <p className="ml-3 text-lg">Book Vehicles</p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <span className="text-[#2E709E] font-bold">✓</span>
                  </div>
                </div>
                <p className="ml-3 text-lg">
                  Streamline your vehicle renting business
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <span className="text-[#2E709E] font-bold">✓</span>
                  </div>
                </div>
                <p className="ml-3 text-lg">Track your performance</p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <span className="text-[#2E709E] font-bold">✓</span>
                  </div>
                </div>
                <p className="ml-3 text-lg">Connect with other riders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
