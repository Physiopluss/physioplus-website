// src/components/homecare/SlotDates.jsx
import React from "react";
import { format, addDays, isToday } from "date-fns";

const getShortDay = (date) => format(date, "EEE"); // e.g., 'Mon'
const getDayNumber = (date) => format(date, "d"); // e.g., '23'

export default function SlotDates({ workingDays = [], selected, onSelect }) {
  const today = new Date();
  const next14Days = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
      {next14Days.map((date, i) => {
        const shortDay = getShortDay(date);
        const isWorking = workingDays.includes(shortDay) && !isToday(date); // 👈 exclude today
        const isSelected =
          selected &&
          format(date, "yyyy-MM-dd") === format(selected, "yyyy-MM-dd");

        return (
          <button
            key={i}
            disabled={!isWorking}
            onClick={() => isWorking && onSelect(date)}
            className={`text-center px-3 py-2 border rounded-lg text-sm min-w-[56px] transition-colors
              ${
                !isWorking
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : isSelected
                  ? "border-green text-green font-semibold bg-green/10"
                  : "border-gray-300 text-gray-600 hover:border-green hover:text-green"
              }`}
          >
            <div>{shortDay}</div>
            <div>{getDayNumber(date)}</div>
          </button>
        );
      })}
    </div>
  );
}
