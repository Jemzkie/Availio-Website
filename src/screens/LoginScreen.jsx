import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/General/Footer";
import logo from "../assets/images/logo.png";
import back from "../assets/images/back.png";
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useSession } from "../context/SessionContext";

import {
  loginUser,
  signInWithGoogle,
  signInWithFacebook,
  signInWithApple,
} from "../hooks/userService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useSession();

  // Validate email format
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async () => {
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

    if (response.success) {
      setUser(response.user); // Update session
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
      <div className="w-full h-auto flex flex-col p-16 gap-5">
        <img className="w-[360px]" src={logo} />
        <div className="w-full flex flex-row gap-5">
          <div className="w-1/2 h-full mt-20">
            <label className="text-5xl font-semibold">Login</label>
            <label className="text-xl flex flex-col mt-10 text-[#E60000]">
              Login to access your scooter gaming account
            </label>
            {error && <p className="error-message">{error}</p>}

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
                <label className="font-semibold"> Remeber Me</label>
              </div>
              <Link className="text-[#E60000] font-semibold" to="/forgotpass">
                Forgot Password?
              </Link>
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-5 px-10 rounded-lg bg-[#2E709E] text-white font-semibold font-roboto mt-5 cursor-pointer"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
            <div className="justify-center items-center flex gap-2 mt-5">
              <label>Don’t have an account?</label>
              <Link
                className="text-center text-[#E60000] font-semibold"
                to="/register"
              >
                Sign up
              </Link>
            </div>

            <div className="flex flex-row justify-center items-center gap-5 mt-10">
              <div className="w-64 h-[1px] border border-gray-200"></div>
              <label className="text-gray-400">Or login with</label>
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
                  onClick={() => handleSocialLogin("google")}
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

export default Login;
