import { CheckCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BsBagCheckFill, BsFillPinMapFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import GiveRating from "../../../components/homecare/comp/GiveRating";
import { getConsultationById } from "../../../api/homecare";

const PerferConsultation = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderId = state?.order?._id;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchConsultation = async () => {
      setLoading(true);
      try {
        const data = await getConsultationById(orderId);
        setOrder(data);
      } catch (err) {
        setError("Failed to load treatments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchConsultation();
  }, [orderId]);
  // pending or completed
  const [showRating, setShowRating] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-3 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green" />
        <p className="text-sm text-gray-500">
          Fetching consultation details...
        </p>
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
            // Optional: fallback initials or icon
            <span className="text-2xl text-gray-400 font-bold">
              {order?.physioId?.name ? order.physioId.name[0] : "?"}
            </span>
          )}
        </div>
        <div className="font-semibold text-center  text-xl mb-4">
          {order?.physioId?.fullName || "Physio"}
        </div>
        <div className="w-full flex flex-wrap gap-4 justify-center mt-1 mb-1">
          {order?.physioId?.specialization &&
          order?.physioId?.specialization?.length > 0
            ? order?.physioId?.specialization?.map((tag) => (
                <span
                  key={tag}
                  className="bg-[rgb(245,255,249)]  border-green border text-green text-sm px-2 py-1 rounded font-semibold"
                >
                  {tag?.name}
                </span>
              ))
            : "Specialization not available"}
        </div>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center mt-4">
          <div className="bg-[rgb(245,255,249)]  rounded-lg border p-2">
            <CheckCircle className="inline-block mb-1 text-green" />
            <p className="text-sm font-medium text-green">Speak</p>
            <p className="text-xs">Hindi, English</p>
          </div>
          <div className="bg-[rgb(245,255,249)]  rounded-lg border p-2">
            <BsBagCheckFill className="inline-block mb-1 text-green" />
            <p className="text-sm font-medium text-green">
              {order?.physioId?.workExperience}+ Years
            </p>

            <p className="text-xs">Experience</p>
          </div>
          <div className="bg-[rgb(245,255,249)]  rounded-lg border p-2">
            <BsFillPinMapFill className="inline-block mb-1 text-green" />
            <p className="text-sm font-medium text-green">
              {order?.physioId?.city}
            </p>
            <p className="text-xs">{order?.physioId?.zipCode}</p>
          </div>
        </div>
      </div>

      {/* Main Card: Pending OR Completed */}
      {!order?.appointmentCompleted ? (
        <>
          <div className="bg-gradient-to-b from-green to-blue-900 rounded-md p-4 text-white">
            <div className="font-semibold mb-1">Home Visit</div>
            <div className="text-xs mb-2 font-semibold">
              Secure Your Session with OTP Verification
            </div>
            <ul className="text-xs space-y-1 mb-3 list-none border-b-2 border-white/50 pb-2">
              <li>✔️ Share the OTP below with your Physio</li>
              <li>✔️ To ensure a secure & seamless experience</li>
            </ul>
            <div className=" flex flex-col items-center">
              <div className="text-xs mb-1">
                PIN shared with Physio to confirm consultation.
              </div>
              <div className="flex gap-1 text-2xl font-bold tracking-widest justify-center">
                {String(order?.otp || "")
                  .split("")
                  .map((digit, idx) => (
                    <span
                      key={idx}
                      className="bg-white text-green rounded px-3 py-1"
                    >
                      {digit}
                    </span>
                  ))}
              </div>
            </div>
          </div>
          <div className="w-full  md:p-8  rounded-xl p-4 shadow-sm border border-green mb-5 bg-[rgb(245,255,249)] ">
            <div className="flex justify-between items-center mb-2 border-b pb-2">
              <p className="text-sm font-medium text-gray-600">
                {"Home Visit"}
              </p>
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold
    ${
      order?.appointmentCompleted
        ? "bg-[#f0fcee] text-green"
        : "bg-yellow-100 text-yellow-800"
    }
  `}
              >
                {order?.appointmentCompleted ? "Completed" : "OnGoing"}
              </span>
            </div>

            <div className="flex gap-4 items-center">
              <img
                src={order?.physioId?.profileImage || "/default-avatar.png"}
                alt={order?.physioId?.fullName}
                className="w-16 h-16 rounded-lg object-cover"
              />{" "}
              <div>
                <h3 className="text-base font-semibold">
                  {" "}
                  {order?.physioId?.fullName || "Physio Name"}
                </h3>
                <p className="text-sm text-gray-600">consultation</p>
                <p className="text-xs text-gray-500 mt-1">{order?.date}</p>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                className="w-full border border-green rounded-lg py-1 font-medium text-sm"
                onClick={() =>
                  navigate("/homecare/contact", {
                    state: { order },
                  })
                }
              >
                Support
              </button>
              <button
                className="w-full bg-green text-white rounded-lg py-1 font-medium text-sm"
                onClick={() =>
                  navigate(`/homecare/consultation-detail/${order?.id}`, {
                    state: { order },
                  })
                }
              >
                View
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Completed: Discount and Review */}
          <div className="bg-gradient-to-b from-green to-blue-900 rounded-md p-4 text-white">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="font-semibold  text-lg mb-1 w-[60%]">
                <p>Want to save more?</p>
                <p className="text-xs mb-1">
                  Ask Your Physio Schedule Treatment
                </p>
              </div>
              <div className="text-2xl font-extrabold bg-white rounded text-green p-2">
                {"70"}% Off
              </div>
            </div>
            <button className="bg-white w-full text-green rounded-md px-3 py-1 text-xs font-semibold shadow border">
              Ask your Physio to Schedule
            </button>
          </div>

          <div className="w-full  md:p-8 bg-[rgb(245,255,249)] rounded-xl p-4 shadow-sm border border-green mb-5">
            <div className="flex justify-between items-center mb-2 border-b pb-2">
              <p className="text-sm font-medium text-gray-600">
                {"Home Visit"}
              </p>

              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold
    ${
      order?.appointmentCompleted
        ? "bg-[#f0fcee] text-green"
        : "bg-yellow-100 text-yellow-800"
    }
  `}
              >
                {order?.appointmentCompleted ? "Completed" : "OnGoing"}
              </span>
            </div>

            <div className="flex gap-4 items-center">
              <img
                src={order?.physioId?.profileImage || "/default-avatar.png"}
                alt={order?.physioId?.fullName}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-base font-semibold">
                  {" "}
                  {order?.physioId?.fullName || "Physio Name"}
                </h3>
                <p className="text-sm text-gray-600">consultation</p>
                <p className="text-xs text-gray-500 mt-1">
                  {order?.date || "Date not available"}
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                className="w-full border border-green rounded-lg py-1 font-medium text-sm"
                onClick={() => setShowRating(true)}
              >
                Rating
              </button>
              <button
                className="w-full bg-green text-white rounded-lg py-1 font-medium text-sm"
                onClick={() =>
                  navigate(`/homecare/consultation-detail/${order?.id}`, {
                    state: { order },
                  })
                }
              >
                View
              </button>
            </div>
          </div>
          {showRating && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="relative w-full max-w-sm m-4">
                <button
                  className="absolute top-3 right-4 text-2xl text-green-800 hover:bg-green-50 rounded-full px-1"
                  onClick={() => setShowRating(false)}
                  aria-label="Close"
                >
                  ×
                </button>
                <GiveRating
                  onClose={() => setShowRating(false)}
                  order={order}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PerferConsultation;
