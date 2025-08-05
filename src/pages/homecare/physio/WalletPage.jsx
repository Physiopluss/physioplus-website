import React, { useEffect, useState } from "react";
import {
  getPhysioRepayTransactions,
  getPhysioWalletRevenue,
  getPhysioWithdrawTransactions,
  makePhysioWithdrawal,
  payToAdminByRazorpay,
} from "../../../api/homecare/physio"; // adjust import if needed
import WithdrawModal from "../../../components/homecare/comp/WithdrawModal";
import toast from "react-hot-toast";
import RepayModal from "../../../components/homecare/comp/RepayModal";
import { format } from "date-fns";

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("online");
  const [withdrawTransactions, setWithdrawTransactions] = useState(null); // for availableBalance
  const [repayTransactions, setRepayTransactions] = useState(null); // for availableBalance
  const [walletRevenue, setWalletRevenue] = useState(null); // for totalRevenue etc.
  const [loading, setLoading] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showRepayModal, setShowRepayModal] = useState(false);

  const userObj = JSON.parse(localStorage.getItem("homecareUser"));
  const physioId = userObj?.userId;
  const userToken = userObj?.userToken;
  // Fetch on tab change: online / cash → get balance
  useEffect(() => {
    const fetchWithdraw = async () => {
      try {
        setLoading(true);
        const details = await getPhysioWithdrawTransactions({
          physioId,
        });
        setWithdrawTransactions(details);
      } catch (error) {
        setWithdrawTransactions(null);
      } finally {
        setLoading(false);
      }
    };

    if (physioId) fetchWithdraw();
  }, []);
  useEffect(() => {
    const fetchRepay = async () => {
      try {
        setLoading(true);
        const details = await getPhysioRepayTransactions({
          physioId,
        });
        setRepayTransactions(details);
      } catch (error) {
        setRepayTransactions(null);
      } finally {
        setLoading(false);
      }
    };

    if (physioId) fetchRepay();
  }, []);

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

  const handleWithdrawConfirm = async (amount) => {
    try {
      await makePhysioWithdrawal({ physioId, amount });
      toast.success("Withdrawal request submitted");

      // Refresh wallet stats
      const details = await getPhysioWithdrawTransactions({
        physioId,
      });
      setWithdrawTransactions(details);
      const revenue = await getPhysioWalletRevenue({ physioId });
      setWalletRevenue(revenue);

      // ✅ Close modal after updates
      setShowWithdrawModal(false);
    } catch (error) {
      toast.error("Withdrawal failed");
      console.error(error);
    }
  };

  const handleRepayConfirm = async (amount) => {
    try {
      await payToAdminByRazorpay({ physioId, amount, userToken });
      toast.success("Payment submitted");

      // Refresh repay transactions and revenue
      const repay = await getPhysioRepayTransactions({ physioId });
      setRepayTransactions(repay);

      const revenue = await getPhysioWalletRevenue({ physioId });
      setWalletRevenue(revenue);

      setShowRepayModal(false);
    } catch (error) {
      toast.error("Payment failed");
      console.error(error);
    }
  };

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
              <span className="font-semibold text-base  text-green">
                ₹{walletRevenue?.totalRevenue.toFixed(2) || "0"}
              </span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-gray-700">
                Total Consultations
              </span>
              <span className="text-green font-semibold">
                {walletRevenue?.totalAppointment || "0"}
              </span>
            </div>
            <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-gray-700">
                Total Treatment
              </span>
              <span className="text-green font-semibold">
                {walletRevenue?.totalTreatment || "0"}
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
      {/* ONLINE TAB: Withdrawals + Online Transactions */}
      {activeTab === "online" && (
        <>
          {/* Withdrawal Card */}
          <div className="px-4 pt-4">
            <div className="bg-[#c3f4cb] rounded-2xl p-4 text-green shadow-md relative">
              <div className="flex flex-row justify-between">
                <div className="text-sm mb-1 font-medium">
                  Available Balance
                </div>
                <div
                  className={`text-2xl font-bold mb-3 ${
                    walletRevenue?.physioWalletAmt < 0
                      ? "text-red-600"
                      : "text-green"
                  }`}
                >
                  ₹{walletRevenue?.physioWalletAmt?.toFixed(2) || "0.00"}
                </div>
              </div>
              <button
                className="bg-white text-green font-semibold rounded-full px-6 py-2 w-full disabled:opacity-50"
                onClick={() => setShowWithdrawModal(true)}
                disabled={walletRevenue?.physioWalletAmt <= 0}
              >
                Withdraw
              </button>
            </div>

            {/* Withdrawal History Button */}
            <button className="mt-4 flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582M20 20v-5h-.582M20 4L4 20"
                />
              </svg>
              Withdrawal History
            </button>
          </div>

          {/* Online Transactions */}
          <div className="mt-6 px-4 space-y-4">
            {(withdrawTransactions || []).map((tx, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-sm text-black">
                      {tx?.physioId?.fullName || "Physioplus Physio"} |{" "}
                      {format(new Date(tx?.createdAt), "dd MMM yyyy, hh:mm a")}
                    </div>
                    <div className="text-xs font-medium mt-1 text-green">
                      {tx?.paymentMode} | {tx?.paymentStatus}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-green">
                    ₹{tx.amount?.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* CASH TAB: Pay Card + Cash Transactions */}
      {activeTab === "cash" && (
        <>
          <div className="px-4 pt-4">
            <div className="bg-[#c3f4cb] text-green rounded-2xl p-4 shadow-md relative">
              <div className="flex flex-row justify-between">
                <div className="text-sm mb-1 font-medium">
                  {" "}
                  Available Balance
                </div>
                <div
                  className={`text-2xl font-bold mb-3 ${
                    walletRevenue?.physioWalletAmt < 0
                      ? "text-red-600"
                      : "text-green"
                  }`}
                >
                  ₹{walletRevenue?.physioWalletAmt?.toFixed(2) || "0.00"}
                </div>
              </div>

              <button
                className="bg-white text-green font-semibold rounded-full px-6 py-2 w-full disabled:opacity-50"
                onClick={() => setShowRepayModal(true)}
                disabled={walletRevenue?.physioWalletAmt >= 0}
              >
                Pay to Admin
              </button>
            </div>

            {/* Pay History Button */}
            <button className="mt-4 flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582M20 20v-5h-.582M20 4L4 20"
                />
              </svg>
              Payment Log
            </button>
          </div>

          {/* Cash Transactions */}
          <div className="mt-6 px-4 space-y-4">
            {(repayTransactions || []).map((tx, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-sm text-black">
                      {tx?.physioId?.fullName || "Physioplus Physio"} |{" "}
                      {format(new Date(tx?.createdAt), "dd MMM yyyy, hh:mm a")}
                    </div>
                    <div className="text-xs font-medium mt-1 text-yellow-800">
                      {tx?.paymentMode} | {tx?.paymentStatus}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-yellow-700">
                    ₹{tx?.amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {showRepayModal && (
        <RepayModal
          onClose={() => setShowRepayModal(false)}
          onConfirm={handleRepayConfirm}
          availableBalance={walletRevenue?.physioWalletAmt || 0}
        />
      )}
      {showWithdrawModal && (
        <WithdrawModal
          onClose={() => setShowWithdrawModal(false)}
          onConfirm={handleWithdrawConfirm}
          availableBalance={walletRevenue?.physioWalletAmt || 0}
        />
      )}
    </div>
  );
}
