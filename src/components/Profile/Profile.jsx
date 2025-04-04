import React, { useEffect } from "react";
import Cat from "../../assets/images/Cat.jpg";
import { useSession } from "../../context/SessionContext";

const Profile = () => {
  const { user } = useSession();
  useEffect(() => {
    if (user === null) {
      return;
    }
  }, [user]);

  return (
    <div className="flex flex-row flex-1 font-inter">
      <div className="w-full h-screen flex flex-row gap-10 p-20">
        <form className="w-full h-auto flex flex-col p-16 gap-5 border border-gray-400 rounded-lg">
          <div className="flex flex-col justify-center gap-1 items-center">
            <img
              className="w-[100px] mt-5 rounded-full object-cover flex flex-col"
              src={user.photoURL || Cat}
            />
            <div className="text-2xl font-semibold">{user.displayName}</div>
            <div className="text-xl text-gray-600">{user.email}</div>
          </div>
          <div className="flex flex-row w-full justify-evenly">
            <div className="w-md flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold">Username</label>
                <input
                  type="text"
                  placeholder="Enter Username"
                  className="border px-4 py-2 border-gray-400 rounded-md"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold">New Password</label>
                <input
                  type="password"
                  placeholder="************"
                  className="border px-4 py-2 border-gray-400 rounded-md"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold">
                  Re-enter Password
                </label>
                <input
                  type="password"
                  placeholder="************"
                  className="border px-4 py-2 border-gray-400 rounded-md"
                />
              </div>
            </div>

            <div className="w-md flex flex-col gap-8">
              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold">Email Address</label>
                <input
                  type="text"
                  placeholder="Enter Email"
                  className="border px-4 py-2 border-gray-400 rounded-md"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-lg font-semibold">Phone Number</label>
                <input
                  type="text"
                  placeholder="Enter Phone Number"
                  className="border px-4 py-2 border-gray-400 rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-sm text-white bg-[#101010]"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
