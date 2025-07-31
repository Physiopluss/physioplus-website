import React, { useEffect, useState, useRef } from "react";
import { FiGift } from "react-icons/fi";
import { CheckCircle } from "lucide-react";
import Confetti from "react-confetti";
import { sendCashbackRevealEvent } from "../../../api/homecare";

const CashbackReveal = ({
  cashbackData,
  cashbackPercentage,
  onClose,
  onReveal, // <-- Parent callback to signal reveal completed
}) => {
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [confettiRun, setConfettiRun] = useState(false);

  // Play sound and start confetti when success becomes true
  useEffect(() => {
    if (success) {
      setConfettiRun(true);
      try {
        const audio = new Audio("/sounds/reveal-sound.mp3");
        audio.play();
      } catch {
        // ignore sound errors
      }
    }
  }, [success]);

  const handleClaimCashback = async () => {
    if (!upiId.trim()) return alert("Please enter a valid UPI ID.");
    setLoading(true);
    try {
      const res = await sendCashbackRevealEvent(
        cashbackData?._id,
        upiId.trim()
      );
      if (res?.data?.success) {
        setSuccess(true);
        // DO NOT call onReveal here
      } else {
        alert(res?.data?.message || "Failed to claim cashback.");
      }
    } catch (err) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Wrapper for close button: Call parent onReveal before onClose
  const handleClose = () => {
    if (onReveal) onReveal(); // call onReveal **only here**, when user closes
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {success && confettiRun && <Confetti />}
      <div className="bg-white rounded-xl w-[90%] max-w-md p-6 shadow-lg relative">
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
          onClick={handleClose} // <-- call handleClose here
        >
          &times;
        </button>
        <div className="flex flex-col items-center text-center">
          {!success ? (
            <>
              <div className="w-full max-w-[340px] mx-auto mb-4">
                <div className="rounded-2xl bg-gradient-to-br from-amber-300 via-green-200 to-green-500 shadow-xl p-[2px] relative overflow-hidden">
                  {/* Glow/shine overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/50 to-transparent pointer-events-none rounded-2xl" />
                  <div className="relative bg-white rounded-2xl p-7 flex flex-col items-center">
                    {/* Circular icon on a golden bg */}
                    <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-green-300 to-yellow-500 shadow-lg w-16 h-16 mb-3">
                      <FiGift className="text-white w-8 h-8" />
                    </span>
                    <h2 className="text-2xl font-bold text-green-700 mb-1 tracking-wide drop-shadow">
                      Congratulations!
                    </h2>
                    <p className="text-gray-700 text-base mb-2 font-medium">
                      You are eligible for 🎁 <br />
                      <span className="mx-1 text-[1.4em] font-extrabold bg-gradient-to-r from-amber-500 to-green text-transparent bg-clip-text drop-shadow">
                        {cashbackPercentage} Cashback
                      </span>
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="inline-block w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
                      <span className="text-[13px] text-green font-semibold tracking-wide uppercase">
                        Cashback Reward Unlocked
                      </span>
                      <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center w-full my-3">
                <label className="text-[15px] font-medium text-gray-700 mb-2">
                  Enter your UPI ID to receive cashback
                </label>
                <input
                  type="text"
                  placeholder="e.g. yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full mb-3 border-2 border-green/20 rounded-lg px-4 py-2 text-base bg-green/5 focus:border-green focus:bg-white placeholder:text-gray-400 transition outline-none"
                  autoFocus
                  spellCheck={false}
                  pattern=".+@.+"
                  required
                />
                <p className="text-xs text-gray-500 mb-2">
                  We use this UPI ID to securely credit your cashback reward.
                </p>
              </div>

              <button
                onClick={handleClaimCashback}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green/90 to-green/70 text-white font-semibold rounded-lg shadow hover:brightness-105 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Submit & Claim"}
              </button>
            </>
          ) : (
            <>
              <CheckCircle className="w-16 h-16 text-green mb-2 animate-bounce" />
              <div className="text-green text-lg font-bold mt-1 mb-1">
                Cashback Claimed Successfully!
              </div>
              <p className="text-sm text-gray-600 mb-3">
                It will be processed to your UPI soon.
              </p>
              <button
                className="mt-2 px-4 py-2 border border-green text-green rounded-lg font-semibold hover:bg-green/10"
                onClick={handleClose} // <-- same handler here
              >
                Close
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashbackReveal;
