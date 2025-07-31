// PhysioTabsPage.jsx
import React, { useState } from "react";
import AppointmentCard from "../../../components/homecare/comp/AppointmentCard";

// Dummy data for Consultation and Treatment tabs
const CONSULTATIONS = [
  {
    id: 1,
    patientName: "Rohit Sharma",
    type: "Consultation",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    mode: "Home Care",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    patientName: "Rohit Sharma",
    type: "Consultation",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    mode: "Home Care",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 3,
    patientName: "Rohit Sharma",
    type: "Consultation",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    mode: "Home Care",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
];

const TREATMENTS = [
  {
    id: 4,
    patientName: "Rohit Sharma",
    type: "Treatment",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    mode: "Home Care",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 5,
    patientName: "Rohit Sharma",
    type: "Treatment",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    mode: "Home Care",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 6,
    patientName: "Rohit Sharma",
    type: "Treatment",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    mode: "Home Care",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  },
];

export default function PhysioTabsPage() {
  const [activeTab, setActiveTab] = useState("Consultation");

  const tabs = [
    { label: "Consultation", value: "Consultation" },
    { label: "Treatment", value: "Treatment" },
  ];

  // Filter the appointments for the selected tab
  const appointments =
    activeTab === "Consultation" ? CONSULTATIONS : TREATMENTS;

  const handleStart = (appt) => {
    // Logic to start session
    console.log("Start appointment", appt);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f1fcf6] px-4 py-6">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={`py-2 px-4 transition font-semibold text-sm ${
              activeTab === tab.value
                ? "border-b-2 border-green text-green bg-white"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards for Active Tab */}
      <div className="space-y-4">
        {appointments.map((appt) => (
          <AppointmentCard
            key={appt.id}
            {...appt}
            onStart={() => handleStart(appt)}
          />
        ))}
      </div>
    </div>
  );
}
