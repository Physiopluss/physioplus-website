import React from "react";
import { useLocation } from "react-router-dom";

const OrderDetailPage = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="min-h-screen bg-white p-4">
      <h1 className="text-xl font-bold text-center mb-4">View Consultation</h1>

      <div className="bg-gray-100 rounded-xl p-4 space-y-4">
        <details open>
          <summary className="font-medium text-gray-700">
            General Details
          </summary>
          <div className="text-sm mt-2 space-y-1">
            <p>
              Patient Name: <strong>Rohit Sharma</strong>
            </p>
            <p>
              Gender: <strong>Male</strong>
            </p>
            <p>
              Consultation Amount: <strong>₹450</strong>
            </p>
            <p>
              Payment: <strong>Online, Paid</strong>
            </p>
          </div>
        </details>

        <details>
          <summary className="font-medium text-gray-700">Your Problem</summary>
          <p className="bg-white p-2 rounded-md text-sm mt-1">
            Patient problem describe by patient
          </p>
        </details>

        <details>
          <summary className="font-medium text-gray-700">
            Physio Prescription
          </summary>
          <p className="bg-white p-2 rounded-md text-sm mt-1">
            Physio prescription describe or mention by physios
          </p>
        </details>

        <details>
          <summary className="font-medium text-gray-700">Address</summary>
          <p className="bg-white p-2 rounded-md text-sm mt-1">
            C5, Shanti Nagar, Gurjar Ki Thadi, Mansarover, 202021
          </p>
        </details>

        <details>
          <summary className="font-medium text-gray-700">
            Payment Overview
          </summary>
          <p className="bg-white p-2 rounded-md text-sm mt-1">
            You can download your invoice after consultation is verified.
          </p>
        </details>
      </div>

      <div className="mt-6">
        <button className="w-full bg-green-700 text-white rounded-lg py-2 text-sm font-semibold flex justify-center items-center gap-2">
          Download Invoice <span role="img">🔒</span>
        </button>
      </div>
    </div>
  );
};

export default OrderDetailPage;
