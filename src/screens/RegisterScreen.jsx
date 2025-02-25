import React from "react";
import "../App.css"; // Import App.css for styling
import Back from "../assets/images/back.png";
function Register() {
  return (
    <div className="register-container">
      <img src={Back} />
      <div className="register-image"></div>
      <div className="register-form">
        <h2>Sign up</h2>
        <p>Let's get you all set up so you can access your personal account.</p>
        <input type="text" placeholder="First Name" />
        <input type="text" placeholder="Last Name" />
        <input type="email" placeholder="Email" />
        <input type="tel" placeholder="Phone Number" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />
        <div className="terms">
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">
            I agree to all the Terms and Privacy Policies
          </label>
        </div>
        <button className="register-button">Create account</button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
        <div className="social-signup">
          <p>Or Sign up with</p>
          <button className="social-button">Facebook</button>
          <button className="social-button">Google</button>
          <button className="social-button">Apple</button>
        </div>
      </div>
    </div>
  );
}

export default Register;
