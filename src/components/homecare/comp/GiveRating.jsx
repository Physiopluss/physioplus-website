import React, { useState } from "react";
import { ratePhysio } from "../../../api/homecare";
import toast from "react-hot-toast";

const GiveRating = ({ onClose, order }) => {
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleStarClick = (i) => {
    setRating((prev) => (prev === i ? 0 : i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select at least 1 star!");
      return;
    }

    setLoading(true);
    try {
      // Prepare payload
      const payload = {
        orderId: order._id,
        rating, // rating integer (1-5)
      };

      const response = await ratePhysio(payload);

      // Assuming your API returns success flag or message
      if (response?.success || response?.status === 200) {
        toast.success(response.message || "Rating submitted successfully!");
        if (onClose) onClose();
      } else {
        // Handle error returned by API with message
        toast.error(response.message || "Failed to submit rating.");
      }
    } catch (error) {
      // You can check for error.response.message if using axios
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to submit rating. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-8 px-4 bg-white/90 rounded-2xl shadow-2xl min-w-full max-w-xs">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-2xl text-green-600 hover:bg-green-50 w-8 h-8 flex items-center justify-center rounded-full transition"
          aria-label="Close"
          type="button"
          disabled={loading}
        >
          ×
        </button>
      )}

      <span className="text-green font-bold text-2xl my-4">Give Rating</span>

      <div className="flex flex-col items-center mb-4">
        <img
          src={order?.physioId?.profileImage}
          alt="Physio"
          className="w-20 h-20 rounded-full object-cover border-4 border-green-200 shadow-lg mb-2"
        />
        <div className="text-base font-semibold text-center mb-1 text-green-900">
          {order?.physioId?.fullName}
        </div>
        <div className="text-sm text-gray-500 text-center">
          {order?.physioId?.specialization &&
          order.physioId.specialization.length > 0
            ? order.physioId.specialization.map((sp) => sp.name).join(", ")
            : "Specialization not available"}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center"
      >
        <div className="border border-gray-300 w-full rounded-md mb-4 p-4">
          <div className="text-sm font-semibold text-center mb-6 text-gray-700 tracking-tight">
            How was your experience with them?
          </div>
          <div className="flex justify-center items-center gap-2 w-full overflow-visible px-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <span key={i} className="inline-block">
                <svg
                  onClick={() => handleStarClick(i)}
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill={i <= rating ? "#20B486" : "#ECFDF5"}
                  stroke="#20B486"
                  strokeWidth={i <= rating ? "0" : "1"}
                  className={`cursor-pointer transition-transform duration-150 ${
                    i === rating ? "scale-125" : "scale-100"
                  }`}
                  aria-label={`${i} Star`}
                  style={{ transition: "fill 0.2s, transform 0.2s" }}
                >
                  <path d="M12 17.25l-6.172 3.727a1 1 0 0 1-1.451-1.054l1.179-6.873-5.028-4.898a1 1 0 0 1 .554-1.704l6.945-1.011 3.107-6.3a1 1 0 0 1 1.794 0l3.107 6.3 6.945 1.011a1 1 0 0 1 .554 1.704l-5.028 4.898 1.179 6.873a1 1 0 0 1-1.451 1.054L12 17.25z" />
                </svg>
              </span>
            ))}
          </div>
          {rating === 0 && (
            <div className="text-xs text-red-500 text-center mt-1">
              Select stars above to rate.
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`w-[80%] max-w-xs bg-green text-lg text-white font-bold rounded-md py-3 shadow hover:scale-105 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default GiveRating;
