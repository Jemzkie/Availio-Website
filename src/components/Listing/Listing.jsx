import React from "react";
import Ribbon from "../General/Ribbon";
import { MdOutlineFileUpload } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";

const Listing = () => {
  return (
    <div className="flex flex-row flex-1 ">
      <div className="flex w-full h-20 flex-row items-center justify-between px-5">
        <button className="w-auto text-nowrap items-center p-1 gap-2 flex flex-row text-sm px-4 font-semibold rounded-lg border border-gray-400 cursor-pointer">
          Upload Your Unit <MdOutlineFileUpload className="w-8 h-8" />
        </button>
        <div className="flex flex-row gap-4 items-center">
          <button className="w-auto text-nowrap items-center p-1 gap-2 flex flex-row text-sm px-4 font-semibold rounded-lg border border-gray-400 cursor-pointer">
            Brand <RiArrowDropDownLine className="w-8 h-8" />
          </button>
          <button className="w-auto text-nowrap items-center p-1 gap-2 flex flex-row text-sm px-4 font-semibold rounded-lg border border-gray-400 cursor-pointer">
            Filter <VscSettings className="w-8 h-8" />
          </button>
          <Ribbon />
        </div>
      </div>
    </div>
  );
};

export default Listing;
