import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPhysioTreatments } from "../../../api/homecare/physio";

export default function TreatmentPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("OnGoing");
  const [ongoingTreatments, setOngoingTreatments] = useState([]);
  const [completedTreatments, setCompletedTreatments] = useState([]);
  const [loading, setLoading] = useState(true);

  const physioId =
    JSON.parse(localStorage.getItem("homecareUser"))?.userId ?? null;

  useEffect(() => {
    if (!physioId) return;

    const fetchTreatments = async () => {
      try {
        setLoading(true);
        const data = await getAllPhysioTreatments(physioId);

        const ongoing = [];
        const completed = [];

        data.forEach((item) => {
          const treatment = {
            id: item._id,
            patientName: item?.patientName || "Patient",
            type: "Treatment",
            date: new Date(item.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            status: item?.isTreatmentScheduled?.isTreatmentCompleted,
          };

          if (treatment.status) {
            completed.push(treatment);
          } else {
            ongoing.push(treatment);
          }
        });

        setOngoingTreatments(ongoing);
        setCompletedTreatments(completed);
      } catch (error) {
        console.error("Error fetching treatments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, [physioId]);

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white pb-4">
      {/* AppBar Title */}
      <div className="flex items-center justify-center h-14 text-base font-semibold border-b border-gray-100 bg-white">
        Treatment
      </div>

      {/* Tabs */}
      <div className="flex w-full bg-white">
        <button
          className={`flex-1 text-center py-3 font-semibold border-b-2 ${
            activeTab === "OnGoing"
              ? "text-green border-green"
              : "text-gray-400 border-transparent"
          }`}
          onClick={() => setActiveTab("OnGoing")}
        >
          OnGoing
        </button>
        <button
          className={`flex-1 text-center py-3 font-semibold border-b-2 ${
            activeTab === "Completed"
              ? "text-green border-green"
              : "text-gray-400 border-transparent"
          }`}
          onClick={() => setActiveTab("Completed")}
        >
          Completed
        </button>
      </div>

      {/* Card List */}
      <div className="px-3 py-4 space-y-3">
        {loading ? (
          <p className="text-center text-gray-400 mt-10">Loading...</p>
        ) : activeTab === "OnGoing" ? (
          ongoingTreatments.length ? (
            ongoingTreatments.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow border border-gray-100 flex flex-col px-4 py-5"
              >
                <div className="border-b flex flex-row justify-between pb-2">
                  <div className="text-sm font-medium text-gray-700">
                    Home Care
                  </div>
                  <span className="px-2.5 py-[2px] mb-1 inline-block rounded-full text-[11px] font-medium text-yellow-700 bg-yellow-50 border border-yellow-400 whitespace-nowrap">
                    OnGoing
                  </span>
                </div>

                <div className="flex items-center pt-4">
                  <img
                    src="https://randomuser.me/api/portraits/men/1.jpg"
                    alt={item.patientName}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  <div className="ml-4 flex-1">
                    <div className="font-medium text-base">
                      {item.patientName}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {item.type}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {item.date}
                    </div>
                  </div>
                </div>

                <button
                  className="mt-3 bg-green text-white w-full py-2 rounded-md text-sm font-semibold shadow hover:bg-green-600 transition"
                  onClick={() =>
                    navigate(`/homecare/physio-treatment/${item.id}`)
                  }
                >
                  Start
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 mt-4">
              No ongoing treatments.
            </p>
          )
        ) : completedTreatments.length ? (
          completedTreatments.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow border border-gray-100 flex flex-col px-4 py-5"
            >
              <div className="border-b flex flex-row justify-between pb-2">
                <div className="text-sm font-medium text-gray-700">
                  Home Care
                </div>
                <span className="px-2.5 py-[2px] mb-1 inline-block rounded-full text-[11px] font-medium text-green bg-green/10 border border-green whitespace-nowrap">
                  Completed
                </span>
              </div>

              <div className="flex items-center pt-4">
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt={item.patientName}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200"
                />
                <div className="ml-4 flex-1">
                  <div className="font-medium text-base">
                    {item.patientName}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{item.type}</div>
                  <div className="text-xs text-gray-600 mt-1">{item.date}</div>
                </div>
              </div>

              <button
                className="mt-3 bg-green text-white w-full py-2 rounded-md text-sm font-semibold shadow hover:bg-green-600 transition"
                // Optional: add invoice navigation here
                onClick={() => {}}
              >
                Invoice
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 mt-4">
            No completed treatments.
          </p>
        )}
      </div>
    </div>
  );
}
