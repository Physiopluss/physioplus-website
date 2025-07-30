import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getConsultationById } from "../../../api/homecare";

const genderMap = {
  0: "Female",
  1: "Male",
  2: "Other",
};

const ViewConsultation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [order, setOrder] = useState(state?.order || {});
  const orderId = state?.order?._id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConsultation = async () => {
      setLoading(true);
      try {
        const data = await getConsultationById(orderId);
        setOrder(data);
      } catch (err) {
        setError("Failed to load consultation details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchConsultation();
  }, [orderId]);

  const handleInvoiceDownload = () => {
    navigate("/homecare/show-invoice", {
      state: { order, type: "appointment" },
    });
  };

  const paymentOverview =
    order.paymentOverview ||
    "You can download your invoice after consultation is verified.";

  return (
    <div className="p-4 max-w-md mx-auto text-black space-y-4">
      <h1 className="text-center font-semibold text-lg mb-4">
        View Consultation
      </h1>

      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="rounded-xl border p-4 space-y-2 shadow-sm">
        {/* General Details */}
        <details open>
          <summary className="font-medium">General Details</summary>
          <div className="text-sm mt-2 space-y-1">
            <p>
              <strong>Patient Name:</strong> {order?.patientName}
            </p>
            <p>
              <strong>Age:</strong> {order?.age}
            </p>
            <p>
              <strong>Gender:</strong> {genderMap[order?.gender] || "N/A"}
            </p>
            <p>
              <strong>Consultation Amount:</strong> ₹{order?.amount}
            </p>
            <p>
              <strong>Payment Mode:</strong> {order?.paymentMode || "N/A"}
            </p>
            <p>
              <strong>Payment:</strong>{" "}
              {order?.transactionId ? "Paid" : "Pending"}
            </p>
          </div>
        </details>

        {/* Problem */}
        <details>
          <summary className="font-medium">Your Problem</summary>
          <textarea
            readOnly
            value={order?.painNotes || ""}
            className="w-full mt-2 p-2 border rounded bg-gray-100 text-sm"
            rows={3}
          />
        </details>

        {/* Prescription */}
        <details>
          <summary className="font-medium">Physio Prescription</summary>
          <textarea
            readOnly
            value={order?.prescriptionNotes || ""}
            className="w-full mt-2 p-2 border rounded bg-gray-100 text-sm"
            rows={3}
          />
        </details>

        {/* Address */}
        <details>
          <summary className="font-medium">Address</summary>
          <textarea
            readOnly
            value={order?.appointmentAddress || ""}
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

        <button
          className="w-full bg-green text-white font-semibold py-2 rounded-lg mt-2"
          disabled={!order?.appointmentCompleted}
          onClick={handleInvoiceDownload}
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default ViewConsultation;
