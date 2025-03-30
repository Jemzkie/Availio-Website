import React from "react";
import Menu from "../components/General/Menu";
import Footer from "../components/General/Footer";
import Messaging from "../components/Messaging/Messaging";

const MessagingScreen = () => {
  const ViewData = "Messaging";
  return (
    <div className="w-full flex flex-col h-auto">
      <div className="flex flex-row">
        <Menu ViewData={ViewData} />
        <Messaging ViewData={ViewData} />
      </div>
    </div>
  );
};

export default MessagingScreen;
