import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <p>Login to access your scooter gaming account</p>

        {error && <p className="error-message">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value.trim())}
        />

        <div className="remember-me">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Remember me</label>
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

        <button className="login-button" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
          Don't have an account? <Link to="/register">Create account</Link>
        </p>

        <div className="social-login">
          <p>Or login with</p>
          <button className="social-button" onClick={() => handleSocialLogin("facebook")} disabled={loading}>
            Facebook
          </button>
          <button className="social-button" onClick={() => handleSocialLogin("google")} disabled={loading}>
            Google
          </button>
          <button className="social-button" onClick={() => handleSocialLogin("apple")} disabled={loading}>
            Apple
          </button>
        </div>
      </div>
      <div className="login-image"></div>
    </div>
  );
}

export default Login;
