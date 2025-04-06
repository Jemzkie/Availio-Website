import React from "react";
import { useSession } from "../../context/SessionContext";
import { IoNotifications } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import Cat from "../../assets/images/Cat.jpg";

const SmallProfile = ({}) => {
  const { user } = useSession();
  return (
    <div className="w-auto flex flex-row gap-5 font-jakarta justify-end px-5 items-end">
      {/* ✅ Use profilePicture if available, otherwise fallback to default Cat image */}
      <IoNotifications className="text-gray-500 w-6 h-6" />
      <div className="flex flex-row gap-6">
        <div className="flex flex-col items-end">
          <label className="font-semibold text-sm">{user.displayName}</label>
          <div className="flex flex-row gap-2 items-center">
            <label className="text-gray-600 text-sm">
              {user.displayRole || "Vehicle Owner"}
            </label>
            <MdVerified className="text-red-400 w-5 h-5" />
          </div>
        </div>

        <img
          className="rounded-full w-10 h-10"
          src={user?.profilePicture || Cat}
          onError={(e) => (e.target.src = Cat)} // ✅ Fallback if URL fails
          alt="Profile Picture"
        />
      </div>
    </div>
  );
};

export default SmallProfile;
