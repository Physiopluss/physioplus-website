import React, { useEffect, useState } from "react";
import { getAllPhysioConsultations } from "../../../api/homecare/physio"; // ✅ Adjust path if needed

export default function ConsultationPage() {
  const [activeTab, setActiveTab] = useState("OnGoing");
  const [ongoingData, setOngoingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const physioId =
    JSON.parse(localStorage.getItem("homecareUser"))?.userId ?? null;

  useEffect(() => {
    if (!physioId) return;

    const fetchConsultations = async () => {
      try {
        setLoading(true);
        const data = await getAllPhysioConsultations(physioId);

        const ongoing = [];
        const completed = [];

        console.log(data, "data");
        data.forEach((item) => {
          const itemData = {
            id: item._id,
            patientName: item?.patientName || "Patient",
            type: "Consultation",
            date: new Date(item.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),

            status: item?.appointmentCompleted,
          };

          if (item.appointmentCompleted === true) {
            completed.push(itemData);
          } else {
            ongoing.push(itemData);
          }
        });

        setOngoingData(ongoing);
        setCompletedData(completed);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [physioId]);

  const renderCard = (item, isCompleted) => (
    <div
      key={item.id}
      className="bg-white rounded-2xl shadow border border-gray-100  flex  flex-col px-4 py-5"
    >
      <div className="border-b flex flex-row justify-between  pb-2">
        <div className="text-sm font-medium text-gray-700">Home Care</div>
        <div className="">
          {isCompleted ? (
            <span className="px-2.5 py-[2px] mb-1 inline-block rounded-full text-[11px] font-medium text-green bg-green/10 border border-green whitespace-nowrap">
              {item.status && "Completed"}
            </span>
          ) : (
            <span className="px-2.5 py-[2px] mb-1 inline-block rounded-full text-[11px] font-medium text-yellow-700 bg-yellow-50 border border-yellow-400 whitespace-nowrap">
              {!item.status && "OnGoing"}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center  pt-4">
        <img
          src="https://randomuser.me/api/portraits/men/1.jpg"
          alt={item.patientName}
          className="w-12 h-12 rounded-full object-cover border border-gray-200"
        />
        <div className="ml-4 flex-1">
          <div className="font-medium text-base">{item.patientName}</div>
          <div className="text-xs text-gray-600 mt-1">{item.type}</div>{" "}
          <div className="text-xs text-gray-600 mt-1">{item.date}</div>
        </div>
      </div>

      {/* Action buttons */}
      {isCompleted ? (
        <div className="flex flex-col gap-2 mt-5">
          <button className="flex-1 border border-green text-green py-2 rounded-xl text-sm font-semibold shadow-sm">
            Invoice
          </button>

          {!item?.isTreatmentRequested && (
            <button className="flex-1 bg-green text-white py-2 rounded-xl text-sm font-semibold shadow hover:bg-green/90 transition">
              Create Treatment Plan
            </button>
          )}

          {item?.appointmentStatus === 1 && (
            <button className="flex-1 bg-green text-white py-2 rounded-xl text-sm font-semibold shadow hover:bg-green/90 transition">
              Go To Treatment
            </button>
          )}
        </div>
      ) : (
        <button className="mt-5 bg-green text-white w-full py-2.5 rounded-xl text-sm font-semibold shadow hover:bg-green/90 transition">
          Start
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white relative pb-28">
      {/* AppBar */}
      <div className="flex items-center justify-center h-14 text-base font-semibold border-b border-gray-100 bg-white">
        Consultation
      </div>

      {/* Tabs */}
      <div className="flex w-full mt-1 bg-white">
        <button
          className={`flex-1 text-center py-3 font-semibold border-b-2 transition ${
            activeTab === "OnGoing"
              ? "text-green border-green bg-white"
              : "text-gray-400 border-transparent"
          }`}
          onClick={() => setActiveTab("OnGoing")}
        >
          Ongoing
        </button>
        <button
          className={`flex-1 text-center py-3 font-semibold border-b-2 transition ${
            activeTab === "Completed"
              ? "text-green border-green bg-white"
              : "text-gray-400 border-transparent"
          }`}
          onClick={() => setActiveTab("Completed")}
        >
          Completed
        </button>
      </div>

      {/* Tab Content */}
      <div className="px-3 py-4 space-y-5">
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading...</p>
        ) : activeTab === "OnGoing" ? (
          ongoingData.length > 0 ? (
            ongoingData.map((item) => renderCard(item, false))
          ) : (
            <p className="text-center text-gray-400">
              No ongoing consultations.
            </p>
          )
        ) : completedData.length > 0 ? (
          completedData.map((item) => renderCard(item, true))
        ) : (
          <p className="text-center text-gray-400">
            No completed consultations.
          </p>
        )}
      </div>
    </div>
  );
}
