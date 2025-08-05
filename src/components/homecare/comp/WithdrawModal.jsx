// components/homecare/comp/WithdrawModal.jsx

import React, { useState } from "react";

export default function WithdrawModal({
  onClose,
  onConfirm,
  availableBalance,
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!amount || isNaN(amount) || +amount <= 0) return;

    setLoading(true);
    try {
      await onConfirm(+amount); // ✅ Await the confirm handler
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-4 w-80">
        <div className="text-lg font-semibold mb-3">Withdraw Amount</div>
        <input
          type="number"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={1}
          max={availableBalance}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded border border-gray-300"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-green text-white font-semibold"
            onClick={handleSubmit}
            disabled={loading || +amount > availableBalance}
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
