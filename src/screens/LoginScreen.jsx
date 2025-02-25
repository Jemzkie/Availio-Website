import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <p>Login to access your scooter gaming account</p>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <div className="remember-me">
          <input type="checkbox" id="remember" />
          <label htmlFor="remember">Remember me</label>
          <button onClick={() => alert("Forgot Password Clicked")}>
            Forgot Password
          </button>
        </div>
        <button className="login-button">Login</button>
        <p>
          Don't have an account? <Link to="/register">Create account</Link>
        </p>
        <div className="social-login">
          <p>Or login with</p>
          <button className="social-button">Facebook</button>
          <button className="social-button">Google</button>
          <button className="social-button">Apple</button>
        </div>
      </div>
      <div className="login-image"></div>
    </div>
  );
}

export default Login;
