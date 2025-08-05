// import React, { useEffect, useState, useRef } from "react";
// import {
//   CalendarDays,
//   Clock,
//   MoreVertical,
//   ChevronDown,
//   ChevronUp,
//   X,
//   CheckCircle2,
// } from "lucide-react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getConsultationById,
//   verifyConsultationOtp,
// } from "../../../api/homecare/physio"; // ✅ You'll need to implement `verifyConsultationOtp` API
// import toast from "react-hot-toast";

// export default function ConsultationDetailPage() {
//   const { id: consultationId } = useParams();
//   const navigate = useNavigate();

//   const [patient, setPatient] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showGeneral, setShowGeneral] = useState(true);
//   const [showProblem, setShowProblem] = useState(true);

//   // OTP + Modal States
//   const [modalOpen, setModalOpen] = useState(false);
//   const [successModal, setSuccessModal] = useState(false);
//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const otpRefs = [useRef(), useRef(), useRef(), useRef()];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await getConsultationById(consultationId);
//         setPatient(data);
//       } catch (err) {
//         console.error("Error loading consultation:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (consultationId) fetchData();
//   }, [consultationId]);

//   const handleOtpChange = (idx, val) => {
//     if (!/^[0-9]?$/.test(val)) return;
//     const newOtp = [...otp];
//     newOtp[idx] = val;
//     setOtp(newOtp);
//     if (val && idx < 3) otpRefs[idx + 1].current.focus();
//   };

//   const handleOtpKeyDown = (idx, e) => {
//     if (e.key === "Backspace" && !otp[idx] && idx > 0) {
//       otpRefs[idx - 1].current.focus();
//     }
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//     setOtp(["", "", "", ""]);
//   };

//   const handleConfirm = async () => {
//     const finalOtp = otp.join("");
//     if (finalOtp.length !== 4) return;

//     try {
//       // ✅ Call your API here
//       await verifyConsultationOtp({ consultationId, otp: finalOtp });
//       setModalOpen(false);
//       setSuccessModal(true);
//       setOtp(["", "", "", ""]);
//     } catch (error) {
//       console.error("OTP Verification Failed", error);
//       toast.error("Invalid OTP. Please try again.");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto min-h-screen bg-white px-4 py-6 pb-32">
//       <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-4 relative">
//         {/* Header Info */}
//         <div className="flex items-start justify-between">
//           <div className="flex items-center gap-4">
//             <img
//               src={patient?.patientId?.profilePhoto || "/homecare/user.png"}
//               alt={patient?.patientId?.fullName}
//               className="w-14 h-14 rounded-full object-cover border"
//             />
//             <div>
//               <h3 className="font-semibold text-base">
//                 {patient?.patientId?.fullName || "Patient"}
//               </h3>
//               <p className="text-xs text-gray-700">Consultation</p>
//               <div className="flex gap-4 mt-1 text-xs text-gray-600">
//                 <span className="flex items-center gap-1">
//                   <CalendarDays className="w-4 h-4" />
//                   {new Date(patient?.date).toLocaleDateString("en-IN", {
//                     day: "2-digit",
//                     month: "short",
//                     year: "numeric",
//                   })}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <button className="p-2 hover:bg-gray-100 rounded-full">
//             <MoreVertical className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {/* Reschedule */}
//         <button
//           disabled
//           className="border border-green text-green text-sm rounded-lg px-5 py-1 font-semibold w-full my-2"
//         >
//           Reschedule
//         </button>

