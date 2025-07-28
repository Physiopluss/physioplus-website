import { CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BsBagCheckFill, BsFillPinMapFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { FiGift } from "react-icons/fi";
import { getTreatmentById } from "../../../api/homecare";

const PerferTreatment = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderId = state?.order?._id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const [treatmentDays, setTreatmentDays] = useState([]);

  useEffect(() => {
    if (order?.isTreatmentScheduled?.treatmentDate) {
      setTreatmentDays(order.isTreatmentScheduled.treatmentDate);
    }
  }, [order]);

  const isPaid = treatmentDays.some((day) => day.isPaid === true);
  const isAllPaid =
    treatmentDays.length > 0 &&
    treatmentDays.every((day) => day.isPaid === true);

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
      {/* Doctor Info */}
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
        <ul className="text-sm space-y-1 mb-3 list-none ">
          <li>✔️ Your upcoming treatment session is all set</li>
          <li>✔️ It's a {treatmentDays.length}-day treatment plan</li>
        </ul>
      </div>

      {!isAllPaid && (
        <div className="bg-gradient-to-r from-green/20 to-white rounded-md text-green">
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
      {!isPaid && (
        <>
          <div className="w-full mx-auto rounded-xl shadow-md bg-green/5 border border-gray-100 py-6 px-5 flex flex-col items-center">
            <div className="mb-4 text-green">
              <FiGift className="w-12 h-12" />
            </div>
            <div className="text-green font-semibold text-xl mb-2 text-center">
              Congratulations!
            </div>
            <div className="text-base text-green mb-5 text-center">
              You&apos;ve received a Scratch Card 🎉
            </div>
            <button className="w-full rounded-lg py-3 text-base font-semibold text-white bg-gradient-to-r from-green/90 via-green/70 to-green/90 shadow-md transition hover:brightness-110">
              Tap to Reveal
            </button>
          </div>
        </>
      )}

      {order?.isTreatmentScheduled?.isCashBack && (
        <>
          <div className="w-full mx-auto rounded-xl shadow-md bg-green/5 border border-gray-100 py-6 px-5 flex flex-col items-center">
            <div className="mb-4 text-green">
              <FiGift className="w-12 h-12" />
            </div>
            <div className="text-green font-semibold text-xl mb-2 text-center">
              Congratulations!
            </div>
            <div className="text-base text-green mb-5 text-center">
              You&apos;ve received a Scratch Card 🎉
            </div>
            <button className="w-full rounded-lg py-3 text-base font-semibold text-white bg-green shadow-md transition hover:brightness-110">
              Cashback Pending
            </button>
          </div>{" "}
          <div className="w-full mx-auto rounded-xl shadow-md bg-green/5 border border-gray-100 py-6 px-5 flex flex-col items-center">
            <div className="mb-4 text-green">
              <FiGift className="w-12 h-12" />
            </div>
            <div className="text-green font-semibold text-xl mb-2 text-center">
              Congratulations!
            </div>
            <div className="text-base text-green mb-5 text-center">
              You&apos;ve received a Scratch Card 🎉
            </div>
            <button className="w-full rounded-lg py-3 text-base font-semibold text-white bg-green shadow-md transition hover:brightness-110">
              Cashback Pending
            </button>
          </div>
        </>
      )}

      <div className="w-full mx-auto rounded-xl shadow-md bg-green/5 border border-gray-100 py-6 px-5 flex flex-col items-center">
        <div className="mb-4 text-green">
          <FiGift className="w-12 h-12" />
        </div>
        <div className="text-green font-semibold text-xl mb-2 text-center">
          Congratulations! Cashback Credited
        </div>
      </div>

      <div className="rounded-xl border p-4 space-y-2 shadow-sm">
        <details open>
          <summary className="font-medium">Treatment Report</summary>
          <div className="text-sm mt-2 space-y-1">
            <p>
              <strong>Treatment Days:</strong> {treatmentDays.length} Days Plan
            </p>
            <p>
              <strong>Duration:</strong> {treatmentDays?.[0]?.date} -{" "}
              {treatmentDays?.[treatmentDays.length - 1]?.date}
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

      <div className="rounded-xl border p-4 space-y-2 shadow-sm">
        <details>
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
                Treatment Day {i + 1} – {day.date}
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
                          day, // Pass full treatment day object
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
          onClick={() =>
            navigate("/homecare/treatment-payment", {
              state: { order, days: treatmentDays },
            })
          }
        >
          Pay at once
        </button>
      ) : (
        <>
          <button className="w-full bg-green text-white font-semibold py-2 rounded-lg mt-2">
            Payment Completed
          </button>
          <button className="w-full border border-green text-green font-semibold py-2 rounded-lg mt-2">
            Download Invoice
          </button>
        </>
      )}
    </div>
  );
};

export default PerferTreatment;
