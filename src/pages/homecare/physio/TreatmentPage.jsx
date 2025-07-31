import React, { useState } from "react";

const TREATMENTS = [
  {
    id: 1,
    patientName: "Rohit Sharma",
    type: "Treatment",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    mode: "Home Care",
    status: "Ongoing",
  },
  {
    id: 2,
    patientName: "Rohit Sharma",
    type: "Treatment",
    date: "11 Feb, 2025",
    time: "09:30 AM",
    mode: "Clinic Visit",
    status: "Ongoing",
  },
  {
    id: 3,
    patientName: "Rohit Sharma",
    type: "Treatment",
    date: "13 Feb, 2025",
    time: "11:00 AM",
    mode: "Home Care",
    status: "Ongoing",
  },
];

const COMPLETED = [
  {
    id: 4,
    patientName: "Rohit Sharma",
    type: "Treatment",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    status: "Completed",
  },
  {
    id: 5,
    patientName: "Rohit Sharma",
    type: "Treatment",
    date: "14 Feb, 2025",
    time: "10:30 AM",
    status: "Completed",
  },
  {
    id: 6,
    patientName: "Rohit Sharma",
    type: "Treatment",
    date: "16 Feb, 2025",
    time: "12:00 PM",
    status: "Completed",
  },
];

export default function TreatmentPage() {
  const [activeTab, setActiveTab] = useState("Treatment");

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#f8f9fa] pb-4">
      {/* AppBar Title */}
      <div className="flex items-center justify-center h-14 text-base font-semibold border-b border-gray-100 bg-white">
        Treatment
      </div>
      {/* Tabs */}
      <div className="flex w-full bg-white">
        <button
          className={
            "flex-1 text-center py-3 font-semibold border-b-2 " +
            (activeTab === "Treatment"
              ? "text-green border-green"
              : "text-gray-400 border-transparent")
          }
          onClick={() => setActiveTab("Treatment")}
        >
          Treatment
        </button>
        <button
          className={
            "flex-1 text-center py-3 font-semibold border-b-2 " +
            (activeTab === "Completed"
              ? "text-green border-green"
              : "text-gray-400 border-transparent")
          }
          onClick={() => setActiveTab("Completed")}
        >
          Completed
        </button>
      </div>

      {/* Card List */}
      <div className="px-3 py-4 space-y-3">
        {activeTab === "Treatment"
          ? TREATMENTS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow border border-green/10 px-3 py-3 flex flex-col mb-1"
              >
                <div className="flex items-center">
                  <img
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt={item.patientName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                  />
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="font-medium text-[15px] truncate">
                      {item.patientName}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate">
                      {item.type}
                    </div>
                    <div className="text-[11px] text-gray-400 leading-snug mt-0.5 truncate">
                      {item.date} &nbsp;|&nbsp; {item.time}
                    </div>
                  </div>
                  <span className="ml-2 px-2 py-1 rounded-full text-xs font-bold text-green bg-green/10 border border-green">
                    {item.mode}
                  </span>
                </div>
                <button className="mt-3 bg-green text-white w-full py-2 rounded-md text-sm font-semibold shadow hover:bg-green-600 transition">
                  Start
                </button>
              </div>
            ))
          : COMPLETED.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow border border-green/10 px-3 py-3 flex flex-col mb-1"
              >
                <div className="flex items-center">
                  <img
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt={item.patientName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-100"
                  />
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="font-medium text-[15px] truncate">
                      {item.patientName}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate font-normal">
                      {item.type}
                    </div>
                    <div className="text-[11px] text-gray-400 leading-snug mt-0.5 truncate font-normal">
                      {item.date} &nbsp;|&nbsp; {item.time}
                    </div>
                  </div>
                  <span className="ml-2 px-2 py-1 rounded-full text-xs font-bold text-green bg-green/10 border border-green">
                    Completed
                  </span>
                </div>
                <button className="mt-3 bg-green text-white w-full py-2 rounded-md text-sm font-semibold shadow hover:bg-green-600 transition">
                  Invoice
                </button>
              </div>
            ))}
      </div>
    </div>
  );
}
