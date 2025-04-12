import React from "react";
import Header from "../General/Header";
import { Link } from "react-router-dom";
import { HiArrowSmallRight } from "react-icons/hi2";
import Nmax from "../../assets/images/Nmax.png";
import Honda from "../../assets/images/Honda.png";
import Yamaha from "../../assets/images/Yamaha.webp";
import Suzuki from "../../assets/images/Suzuki.png";
import Kymco from "../../assets/images/Kymco.png";
import Vespa from "../../assets/images/Vespa.png";
import Toyota from "../../assets/images/Toyota.jpg";
import Subaru from "../../assets/images/Subaru.jpg";

const FirstSection = ({ ViewData }) => {
  return (
    <div className="h-auto flex flex-col px-20 overflow-hidden ">
      <Header ViewData={ViewData} />
      <div className="w-full flex flex-col md:flex-row md:mt-28 mt-5 md:initial">
        <div className="md:w-1/2 w-full text-6xl ">
          <h1 className="text-[#2E709E] w-[500px] font-semibold font-roboto md:text-left text-center">
            Check Availability Check{" "}
            <label className="text-[#E60000]">Avalio.</label>
          </h1>

          <p className="text-[#2E709E] text-lg md:text-left text-center md:w-[544px] mt-10">
            Whether you're planning to explore a city, need a reliable
            transportation vehicle, or just want the convenience of having a
            scooter at your disposal, we've got you covered.
          </p>

          <div className="flex flex-row gap-5 mt-5 md:justify-start justify-center">
            <button className="text-white bg-[#E60000] text-lg px-4 py-2 rounded-lg">
              Get Now
            </button>
            <Link className="text-[#2E709E] text-lg items-center gap-2 justify-center flex flex-row">
              See details <HiArrowSmallRight />
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 md:flex justify-center items-center md:relative">
          <img
            src={Nmax}
            className="md:object-cover slide-in absolute -translate-x-96 -translate-y-[600px] transform md:-translate-x-30 md:-translate-y-20 md:z-0 -z-10"
          />
          <div className="to-[#E60000] md:block hidden bg-gradient-to-r from-white w-[864px] h-[506px] rounded-xl transform  translate-x-42 -z-10"></div>
        </div>
      </div>
      <div className="w-full h-auto flex justify-center md:flex-nowrap flex-wrap md:mt-0 mt-5 flex-row gap-5 md:gap-20">
        <img src={Honda} className="md:w-32 w-20 object-contain" />
        <img src={Yamaha} className="md:w-32 w-20 object-contain" />
        <img src={Suzuki} className="md:w-32 w-20 object-contain" />
        <img src={Kymco} className="md:w-32 w-20 object-contain" />
        <img src={Vespa} className="md:w-32 w-20 object-contain" />
        <img src={Toyota} className="md:w-32 w-20 object-contain" />
        <img src={Subaru} className="md:w-32 w-20 object-contain" />
      </div>
    </div>
  );
};

export default FirstSection;
