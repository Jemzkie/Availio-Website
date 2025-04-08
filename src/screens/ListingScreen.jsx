import React from "react";
import Menu from "../components/General/Menu";
import Footer from "../components/General/Footer";
import Listing from "../components/Listing/Listing";
const ListingScreen = () => {
  const ViewData = "Listing";
  return (
    <div className="w-full flex flex-col h-auto">
      <div className="flex flex-row">
        <Menu ViewData={ViewData} />
        <Listing />
      </div>
    </div>
  );
};

export default ListingScreen;
