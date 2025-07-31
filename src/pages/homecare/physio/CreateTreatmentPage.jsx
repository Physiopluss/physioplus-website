import React, { useState } from "react";

export default function CreateTreatmentPage() {
  const [success, setSuccess] = useState(false);

  // Form values (not functional—add state as desired)
  const [date, setDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [fees, setFees] = useState("");

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f9fbfa] pb-8 flex flex-col">
      {/* App Title */}
      <div className="h-14 flex items-center justify-center text-base font-semibold border-b border-gray-100 bg-white">
        Patient Details
      </div>

      {/* Patient Card */}
      <div className="bg-white rounded-xl shadow border border-gray-100 flex items-center gap-3 px-4 py-4 mt-4 mx-3">
        <img
          src="https://randomuser.me/api/portraits/men/1.jpg"
          alt="Rohit Sharma"
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div>
          <div className="font-semibold text-base">Rohit Sharma</div>
          <div className="text-xs text-gray-500">Consultation</div>
        </div>
      </div>

      {/* Create Treatment Form */}
      <div className="bg-white rounded-xl shadow border border-green/10 px-4 py-5 mx-3 mt-5">
        <div className="text-[15px] font-semibold text-green mb-2">
          Create Treatment
        </div>

        <div className="mb-3">
          <label className="text-xs text-gray-600 font-medium mb-1 block">
            Select Treatment Days
          </label>
          <input
            type="date"
            className="w-full border border-gray-200 rounded-md px-3 py-2 mt-1 text-sm bg-white focus:outline-none focus:border-green"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="text-xs text-gray-600 font-medium mb-1 block">
            Time Slot
          </label>
          <div className="flex gap-2">
            <input
              type="time"
              className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-green"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              placeholder="From"
            />
            <input
              type="time"
              className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-green"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              placeholder="To"
            />
          </div>
        </div>

        <div className="mb-2">
          <label className="text-xs text-gray-600 font-medium mb-1 block">
            Treatment Fees (Per day)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              ₹
            </span>
            <input
              type="number"
              min={0}
              className="w-full border border-gray-200 rounded-md px-8 py-2 text-sm bg-white focus:outline-none focus:border-green"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              placeholder="Enter your Homecare fees"
            />
          </div>
        </div>
      </div>

      {/* Create Treatment Button */}
      <button
        className=" w-full max-w-md mx-auto bg-green text-white rounded-t-lg py-3 font-semibold text-base shadow-lg"
        style={{ zIndex: 30 }}
        onClick={() => setSuccess(true)}
      >
        Create Treatment
      </button>

      {/* Success Modal */}
      {success && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-50"
            onClick={() => setSuccess(false)}
            aria-hidden="true"
          />
          {/* Modal Content */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
            <div className="bg-white rounded-xl shadow-lg px-6 pt-7 pb-5 flex flex-col items-center w-full max-w-xs text-center relative">
              <span className="inline-block bg-green/10 rounded-full p-2 mb-3">
                <svg
                  className="h-8 w-8 text-green"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="12"
                    fill="currentColor"
                    opacity="0.15"
                  />
                  <path
                    d="M7 13l3 3 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <div className="font-semibold text-base mb-1">
                Treatment is Scheduled
              </div>
              <div className="text-xs text-gray-500 mb-4">
                Thank you for scheduling the treatment.
              </div>
              <button
                className="w-full bg-green text-white rounded-md py-2 font-semibold text-sm shadow mt-1"
                onClick={() => setSuccess(false)}
              >
                Go to Treatment
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
