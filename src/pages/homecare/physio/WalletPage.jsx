// import React, { useEffect, useState } from "react";
// import {
//   getPhysioWalletDetails,
//   getPhysioWalletRevenue,
// } from "../../../api/homecare/physio"; // adjust import if needed

// export default function WalletPage() {
//   const [activeTab, setActiveTab] = useState("online");
//   const [walletDetails, setWalletDetails] = useState(null); // for availableBalance
//   const [walletRevenue, setWalletRevenue] = useState(null); // for totalRevenue etc.
//   const [loading, setLoading] = useState(false);

//   const physioId = JSON.parse(localStorage.getItem("homecareUser"))?.userId;

//   // Fetch on tab change: online / cash → get balance
//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         setLoading(true);
//         const details = await getPhysioWalletDetails({
//           mode: activeTab,
//           physioId,
//         });
//         setWalletDetails(details);
//       } catch (error) {
//         setWalletDetails(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (physioId) fetchDetails();
//   }, [activeTab]);

//   // Fetch once: total stats
//   useEffect(() => {
//     const fetchRevenue = async () => {
//       try {
//         const revenue = await getPhysioWalletRevenue({ physioId });
//         setWalletRevenue(revenue);
//       } catch (error) {
//         setWalletRevenue(null);
//       }
//     };

//     if (physioId) fetchRevenue();
//   }, []);

//   return (
//     <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white pb-4">
//       {/* AppBar Title */}
//       <div className="flex items-center justify-center h-14 text-base font-semibold border-b border-gray-100 bg-white">
//         Wallet
//       </div>

//       {/* Wallet Stats */}
//       <div className="mx-3 mt-4 space-y-2">
//         {loading ? (
//           <div className="text-center text-gray-400">Loading...</div>
//         ) : walletRevenue ? (
//           <>
//             <div className="flex items-center justify-between bg-[#f3f8f6] rounded-lg px-4 py-2">
//               <span className="text-sm font-medium text-gray-700">
//                 Total Revenue
//               </span>
//               <span
//                 className={`font-semibold text-base ${
//                   activeTab === "online" ? "text-green" : "text-red-400"
//                 }`}
//               >
//                 ₹{walletRevenue.totalRevenue}
//               </span>
//             </div>
//             <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2">
//               <span className="text-sm font-medium text-gray-700">
//                 Total Consultations
//               </span>
//               <span className="text-green font-semibold">
//                 {walletRevenue.totalConsultations}.00
//               </span>
//             </div>
//             <div className="flex items-center justify-between bg-white rounded-lg px-4 py-2">
//               <span className="text-sm font-medium text-gray-700">
//                 Total Treatment
//               </span>
//               <span className="text-green font-semibold">
//                 {walletRevenue.totalTreatment}.00
//               </span>
//             </div>
//           </>
//         ) : (
//           <div className="text-center text-red-400">No stats found.</div>
//         )}
//       </div>

//       {/* Tabs */}
//       <div className="flex w-full mt-5 border-b border-gray-100">
//         {["online", "cash"].map((tab) => (
//           <button
//             key={tab}
//             className={`flex-1 text-center py-3 font-semibold border-b-2 transition ${
//               activeTab === tab
//                 ? "text-green border-green"
//                 : "text-gray-400 border-transparent"
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Cards */}
//       <div className="px-3 py-4 space-y-4">
//         {!loading &&
//           walletDetails &&
//           [1, 2, 3].map((_, idx) => (
//             <div
//               key={idx}
//               className="bg-green/10 rounded-xl p-4 flex flex-col items-center"
//             >
//               <div className="w-full flex justify-between items-center mb-3">
//                 <div className="text-gray-700 font-medium text-base">
//                   Available Balance
//                 </div>
//                 <div
//                   className={`font-bold text-lg ${
//                     activeTab === "online" ? "text-green" : "text-red-400"
//                   }`}
//                 >
//                   ₹{walletDetails.availableBalance}
//                 </div>
//               </div>
//               <button
//                 className={`w-full rounded-lg py-2 mt-1 border font-semibold ${
//                   activeTab === "online"
//                     ? "text-green border-green bg-white"
//                     : "bg-white text-green border-green"
//                 }`}
//               >
//                 {activeTab === "online" ? "Withdraw" : "Pay"}
//               </button>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import {
  getPhysioWalletDetails,
  getPhysioWalletRevenue,
} from "../../../api/homecare/physio";
import { Repeat } from "lucide-react";

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("online");
  const [walletDetails, setWalletDetails] = useState(null);
  const [walletRevenue, setWalletRevenue] = useState(null);
  const [loading, setLoading] = useState(false);

  const physioId = JSON.parse(localStorage.getItem("homecareUser"))?.userId;

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

  const isOnline = activeTab === "online";

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white pb-4">
      {/* Header */}
      <div className="flex items-center justify-center h-14 text-base font-semibold border-b border-gray-100">
        {isOnline ? "Online" : "Cash"}
      </div>

      {/* Balance Card */}
      <div className="px-4 pt-4">
        <div className="bg-gradient-to-r from-green-600 to-green-400 rounded-2xl p-4 text-white shadow-md relative">
          <div className="text-sm mb-1 font-medium">Available Balance</div>
          <div className="text-2xl font-bold mb-3">
            {isOnline ? "₹" : "- ₹"}
            {walletDetails?.availableBalance || "0.00"}
          </div>
          <button className="bg-white text-green font-semibold rounded-full px-6 py-2 w-full">
            {isOnline ? "Withdraw" : "Pay"}
          </button>
        </div>

        {/* Withdrawal History */}
        <button className="mt-4 flex items-center gap-2 px-4 py-2 border rounded-full text-sm font-medium text-gray-700">
          <Repeat className="w-4 h-4" />
          Withdrawal History
        </button>
      </div>

      {/* Transactions */}
      <div className="mt-6 px-4 space-y-4">
        {/* Replace the below array with `walletDetails.transactions` */}
        {[1].map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-sm text-black">
                  Physioplus Patient | 6:04 PM
                </div>
                <div
                  className={`text-xs font-medium mt-1 ${
                    isOnline ? "text-green" : "text-[#00B36A]"
                  }`}
                >
                  {isOnline ? "Online" : "Cash"} | Paid
                </div>
              </div>
              <div className="text-sm font-bold text-green">Rs. 500</div>
            </div>
            <div className="text-xs text-gray-500 mt-2">Treatment Fee</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t border-gray-200 bg-white">
        {["online", "cash"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 text-sm font-semibold ${
              activeTab === tab
                ? "text-green border-t-2 border-green"
                : "text-gray-400"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