//         {/* General Details */}
//         <div className="bg-gray-50 rounded-lg">
//           <button
//             className="flex w-full items-center justify-between px-3 py-2 font-semibold text-gray-800"
//             onClick={() => setShowGeneral(!showGeneral)}
//           >
//             <span>General Details</span>
//             {showGeneral ? <ChevronUp /> : <ChevronDown />}
//           </button>
//           {showGeneral && (
//             <div className="px-3 pb-3 text-xs text-gray-600 space-y-1">
//               <div>
//                 <span className="font-medium">Gender: </span>
//                 {patient?.gender === 0
//                   ? "Female"
//                   : patient?.gender === 1
//                   ? "Male"
//                   : "Other"}
//               </div>
//               <div>
//                 <span className="font-medium">Age: </span>
//                 {patient?.age}
//               </div>
//               <div>
//                 <span className="font-medium">Consultation Amount: </span>₹
//                 {patient?.amount}
//               </div>
//               <div>
//                 <span className="font-medium">Payment Method: </span>
//                 {patient?.paymentMode}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Problem Description */}
//         <div className="bg-gray-50 rounded-lg">
//           <button
//             className="flex w-full items-center justify-between px-3 py-2 font-semibold text-gray-800"
//             onClick={() => setShowProblem(!showProblem)}
//           >
//             <span>Patient Problem</span>
//             {showProblem ? <ChevronUp /> : <ChevronDown />}
//           </button>
//           {showProblem && (
//             <div className="px-3 pb-3 text-xs text-gray-700">
//               {patient?.painNotes || "No problem description."}
//             </div>
//           )}
//         </div>

//         {/* Address */}
//         <div className="bg-gray-50 rounded-lg p-3 flex items-start justify-between gap-3 text-xs text-gray-700">
//           <div className="flex-1">
//             <p className="font-semibold text-gray-800 mb-1">
//               {patient?.patientId?.fullName || "Patient"}'s Address
//             </p>
//             <p className="whitespace-pre-wrap leading-snug text-gray-600">
//               {patient?.patientId?.appointmentAddress?.replace(
//                 /\n?Lat:.*$/i,
//                 ""
//               ) || "Address not available"}
//             </p>
//           </div>

//           <button
//             className="bg-green hover:bg-green/90 transition text-white text-xs px-4 py-1.5 rounded-md font-medium whitespace-nowrap mt-1"
//             onClick={() => {
//               const address = patient?.patientId?.appointmentAddress;
//               if (!address) return alert("Address not available");

//               const match = address.match(
//                 /Lat:\s*([-0-9.]+),\s*Lng:\s*([-0-9.]+)/
//               );

//               const mapsUrl = match
//                 ? `https://www.google.com/maps?q=${match[1]},${match[2]}`
//                 : `https://www.google.com/maps?q=${encodeURIComponent(
//                     address.replace(/\n?Lat:.*$/i, "")
//                   )}`;
//               window.open(mapsUrl, "_blank");
//             }}
//           >
//             📍 Locate
//           </button>
//         </div>

//         {/* Start Consultation */}
//         <button
//           onClick={() => {
//             if (!patient?.appointmentCompleted) {
//               setModalOpen(true);
//             }
//           }}
//           disabled={patient?.appointmentCompleted}
//           className={`w-full max-w-md mx-auto text-base py-3 rounded-lg font-semibold shadow-lg ${
//             patient?.appointmentCompleted
//               ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//               : "bg-green text-white hover:bg-green/90"
//           }`}
//         >
//           {patient?.appointmentCompleted
//             ? "Consultation Completed"
//             : "Start Consultation"}
//         </button>
//       </div>

//       {/* OTP Modal */}
//       {modalOpen && (
//         <>
//           <div
//             className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50"
//             onClick={closeModal}
//           />
//           <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
//             <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 relative">
//               <button
//                 onClick={closeModal}
//                 className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
//               >
//                 <X className="w-5 h-5 text-gray-400" />
//               </button>
//               <h2 className="text-lg font-semibold mb-2 text-center">
//                 Verify Appointment
//               </h2>
//               <p className="text-sm text-gray-500 mb-4 text-center">
//                 Please submit the otp received by the patient at the time of
//                 booking this appointment.
//               </p>
//               <div className="flex justify-center gap-2 mb-4">
//                 {otp.map((val, idx) => (
//                   <input
//                     key={idx}
//                     ref={otpRefs[idx]}
//                     type="text"
//                     inputMode="numeric"
//                     maxLength={1}
//                     className="w-12 h-12 rounded-lg border-2 text-center text-lg font-bold bg-gray-50 border-gray-200 focus:border-green outline-none"
//                     value={val}
//                     onChange={(e) => handleOtpChange(idx, e.target.value)}
//                     onKeyDown={(e) => handleOtpKeyDown(idx, e)}
//                   />
//                 ))}
//               </div>
//               <button
//                 onClick={handleConfirm}
//                 disabled={otp.join("").length !== 4}
//                 className="w-full bg-green text-white rounded-lg py-2 font-semibold text-base disabled:opacity-60"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Success Modal */}
//       {successModal && (
//         <>
//           <div
//             className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50"
//             onClick={() => setSuccessModal(false)}
//           />
//           <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
//             <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-7 relative flex flex-col items-center">
//               <CheckCircle2 className="w-12 h-12 text-green mb-3" />
//               <h2 className="text-lg font-semibold text-center mb-1">
//                 Consultation Completed
//               </h2>
//               <p className="text-sm text-center text-gray-600 mb-6">
//                 Great work! You've successfully completed this consultation.
//               </p>
//               <button
//                 className="w-full bg-green text-white rounded-lg py-2 mt-1 font-semibold text-base"
//                 onClick={() => {
//                   setSuccessModal(false);

