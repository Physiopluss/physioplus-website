import React, { useState } from "react";

const CONSULTATIONS = [
  {
    id: 1,
    patientName: "Rohit Sharma",
    type: "Consultation",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    status: "Ongoing",
  },
  {
    id: 2,
    patientName: "Rohit Sharma",
    type: "Consultation",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    status: "Ongoing",
  },
  {
    id: 3,
    patientName: "Rohit Sharma",
    type: "Consultation",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    status: "Ongoing",
  },
];

const COMPLETED = [
  {
    id: 4,
    patientName: "Rohit Sharma",
    type: "Consultation",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    mode: "Home Visit",
    status: "Completed",
  },
  {
    id: 5,
    patientName: "Rohit Sharma",
    type: "Consultation",
    date: "11 Feb, 2025",
    time: "10:00 AM",
    mode: "Home Visit",
    status: "Completed",
  },
  {
    id: 6,
    patientName: "Rohit Sharma",
    type: "Consultation",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    mode: "Clinic Visit",
    status: "Completed",
  },
];

export default function ConsultationPage() {
  const [activeTab, setActiveTab] = useState("Consultation");

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#f8f9fa] relative pb-28">
      {/* AppBar Title */}
      <div className="flex items-center justify-center h-14 text-base font-semibold border-b border-gray-100 bg-white">
        Consultation
      </div>

      {/* Tabs */}
      <div className="flex w-full mt-1 bg-white">
        <button
          className={`flex-1 text-center py-3 font-semibold border-b-2 transition ${
            activeTab === "Consultation"
              ? "text-green border-green bg-white"
              : "text-gray-400 border-transparent"
          }`}
          onClick={() => setActiveTab("Consultation")}
        >
          Consultation
        </button>
        <button
          className={`flex-1 text-center py-3 font-semibold border-b-2 transition ${
            activeTab === "Completed"
              ? "text-green border-green bg-white"
              : "text-gray-400 border-transparent"
          }`}
          onClick={() => setActiveTab("Completed")}
        >
          Completed
        </button>
      </div>

      {/* Tab Content */}
      <div className="px-3 py-3 space-y-5">
        {activeTab === "Consultation"
          ? CONSULTATIONS.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow border border-gray-100 px-4 py-5 flex flex-col"
              >
                <div className="flex items-center">
                  <img
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt={item.patientName}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  <div className="ml-4 flex-1">
                    <div className="font-medium text-base">
                      {item.patientName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.type} &nbsp;|&nbsp; {item.date} &nbsp;|&nbsp;{" "}
                      {item.time}
                    </div>
                  </div>
                  <span className="ml-2 px-3 py-[2px] rounded-full text-[11px] font-semibold text-green bg-green/10 border border-green shadow-sm">
                    Ongoing
                  </span>
                </div>
                <button className="mt-5 bg-green text-white w-full py-2.5 rounded-xl text-sm font-semibold shadow hover:bg-green/90 transition">
                  Start
                </button>
              </div>
            ))
          : COMPLETED.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow border border-gray-100 px-4 py-5 flex flex-col"
              >
                <div className="flex items-center">
                  <img
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt={item.patientName}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  <div className="ml-4 flex-1">
                    <div className="font-medium text-base">
                      {item.patientName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {item.type} &nbsp;|&nbsp; {item.date} &nbsp;|&nbsp;{" "}
                      {item.time}
                    </div>
                  </div>
                  <div className="ml-2 flex flex-col items-end gap-1">
                    <span className="px-2.5 py-[2px] mb-1 inline-block rounded-full text-[11px] font-medium text-green bg-green/10 border border-green whitespace-nowrap">
                      {item.mode}
                    </span>
                    <span className="px-2.5 py-[2px] inline-block rounded-full text-[11px] font-medium text-gray-600 bg-gray-50 border border-gray-300 whitespace-nowrap">
                      Completed
                    </span>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex gap-2 mt-5">
                  <button className="flex-1 border border-green text-green py-2 rounded-xl text-sm font-semibold shadow-sm">
                    Invoice
                  </button>
                  <button className="flex-1 bg-green text-white py-2 rounded-xl text-sm font-semibold shadow hover:bg-green/90 transition">
                    Go To Treatment
                  </button>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
