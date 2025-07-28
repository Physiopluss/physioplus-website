import React from "react";
import { useLocation } from "react-router-dom";

const ViewConsultation = () => {
  const { state } = useLocation();
  const order = state?.order || {};

  // Demo fallback data if order not provided
  const patientName = order.patientName || "Rohit Sharma";
  const gender = order.gender || "Male";
  const consultationAmount = order.consultationAmount || 450;
  const paymentStatus = order.paymentStatus || "Online, Paid";
  const problem = order.problem || "Patient problem describe by patient";
  const prescription =
    order.prescription || "Physio prescription describe or mention by physios";
  const address =
    order.address || "C5, Shanti Nagar, Gurjar Ki Thadi, Mansarovar, 202021";
  const paymentOverview =
    order.paymentOverview ||
    "You can download your invoice after consultation is being verified.";

  return (
    <div className="p-4 max-w-md mx-auto text-black space-y-4">
      <h1 className="text-center font-semibold text-lg mb-4">
        View Consultation
      </h1>

      <div className="rounded-xl border p-4 space-y-2 shadow-sm">
        {/* General Details */}
        <details open>
          <summary className="font-medium">General Details</summary>
          <div className="text-sm mt-2 space-y-1">
            <p>
              <strong>Patient Name:</strong> {patientName}
            </p>
            <p>
              <strong>Gender:</strong> {gender}
            </p>
            <p>
              <strong>Consultation Amount:</strong> ₹{consultationAmount}
            </p>
            <p>
              <strong>Payment:</strong> {paymentStatus}
            </p>
          </div>
        </details>

        {/* Your Problem */}
        <details>
          <summary className="font-medium">Your Problem</summary>
          <textarea
            readOnly
            value={problem}
            className="w-full mt-2 p-2 border rounded bg-gray-100 text-sm"
            rows={3}
          />
        </details>

        {/* Physio Prescription */}
        <details>
          <summary className="font-medium">Physio Prescription</summary>
          <textarea
            readOnly
            value={prescription}
            className="w-full mt-2 p-2 border rounded bg-gray-100 text-sm"
            rows={3}
          />
        </details>

        {/* Address */}
        <details>
          <summary className="font-medium">Address</summary>
          <textarea
            readOnly
            value={address}
            className="w-full mt-2 p-2 border rounded bg-gray-100 text-sm"
            rows={2}
          />
        </details>

        {/* Payment Overview */}
        <details>
          <summary className="font-medium">Payment Overview</summary>
          <textarea
            readOnly
            value={paymentOverview}
            className="w-full mt-2 p-2 border rounded bg-gray-100 text-sm"
            rows={2}
          />
        </details>

        <button className="w-full bg-green text-white font-semibold py-2 rounded-lg mt-2">
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default ViewConsultation;
