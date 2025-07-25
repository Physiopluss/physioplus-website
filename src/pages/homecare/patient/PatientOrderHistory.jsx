import React from "react";
import { ArrowRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientOrderHistory = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen p-5 bg-gradient-to-b from-[#0cb46f] via-[#1aa376] to-[#0b7bb5] text-white">
      {/* Heading */}
      <div className="space-y-2 my-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold">My Appointments</h1>
        <button className="flex items-center gap-2 text-sm px-4 py-1 rounded-full bg-black/40 w-fit">
          <Star size={16} className="text-yellow-400" />
          Choose your healthcare journey
        </button>
      </div>

      {/* Card Container */}
      <div className="space-y-10 my-20 flex flex-col items-center justify-center">
        {/* Consultation Card */}
        <div
          onClick={() => handleNavigate("/homecare/consultation-orders")}
          className="cursor-pointer w-full md:w-[50%] md:h-36 flex items-center justify-between p-8 md:p-16 rounded-2xl bg-gradient-to-r from-[#00eab0] to-[#1ba8e2] shadow-md"
        >
          <div>
            <p className="font-bold text-lg md:text-2xl">Consultation</p>
            <p className="text-sm md:text-lg text-white">
              Expert medical consultation
            </p>
          </div>
          <button
            className="p-2 bg-white/20 rounded-full"
            onClick={(e) => {
              e.stopPropagation(); // Prevent bubbling to parent
              handleNavigate("/homecare/consultation-orders");
            }}
          >
            <ArrowRight className="text-white" size={20} />
          </button>
        </div>

        {/* Treatment Card */}
        <div
          onClick={() => handleNavigate("/homecare/treatment-orders")}
          className="cursor-pointer flex w-full md:w-[50%] md:h-36 items-center justify-between p-8 md:p-16 rounded-2xl bg-gradient-to-r from-[#1ba8e2] to-[#00eab0] shadow-md"
        >
          <div>
            <p className="font-bold text-lg md:text-2xl">Treatment</p>
            <p className="text-sm text-white md:text-lg">
              Advanced treatment plans
            </p>
          </div>
          <button
            className="p-2 bg-white/20 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              handleNavigate("/homecare/treatment-orders");
            }}
          >
            <ArrowRight className="text-white" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientOrderHistory;
