import React, { useEffect, useState } from "react";
import Menu from "../components/General/Menu";
import Transaction from "../components/Transaction/Transaction";
import { useSession } from "../context/SessionContext";
import { fetchOwnerTransaction } from "../hooks/transactionService";
import Loader from "../components/General/Loader";
import fetchUser from "../hooks/userData";
import WalletModal from "../components/Wallet/WalletModal";

const TransactionScreen = () => {
  const ViewData = "Transactions";
  const { user } = useSession();
  const [transactionData, setTransactionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [TopUpModal, setTopUpModal] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRequest = await fetchUser(user.uid);
        setUserData(userRequest);

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
      <div className={`flex flex-row ${TopUpModal ? "blur-xs" : ""}`}>
        <Menu ViewData={ViewData} />
        <Transaction
          Transaction={transactionData}
          userData={userData}
          setTopUpModal={setTopUpModal}
        />
      </div>
      <WalletModal
        user={user}
        userData={userData}
        isOpen={TopUpModal}
        setTopUpModal={setTopUpModal}
      />
    </div>
  );
};

export default TransactionScreen;
