import React, { useState } from "react";
import SmallProfile from "../General/SmallProfile";
import formatTimestamp from "../../utils/formatTimestamp";
import Wallet from "../General/Wallet";

const Transaction = ({ Transaction, userData, isOpen, setTopUpModal }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = Transaction.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(Transaction.length / itemsPerPage);

  return (
    <div className="flex flex-col font-inter flex-1 p-5">
      <div className="flex w-full h-20 flex-row items-center justify-between mb-4 border-b border-gray-400">
        <Wallet
          userData={userData}
          isOpen={isOpen}
          setTopUpModal={setTopUpModal}
        />
        <SmallProfile />
      </div>

      {Transaction.length === 0 ? (
        <div className="text-4xl mt-5 text-gray-600 text-center w-full h-full flex justify-center items-center">
          No Transactions Yet
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-2 min-h-[600px]">
          {currentTransactions.length > 0
            ? currentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="w-full h-16 border-b border-gray-300 flex flex-row justify-between"
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-600 text-xs">
                      {formatTimestamp(transaction.createdAt)}
                    </label>
                    <label>{transaction.type}</label>
                  </div>

                  {transaction.type === "Top-Up" ? (
                    <div className="flex items-center pe-8 text-green-600">
                      <label className="px-2 py-1 bg-green-100 rounded-md">
                        +₱{transaction.amount}
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center pe-8 text-red-600">
                      <label className="px-2 py-1 bg-red-100 rounded-md">
                        -₱{transaction.amount}
                      </label>
                    </div>
                  )}
                </div>
              ))
            : null}
        </div>
      )}

      <div className="flex justify-center gap-2 mt-4 items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Previous
        </button>

        {/* Page Number Display */}
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Transaction;
