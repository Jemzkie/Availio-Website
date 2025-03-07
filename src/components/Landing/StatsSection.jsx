import React from "react";

function StatsSection() {
  return (
    <section className="flex flex-row text-5xl w-11/12 rounded-e-2xl text-nowrap bg-[#E60000] text-white font-semibold font-roboto gap-16 px-20 py-12">
      <div className="flex flex-col gap-3">
        <label>50+</label> <label>Scooters</label>
      </div>
      <div className="flex flex-col gap-3">
        <label>90+</label> <label>Service Providers</label>
      </div>
      <div className="flex flex-col gap-3">
        <label>120+</label> <label>Pickup Locations</label>
      </div>
      <div className="flex flex-col gap-3">
        <label>4650+</label> <label>Happy Customers</label>
      </div>
    </section>
  );
}

export default StatsSection;
