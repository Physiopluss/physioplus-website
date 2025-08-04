import React, { useState, useRef } from "react";
import { ChevronDown, X, CheckCircle2 } from "lucide-react";

export default function ConsultationSessionPage() {
  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-white relative pb-24">
      {/* App Bar */}
      <div className="flex items-center justify-center h-14 text-base font-semibold border-b border-gray-100 bg-white">
        Patient Details
      </div>
      {/* Patient Card */}
      <div className="flex items-center gap-3 bg-white px-4 py-5">
        <img
          src="https://randomuser.me/api/portraits/men/1.jpg"
          alt="Rohit Sharma"
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div>
          <div className="font-semibold text-base">Rohit Sharma</div>
          <div className="text-xs text-gray-500">Consultation</div>
        </div>
      </div>
      {/* Prescription Card */}
      <div className="px-3">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mt-2">
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="font-semibold text-base">Physio Prescription</div>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </div>
          <div className="px-4 pb-4 pt-2">
            <textarea
              className="w-full bg-gray-50 min-h-[80px] text-sm rounded-lg border-none outline-none p-3 placeholder:text-gray-400"
              placeholder="Physio prescription describe or mention by physios"
              defaultValue=""
              spellCheck={false}
            />
          </div>
        </div>

        {/* Button to show OTP Modal */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full max-w-md mx-auto bg-green text-white font-semibold text-base rounded-lg shadow-lg py-3 mt-4"
          style={{ zIndex: 50 }}
        >
          Complete Consultation
        </button>
      </div>
    </div>
  );
}
