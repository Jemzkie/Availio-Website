import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="w-full h-12 flex flex-row justify-between mt-10">
      <div className="logo">
        <img src="/logo.png" alt="Scooter Gaming PH Logo" />
      </div>
      <nav className="flex gap-5 text-2xl text-[#2E709E] items-center">
        <Link className="hover:text-black" to="/">
          Homepage
        </Link>
        <Link className="hover:text-black" to="/scooters">
          Scooters
        </Link>
        <Link className="hover:text-black" to="/about">
          About Us
        </Link>
        <Link
          className="bg-[#E60000] rounded-lg text-white px-4 py-2 cursor-pointer"
          to="/login"
        >
          Login
        </Link>
      </nav>
    </header>
  );
}

export default Header;
