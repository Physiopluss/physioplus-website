import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function BookingSummaryPage() {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const physio = {
    name: "Dr. Shubham Gupta",
    image: "/path-to-image.jpg", // Replace with actual image
    serviceType: "Clinic Visit",
    date: "24 July 2025",
    cashPrice: 700,
    onlinePrice: 350,
    patientName: "Dev Singh",
  };

  const handlePay = () => {
    // Simulate payment/booking logic
    setTimeout(() => {
      setShowConfirmation(true);
    }, 1000);
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <CheckCircle className="text-green-700 w-16 h-16 mb-4" />
        <h2 className="text-lg font-semibold mb-2">Appointment Confirmed</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          You booked an appointment with <br />
          <strong>{physio?.fullName}</strong> on <strong>February 21</strong>,
          at <strong>4:00 PM</strong>
        </p>
        <button
          className="w-full max-w-xs bg-green text-white py-3 rounded-xl text-sm font-medium"
          onClick={() => navigate("/")}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen p-4 bg-white">
      {/* Top */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-green-700" />
        </button>
        <h2 className="ml-auto mr-auto text-sm font-medium text-green">
          Summary
        </h2>
      </div>

      {/* Profile */}
      <div className="bg-[#f1fff4] rounded-xl p-4 mb-6 text-center">
        <img
          src={physio?.profileImage}
          alt={physio?.fullName}
          className="w-20 h-20 rounded-full mx-auto mb-2"
        />
        <h3 className="text-md font-semibold">{physio?.fullName}</h3>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-green-700">Service Type</span>
          <span>{physio?.serviceType}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-green-700">Date</span>
          <span>{physio?.selectedDate}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-2 text-green">
          Payment Method
        </h4>
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
              />
              Cash
            </div>
            ₹{physio?.cashPrice}.00
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
              />
              Online
            </div>
            ₹{physio?.onlinePrice}.00
          </label>
        </div>
      </div>

      {/* Booking For */}
      <div className="mb-4 border p-4 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2 items-center">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="patient"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium">{physio?.patientName}</span>
          </div>
          <button className="text-green text-xs">Edit</button>
        </div>
        <div className="text-sm text-gray-700">
          {paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}: ₹
          {paymentMethod === "cash"
            ? physio?.cashPrice
            : paymentMethod === "online"
            ? physio?.onlinePrice
            : 0}
          .00
        </div>
      </div>

      {/* CTA */}
      <button
        disabled={!paymentMethod}
        className={`mt-2 w-full ${
          paymentMethod
            ? "bg-green hover:bg-[#15692c]"
            : "bg-gray-300 cursor-not-allowed"
        } text-white py-3 rounded-xl text-sm font-medium`}
        onClick={handlePay}
      >
        Continue to Pay
      </button>
    </div>
  );
}
