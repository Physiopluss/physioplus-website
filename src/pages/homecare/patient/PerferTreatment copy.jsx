import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";

// --- Main Booking Summary Page ---
export default function BookingSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patient, physio, formData, selectedDate } = location.state || {};

  // Calculate prices dynamically
  const consultationCharges = physio?.home?.charges;
  const onlineDiscount = 0.5; // 50% for online (from image 2)
  const onlineAmount = Math.round(consultationCharges * (1 - onlineDiscount));
  const couponLabel = "Coupon Applied 50% Off";
  const patientName = formData?.name || "Patient Name";

  const appointmentDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : new Date().toLocaleDateString();

  const appointmentTime = selectedDate
    ? new Date(selectedDate).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const [paymentMethod, setPaymentMethod] = useState("");

  const [showConfirmation, setShowConfirmation] = useState(false);

  // Simulate payment
  const handlePay = () => {
    if (!paymentMethod) return alert("Please select a payment method");
    setTimeout(() => setShowConfirmation(true), 700);
  };

  // Confirmation Screen (common for both methods)
  if (showConfirmation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <CheckCircle className="text-green-700 w-16 h-16 mb-4" />
        <h2 className="text-lg font-semibold mb-2">Appointment Confirmed</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          You booked an appointment with <br />
          <strong>{physio?.fullName}</strong>
          <br />
          on <strong>{appointmentDate}</strong> at{" "}
          <strong>{appointmentTime}</strong>
        </p>
        <button
          className="w-full max-w-xs bg-green text-white py-3 rounded-xl text-sm font-medium"
          onClick={() => navigate("/homecare")}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen p-4 bg-white">
      {/* Top Bar */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-green-700" />
        </button>
        <h2 className="ml-auto mr-auto text-sm font-medium text-green">
          Summary
        </h2>
      </div>

      {/* Profile Card */}
      <div className=" rounded-xl p-4 mb-4 text-center shadow border">
        <img
          src={physio?.profileImage ?? "https://via.placeholder.com/80"}
          alt={physio?.fullName ?? "Doctor"}
          className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
        />
        <h3 className="text-md font-semibold mb-2 border-b-2 border-green/50 pb-2">
          {physio?.fullName}
        </h3>

        <div className="flex justify-between text-sm">
          <span className="">Service Type :</span>
          <span>{physio?.serviceType ?? "Consultation"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="">Date :</span>
          <span>{appointmentDate}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-4">
        <div className="space-y-2">
          <label
            className={`flex items-center justify-between px-4 py-3 border rounded-lg text-sm cursor-pointer ${
              paymentMethod === "cash" ? "bg-green/10 border-green" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />{" "}
              Cash
            </div>
            <span className="font-semibold text-gray-700">
              ₹{consultationCharges}
            </span>
          </label>
          <label
            className={`flex items-center justify-between px-4 py-3 border rounded-lg text-sm cursor-pointer ${
              paymentMethod === "online" ? "bg-green/10 border-green" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />{" "}
              Online
            </div>
            <span className="font-semibold text-green-700">
              ₹{onlineAmount}
            </span>
          </label>
        </div>
      </div>

      {/* Breakdown/Details block (match image) */}
      {paymentMethod === "online" && (
        <>
          <div className="flex justify-center bg-green text-xs p-2 my-2 rounded-md font-semibold">
            <span className="bg-white px-2 p-1 rounded text-green">
              ₹ {onlineAmount}
            </span>
            <span className=" px-2 p-1 text-white">Pay Now And Save 50%</span>
          </div>
          <div className="bg-[rgb(245,255,249)] border p-4 rounded-lg mb-3 text-sm space-y-2 shadow">
            <div className="flex items-center justify-between">
              <span>Consultation Charges</span>
              <span>₹{consultationCharges}</span>
            </div>
            <div className="flex items-center justify-between text-green-700">
              <span>{couponLabel}</span>
              <span>-₹{consultationCharges - onlineAmount}</span>
            </div>
            <hr className="my-2" />
            <div className="flex items-center justify-between font-semibold text-base">
              <span>Total Amount</span>
              <span>₹{onlineAmount}</span>
            </div>
          </div>
        </>
      )}
      {paymentMethod === "cash" && (
        <div className="bg-[rgb(245,255,249)] border p-4 rounded-lg mb-3 text-sm space-y-2 shadow">
          <div className="flex items-center justify-between">
            <span>Consultation Charges</span>
            <span>₹{consultationCharges}</span>
          </div>
          <hr className="my-2" />
          <div className="flex items-center justify-between font-semibold text-base">
            <span>Pay in Cash</span>
            <span>₹{consultationCharges}</span>
          </div>
        </div>
      )}

      {/* Patient */}
      <div className="border-gray-100 -mx-4 py-2 px-4 border-t-4">
        <div className="text-sm font-medium">Booking For</div>
        <div className="flex flex-row gap-4 py-2 justify-between">
          <div className="flex flex-row gap-4 items-center justify-start">
            <img
              src={patient?.profilePhoto}
              alt="patient"
              className="w-9 h-9 rounded-full"
            />
            <div>
              <div className="text-sm font-medium">{patientName}</div>
              <div className="text-xs text-gray-700">
                {formData?.gender}
                {formData?.age ? `, ${formData.age} yrs` : ""}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-green hover:underline"
          >
            Edit
          </button>
        </div>

        <hr className="my-2" />
        {/* Continue CTA */}
        {/* Continue Button */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm">
            <span className="block text-gray-600">Pay by {paymentMethod}</span>
            <span className="font-bold">
              ₹{paymentMethod === "online" ? onlineAmount : consultationCharges}
            </span>
          </div>
          <button
            onClick={handlePay}
            disabled={!paymentMethod}
            className={`w-[60%] py-3 rounded-xl text-sm font-medium text-white ${
              paymentMethod ? "bg-green" : "bg-green/50 cursor-not-allowed"
            }`}
          >
            Continue to Pay
          </button>
        </div>
      </div>
    </div>
  );
}
