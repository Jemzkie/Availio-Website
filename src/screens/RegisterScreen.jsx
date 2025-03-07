import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, signInWithGoogle, signInWithFacebook, signInWithApple } from "../hooks/userService";
import Back from "../assets/images/back.png";

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
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Handle registration
  const handleRegister = async () => {
    setError("");

    if (!userData.firstName || !userData.lastName || !userData.email || !userData.phone || !userData.password) {
      setError("Please fill all fields.");
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const response = await registerUser(userData.email, userData.password, {
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
    });

    if (response.success) {
      navigate("/dashboard"); // Redirect after successful signup
    } else {
      setError(response.error);
    }
  };

  // Handle social sign-in
  const handleSocialLogin = async (provider) => {
    setError("");
    let response;

    if (provider === "google") response = await signInWithGoogle();
    if (provider === "facebook") response = await signInWithFacebook();
    if (provider === "apple") response = await signInWithApple();

    if (response.success) {
      navigate("/dashboard");
    } else {
      setError(response.error);
    }
  };

  return (
    <div className="register-container">
      <img src={Back} alt="Background" />
      <div className="register-form">
        <h2>Sign up</h2>
        <p>Let's get you all set up so you can access your personal account.</p>

        {error && <p className="error-message">{error}</p>}

        <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
        <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} />
        <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />

        <div className="terms">
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">I agree to all the Terms and Privacy Policies</label>
        </div>

        <button className="register-button" onClick={handleRegister}>Create account</button>

        <p>Already have an account? <Link to="/login">Login</Link></p>

        <div className="social-signup">
          <p>Or Sign up with</p>
          <button className="social-button" onClick={() => handleSocialLogin("facebook")}>Facebook</button>
          <button className="social-button" onClick={() => handleSocialLogin("google")}>Google</button>
          <button className="social-button" onClick={() => handleSocialLogin("apple")}>Apple</button>
        </div>
      </div>
    </div>
  );
}

export default Register;
