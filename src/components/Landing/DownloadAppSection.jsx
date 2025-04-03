// src/components/DownloadAppSection.js
import React from "react";
import Phone from "../../assets/images/Phone.png";
import AppStore from "../../assets/images/AppStore.png";
import PlayStore from "../../assets/images/PlayStore.png";

function DownloadAppSection() {
  return (
    <section className="flex flex-row mt-32 text-5xl md:w-11/12 md:h-[580px] md:rounded-e-2xl text-nowrap relative bg-[#E60000] text-white font-semibold font-roboto py-12 px-6 md:p-32">
      <div className="md:w-1/3 flex flex-col md:gap-16 z-10">
        <label className="md:text-4xl text-xl">
          Unlock your adventure. Rent a scooter with ease.
        </label>
        <label className="md:text-5xl text-2xl text-black font-semibold font-roboto text-wrap md:w-[900px]">
          Download our new app and book your first scooter today
        </label>
        <div className="flex flex-row md:flex-nowrap ">
          <img className="md:w-[900px] w-[200px]" src={AppStore} />
          <img className="md:w-[900px] w-[200px]" src={PlayStore} />
        </div>
      </div>
      <img
        className="md:h-[720px] bounce -translate-y-66 overflow-hidden translate-x-40 -z-0 absolute object-contain transform md:-translate-y-60 md:translate-x-[600px]"
        src={Phone}
      />
    </section>
  );
}

export default DownloadAppSection;
