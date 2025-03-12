import React from "react";
import { IoNotifications } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import Cat from "../../assets/images/Cat.jpg";
const Ribbon = () => {
  return (
    <div className="h-20 w-auto flex flex-row justify-end items-center px-4">
      <div className="flex gap-12 justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <IoNotifications className="text-gray-500 w-8 h-8" />
          <div className="shadow-md flex flex-row items-center px-5 py-2 rounded-lg">
            <input
              className="text-lg w-60 text-gray-500"
              placeholder="Search here "
            />
            <IoSearch className="text-gray-500 w-8 h-8" />
          </div>
        </div>

        <img className="rounded-full w-10 h-10" src={Cat} />
      </div>
    </div>
  );
};

export default Ribbon;
