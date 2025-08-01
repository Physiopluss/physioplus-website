import React from "react";
import { ArrowRight, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PhysioOrderHistory = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen p-5 bg-gradient-to-b from-[#0cb46f] via-[#1aa376] to-[#0b7bb5] text-white">
      {/* Heading */}
      <div className="space-y-2 my-8 flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold">My Patient Records</h1>
        <p className="text-sm text-white/80">
          View all your consultations and treatment sessions
        </p>
      </div>

      {/* Cards */}
      <div className="space-y-10 my-16 flex flex-col items-center justify-center w-full">
        {/* Consultations */}
        <button
          onClick={() => handleNavigate("/homecare/physio-consultations")}
          className="group cursor-pointer w-full md:w-[60%] flex items-center justify-between p-6 md:p-10 rounded-2xl bg-gradient-to-r from-[#00eab0] to-[#1ba8e2] shadow-xl hover:brightness-105 transition"
        >
          <div>
            <p className="font-bold text-xl md:text-2xl">Consultations</p>
            <p className="text-sm md:text-lg text-white/90 mt-1">
              View all your consultation sessions
            </p>
          </div>
          <ArrowRight
            className="text-white group-hover:translate-x-1 transition"
            size={24}
          />
        </button>

        {/* Treatments */}
        <button
          onClick={() => handleNavigate("/homecare/physio-treatments")}
          className="group cursor-pointer w-full md:w-[60%] flex items-center justify-between p-6 md:p-10 rounded-2xl bg-gradient-to-r from-[#1ba8e2] to-[#00eab0] shadow-xl hover:brightness-105 transition"
        >
          <div>
            <p className="font-bold text-xl md:text-2xl">Treatments</p>
            <p className="text-sm md:text-lg text-white/90 mt-1">
              Manage your multi-day treatment plans
            </p>
          </div>
          <ArrowRight
            className="text-white group-hover:translate-x-1 transition"
            size={24}
          />
        </button>
      </div>
    </div>
  );
};

export default PhysioOrderHistory;
