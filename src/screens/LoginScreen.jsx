import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, signInWithGoogle, signInWithFacebook, signInWithApple } from "../hooks/userService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    const response = await loginUser(email, password);
    if (response.success) {
      navigate("/dashboard"); // Redirect to dashboard after successful login
    } else {
      setError(response.error);
    }
  };

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
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <p>Login to access your scooter gaming account</p>
        
        {error && <p className="error-message">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="remember-me">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Remember me</label>
          <button onClick={() => alert("Forgot Password Clicked")}>
            Forgot Password
          </button>
        </div>

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>

        <p>
          Don't have an account? <Link to="/register">Create account</Link>
        </p>

        <div className="social-login">
          <p>Or login with</p>
          <button className="social-button" onClick={() => handleSocialLogin("facebook")}>
            Facebook
          </button>
          <button className="social-button" onClick={() => handleSocialLogin("google")}>
            Google
          </button>
          <button className="social-button" onClick={() => handleSocialLogin("apple")}>
            Apple
          </button>
        </div>
      </div>
      <div className="login-image"></div>
    </div>
  );
}

export default Login;
