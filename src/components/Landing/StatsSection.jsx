import React from "react";

function StatsSection() {
  return (
    <section className="flex flex-row md:flex-nowrap flex-wrap md:justify-start justify-center md:items-start text-lg md:text-4xl w-full md:w-11/12 md:rounded-e-2xl mt-5 text-nowrap bg-[#E60000] text-white font-semibold font-roboto gap-8 md:gap-16 md:px-20 p-6 md:py-12">
      <div className="flex w-36 md:w-auto flex-col md:gap-3">
        <label>50+</label> <label>Scooters</label>
      </div>
      <div className="flex w-36 md:w-auto flex-col md:gap-3">
        <label>90+</label> <label>Service Providers</label>
      </div>
      <div className="flex w-36 md:w-auto flex-col md:gap-3">
        <label>120+</label> <label>Pickup Locations</label>
      </div>
      <div className="flex w-36 md:w-auto flex-col md:gap-3">
        <label>4650+</label> <label>Happy Customers</label>
      </div>
    </section>
  );
}

export default StatsSection;
