import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <div className="logo">
        <img src="/logo.png" alt="Scooter Gaming PH Logo" />
      </div>
      <nav>
        <Link to="/">Homepage</Link>
        <Link to="/scooters">Scooters</Link>
        <Link to="/about">About Us</Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </nav>
    </header>
  );
}

export default Header;
