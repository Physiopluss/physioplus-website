// AppointmentCard.jsx
import React from "react";
import { CalendarDays, Clock } from "lucide-react";

export default function AppointmentCard({
  patientName,
  type,
  date,
  time,
  mode,
  avatar,
  onStart,
}) {
  return (
    <div className="bg-white border border-green/10 rounded-xl p-3 shadow-sm flex flex-col gap-3 items-center">
      {/* Avatar */}
      <img
        src={avatar}
        alt={patientName}
        className="w-12 h-12 rounded-full object-cover border"
      />

      {/* Info */}
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">{patientName}</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full text-green bg-green/10 border border-green font-semibold">
            {mode}
          </span>
        </div>
        <p className="text-xs text-gray-600">{type}</p>
        <div className="flex gap-4 text-xs text-gray-600 mt-1">
          <div className="flex items-center gap-1">
            <CalendarDays className="w-4 h-4" />
            {date}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {time}
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStart}
        className="bg-green text-white text-xs px-4 py-1.5 rounded-md font-semibold w-full mt-2"
      >
        Start
      </button>
    </div>
  );
}
