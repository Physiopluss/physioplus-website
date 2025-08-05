import React, { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import {
  getAllTodayConsultations,
  getPhysioDetails,
} from "../../../api/homecare/physio";
import { useNavigate } from "react-router-dom";

export default function PhysioHomeScreen() {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Consultation");
  const [physio, setPhysio] = useState(null);
  const physioId = JSON.parse(localStorage.getItem("homecareUser"))?.userId;

  useEffect(() => {
    const fetchPhysio = async () => {
      try {
        const data = await getPhysioDetails(physioId);
        setPhysio(data);
      } catch (error) {
        console.error("Error fetching physio details:", error);
      }
    };

    fetchPhysio();
  }, []);
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await getAllTodayConsultations({ physioId });
        setConsultations(data?.appointments || []);
        setTreatments(data?.todayTreatment || []);
      } catch (error) {
        console.error("Error fetching consultations", error);
        setConsultations([]);
        setTreatments([]);
      } finally {
        setLoading(false);
      }
    };

    if (physioId) fetchAppointments();
  }, [physioId]);

  const handleStart = (appt) => {
    if (activeTab === "Consultation") {
      navigate(`/homecare/physio-consultation/${appt._id}`);
    } else {
      navigate(`/homecare/physio-treatment/${appt._id}`);
    }
  };

  const currentData = activeTab === "Consultation" ? consultations : treatments;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white px-4 py-6 space-y-4">
      {/* Header */}
      <div className="bg-[#abf6cb] rounded-2xl  flex items-center justify-between shadow-sm">
        {/* Text */}
        <div className="flex flex-col justify-center flex-1 px-4">
          <div className="text-md font-semibold text-black mb-1">Homecare</div>
          <div className="text-[13px] leading-snug text-gray-800">
            {physio?.city}, {physio?.state}, {physio?.country} -{" "}
            {physio?.zipCode}
          </div>
        </div>

        {/* Image */}
        <img
          src="/homecare/hospital.png"
          alt="Hospital"
          className="w-[50%]  object-contain ml-4 mt-4"
        />
      </div>

      {/* Tabs */}
      <div className="flex mt-6 border-b border-gray-100">
        {["Consultation", "Treatment"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-2 font-semibold border-b-2 transition ${
              activeTab === tab
                ? "text-green border-green"
                : "text-gray-400 border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Appointment Header */}
      <div className="flex justify-between items-center my-4">
        <h2 className="text-sm font-semibold text-green">
          Today’s {activeTab}
        </h2>
        <div className="text-white bg-green w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold">
          {currentData.length}
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="text-center text-gray-400 text-sm">Loading...</div>
      ) : currentData.length === 0 ? (
        <div className="text-center text-gray-400 text-sm">
          No upcoming {activeTab.toLowerCase()}
        </div>
      ) : (
        currentData.map((appt) => (
          <div
            key={appt._id}
            className="bg-white border border-green/10 rounded-xl p-3 shadow-sm flex flex-col gap-3 mb-4"
          >
            <div className="flex flex-row">
              <img
                src={appt?.patientId?.profilePhoto || "/homecare/user.png"}
                alt={appt?.patientId?.fullName}
                className="w-12 h-12 rounded-full object-cover border"
              />
              <div className="flex-1 w-full ml-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">
                    {appt?.patientId?.fullName || "Patient"}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full text-green bg-green/10 border border-green font-semibold">
                    {appt?.mode || "Home Visit"}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{activeTab}</p>
                <div className="flex gap-4 text-xs text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    {new Date(appt?.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleStart(appt)}
              className="bg-green text-white text-xs px-4 py-1.5 rounded-md font-semibold w-full mt-2"
            >
              Start
            </button>
          </div>
        ))
      )}
    </div>
  );
}
