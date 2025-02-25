import React from "react";

function DealsSection() {
  return (
    <section className="deals">
      <h2>Best deals out there</h2>
      <div className="deal">
        <h3>Honda Beat</h3>
        <p>From ₱500</p>
        <button>See Scooter</button>
      </div>
      <div className="deal">
        <h3>Honda Click</h3>
        <p>From ₱600</p>
        <button>See Scooter</button>
      </div>
      <div className="deal">
        <h3>Aerox</h3>
        <p>From ₱800</p>
        <button>See Scooter</button>
      </div>
    </section>
  );
}

export default DealsSection;
