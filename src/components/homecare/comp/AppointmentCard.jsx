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
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-3 flex gap-3 items-center">
      {/* Avatar */}
      <img
        src={avatar}
        alt={patientName}
        className="w-12 h-12 rounded-full object-cover border"
      />

      {/* Info */}
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">{patientName}</h3>
          <span className="text-[10px] px-2 py-1 rounded-full text-green bg-green/10">
            {mode}
          </span>
        </div>
        <p className="text-xs text-gray-600">{type}</p>
        <div className="flex gap-2 text-xs text-gray-600 mt-1">
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
        className="bg-green text-white text-xs px-4 py-1.5 rounded-md font-medium whitespace-nowrap"
      >
        Start
      </button>
    </div>
  );
}
