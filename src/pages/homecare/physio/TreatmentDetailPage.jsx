import React from "react";

export default function TreatmentDetailPage() {
  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#f8f9fa] pb-28">
      {/* Patient Header Card */}
      <div className="flex items-center gap-3 bg-white rounded-xl shadow border border-gray-100 px-4 py-4 mt-4 mx-3">
        <img
          src="https://randomuser.me/api/portraits/men/1.jpg"
          alt="Rohit Sharma"
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div className="flex-1">
          <div className="font-semibold text-base">Rohit Sharma</div>
          <div className="text-xs text-gray-500">Treatment</div>
          <div className="flex text-xs text-gray-500 mt-1 gap-1">
            <span>06 Aug, 2025</span>
            <span>-</span>
            <span>10 Aug, 2025</span>
          </div>
        </div>
        <button className="px-3 py-1 rounded border text-green border-green bg-green/10 text-xs font-semibold">
          Reschedule
        </button>
      </div>

      {/* Address and Locate */}
      <div className="flex items-center bg-white mt-4 mx-3 px-4 py-3 rounded-xl border border-gray-100 shadow">
        <span className="inline-block w-3 h-3 mr-2 rounded-full bg-green/60" />
        <div className="flex-1 text-xs text-gray-700 font-medium leading-snug">
          C5, Shanti Nagar, Gujar Ki <br /> Thadi Mansarover. 202021
        </div>
        <span className="text-[11px] font-semibold text-gray-400 mr-3">
          5 Km
        </span>
        <button className="text-xs bg-green text-white px-4 py-1 rounded font-semibold ml-1">
          Locate
        </button>
      </div>

      {/* Physio Prescription Section */}
      <div className="bg-white mt-4 mx-3 px-4 py-3 rounded-xl border border-gray-100 shadow">
        <div className="font-semibold text-base mb-2">Physio Prescription</div>
        <div className="text-[13px] text-gray-700">
          I've been experiencing sharp lower back pain that worsens with
          movement, making it hard to sit, stand, or bend
        </div>
      </div>

      {/* Treatment Report */}
      <div className="bg-white mt-4 mx-3 px-4 py-3 rounded-xl border border-gray-100 shadow">
        <div className="font-semibold text-base mb-2">Treatment Report</div>
        <div className="text-xs text-gray-700 grid grid-cols-2 gap-y-2">
          <span className="font-medium">Treatment Days:</span>
          <span>5 Days Plan</span>
          <span className="font-medium">Treatment Type:</span>
          <span>Home Care</span>
          <span className="font-medium">Treatment Duration:</span>
          <span>7 Feb - 12 Feb</span>
          <span className="font-medium">Treatment Amount:</span>
          <span>₹ 450</span>
        </div>
      </div>

      {/* Payment Overview */}
      <div className="bg-white mt-4 mx-3 px-4 py-3 rounded-xl border border-gray-100 shadow">
        <div className="font-semibold text-base mb-2">Payment Overview</div>
        <div className="flex flex-col gap-2">
          {["Day 5", "Day 4", "Day 3", "Day 2", "Day 1"].map((day) => (
            <div
              key={day}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-gray-600">{day}</span>
              <span className="text-green font-medium">Paid</span>
            </div>
          ))}
        </div>
        {/* Confirm Payment Button */}
        <button
          className=" mt-4 w-full max-w-md mx-auto bg-green text-white rounded-lg py-3 font-semibold text-base shadow-lg"
          style={{ zIndex: 30 }}
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
}
