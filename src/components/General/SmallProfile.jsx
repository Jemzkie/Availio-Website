import React from "react";
import { useSession } from "../../context/SessionContext";
import { IoNotifications } from "react-icons/io5";
import { MdVerified } from "react-icons/md";

const SmallProfile = ({}) => {
  const { user } = useSession();
  return (
    <div className="w-auto flex flex-row roboto gap-5 justify-end items-center">
      {/* ✅ Use profilePicture if available, otherwise fallback to default Cat image */}
      <IoNotifications className="text-gray-500 w-8 h-8" />
      <div className="flex flex-row gap-6">
        <div className="flex flex-col items-end">
          <label className="font-semibold text-lg">{user.displayName}</label>
          <div className="flex flex-row gap-2 items-center transform -translate-y-1">
            <label className="text-gray-600 text-lg">
              {user.displayRole || "User"}
            </label>
            <MdVerified className="text-red-400 w-5 h-5" />
          </div>
        </div>

        <img
          className="rounded-full w-14 h-14"
          src={user?.profilePicture || Cat}
          onError={(e) => (e.target.src = Cat)} // ✅ Fallback if URL fails
          alt="Profile Picture"
        />
      </div>
    </div>
  );
};

export default SmallProfile;
