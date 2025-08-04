import React, { useEffect, useState } from "react";
import {
  getPhysioWalletDetails,
  getPhysioWalletRevenue,
} from "../../../api/homecare/physio"; // adjust import if needed

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("online");
  const [walletDetails, setWalletDetails] = useState(null); // for availableBalance
  const [walletRevenue, setWalletRevenue] = useState(null); // for totalRevenue etc.
  const [loading, setLoading] = useState(false);

  const physioId = JSON.parse(localStorage.getItem("homecareUser"))?.userId;

  // Fetch on tab change: online / cash → get balance
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const details = await getPhysioWalletDetails({
          mode: activeTab,
          physioId,
        });
        setWalletDetails(details);
      } catch (error) {
        setWalletDetails(null);
      } finally {
        setLoading(false);
      }
    };

    if (physioId) fetchDetails();
  }, [activeTab]);

  // Fetch once: total stats
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const revenue = await getPhysioWalletRevenue({ physioId });
        setWalletRevenue(revenue);
      } catch (error) {
        setWalletRevenue(null);
      }
    };

    if (physioId) fetchRevenue();
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white pb-4">
      {/* AppBar Title */}
      <div className="flex items-center justify-center h-14 text-base font-semibold border-b border-gray-100 bg-white">
        Wallet
      </div>

      {/* Wallet Stats */}
      <div className="mx-3 mt-4 space-y-2">
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : walletRevenue ? (
          <>
            <div className="flex items-center justify-between bg-[#f3f8f6] rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-gray-700">
                Total Revenue
              </span>
              <span
                className={`font-semibold text-base ${
                  activeTab === "online" ? "text-green" : "text-red-400"
                }`}
              >
                ₹{walletRevenue.totalRevenue}
              </span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-gray-700">
                Total Consultations
              </span>
              <span className="text-green font-semibold">
                {walletRevenue.totalConsultations}.00
              </span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-gray-700">
                Total Treatment
              </span>
              <span className="text-green font-semibold">
                {walletRevenue.totalTreatment}.00
              </span>
            </div>
          </>
        ) : (
          <div className="text-center text-red-400">No stats found.</div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex w-full mt-5 border-b border-gray-100">
        {["online", "cash"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 text-center py-3 font-semibold border-b-2 transition ${
              activeTab === tab
                ? "text-green border-green"
                : "text-gray-400 border-transparent"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="px-3 py-4 space-y-4">
        {!loading &&
          walletDetails &&
          [1, 2, 3].map((_, idx) => (
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
                  ₹{walletDetails.availableBalance}
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
