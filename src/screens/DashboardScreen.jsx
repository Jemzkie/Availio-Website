import React, { useState } from "react";
import Menu from "../components/General/Menu";
import Analytics from "../components/Dashboard/Analytics";
import WalletModal from "../components/Wallet/WalletModal";

const Dashboard = () => {
  const ViewData = "Dashboard";
  const [TopUpModal, setTopUpModal] = useState(false);

  return (
    <div className="w-full flex flex-col min-h-screen h-auto">
      <div className={`flex flex-row ${TopUpModal ? "blur-xs" : ""}`}>
        <Menu ViewData={ViewData} />
        <Analytics isOpen={TopUpModal} setTopUpModal={setTopUpModal} />
      </div>
      <WalletModal isOpen={TopUpModal} setTopUpModal={setTopUpModal} />
    </div>
  );
};

export default Dashboard;
