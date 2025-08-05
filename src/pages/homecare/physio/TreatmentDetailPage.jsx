import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";
import {
  getTreatmentById,
  markTreatmentComplete,
  markTreatmentDaysPaid,
} from "../../../api/homecare/physio";
import toast from "react-hot-toast";
import RescheduleModal from "../../../components/homecare/comp/RescheduleModal";

function formatDateRange(treatmentDates = []) {
  if (!Array.isArray(treatmentDates) || treatmentDates.length === 0)
    return "N/A";

  const dates = treatmentDates.map((d) => new Date(d.date));
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  return `${minDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })} - ${maxDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}`;
}

export default function TreatmentDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPrescription, setShowPrescription] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false); // ⬅️ State for Reschedule Modal
  const [selectedDates, setSelectedDates] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchTreatment();
  }, [id]);

  const fetchTreatment = async () => {
    try {
      const data = await getTreatmentById(id);
      setPatient(data);
    } catch (error) {
      console.error("Error fetching treatment by ID:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentConfirm = async () => {
    try {
      setConfirmLoading(true);
      await markTreatmentDaysPaid(selectedDates, id);
      await fetchTreatment(); // refresh data
      toast.success("Payment update successfully completed!");
      setShowModal(false);
      setSelectedDates([]);
    } catch (err) {
      console.error("Payment update failed:", err);
      toast.error("Failed to update payment. Try again.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const handelComplete = async () => {
    try {
      if (!id) return;
      await markTreatmentComplete(id);
      toast.success("Treatment marked as completed!");
      await fetchTreatment();
    } catch (err) {
      console.error("Failed to complete treatment:", err);
      toast.error("Something went wrong while completing treatment.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-sm text-gray-400">
        Loading treatment details...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center mt-10 text-sm text-red-500">
        No treatment found for ID: {id}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white px-4 py-6 pb-32">
      <div className="font-semibold text-md mb-4 flex justify-center">
        Patient Details
      </div>

      {/* Header */}
      <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={patient?.patientId?.profilePhoto || "/homecare/user.png"}
              alt={patient?.patientId?.fullName}
              className="w-14 h-14 rounded-full object-cover border"
            />
            <div>
              <div className="font-semibold text-base">
                {patient?.patientId?.fullName}
              </div>
              <div className="text-xs text-gray-500">Treatment</div>
              <span className="text-xs text-gray-500">
                {formatDateRange(patient?.isTreatmentScheduled?.treatmentDate)}
              </span>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <button
          onClick={() => setShowRescheduleModal(true)}
          className="border border-green text-green text-sm rounded-lg px-5 py-1 font-semibold w-full"
        >
          Reschedule
        </button>
      </div>

      {/* Address */}
      <div className="bg-gray-50 rounded-lg p-3 mt-3 text-xs text-gray-700">
        <p className="font-semibold text-gray-800 mb-1">
          {patient?.patientId?.fullName || "Patient"}'s Address
        </p>
        <p className="whitespace-pre-wrap leading-snug text-gray-600">
          {patient?.patientId?.appointmentAddress?.replace(/\n?Lat:.*$/i, "") ||
            "Address not available"}
        </p>
        <button
          className="bg-green hover:bg-green/90 mt-2 text-white text-xs px-4 py-1.5 rounded-md font-medium"
          onClick={() => {
            const address = patient?.patientId?.appointmentAddress;
            if (!address) return alert("Address not available");

            const match = address.match(
              /Lat:\s*([-0-9.]+),\s*Lng:\s*([-0-9.]+)/
            );

            const mapsUrl = match
              ? `https://www.google.com/maps?q=${match[1]},${match[2]}`
              : `https://www.google.com/maps?q=${encodeURIComponent(
                  address.replace(/\n?Lat:.*$/i, "")
                )}`;
            window.open(mapsUrl, "_blank");
          }}
        >
          📍 Locate
        </button>
      </div>

      {/* Prescription */}
      <div className="bg-gray-50 rounded-lg mt-3">
        <button
          className="flex w-full items-center justify-between px-3 py-2 font-semibold text-gray-800"
          onClick={() => setShowPrescription(!showPrescription)}
        >
          <span>Physio Prescription</span>
          {showPrescription ? <ChevronUp /> : <ChevronDown />}
        </button>
        {showPrescription && (
          <div className="px-3 pb-3 text-xs text-gray-700">
            {patient?.prescriptionNotes || "No prescription Notes."}
          </div>
        )}
      </div>

      {/* Report */}
      <div className="bg-white mt-4 px-4 py-3 rounded-xl border shadow">
        <div className="font-semibold text-base mb-2">Treatment Report</div>
        <div className="text-xs text-gray-700 flex flex-col gap-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Treatment Days:</span>
            <span>
              {patient?.isTreatmentScheduled?.treatmentDate?.length || 0} Days
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Treatment Type:</span>
            <span>Home Care</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Treatment Duration:</span>
            <span>
              {formatDateRange(patient?.isTreatmentScheduled?.treatmentDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Treatment Amount:</span>
            <span>₹ {patient?.isTreatmentScheduled?.amount || 0}</span>
          </div>
        </div>
      </div>

      {/* Confirm Payment + Complete Button */}
      <div className="bg-white mt-4 px-4 py-3 rounded-xl border shadow">
        <div className="font-semibold text-base mb-2">Payment Overview</div>
        <div className="flex flex-col gap-2">
          {[...(patient?.isTreatmentScheduled?.treatmentDate || [])]
            .slice()
            .reverse()
            .map((day, i, arr) => (
              <div
                key={day._id}
                className="flex justify-between text-sm border-b py-2"
              >
                <div>
                  <span className="block text-gray-600">{`Day ${
                    arr.length - i
                  }`}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(day.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    ({patient?.isTreatmentScheduled?.startTime} -{" "}
                    {patient?.isTreatmentScheduled?.endTime})
                  </span>
                </div>
                <span
                  className={`font-medium ${
                    day.isPaid ? "text-green" : "text-red-500"
                  }`}
                >
                  {day.isPaid ? "Paid" : "Unpaid"}
                </span>
              </div>
            ))}
        </div>

        <button
          className="mt-4 w-full bg-green text-white rounded-lg py-3 font-semibold"
          onClick={() => setShowModal(true)}
        >
          Confirm Payment
        </button>

        {patient?.isTreatmentScheduled?.isTreatmentCompleted ? (
          <button
            disabled
            className="mt-4 w-full bg-white text-green border border-green rounded-lg py-3 font-semibold"
          >
            Already Completed
          </button>
        ) : (
          <button
            className="mt-4 w-full bg-white text-green border border-green rounded-lg py-3 font-semibold"
            onClick={handelComplete}
          >
            Complete
          </button>
        )}
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center px-3">
          <div className="bg-white rounded-xl p-4 w-full max-w-sm shadow-xl relative">
            <h2 className="text-center font-semibold text-base mb-4">
              Select Dates for Cash Payment Collection
            </h2>

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
              {(patient?.isTreatmentScheduled?.treatmentDate || []).map(
                (day, i) => {
                  const isSelected = selectedDates.includes(day._id);
                  const isPaid = day.isPaid;

                  return (
                    <div
                      key={day._id}
                      className={`flex justify-between items-center text-sm px-3 py-2 rounded-md border cursor-pointer ${
                        isPaid
                          ? "bg-green/90 text-white cursor-not-allowed"
                          : isSelected
                          ? "bg-green/90 text-white"
                          : "bg-white"
                      }`}
                      onClick={() => {
                        if (isPaid) return;
                        setSelectedDates((prev) =>
                          prev.includes(day._id)
                            ? prev.filter((id) => id !== day._id)
                            : [...prev, day._id]
                        );
                      }}
                    >
                      <span>Day {i + 1}</span>
                      <span className="font-semibold">
                        ₹ {patient?.isTreatmentScheduled?.amount || 0}{" "}
                        {isPaid
                          ? "Collected"
                          : isSelected
                          ? "Collected"
                          : "Collect"}
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                className="w-1/2 border border-black/20 rounded py-2 font-semibold text-sm"
                onClick={() => {
                  setSelectedDates([]);
                  setShowModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="w-1/2 bg-green text-white rounded py-2 font-semibold text-sm disabled:opacity-50"
                disabled={selectedDates.length === 0 || confirmLoading}
                onClick={handlePaymentConfirm}
              >
                {confirmLoading ? "Updating..." : "Confirm Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <RescheduleModal
          patient={patient}
          treatmentId={id}
          onClose={() => setShowRescheduleModal(false)}
          onRescheduleSuccess={async () => {
            await fetchTreatment();
            setShowRescheduleModal(false);
          }}
        />
      )}
    </div>
  );
}