//                   navigate(`/homecare/physio-consultation/${consultationId}`);
//                 }}
//               >
//                 Go to Consultation
//               </button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState, useRef } from "react";
import {
  CalendarDays,
  Clock,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle2,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getConsultationById,
  verifyConsultationOtp,
  updateConsultationDate,
} from "../../../api/homecare/physio"; // ✅ Make sure `updateConsultationDate` is implemented
import toast from "react-hot-toast";

export default function ConsultationDetailPage() {
  const { id: consultationId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGeneral, setShowGeneral] = useState(true);
  const [showProblem, setShowProblem] = useState(true);

  // OTP Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  // Reschedule Modal
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getConsultationById(consultationId);
        setPatient(data);
      } catch (err) {
        console.error("Error loading consultation:", err);
      } finally {
        setLoading(false);
      }
    };
    if (consultationId) fetchData();
  }, [consultationId]);

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

  const closeModal = () => {
    setModalOpen(false);
    setOtp(["", "", "", ""]);
  };

  const handleConfirm = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 4) return;

    try {
      await verifyConsultationOtp({ consultationId, otp: finalOtp });
      setModalOpen(false);
      setSuccessModal(true);
      setOtp(["", "", "", ""]);
    } catch (error) {
      console.error("OTP Verification Failed", error);
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white px-4 py-6 pb-32">
      <div className="font-semibold text-md mb-4 flex justify-center">
        patient Details
      </div>
      <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-4 relative">
        {/* Header Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={patient?.patientId?.profilePhoto || "/homecare/user.png"}
              alt={patient?.patientId?.fullName}
              className="w-14 h-14 rounded-full object-cover border"
            />
            <div>
              <h3 className="font-semibold text-base">
                {patient?.patientId?.fullName || "Patient"}
              </h3>
              <p className="text-xs text-gray-700">Consultation</p>
              <div className="flex gap-4 mt-1 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(patient?.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Reschedule */}
        <button
          onClick={() => setRescheduleOpen(true)}
          className="border border-green text-green text-sm rounded-lg px-5 py-1 font-semibold w-full my-2"
        >
          Reschedule
        </button>

        {/* General Details */}
        <div className="bg-gray-50 rounded-lg">
          <button
            className="flex w-full items-center justify-between px-3 py-2 font-semibold text-gray-800"
            onClick={() => setShowGeneral(!showGeneral)}
          >
            <span>General Details</span>
            {showGeneral ? <ChevronUp /> : <ChevronDown />}
          </button>
          {showGeneral && (
            <div className="px-3 pb-3 text-xs text-gray-600 space-y-1">
              <div>
                <span className="font-medium">Gender: </span>
                {patient?.gender === 0
                  ? "Female"
                  : patient?.gender === 1
                  ? "Male"
                  : "Other"}
              </div>
              <div>
                <span className="font-medium">Age: </span>
                {patient?.age}
              </div>
              <div>
                <span className="font-medium">Consultation Amount: </span>₹
                {patient?.amount}
              </div>
              <div>
                <span className="font-medium">Payment Method: </span>
                {patient?.paymentMode}
              </div>
            </div>
          )}
        </div>

        {/* Problem Description */}
        <div className="bg-gray-50 rounded-lg">
          <button
            className="flex w-full items-center justify-between px-3 py-2 font-semibold text-gray-800"
            onClick={() => setShowProblem(!showProblem)}
          >
            <span>Patient Problem</span>
            {showProblem ? <ChevronUp /> : <ChevronDown />}
          </button>
          {showProblem && (
            <div className="px-3 pb-3 text-xs text-gray-700">
              {patient?.painNotes || "No problem description."}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="bg-gray-50 rounded-lg p-3 flex items-start justify-between gap-3 text-xs text-gray-700">
          <div className="flex-1">
            <p className="font-semibold text-gray-800 mb-1">
              {patient?.patientId?.fullName || "Patient"}'s Address
            </p>
            <p className="whitespace-pre-wrap leading-snug text-gray-600">
              {patient?.patientId?.appointmentAddress?.replace(
                /\n?Lat:.*$/i,
                ""
              ) || "Address not available"}
            </p>
          </div>
          <button
            className="bg-green hover:bg-green/90 transition text-white text-xs px-4 py-1.5 rounded-md font-medium whitespace-nowrap mt-1"
            onClick={() => {
              const address = patient?.patientId?.appointmentAddress;
              if (!address) return alert("Address not available");

              const match = address.match(
                /Lat:\s*([-0-9.]+),\s*Lng:\s*([-0-9.]+)/
              );

              const mapsUrl = match
                ? `https://www.google.com/maps?q=${match[1]},${match[2]}`
                : `https://www.google.com/maps?q=${encodeURIComponent(
                    address.replace(/\n?Lat:.*$/i, "")
                  )}`;
              window.open(mapsUrl, "_blank");
            }}
          >
            📍 Locate
          </button>
        </div>

        {/* Start Consultation */}
        <button
          onClick={() => {
            if (!patient?.appointmentCompleted) {
              setModalOpen(true);
            }
          }}
          disabled={patient?.appointmentCompleted}
          className={`w-full max-w-md mx-auto text-base py-3 rounded-lg font-semibold shadow-lg ${
            patient?.appointmentCompleted
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-green text-white hover:bg-green/90"
          }`}
        >
          {patient?.appointmentCompleted
            ? "Consultation Completed"
            : "Start Consultation"}
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
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <h2 className="text-lg font-semibold mb-2 text-center">
                Verify Appointment
              </h2>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Please submit the OTP received by the patient at the time of
                booking this appointment.
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
                disabled={otp.join("").length !== 4}
                className="w-full bg-green text-white rounded-lg py-2 font-semibold text-base disabled:opacity-60"
              >
                Confirm
              </button>
            </div>
          </div>
        </>
      )}

      {/* Reschedule Modal */}
      {rescheduleOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-50"
            onClick={() => setRescheduleOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 relative">
              <button
                onClick={() => setRescheduleOpen(false)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              <h2 className="text-lg font-semibold text-center mb-2">
                Reschedule Consultation
              </h2>
              <p className="text-sm text-gray-500 text-center mb-4">
                Old Date:{" "}
                <span className="font-semibold">
                  {new Date(patient?.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </p>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={selectedDate || ""}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full mt-3 bg-gray-50 border px-3 py-2 rounded-lg"
              />
              <div className="mt-5 flex gap-4">
                <button
                  onClick={() => setRescheduleOpen(false)}
                  className="w-full py-2 border border-gray-300 rounded-lg text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      await updateConsultationDate({
                        consultationId,
                        newDate: selectedDate,
                      });
                      toast.success("Consultation rescheduled!");
                      setPatient({ ...patient, date: selectedDate });
                      setRescheduleOpen(false);
                    } catch (err) {
                      console.error(err);
                      toast.error("Failed to reschedule consultation.");
                    }
                  }}
                  disabled={!selectedDate}
                  className="w-full py-2 bg-green text-white rounded-lg font-semibold disabled:opacity-60"
                >
                  Confirm
                </button>
              </div>
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
                Great work! You've successfully completed this consultation.
              </p>
              <button
                className="w-full bg-green text-white rounded-lg py-2 mt-1 font-semibold text-base"
                onClick={() => {
                  setSuccessModal(false);
                  navigate(`/homecare/physio-consultation/${consultationId}`);
                }}
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
