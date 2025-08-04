import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTreatmentById } from "../../../api/homecare/physio";

export default function TreatmentDetailPage() {
  const { id } = useParams(); // 🔑 id from `/homecare/physio-treatment/:id`
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await getTreatmentById(id);
        setTreatment(data);
      } catch (error) {
        console.error("Error fetching treatment by ID:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  if (!treatment) {
    return (
      <div className="text-center mt-10 text-red-500">No treatment found.</div>
    );
  }

  // You can destructure real API data here:
  const {
    patientName = "Patient",
    address = "N/A",
    distance = "5 Km",
    treatmentPlan = "5 Days Plan",
    treatmentType = "Home Care",
    startDate = "07 Feb",
    endDate = "12 Feb",
    treatmentAmount = 450,
    prescription = "Not Provided",
    paymentStatus = ["Paid", "Paid", "Paid", "Paid", "Paid"],
  } = treatment;

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-[#f8f9fa] pb-28">
      {/* Patient Header Card */}
      <div className="flex items-center gap-3 bg-white rounded-xl shadow border border-gray-100 px-4 py-4 mt-4 mx-3">
        <img
          src="https://randomuser.me/api/portraits/men/1.jpg"
          alt={patientName}
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div className="flex-1">
          <div className="font-semibold text-base">{patientName}</div>
          <div className="text-xs text-gray-500">Treatment</div>
          <div className="flex text-xs text-gray-500 mt-1 gap-1">
            <span>{startDate}</span>
            <span>-</span>
            <span>{endDate}</span>
          </div>
        </div>
        <button className="px-3 py-1 rounded border text-green border-green bg-green/10 text-xs font-semibold">
          Reschedule
        </button>
      </div>

      {/* Address and Locate */}
      <div className="flex items-center bg-white mt-4 mx-3 px-4 py-3 rounded-xl border border-gray-100 shadow">
        <span className="inline-block w-3 h-3 mr-2 rounded-full bg-green/60" />
        <div className="flex-1 text-xs text-gray-700 font-medium leading-snug">
          {address}
        </div>
        <span className="text-[11px] font-semibold text-gray-400 mr-3">
          {distance}
        </span>
        <button className="text-xs bg-green text-white px-4 py-1 rounded font-semibold ml-1">
          Locate
        </button>
      </div>

      {/* Physio Prescription */}
      <div className="bg-white mt-4 mx-3 px-4 py-3 rounded-xl border border-gray-100 shadow">
        <div className="font-semibold text-base mb-2">Physio Prescription</div>
        <div className="text-[13px] text-gray-700">{prescription}</div>
      </div>

      {/* Treatment Report */}
      <div className="bg-white mt-4 mx-3 px-4 py-3 rounded-xl border border-gray-100 shadow">
        <div className="font-semibold text-base mb-2">Treatment Report</div>
        <div className="text-xs text-gray-700 grid grid-cols-2 gap-y-2">
          <span className="font-medium">Treatment Days:</span>
          <span>{treatmentPlan}</span>
          <span className="font-medium">Treatment Type:</span>
          <span>{treatmentType}</span>
          <span className="font-medium">Treatment Duration:</span>
          <span>
            {startDate} - {endDate}
          </span>
          <span className="font-medium">Treatment Amount:</span>
          <span>₹ {treatmentAmount}</span>
        </div>
      </div>

      {/* Payment Overview */}
      <div className="bg-white mt-4 mx-3 px-4 py-3 rounded-xl border border-gray-100 shadow">
        <div className="font-semibold text-base mb-2">Payment Overview</div>
        <div className="flex flex-col gap-2">
          {paymentStatus.map((status, i) => (
            <div key={i} className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{`Day ${
                paymentStatus.length - i
              }`}</span>
              <span className="text-green font-medium">{status}</span>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full max-w-md mx-auto bg-green text-white rounded-lg py-3 font-semibold text-base shadow-lg">
          Confirm Payment
        </button>
      </div>
    </div>
  );
}
