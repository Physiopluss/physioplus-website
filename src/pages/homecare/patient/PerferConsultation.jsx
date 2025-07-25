import React, { useState } from "react";

const PerferConsultation = () => {
  // Toggle between "pending" and "completed" to demo both UI states
  const [status, setStatus] = useState("pending");

  // Demo/mock consultation data
  const consultation = {
    doctor: {
      name: "Dr. Shubham Gupta",
      tags: ["Pediatric Physiotherapy", "Women Physiotherapy"],
      languages: ["Hindi", "English"],
      experience: "11+ Years",
    },
    patient: {
      name: "Rohit Sharma",
      date: "10 Feb, 2025",
    },
    otp: "7689",
    discount: 70,
  };

  return (
    <div className="bg-white w-full max-w-md mx-auto my-8 rounded-md shadow p-4 space-y-4">
      {/* Doctor Info */}
      <div className="flex flex-col items-center py-3">
        {/* Profile image placeholder for doctor */}
        <div className="w-[70px] h-[70px] rounded-full bg-gray-200 mb-2 flex items-center justify-center">
          <span className="text-2xl text-gray-400">
            <svg height="36" width="36" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="8" r="4" />
              <path d="M12 14c-8 0-8 5-8 5v3h16v-3s0-5-8-5z" />
            </svg>
          </span>
        </div>
        <div className="font-semibold text-center">
          {consultation.doctor.name}
        </div>
        <div className="flex flex-wrap gap-1 justify-center mt-1 mb-1">
          {consultation.doctor.tags.map((tag) => (
            <span
              key={tag}
              className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-5 items-center text-xs text-gray-500 font-medium mb-1">
          <span>Speak: {consultation.doctor.languages.join(", ")}</span>
          <span>{consultation.doctor.experience} Experiences</span>
        </div>
        <div className="flex items-center justify-center text-xs text-gray-500 font-medium">
          <span className="cursor-pointer underline">Chat</span>
          <span className="mx-2">|</span>
          <span>Tap to chat</span>
        </div>
      </div>

      {/* Main Card: Pending OR Completed */}
      {status === "pending" ? (
        <>
          {/* OTP Section */}
          <div className="bg-gradient-to-r from-green-400 to-green-700 rounded-md p-4 text-white">
            <div className="font-semibold mb-1">Home Visit</div>
            <div className="text-xs mb-2">
              Secure Your Session with OTP Verification
            </div>
            <ul className="text-xs space-y-1 mb-3 list-none">
              <li>✔️ Share the OTP below with your Physio</li>
              <li>✔️ To ensure a secure & seamless experience</li>
            </ul>
            <div className="text-xs mb-1">
              PIN shared with Physio to confirm consultation.
            </div>
            <div className="flex gap-1 text-2xl font-bold tracking-widest justify-center">
              {consultation.otp.split("").map((digit, idx) => (
                <span
                  key={idx}
                  className="bg-white text-green-700 rounded px-3 py-1"
                >
                  {digit}
                </span>
              ))}
            </div>
          </div>
          {/* Home Visit Status Row */}
          <div className="bg-gray-50 p-3 rounded-md flex justify-between items-center border mt-3">
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Home Visit</div>
              <div className="font-medium text-sm">
                {consultation.patient.name}
              </div>
              <div className="text-xs text-gray-500">
                {consultation.patient.date}
              </div>
            </div>
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded font-semibold">
              Pending
            </span>
          </div>
          {/* Action Buttons */}
          <div className="flex mt-5 gap-3">
            <button className="flex-1 py-2 rounded text-green-700 border border-green-600 font-medium">
              Support
            </button>
            <button className="flex-1 py-2 rounded bg-green-600 text-white font-medium">
              View
            </button>
          </div>
          {/* Toggle for demo/testing */}
          <button
            className="block mx-auto text-xs underline mt-4"
            onClick={() => setStatus("completed")}
          >
            Mark as Completed (Demo)
          </button>
        </>
      ) : (
        <>
          {/* Completed: Discount and Review */}
          <div className="bg-gradient-to-r from-green-400 to-green-700 rounded-md p-4 text-white">
            <div className="font-semibold mb-1">Want to save more?</div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-extrabold">
                {consultation.discount}% Off
              </div>
              <button className="bg-white text-green-700 rounded px-3 py-1 text-xs font-semibold shadow border">
                Ask your Physio to Schedule
              </button>
            </div>
          </div>
          {/* Home Visit Completed Row */}
          <div className="bg-gray-50 p-3 rounded-md flex justify-between items-center border mt-3">
            <div>
              <div className="text-xs text-gray-500 mb-0.5">Home Visit</div>
              <div className="font-medium text-sm">
                {consultation.patient.name}
              </div>
              <div className="text-xs text-gray-500">
                {consultation.patient.date}
              </div>
            </div>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded font-semibold">
              Completed
            </span>
          </div>
          {/* Action Buttons */}
          <div className="flex mt-5 gap-3">
            <button className="flex-1 py-2 rounded bg-yellow-50 text-yellow-900 border font-medium">
              Review
            </button>
            <button className="flex-1 py-2 rounded bg-green-600 text-white font-medium">
              View
            </button>
          </div>
          {/* Toggle for demo/testing */}
          <button
            className="block mx-auto text-xs underline mt-4"
            onClick={() => setStatus("pending")}
          >
            Mark as Pending (Demo)
          </button>
        </>
      )}
    </div>
  );
};

export default PerferConsultation;
