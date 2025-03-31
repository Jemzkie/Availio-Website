import React from "react";
import { IoIosCall } from "react-icons/io";
import { IoVideocam } from "react-icons/io5";
import { RxDashboard } from "react-icons/rx";
import { IoIosSend } from "react-icons/io";

const MessageContainer = ({ uid }) => {
  if (uid === null || uid === undefined) {
    return null;
  }
  return (
    <div className="w-full h-full flex flex-col">
      <div className="h-18 flex flex-row items-center px-4 justify-between">
        <div className="flex flex-row font-jakarta gap-4">
          <img className="rounded-full w-12 h-12" src="/2.jpg" />
          <div className="flex flex-col">
            <label className="font-semibold">User 1</label>
            <div className="flex flex-row gap-2 items-center">
              <div className="rounded-full w-3 h-3 bg-green-400"></div>
              <label className="text-gray-600">Online</label>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-5">
          <IoVideocam className="w-7 h-7" />
          <IoIosCall className="w-7 h-7" />
          <RxDashboard className="w-7 h-7" />
        </div>
      </div>

      <div className="flex-1 bg-gray-50 rounded-md">
        {/*Render Messages Here*/}
      </div>

      <form className="h-18 mt-4 flex gap-5 flex-row justify-between items-center px-4">
        <RxDashboard className="w-7 h-7" />
        <input className="flex-1 p-3 bg-gray-50" />
        <button className="bg-[#2E3B5B] px-6 py-3 rounded-md">
          <IoIosSend className="text-white w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default MessageContainer;
