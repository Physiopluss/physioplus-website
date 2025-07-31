import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  MoreVertical,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function ConsultationDetailPage() {
  // Demo patient data
  const patient = {
    name: "Rohit Sharma",
    type: "Consultation",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    gender: "Male",
    age: 20,
    serviceType: "Home Care",
    bookingDate: "20 Jan 2025",
    consultationAmount: "₹500",
    paymentMethod: "Online / Cash",
    problem:
      "I've been experiencing sharp lower back pain that worsens with movement, making it hard to sit, stand, or bend",
    address: "C5, Shanti Nagar, Gujar Ki Thadi Mansarover, 202021",
    distance: "5 Km",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  };

  const [showGeneral, setShowGeneral] = useState(true);
  const [showProblem, setShowProblem] = useState(true);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f1fcf6] px-4 py-6 pb-32">
      {/* Main Card */}
      <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-4 relative">
        {/* Patient Info Row with dot button */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={patient.avatar}
              alt={patient.name}
              className="w-14 h-14 rounded-full object-cover border"
            />
            <div>
              <h3 className="font-semibold text-base">{patient.name}</h3>
              <p className="text-xs text-gray-700">{patient.type}</p>
              <div className="flex gap-4 mt-1 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  {patient.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {patient.time}
                </span>
              </div>
            </div>
          </div>
          {/* Three-dot button */}
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Reschedule Button */}
        <button className="border border-green text-green text-sm rounded-lg px-5 py-1 font-semibold w-full my-2">
          Reschedule
        </button>

        {/* General Details (collapsible) */}
        <div className="bg-gray-50 rounded-lg">
          <button
            className="flex w-full items-center justify-between px-3 py-2 font-semibold text-gray-800"
            onClick={() => setShowGeneral((v) => !v)}
            aria-expanded={showGeneral}
          >
            <span>General Details</span>
            {showGeneral ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {showGeneral && (
            <div className="px-3 pb-3 text-xs text-gray-600 space-y-1">
              <div>
                <span className="font-medium">Booking Date: </span>
                {patient.bookingDate}
              </div>
              <div>
                <span className="font-medium">Service Type: </span>
                {patient.serviceType}
              </div>
              <div>
                <span className="font-medium">Gender: </span>
                {patient.gender}
              </div>
              <div>
                <span className="font-medium">Age: </span>
                {patient.age}
              </div>
              <div>
                <span className="font-medium">Consultation Amount: </span>
                {patient.consultationAmount}
              </div>
              <div>
                <span className="font-medium">Payment Method: </span>
                {patient.paymentMethod}
              </div>
            </div>
          )}
        </div>

        {/* Patient Problem (collapsible) */}
        <div className="bg-gray-50 rounded-lg">
          <button
            className="flex w-full items-center justify-between px-3 py-2 font-semibold text-gray-800"
            onClick={() => setShowProblem((v) => !v)}
            aria-expanded={showProblem}
          >
            <span>Patient Problem</span>
            {showProblem ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {showProblem && (
            <div className="px-3 pb-3">
              <div className="text-xs text-gray-700 mb-2">
                {patient.problem}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-700 gap-2">
          <span>
            {patient.name} ({patient.distance})
            <br />
            {patient.address}
          </span>
          <button className="bg-green text-white text-xs px-3 py-1 rounded font-medium">
            Locate
          </button>
        </div>
        {/* Fixed Bottom Start Consultation Button */}
        <button className="  w-full max-w-md mx-auto bg-green text-white text-base py-3 rounded-lg font-semibold shadow-lg">
          Start Consultation
        </button>
      </div>
    </div>
  );
}
