import React from "react";
import HondaBeat from "../../assets/images/HondaBeat.png";
import HondaClick from "../../assets/images/HondaClick.png";
import Aerox from "../../assets/images/Aerox.jpg";
import { Link } from "react-router-dom";
function DealsSection() {
  return (
    <section className="flex flex-col gap-16">
      <h2 className="text-center text-[#2E709E] text-5xl mt-30 font-semibold font-roboto">
        Best deals out there
      </h2>
      <div className="w-full flex justify-center relative flex-row mt-8 gap-20">
        <div className="bg-[#2E709E] h-[525px] justify-end flex w-96 pb-20 flex-col text-white items-center gap-5 text-3xl rounded-xl font-semibold font-roboto">
          <img
            src={HondaBeat}
            className="w-96 transform -translate-y-24 absolute h-full object-contain"
          />
          <label>Honda Beat</label>
          <label className="text-2xl">From ₱500</label>
          <Link className="bg-[#E60000] text-xl px-6 py-3 rounded-lg">
            See Scooter
          </Link>
        </div>
        <div className="bg-[#2E709E] justify-end flex w-96 pb-20 flex-col text-white items-center gap-5 text-3xl rounded-xl font-semibold font-roboto">
          <img
            src={HondaClick}
            className="w-96 transform -translate-y-24 absolute h-full object-contain"
          />
          <label>Honda Click</label>
          <label className="text-2xl">From ₱600</label>
          <Link className="bg-[#E60000] text-xl px-6 py-3 rounded-lg">
            See Scooter
          </Link>
        </div>
        <div className="bg-[#2E709E] justify-end flex w-96 pb-20 flex-col text-white items-center gap-5 text-3xl rounded-xl font-semibold font-roboto">
          <img
            src={Aerox}
            className="w-96 transform -translate-y-24 absolute h-full object-contain"
          />
          <label>Aerox</label>
          <label className="text-2xl">From ₱800</label>
          <Link className="bg-[#E60000] text-xl px-6 py-3 rounded-lg">
            See Scooter
          </Link>
        </div>
      </div>
    </section>
  );
}

export default DealsSection;
