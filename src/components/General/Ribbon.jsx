import React, { useEffect, useState } from "react";
import { IoNotifications, IoSearch } from "react-icons/io5";
import Cat from "../../assets/images/Cat.jpg";
import { useSession } from "../../context/SessionContext"; // ✅ Import session context
import { MdVerified } from "react-icons/md";
import { VscUnverified } from "react-icons/vsc";

const Ribbon = ({ userData, setSearchInput }) => {
  const { user } = useSession();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (user === null) {
      return;
    }
  }, [user]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setSearchInput(val);
  };

  return (
    <div className="h-20 w-auto flex font-jakarta flex-row justify-end items-center px-4">
      <div className="flex gap-12 justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <IoNotifications className="text-gray-500 w-6 h-6" />
          <div className="border border-gray-400 flex flex-row items-center px-5 py-2 rounded-lg">
            <input
              type="text"
              name="searchBar"
              value={inputValue}
              onChange={handleInputChange}
              className=" w-60 text-gray-500"
              placeholder="Search here"
            />
            <IoSearch className="text-gray-500 w-6 h-6" />
          </div>
        </div>
        <div className="flex flex-row gap-6">
          <div className="flex flex-col items-end">
            <label className="font-semibold text-sm">{user.displayName}</label>
            <div className="flex flex-row gap-2 items-center">
              <label className="text-gray-600 text-sm">
                {user.displayRole || "Vehicle Owner"}
              </label>
              {userData?.businessVerified ? (
                <MdVerified className="text-red-400 w-5 h-5" />
              ) : (
                <VscUnverified className="w-5 h-5" />
              )}
            </div>
          </div>

          {/* ✅ Use profilePicture if available, otherwise fallback to default Cat image */}
          <img
            className="rounded-full w-10 h-10 border-gray-400 border object-cover"
            src={userData?.personalProfile || user?.profilePicture || Cat}
            onError={(e) => (e.target.src = Cat)} // ✅ Fallback if URL fails
            alt="Profile Picture"
          />
        </div>
      </div>
    </div>
  );
};

export default Ribbon;
