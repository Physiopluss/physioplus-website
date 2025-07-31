import React from "react";

const PAYMENTS = [
  {
    id: 1,
    label: "Session 1 or Day 1",
    date: "25 September 2024",
    txnId: "55412654",
    method: "Online",
    amount: "₹450",
    status: "Paid",
  },
  {
    id: 2,
    label: "Session 2 or Day 2",
    date: "25 September 2024",
    txnId: "55412654",
    method: "Cash",
    amount: "₹450",
    status: "Paid",
  },
  {
    id: 3,
    label: "Session 3 or Day 3",
    date: "25 September 2024",
    txnId: "55412654",
    method: "Online",
    amount: "₹450",
    status: "Paid",
  },
  {
    id: 4,
    label: "Session 4 or Day 4",
    date: "25 September 2024",
    txnId: "55412654",
    method: "Online",
    amount: "₹450",
    status: "Paid",
  },
  {
    id: 5,
    label: "Session 5 or Day 5",
    date: "25 September 2024",
    txnId: "55412654",
    method: "Online",
    amount: "₹4,550",
    status: "Paid",
  },
  {
    id: 6,
    label: "Session 5 or Day 5",
    date: "25 September 2024",
    txnId: "55412654",
    method: "Online",
    amount: "₹4,550",
    status: "Failed",
  },
];

export default function PaymentHistory() {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f8f9fa] pb-4">
      {/* Header */}
      <div className="flex items-center justify-center h-14 text-base font-semibold border-b border-gray-100 bg-white">
        Payment History
      </div>
      <div className="px-3 py-5 space-y-3">
        {PAYMENTS.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="bg-white rounded-xl border border-gray-100 shadow-md px-3 py-3 flex items-center"
          >
            {/* Left: Circle icon with arrow */}
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-green/10 mr-3">
              <svg
                width={22}
                height={22}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="text-green"
              >
                <path
                  d="M7 11h8M13 7l4 4-4 4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {/* Center info block */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="font-medium text-[15px] truncate">
                  {item.label}
                </div>
                <span
                  className={`ml-3 px-2 py-0.5 rounded-full text-xs font-semibold
                    ${
                      item.status === "Paid"
                        ? "bg-green/10 text-green border border-green"
                        : "bg-red-100 text-red-600 border border-red-200"
                    }`}
                >
                  {item.status === "Paid" ? "Paid" : "Failed"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 mt-0.5">
                <div className="text-[11px] text-gray-500 font-medium">
                  {item.date}
                </div>
                <span className="text-[11px] text-gray-300">|</span>
                <div className="text-[11px] text-gray-500">
                  Txn: {item.txnId}
                </div>
                <span className="text-[11px] text-gray-300">|</span>
                <span
                  className={`text-[11px] font-medium ${
                    item.method === "Online" ? "text-green" : "text-yellow-800"
                  }`}
                >
                  {item.method}
                </span>
              </div>
            </div>
            {/* Amount */}
            <div className="ml-2 flex-shrink-0 flex flex-col items-end">
              <div className="font-bold text-green text-[16px] -mt-0.5">
                {item.amount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
