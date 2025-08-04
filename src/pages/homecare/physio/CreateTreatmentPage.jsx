import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiCalendar } from "react-icons/fi";
import { CalendarDays } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import toast from "react-hot-toast";
import {
  createTreatmentPlan,
  getConsultationById,
} from "../../../api/homecare/physio";

export default function CreateTreatmentPage() {
  const { id: appointmentId } = useParams();
  const navigate = useNavigate();
  const datePickerRef = useRef();

  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState(null);
  const [fees, setFees] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);

  // Generate time slots like 08:00 AM, 08:30 AM, ...
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

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getConsultationById(appointmentId);
        setPatient(data);
      } catch (err) {
        console.error("Error fetching consultation:", err);
      }
    };
    if (appointmentId) fetchDetails();
  }, [appointmentId]);

  const handleCreate = async () => {
    if (
      selectedDates.length === 0 ||
      !fees ||
      !fromTime.trim() ||
      !toTime.trim()
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await createTreatmentPlan({
        appointmentId,
        date: selectedDates.map((d) => d.format("YYYY-MM-DD")),
        startTime: fromTime,
        endTime: toTime,
        treatmentAmount: fees,
      });
      setSuccess(true);
    } catch (error) {
      toast.error("Failed to create treatment plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white pb-8 flex flex-col">
      {/* Header */}
      <div className="h-14 flex items-center justify-center text-base font-semibold border-b border-gray-100 bg-white">
        Patient Details
      </div>

      {/* Patient Card */}
      <div className="bg-white rounded-xl shadow border border-gray-100 flex items-center gap-3 px-4 py-4 mt-4 mx-3">
        <img
          src={patient?.patientId?.profilePhoto || "/homecare/user.png"}
          alt={patient?.patientId?.fullName}
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div>
          <div className="font-semibold text-base">
            {patient?.patientId?.fullName}
          </div>
          <div className="text-xs text-gray-600">Consultation</div>
          <div className="flex gap-4 mt-1 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              {new Date(patient?.date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow border border-green/10 px-4 py-5 mx-3 mt-5">
        <div className="text-[15px] font-semibold text-green mb-3">
          Create Treatment
        </div>

        {/* Date Picker */}
        <div className="mb-3">
          <label className="text-xs text-gray-600 font-medium mb-1 block">
            Select Treatment Days
          </label>
          <div className="relative inline-flex items-center">
            <button
              type="button"
              onClick={() => datePickerRef.current.openCalendar()}
              className="p-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100"
            >
              <FiCalendar size={20} />
            </button>

            <DatePicker
              ref={datePickerRef}
              multiple
              value={selectedDates}
              onChange={setSelectedDates}
              format="DD MMM YYYY"
              onlyCalendar
              portal
              inputClass="hidden"
              mapDays={({ date, selectedDates = [] }) => {
                const isSelected = selectedDates.some(
                  (d) => d.format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
                );
                return {
                  style: isSelected
                    ? {
                        backgroundColor: "#22c55e",
                        color: "white",
                        borderRadius: "8px",
                      }
                    : {},
                };
              }}
            />
          </div>

          {selectedDates?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedDates.map((date, idx) => (
                <span
                  key={idx}
                  className="bg-green/10 text-green text-xs px-2 py-1 rounded-md"
                >
                  {date.format("DD MMM YYYY")}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Time Selectors */}
        <div className="flex gap-3 mb-3">
          <div className="w-1/2">
            <label className="text-xs text-gray-600 font-medium mb-1 block">
              From Time
            </label>
            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-green"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
            >
              <option value="">Select</option>
              {generateTimeSlots().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
          <div className="w-1/2">
            <label className="text-xs text-gray-600 font-medium mb-1 block">
              To Time
            </label>
            <select
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:border-green"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
            >
              <option value="">Select</option>
              {generateTimeSlots().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fees Input */}
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
              placeholder="Enter fees"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        className="w-full max-w-md mx-auto bg-green text-white rounded-t-lg py-3 font-semibold text-base shadow-lg mt-4"
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Treatment"}
      </button>

      {/* Success Modal */}
      {success && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-50"
            onClick={() => setSuccess(false)}
          />
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
                onClick={() => navigate("/homecare/physio-treatments")}
              >
                Go to Treatments
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
