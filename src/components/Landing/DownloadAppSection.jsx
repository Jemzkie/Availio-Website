// src/components/DownloadAppSection.js
import React from "react";
import Phone from "../../assets/images/Phone.png";
import AppStore from "../../assets/images/AppStore.png";
import PlayStore from "../../assets/images/PlayStore.png";

function DownloadAppSection() {
  return (
    <section className="flex flex-row mt-60 text-5xl w-11/12 h-[580px] rounded-e-2xl text-nowrap relative bg-[#E60000] text-white font-semibold font-roboto  p-32">
      <div className="w-1/3 flex flex-col gap-16">
        <label className="text-4xl">
          Unlock your adventure. Rent a scooter with ease.
        </label>
        <label className="text-5xl text-black font-semibold font-roboto text-wrap  w-[900px]">
          Download our new app and book your first scooter today
        </label>
        <div className="flex flex-row">
          <img className="w-[900px]" src={AppStore} />
          <img className="w-[900px]" src={PlayStore} />
        </div>
      </div>
      <img
        className="h-[720px] absolute object-contain transform -translate-y-60 translate-x-[700px]"
        src={Phone}
      />
    </section>
  );
}

export default DownloadAppSection;
