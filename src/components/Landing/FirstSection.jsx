import React from "react";
import Header from "../General/Header";
import { Link } from "react-router-dom";
import { HiArrowSmallRight } from "react-icons/hi2";
import Nmax from "../../assets/images/Nmax.png";
import Honda from "../../assets/images/Honda.png";
import Yamaha from "../../assets/images/Yamaha.webp";
import Suzuki from "../../assets/images/Suzuki.png";
import Kymco from "../../assets/images/Kymco.png";
import Sunra from "../../assets/images/Sunra.jpg";
import Vespa from "../../assets/images/Vespa.png";

const FirstSection = () => {
  return (
    <div className="h-screen flex flex-col px-20 overflow-hidden">
      <Header />
      <div className="w-full flex flex-row">
        <div className="w-1/2 text-6xl mt-28">
          <h1 className="text-[#2E709E] font-semibold font-roboto">
            Explore the freedom of scooter rental with{" "}
            <label className="text-[#E60000]">Scooter Gaming.</label>
          </h1>

          <p className="text-[#2E709E] text-lg w-[544px] mt-10">
            Whether you're planning to explore a city, need a reliable
            transportation vehicle, or just want the convenience of having a
            scooter at your disposal, we've got you covered.
          </p>

          <div className="flex flex-row gap-5 mt-5">
            <button className="text-white bg-[#E60000] text-lg px-4 py-2 rounded-lg">
              Get your scooter today
            </button>
            <Link className="text-[#2E709E] text-lg items-center gap-2 justify-center flex flex-row">
              See all scooters <HiArrowSmallRight />
            </Link>
          </div>
        </div>
        <div className="w-1/2 flex justify-center items-center relative mt-48">
          <img
            src={Nmax}
            className="object-cover absolute transform -translate-x-30 -translate-y-40"
          />
          <div className="to-[#E60000] bg-gradient-to-r from-white w-[864px] h-[506px] rounded-xl transform -translate-y-30 translate-x-42 -z-10"></div>
        </div>
      </div>
      <div className="w-full h-32 flex justify-center flex-row gap-20">
        <img src={Honda} className="w-32 object-contain" />
        <img src={Yamaha} className="w-32 object-contain" />
        <img src={Suzuki} className="w-32 object-contain" />
        <img src={Kymco} className="w-32 object-contain" />
        <img src={Sunra} className="w-32 object-contain" />
        <img src={Vespa} className="w-32 object-contain" />
      </div>
    </div>
  );
};

export default FirstSection;
