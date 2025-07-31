// PhysioHomeScreen.jsx
import React from "react";
import AppointmentCard from "../../../components/homecare/comp/AppointmentCard";

// Use identical image to repeat the look, or keep unique avatars as desired
const FAKE_AVATAR = "https://randomuser.me/api/portraits/men/1.jpg";

const DEMO_APPOINTMENTS = [
  {
    id: 1,
    patientName: "Rohit Sharma",
    type: "Consultation",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    mode: "Home Visit",
    avatar: FAKE_AVATAR,
  },
  {
    id: 2,
    patientName: "Rohit Sharma",
    type: "Consultation",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    mode: "Home Visit",
    avatar: FAKE_AVATAR,
  },
  {
    id: 3,
    patientName: "Rohit Sharma",
    type: "Consultation",
    date: "10 Feb, 2025",
    time: "10:00 AM",
    mode: "Home Visit",
    avatar: FAKE_AVATAR,
  },
];

export default function PhysioHomeScreen() {
  const handleStart = (appt) => {
    console.log("Start appointment:", appt);
    // Navigation logic here
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f1fcf6] px-4 py-6 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-green/10">
        <div className="text-xs text-gray-800 font-medium mb-0.5">Homecare</div>
        <div className="text-[11px] text-gray-500 leading-tight">
          Plot No 10, Near Shyam Nagar,
          <br />
          Jaipur Rajasthan 302020
        </div>
        <div className="flex justify-between items-center mt-4">
          <h2 className="text-sm font-semibold text-green">
            Upcoming Consultation
          </h2>
          <div className="text-white bg-green w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold">
            {DEMO_APPOINTMENTS.length}
          </div>
        </div>
      </div>

      {/* Appointments */}
      {DEMO_APPOINTMENTS.map((appt) => (
        <AppointmentCard
          key={appt.id}
          {...appt}
          onStart={() => handleStart(appt)}
        />
      ))}
    </div>
  );
}
