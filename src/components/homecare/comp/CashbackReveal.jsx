import React, { useEffect } from "react";
import { FiGift } from "react-icons/fi";
import Confetti from "react-confetti";

const CashbackReveal = ({ cashbackPercentage, onClose, onReveal }) => {
  useEffect(() => {
    const audio = new Audio("/sounds/reveal-sound.mp3");
    audio.play().catch(console.error);

    // Optional callback
    if (onReveal) onReveal();

    // 🟢 API call to notify backend about reveal
    sendCashbackRevealEvent(cashbackPercentage)
      .then((res) => {
        console.log("Cashback reveal event sent", res.data);
      })
      .catch((err) => {
        console.error("Failed to send cashback reveal event", err);
      });
  }, [cashbackPercentage, onReveal]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Confetti />
      <div className="bg-white rounded-xl w-[90%] max-w-md p-6 shadow-lg relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Cashback Reveal Card */}
        <div className="flex flex-col items-center">
          <FiGift className="text-green w-12 h-12 mb-3" />
          <h2 className="text-xl font-semibold text-green mb-2">
            Congratulations!
          </h2>
          <p className="text-center text-gray-600 mb-5">
            You've received <strong>{cashbackPercentage}% cashback</strong> 🎉
          </p>

          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-green/90 to-green/70 text-white font-semibold rounded-lg shadow hover:brightness-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashbackReveal;
