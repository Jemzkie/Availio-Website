import React, { useEffect, useState } from "react";
import Menu from "../components/General/Menu";
import Transaction from "../components/Transaction/Transaction";
import { useSession } from "../context/SessionContext";
import { fetchOwnerTransaction } from "../hooks/fetchOwnerTransaction";
import Loader from "../components/General/Loader";

const TransactionScreen = () => {
  const ViewData = "Transactions";
  const { user } = useSession();
  const [transactionData, setTransactionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transaction = await fetchOwnerTransaction(user.uid);
        setTransactionData(transaction);
        setIsLoading(false);
      } catch (error) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loader ViewData={ViewData} />;
  }

  return (
    <div className="w-full flex flex-col h-auto">
      <div className="flex flex-row">
        <Menu ViewData={ViewData} />
        <Transaction Transaction={transactionData} />
      </div>
    </div>
  );
};

export default TransactionScreen;
