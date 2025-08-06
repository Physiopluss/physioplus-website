import React from "react";
import { MapPin, Users, ActivitySquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PhysioCard({ physio }) {
  const navigate = useNavigate();
  return (
    <div className=" p-2 rounded-xl shadow flex mb-4 border-green border  bg-[#d9fddd]">
      <div className="flex-1  justify-between">
        <div className="flex items-center mb-2">
          <img
            src={physio?.profileImage}
            alt={physio?.fullName}
            className="w-24 h-24 object-cover rounded-lg border mr-4"
          />
          <div className="flex  text-sm text-semibold gap-2 my-1 flex-col">
            <div className="font-semibold text-md text-green">
              {physio?.fullName}
            </div>
            <div className="flex gap-2 items-center font-semibold">
              <ActivitySquare className="w-4 h-4" /> {physio?.workExperience} +
              years Experience
            </div>
            <div className="flex gap-2 items-center font-semibold">
              <Users className="w-4 h-4" /> {physio?.patientCount} Patient
              Treated
            </div>
            <div className="flex gap-2 items-center font-semibold">
              <MapPin className="w-4 h-4" /> {physio?.travelDistance} Nearby
            </div>
          </div>
        </div>

        <div className="flex  gap-2 mt-1 justify-start flex-wrap">
          {physio?.specialization?.map((spec) => (
            <span
              key={spec}
              className="bg-white text-green font-semibold  px-3 py-1 rounded text-sm border border-green"
            >
              {spec?.name}
            </span>
          ))}
        </div>
        <div className="flex flex-row items-center mt-2">
          <div className="font-medium text-green mr-4">
            <p className="text-sm font-semibold text-black">Consultation Fee</p>
            ₹ {physio?.home?.charges}
          </div>
          <button
            className="w-fit ml-auto px-4 py-2 bg-[#189e3e] text-white rounded-xl text-sm hover:bg-green font-semibold"
            onClick={() =>
              navigate(`/homecare/profile/${physio?._id}`, {
                state: {
                  patientCount: physio?.patientCount,
                },
              })
            }
          >
            Book your Session
          </button>
        </div>
      </div>
    </div>
  );
}
