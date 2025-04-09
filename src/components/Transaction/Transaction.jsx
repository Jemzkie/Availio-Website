import React from "react";
import SmallProfile from "../General/SmallProfile";
import formatTimestamp from "../../utils/formatTimestamp";
const Transaction = ({ Transaction }) => {
  console.log(Transaction);
  return (
    <div className="flex flex-col font-inter flex-1 p-5">
      <div className="flex w-full h-20 flex-row items-center justify-end mb-4 border-b border-gray-400">
        <SmallProfile />
      </div>

      {Transaction.length === 0 ? (
        <div className="text-4xl mt-5 text-gray-600 text-center w-full h-full flex justify-center items-center">
          No Transactions Yet
        </div>
      ) : (
        <div className="mt-5 flex flex-col gap-2">
          {Transaction.length > 0
            ? Transaction.map((transaction) => (
                <div
                  key={transaction.id}
                  className="w-full h-16 border-b border-gray-300 flex flex-row justify-between "
                >
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-600 text-xs">
                      {formatTimestamp(transaction.createdAt)}
                    </label>
                    <label>{transaction.type}</label>
                  </div>

                  <div className="flex items-center pe-8 text-green-600">
                    <label className="px-2 py-1 bg-green-100 rounded-md">
                      +₱{transaction.amount}
                    </label>
                  </div>
                </div>
              ))
            : null}
        </div>
      )}
    </div>
  );
};

export default Transaction;
