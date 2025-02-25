import React from "react";
import Header from "../General/Header";

const FirstSection = () => {
  return (
    <div className="">
      <Header />
      <div>
        <h1>Explore the freedom of scooter rental with Scooter Gaming.</h1>
        <p>
          Whether you're planning to explore a city, need a reliable
          transportation vehicle, or just want the convenience of having a
          scooter at your disposal, we've got you covered.
        </p>
        <button>Get your scooter today</button>
        <a href="#scooters">See all scooters</a>
      </div>
      <img src="path-to-scooter-image" alt="Scooter" />
    </div>
  );
};

export default FirstSection;
