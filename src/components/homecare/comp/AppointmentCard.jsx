import React, { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { getAllPhysioConsultations } from "../../../api/homecare/physio"; // ✅ Make sure this path is correct

export default function PhysioHomeScreen() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const physioId = JSON.parse(localStorage.getItem("homecareUser"))?.userId;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAllPhysioConsultations({ physioId });
        setAppointments(data || []);
      } catch (error) {
        console.error("Error fetching consultations", error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    if (physioId) fetchAppointments();
  }, [physioId]);

  const handleStart = (appt) => {
    console.log("Start appointment:", appt);
    // navigation logic here
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white px-4 py-6 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-md border border-green/10">
        <div className="text-xs text-gray-800 font-medium mb-0.5">Homecare</div>
        <div className="text-[11px] text-gray-500 leading-tight">
          Plot No 10, Near Shyam Nagar,
          <br />
          Jaipur Rajasthan 302020
        </div>
      </div>

      {/* Appointments Section */}
      <div>
        <div className="flex justify-between items-center my-4">
          <h2 className="text-sm font-semibold text-green">
            Upcoming Consultation
          </h2>
          <div className="text-white bg-green w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold">
            {appointments.length}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 text-sm">Loading...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center text-gray-400 text-sm">
            No upcoming appointments
          </div>
        ) : (
          appointments.map((appt) => (
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
                      {appt?.mode || "Visit"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{appt?.type}</p>
                  <div className="flex gap-4 text-xs text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(appt?.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {appt?.time || "—"}
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
    </div>
  );
}
