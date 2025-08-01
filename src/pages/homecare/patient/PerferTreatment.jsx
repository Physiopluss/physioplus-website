import { CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BsBagCheckFill, BsFillPinMapFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { FiGift } from "react-icons/fi";
import { getTreatmentById } from "../../../api/homecare";
import CashbackReveal from "../../../components/homecare/comp/CashbackReveal";
import moment from "moment";

const PerferTreatment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderId = state?.order?._id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [treatmentDays, setTreatmentDays] = useState([]);
  const [showCashbackModal, setShowCashbackModal] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const cashbackPct =
    order?.isTreatmentScheduled?.isCashBack?.rewardPercentage ?? 0;

  useEffect(() => {
    const fetchTreatment = async () => {
      setLoading(true);
      try {
        const data = await getTreatmentById(orderId);
        setOrder(data);
      } catch (err) {
        setError("Failed to load treatments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchTreatment();
  }, [orderId]);

  useEffect(() => {
    if (order?.isTreatmentScheduled?.treatmentDate) {
      setTreatmentDays(order.isTreatmentScheduled.treatmentDate);
    }
  }, [order]);

  const isPaid = treatmentDays.some((day) => day.isPaid === true);
  const isAllPaid =
    treatmentDays.length > 0 &&
    treatmentDays.every((day) => day.isPaid === true);

  const handleInvoiceDownload = () => {
    navigate("/homecare/show-invoice", {
      state: { order, type: "treatment" },
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-3 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green" />
        <p className="text-sm text-gray-500">Fetching treatment details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-center px-4">
        <p className="text-red-600 font-semibold mb-2">{error}</p>
        <button
          className="mt-2 px-4 py-2 bg-green text-white rounded-lg shadow"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white w-full max-w-md mx-auto my-8 rounded-md shadow p-4 space-y-4">
      {/* PHYSIO DETAILS */}
      <div className="flex flex-col items-center py-3">
        <div className="w-[70px] h-[70px] rounded-full bg-gray-200 mb-2 flex items-center justify-center overflow-hidden">
          {order?.physioId?.profileImage ? (
            <img
              src={order.physioId.profileImage}
              alt={`${order?.physioId?.name || "Doctor"} profile`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl text-gray-400 font-bold">
              {order?.physioId?.name ? order.physioId.name[0] : "?"}
            </span>
          )}
        </div>
        <div className="font-semibold text-center text-xl mb-4">
          {order?.physioId?.fullName || "Physio"}
        </div>
        <div className="w-full flex flex-wrap gap-4 justify-center mt-1 mb-1">
          {order?.physioId?.specialization?.length > 0
            ? order.physioId.specialization.map((tag) => (
                <span
                  key={tag._id || tag.name}
                  className="bg-[rgb(245,255,249)] border-green border text-green text-sm px-2 py-1 rounded font-semibold"
                >
                  {tag?.name}
                </span>
              ))
            : "Specialization not available"}
        </div>
        <div className="grid grid-cols-3 gap-2 text-center mt-4">
          <div className="bg-[rgb(245,255,249)] rounded-lg border p-2">
            <CheckCircle className="inline-block mb-1 text-green" />
            <p className="text-sm font-medium text-green">Speak</p>
            <p className="text-xs">Hindi, English</p>
          </div>
          <div className="bg-[rgb(245,255,249)] rounded-lg border p-2">
            <BsBagCheckFill className="inline-block mb-1 text-green" />
            <p className="text-sm font-medium text-green">
              {order?.physioId?.workExperience}+ Years
            </p>
            <p className="text-xs">Experience</p>
          </div>
          <div className="bg-[rgb(245,255,249)] rounded-lg border p-2">
            <BsFillPinMapFill className="inline-block mb-1 text-green" />
            <p className="text-sm font-medium text-green">
              {order?.physioId?.city}
            </p>
            <p className="text-xs">{order?.physioId?.zipCode}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-green to-blue-900 rounded-md p-4 text-white text-md">
        <div className="font-semibold mb-1">Home Visit</div>
        <div className="text-base mb-2 font-semibold border-b-2 border-white/50 pb-2">
          Your {treatmentDays.length}-Day Treatment Wellness Plan Awaits!
        </div>
        <ul className="text-sm space-y-1 mb-3 list-none">
          <li>✔️ Your upcoming treatment session is all set</li>
          <li>✔️ It's a {treatmentDays.length}-day treatment plan</li>
        </ul>
      </div>

      {isPaid && (
        <div className="bg-gradient-to-r from-green/20 to-white rounded-md text-green my-4">
          <div className="flex items-center justify-center gap-2">
            <div className="font-semibold text-lg my-2 w-[60%]">
              <p className="mb-2">Want to save more?</p>
              <p className="text-xs mb-2">
                Pay at once and get{" "}
                <span className="font-extrabold bg-white rounded text-green p-2">
                  70% Off
                </span>
              </p>
            </div>
            <img src="/homecare/coins.png" alt="" className="w-10 h-10" />
          </div>
        </div>
      )}
      {/* Scratch card */}
      {order?.isTreatmentScheduled?.isCashBack?.status === "pending" &&
        !revealed && (
          <div className="w-full max-w-[340px] mx-auto rounded-2xl shadow-xl bg-gradient-to-br from-amber-300 via-green-200 to-green-500 p-[2px] relative overflow-hidden my-8">
            {/* Subtle glow overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent pointer-events-none rounded-2xl" />
            <div className="relative bg-white rounded-2xl py-7 px-4 flex flex-col items-center">
              {/* Gift icon in gold/green gradient circle */}
              <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-green-300 to-yellow-500 shadow-lg w-16 h-16 mb-3">
                <FiGift className="text-white w-8 h-8" />
              </span>
              <div className="text-2xl font-bold text-green-700 mb-2 tracking-wide drop-shadow text-center">
                Congratulations!
              </div>
              <div className="text-base text-green mb-3 text-center font-semibold">
                You've received a{" "}
                <span className="text-amber-500 font-bold">CashBack Card</span>{" "}
                🎉
              </div>
              <button
                onClick={() => setShowCashbackModal(true)}
                className="w-full rounded-lg py-3 bg-gradient-to-r from-green via-green-400 to-amber-400 text-base font-bold text-white shadow-md tracking-wide mt-2 hover:brightness-105 transition"
              >
                Tap to Reveal
              </button>
              <div className="flex items-center gap-2 mt-4">
                <span className="inline-block w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
                <span className="text-[13px] text-green font-semibold tracking-wide uppercase">
                  CashBack Reward
                </span>
                <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              </div>
            </div>
          </div>
        )}

      {order?.isTreatmentScheduled?.isCashBack?.status === "process" && (
        <div className="w-full max-w-[340px] mx-auto rounded-2xl shadow-xl bg-gradient-to-br from-amber-300 via-green-200 to-green-500 p-[2px] relative overflow-hidden my-8">
          {/* Subtle glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/25 to-transparent pointer-events-none rounded-2xl" />
          <div className="relative bg-white rounded-2xl py-7 px-4 flex flex-col items-center">
            {/* Gift icon in gold/green gradient circle */}
            <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-green-300 to-yellow-500 shadow-lg w-16 h-16 mb-3">
              <FiGift className="text-white w-8 h-8" />
            </span>
            <h2 className="text-2xl font-bold text-green-700 mb-1 tracking-wide drop-shadow">
              Congratulations!
            </h2>
            <p className="text-gray-700 text-base mb-2 font-medium">
              You are eligible for 🎁 <br />
              <span className="mx-1 text-[1.4em] font-extrabold bg-gradient-to-r from-amber-500 to-green text-transparent bg-clip-text drop-shadow">
                {cashbackPct} Cashback
              </span>
            </p>
            <button
              className="w-full mt-2 rounded-lg py-3 bg-gradient-to-r from-green via-[#3bee67] to-amber-400 text-base font-semibold text-white shadow-md"
              disabled
            >
              Cashback Pending
            </button>
            <div className="flex items-center gap-2 mt-4">
              <span className="inline-block w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
              <span className="text-[13px] text-green font-semibold tracking-wide uppercase">
                Processing Reward
              </span>
              <span className="inline-block w-1.5 h-1.5 bg-green/80 rounded-full"></span>
            </div>
          </div>
        </div>
      )}

      {order?.isTreatmentScheduled?.isCashBack?.status === "success" && (
        <div className="w-full mx-auto max-w-[340px] rounded-2xl shadow-xl bg-gradient-to-br from-amber-300 via-green-200 to-green-500 p-[2px] relative overflow-hidden my-8">
          {/* Subtle glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent pointer-events-none rounded-2xl" />
          <div className="relative bg-white rounded-2xl py-7 px-4 flex flex-col items-center">
            {/* Circular icon on gold/green gradient */}
            <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-green-300 to-yellow-500 shadow-lg w-16 h-16 mb-3">
              <FiGift className="text-white w-8 h-8" />
            </span>
            <h2 className="text-2xl font-bold text-green-700 mb-1 tracking-wide drop-shadow">
              Congratulations!
            </h2>
            <div className="font-bold text-green text-xl mb-2 text-center flex items-center justify-center gap-1">
              Cashback Credited <span className="ml-1 text-[22px]">✅</span>
            </div>
            <div className="text-base text-green mb-5 text-center font-medium">
              ₹{order?.isTreatmentScheduled?.isCashBack?.rewardAmount} has been
              sent to <br />
              <span className="font-semibold text-gray-900">
                {order?.isTreatmentScheduled?.isCashBack?.userUpiId}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-block w-1.5 h-1.5 bg-amber-300 rounded-full"></span>
              <span className="text-[13px] text-green font-semibold tracking-wide uppercase">
                Enjoy your reward!
              </span>
              <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full"></span>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showCashbackModal && (
        <CashbackReveal
          cashbackData={order?.isTreatmentScheduled?.isCashBack}
          cashbackPercentage={cashbackPct}
          onReveal={() => {
            setRevealed(true);
            setShowCashbackModal(false);
          }}
          onClose={() => setShowCashbackModal(false)}
        />
      )}

      {/* Report */}
      <div className="rounded-xl border p-4 space-y-2 shadow-sm">
        <details open>
          <summary className="font-medium">Treatment Report</summary>
          <div className="text-sm mt-2 space-y-1 p-4">
            <p>
              <strong>Treatment Days:</strong> {treatmentDays.length} Days Plan
            </p>
            <p>
              <strong>Duration:</strong>{" "}
              {moment(treatmentDays?.[0]?.date).format("DD MMM YYYY")} -{" "}
              {moment(treatmentDays?.[treatmentDays.length - 1]?.date).format(
                "DD MMM YYYY"
              )}
            </p>
            <p>
              <strong>Treatment Amount:</strong> ₹
              {order?.isTreatmentScheduled?.amount || 0}
            </p>
          </div>
        </details>

        <details>
          <summary className="font-medium">Physio Prescription</summary>
          <textarea
            readOnly
            value={order?.isTreatmentScheduled?.prescriptionNotes || ""}
            className="w-full mt-2 p-2 border rounded bg-gray-100 text-sm"
            rows={3}
          />
        </details>
      </div>

      {/* Treatment Overview */}
      <div className="rounded-xl border p-4 space-y-2 shadow-sm">
        <details open>
          <summary className="font-medium">Treatment Overview</summary>
          <div className="mt-2 space-y-2">
            {treatmentDays.map((day, i) => (
              <div
                key={day._id || i}
                className={`flex justify-between items-center px-4 py-2 rounded-lg ${
                  day.isPaid
                    ? "bg-green/10 text-green font-medium"
                    : "bg-gray-100 text-black"
                }`}
              >
                Treatment Day {i + 1} – {moment(day.date).format("DD MMM YYYY")}
                {day.isPaid ? (
                  <span className="text-xs bg-[#e9fded] text-green rounded-full px-2 py-0.5">
                    Paid
                  </span>
                ) : (
                  <button
                    className="text-xs bg-green text-white rounded-full px-2 py-0.5"
                    onClick={() =>
                      navigate("/homecare/treatment-payment", {
                        state: {
                          order,
                          day,
                        },
                      })
                    }
                  >
                    Pay
                  </button>
                )}
              </div>
            ))}
          </div>
        </details>
      </div>

      {!isAllPaid ? (
        <button
          className="w-full bg-green text-white font-semibold py-2 rounded-lg mt-2"
          onClick={() => {
            const unpaidDays = treatmentDays.filter((d) => !d.isPaid);

            navigate("/homecare/treatment-payment", {
              state: {
                order,
                days: unpaidDays,
              },
            });
          }}
        >
          Pay at once
        </button>
      ) : (
        <>
          <button className="w-full bg-green text-white font-semibold py-2 rounded-lg mt-2">
            Payment Completed
          </button>
          <button
            className={`w-full border border-green text-green font-semibold py-2 rounded-lg mt-2 transition 
    ${
      order?.isTreatmentScheduled?.isTreatmentCompleted
        ? "hover:bg-green/10 cursor-pointer"
        : "opacity-60 cursor-not-allowed"
    }
  `}
            disabled={!order?.isTreatmentScheduled?.isTreatmentCompleted}
            onClick={handleInvoiceDownload}
          >
            Download Invoice
          </button>
        </>
      )}
    </div>
  );
};

export default PerferTreatment;
