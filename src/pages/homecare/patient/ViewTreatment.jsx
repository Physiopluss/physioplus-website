import React from "react";
import { useLocation } from "react-router-dom";

const ViewTreatment = () => {
  const { state } = useLocation();
  const order = state?.order;
  const isPaid = order?.status === "Completed";

  return (
    <div className="p-4 max-w-md mx-auto text-black space-y-4">
      <h1 className="text-center font-semibold text-lg mb-4">View Treatment</h1>

      <div className="rounded-xl border p-4 space-y-2 shadow-sm">
        <details open>
          <summary className="font-medium">Treatment Report</summary>
          <div className="text-sm mt-2 space-y-1">
            <p>
              <strong>Treatment Days:</strong> 5 Days Plan
            </p>
            <p>
              <strong>Duration:</strong> 7 Feb - 12 Feb
            </p>
            <p>
              <strong>Treatment Amount:</strong> ₹450
            </p>
          </div>
        </details>

        <details>
          <summary className="font-medium">Physio Prescription</summary>
          <textarea
            readOnly
            value="Physio prescription describe or mention by physios"
            className="w-full mt-2 p-2 border rounded bg-gray-100 text-sm"
            rows={3}
          />
        </details>

        <details>
          <summary className="font-medium">Treatment Overview</summary>
          <div className="mt-2 space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`flex justify-between items-center px-4 py-2 rounded-lg ${
                  isPaid
                    ? "bg-green/10 text-green font-medium"
                    : "bg-gray-100 text-black"
                }`}
              >
                Treatment Day {i + 1}
                {isPaid && (
                  <span className="text-xs bg-green text-white rounded-full px-2 py-0.5">
                    Paid
                  </span>
                )}
              </div>
            ))}
          </div>
        </details>

        {!isPaid ? (
          <button className="w-full bg-green text-white font-semibold py-2 rounded-lg mt-2">
            Pay at once
          </button>
        ) : (
          <>
            <button className="w-full bg-green text-white font-semibold py-2 rounded-lg mt-2">
              Payment Completed
            </button>
            <button className="w-full border border-green text-green font-semibold py-2 rounded-lg mt-2">
              Download Invoice
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewTreatment;
