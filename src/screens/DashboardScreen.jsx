import React from "react";
import Menu from "../components/General/Menu";
import Footer from "../components/General/Footer";
import Analytics from "../components/Dashboard/Analytics";

const Dashboard = () => {
  const ViewData = "Dashboard";

  return (
    <div className="w-full flex flex-col min-h-screen h-auto">
      <div className="flex flex-row">
        <Menu ViewData={ViewData} />
        <Analytics />
      </div>
    </div>
  );
};

export default Dashboard;
