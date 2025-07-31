import React, { useState, useRef } from "react";
import { ChevronDown, X, CheckCircle2 } from "lucide-react";

export default function ConsultationSessionPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  // OTP handlers
  const handleOtpChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 3) otpRefs[idx + 1].current.focus();
  };
  const handleOtpKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs[idx - 1].current.focus();
    }
  };
  const closeModal = () => setModalOpen(false);
  const handleConfirm = () => {
    if (otp.join("").length === 4) {
      setModalOpen(false);
      setSuccessModal(true);
      setOtp(["", "", "", ""]);
    }
  };

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

      {/* OTP Modal */}
      {modalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50"
            onClick={closeModal}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 relative">
              <button
                onClick={closeModal}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <h2 className="text-lg font-semibold mb-2 text-center">
                Verify Appointment
              </h2>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Please submit the OTP received by the patient at the time of
                booking this appointment
              </p>
              <div className="flex justify-center gap-2 mb-4">
                {otp.map((val, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-12 h-12 rounded-lg border-2 text-center text-lg font-bold bg-gray-50 border-gray-200 focus:border-green outline-none"
                    value={val}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  />
                ))}
              </div>
              <button
                onClick={handleConfirm}
                className="w-full bg-green text-white rounded-lg py-2 mt-2 font-semibold text-base"
                disabled={otp.join("").length !== 4}
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}

      {/* Success Modal */}
      {successModal && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50"
            onClick={() => setSuccessModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-7 relative flex flex-col items-center">
              <CheckCircle2 className="w-12 h-12 text-green mb-3" />
              <h2 className="text-lg font-semibold text-center mb-1">
                Consultation Completed
              </h2>
              <p className="text-sm text-center text-gray-600 mb-6">
                Great work! You've successfully completed this consultation
              </p>
              <button
                className="w-full bg-green text-white rounded-lg py-2 mt-1 font-semibold text-base"
                onClick={() => setSuccessModal(false)}
              >
                Go to Consultation
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
