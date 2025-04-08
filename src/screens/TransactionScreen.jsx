import React from "react";
import Menu from "../components/General/Menu";
import Transaction from "../components/Transaction/Transaction";
const TransactionScreen = () => {
  const ViewData = "Transactions";

  return (
    <div className="w-full flex flex-col h-auto">
      <div className="flex flex-row">
        <Menu ViewData={ViewData} />
        <Transaction />
      </div>
    </div>
  );
};

export default TransactionScreen;
