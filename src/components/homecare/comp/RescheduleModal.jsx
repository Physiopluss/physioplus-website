import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";
import { FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";
import { updateTreatmentPlan } from "../../../api/homecare/physio";

const RescheduleModal = ({
  patient,
  treatmentId,
  onClose,
  onRescheduleSuccess,
}) => {
  const originalDates = patient?.isTreatmentScheduled?.treatmentDate || [];

  const [selectedDateIds, setSelectedDateIds] = useState([]); // existing _ids selected
  const [rescheduleDates, setRescheduleDates] = useState({}); // { _id: new Date }
  const [fromTime, setFromTime] = useState(
    patient?.isTreatmentScheduled?.startTime || ""
  );
  const [toTime, setToTime] = useState(
    patient?.isTreatmentScheduled?.endTime || ""
  );
  const [loading, setLoading] = useState(false);

  const generateTimeSlots = (interval = 30) => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += interval) {
        const hour = h % 12 === 0 ? 12 : h % 12;
        const minute = m < 10 ? `0${m}` : m;
        const ampm = h < 12 ? "AM" : "PM";
        slots.push(`${hour}:${minute} ${ampm}`);
      }
    }
    return slots;
  };

  const toggleDateSelection = (id) => {
    setSelectedDateIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleUpdate = async () => {
    const missingNewDates = selectedDateIds.some((id) => !rescheduleDates[id]);
    if (missingNewDates || !fromTime || !toTime) {
      toast.error("Please select all replacement dates and times.");
      return;
    }

    try {
      setLoading(true);

      // Create [{ id, date }] array
      const entries = selectedDateIds.map((id) => ({
        id,
        date: new Date(rescheduleDates[id]).toISOString().split("T")[0],
      }));

      // Sort by date
      const sortedEntries = entries.sort((a, b) =>
        a.date.localeCompare(b.date)
      );

      // Extract sorted ids and dates
      const dateIds = sortedEntries.map((e) => e.id);
      const dates = sortedEntries.map((e) => e.date);

      await updateTreatmentPlan({
        treatmentId,
        dateIds,
        dates,
        startTime: fromTime,
        endTime: toTime,
      });

      toast.success("Treatment rescheduled successfully!");
      if (onRescheduleSuccess) onRescheduleSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reschedule treatment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 overflow-auto">
      <div className="bg-white w-full h-full p-5 sm:rounded-none sm:max-w-full sm:max-h-full overflow-y-auto">
        <h2 className="text-center font-semibold text-base mb-4">
          Reschedule Treatment Plan
        </h2>

        {/* Step 1: Select Existing Dates to Reschedule */}
        <div className="mb-4">
          <p className="text-sm font-medium mb-2 text-gray-700">
            1️⃣ Select dates to reschedule:
          </p>
          <div className="flex flex-wrap gap-2">
            {originalDates.map((d) => {
              const dateStr = new Date(d.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              const isSelected = selectedDateIds.includes(d._id);

              return (
                <button
                  key={d._id}
                  type="button"
                  onClick={() => toggleDateSelection(d._id)}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    isSelected
                      ? "bg-green text-white border-green"
                      : "bg-white text-gray-600 border-gray-300"
                  }`}
                >
                  {dateStr}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Pick New Dates for Each */}
        {selectedDateIds.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2 text-gray-700">
              2️⃣ Pick new dates:
            </p>
            <div className="flex flex-col gap-3">
              {selectedDateIds.map((id) => {
                const oldDate = originalDates.find((d) => d._id === id)?.date;

                return (
                  <div key={id} className="flex items-center justify-start">
                    <span className="text-xs text-gray-500 w-32">
                      Old:{" "}
                      {new Date(oldDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <DatePicker
                      value={rescheduleDates[id] || ""}
                      onChange={(date) =>
                        setRescheduleDates((prev) => ({
                          ...prev,
                          [id]: date?.toDate?.() || date,
                        }))
                      }
                      format="DD MMM YYYY"
                      className="border border-gray-300 px-2 py-1 text-sm rounded w-40"
                      minDate={new Date()}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Time Selection */}
        <div className="flex gap-3 mb-4">
          <div className="w-1/2">
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              From Time
            </label>
            <select
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm bg-white"
            >
              <option value="">Select</option>
              {generateTimeSlots().map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              To Time
            </label>
            <select
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-2 py-2 text-sm bg-white"
            >
              <option value="">Select</option>
              {generateTimeSlots().map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-4">
          <button
            className="w-1/2 border border-gray-300 rounded py-2 text-sm font-semibold"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="w-1/2 bg-green text-white rounded py-2 text-sm font-semibold disabled:opacity-50"
            disabled={loading}
            onClick={handleUpdate}
          >
            {loading ? "Updating..." : "Reschedule"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleModal;
