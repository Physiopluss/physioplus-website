import React, { useState } from "react";

const WALLET = {
  online: {
    totalRevenue: "₹1,749.00",
    totalConsultations: 15,
    totalTreatment: 10,
    availableBalance: "₹1,749.00",
  },
  cash: {
    totalRevenue: "- ₹1,749.00",
    totalConsultations: 15,
    totalTreatment: 10,
    availableBalance: "- ₹1,749.00",
  },
};

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("online");

  const onlineCards = [1, 2, 3];
  const cashCards = [1, 2, 3];

  const wallet = WALLET[activeTab];

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#f8f9fa] pb-4">
      {/* AppBar Title */}
      <div className="flex items-center justify-center h-14 text-base font-semibold border-b border-gray-100 bg-white">
        Wallet
      </div>

      {/* Wallet Stats */}
      <div className="mx-3 mt-4 space-y-2">
        {/* Total Revenue Row */}
        <div className="flex items-center justify-between bg-[#f3f8f6] rounded-lg px-4 py-2">
          <span className="text-sm font-medium text-gray-700">
            Total Revenue
          </span>
          <span
            className={`font-semibold text-base ${
              activeTab === "online" ? "text-green" : "text-red-400"
            }`}
          >
            {wallet.totalRevenue}
          </span>
        </div>
        {/* Total Consultations */}
        <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2">
          <span className="text-sm font-medium text-gray-700">
            Total Consultations
          </span>
          <span className="text-green font-semibold">
            {wallet.totalConsultations}.00
          </span>
        </div>
        {/* Total Treatment */}
        <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2">
          <span className="text-sm font-medium text-gray-700">
            Total Treatment
          </span>
          <span className="text-green font-semibold">
            {wallet.totalTreatment}.00
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-full mt-5 border-b border-gray-100">
        <button
          className={`flex-1 text-center py-3 font-semibold border-b-2 transition ${
            activeTab === "online"
              ? "text-green border-green"
              : "text-gray-400 border-transparent"
          }`}
          onClick={() => setActiveTab("online")}
        >
          Online
        </button>
        <button
          className={`flex-1 text-center py-3 font-semibold border-b-2 transition ${
            activeTab === "cash"
              ? "text-green border-green"
              : "text-gray-400 border-transparent"
          }`}
          onClick={() => setActiveTab("cash")}
        >
          Cash
        </button>
      </div>

      {/* Cards */}
      <div className="px-3 py-4 space-y-4">
        {(activeTab === "online" ? onlineCards : cashCards).map((_, idx) => (
          <div
            key={idx}
            className="bg-green/10 rounded-xl p-4 flex flex-col items-center"
          >
            <div className="w-full flex justify-between items-center mb-3">
              <div className="text-gray-700 font-medium text-base">
                Available Balance
              </div>
              <div
                className={`font-bold text-lg ${
                  activeTab === "online" ? "text-green" : "text-red-400"
                }`}
              >
                {wallet.availableBalance}
              </div>
            </div>
            <button
              className={`w-full rounded-lg py-2 mt-1 border font-semibold ${
                activeTab === "online"
                  ? "text-green border-green bg-white"
                  : "bg-white text-green border-green"
              }`}
            >
              {activeTab === "online" ? "Withdraw" : "Pay"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
