import React from "react";
import { Link } from "react-router-dom";

function Header({ ViewData }) {
  return (
    <>
      <header className="w-full h-auto font-roboto md:flex flex-row justify-between hidden">
        <div className="logo">
        <img src="/logo.png" alt="Availio Logo" className="h-15" />
        </div>
        <nav className="flex gap-5 text-2xl text-[#2E709E] items-center">
          <Link
            className={`hover:text-black font-semibold ${
              ViewData === "Landing"
                ? "text-black border-b border-[#2E709E] "
                : ""
            }`}
            to="/"
          >
            Homepage
          </Link>
          <Link
            className="bg-[#E60000] rounded-lg text-white px-4 py-2 cursor-pointer"
            to="/login"
          >
            Login
          </Link>
        </nav>
      </header>
      <header className="md:hidden flex w-full h-auto flex-col gap-2">
        <div className="logo">
        <img src="/logo.png" alt="Availio Logo" className="h-15" />
        </div>
        <nav className=""></nav>
      </header>
    </>
  );
}

export default Header;
