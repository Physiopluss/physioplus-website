import React from "react";
import { useLocation } from "react-router-dom";

const ViewConsultation = () => {
  const { state } = useLocation();
  const order = state?.order;

  return (
    <div className="p-4 max-w-md mx-auto text-black space-y-4">
      <h1 className="text-center font-semibold text-lg mb-4">
        View Consultation
      </h1>

      <div className="rounded-xl border p-4 space-y-2 shadow-sm">
        <details open>
          <summary className="font-medium">General Details</summary>
          <div className="text-sm mt-2 space-y-1">
            <p>
              <strong>Patient Name:</strong> Rohit Sharma
            </p>
            <p>
              <strong>Gender:</strong> Male
            </p>
            <p>
              <strong>Consultation Amount:</strong> ₹450
            </p>
            <p>
              <strong>Payment:</strong> Online, Paid
            </p>
          </div>
        </details>

        <details>
          <summary className="font-medium">Your Problem</summary>
          <textarea
            readOnly
            value="Patient problem describe by patient"
            className="w-full mt-2 p-2 border rounded bg-gray-100 text-sm"
            rows={3}
          />
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
          <summary className="font-medium">Address</summary>
          <textarea
            readOnly
            value="C5, Shanti Nagar, Gurjar Ki Thadi, Mansarovar, 202021"
            className="w-full mt-2 p-2 border rounded bg-gray-100 text-sm"
            rows={2}
          />
        </details>

        <details>
          <summary className="font-medium">Payment Overview</summary>
          <textarea
            readOnly
            value="You can download your invoice after consultation is being verified."
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
