import moment from "moment";
import { useState } from "react";
import ReviewOverlay from "../components/ReviewOverlay";
import { useSubmitPhysioReviewMutation } from "../api/physios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const TreatmentCard = ({ orderData }) => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [submitReview] = useSubmitPhysioReviewMutation();

  const handleReviewSubmit = async (data) => {
    try {
      await submitReview({
        appointmentId: orderData?._id,
        patientId: orderData?.patientId?._id,
        physioId: orderData?.physioId?._id,
        rating: data.rating,
        comment: data.review,
      }).unwrap();
      toast.success("Review submitted successfully!");
    } catch (error) {
      const message = error?.data?.message || "Something went wrong.";
      toast.error(`Error: ${message}`);
    }
  };

  const handleViewDetails = () => {
    navigate("/treatment-details", { state: { treatmentId: orderData?._id } });
  };

  const handleSupport = () => {
    navigate("/contact", { state: { orderData } });
  };

  const isCompleted = orderData?.isTreatmentScheduled?.isTreatmentCompleted;

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-2px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade {
            animation: fadeIn 0.2s ease-out;
          }
        `}
      </style>

      <div className="w-full md:bg-[#E6F4EC] rounded-3xl border border-[#E6F4EC] shadow-md overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between bg-white">
          {/* Left: Physio Details */}
          <div className="w-full md:w-fit flex items-center gap-4 p-2">
            <div className="relative rounded-full overflow-hidden">
              <img
                src={orderData?.physioId?.profileImage || "/mockPhysioMale.png"}
                alt={orderData?.physioId?.fullName}
                className="object-cover w-20 h-20 aspect-square"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-medium text-[#4a4e69] mb-1">
                {orderData?.physioId?.fullName}
              </h2>
              <div className="font-semibold text-gray-500 text-md">
                {orderData?.isTreatmentScheduled?.treatmentServiceType === 0
                  ? "Home"
                  : orderData?.isTreatmentScheduled?.treatmentServiceType === 1
                  ? "Clinic"
                  : "Online"}{" "}
                Treatment
              </div>
              <div className="flex gap-6 flex-wrap">
                {/* <div className="flex items-center gap-1 text-black font-normal text-xs md:text-sm lg:text-base">
                  <img
                    src="/images/CalendarBlank.png"
                    alt=""
                    className="w-4 h-4"
                  />
                  <span>
                    {moment(orderData?.date).format("dddd, DD.MM.YYYY")}
                  </span>
                </div> */}
                <div className="flex items-center gap-1 text-black font-normal text-xs md:text-sm lg:text-base">
                  <img src="/images/Clock.png" alt="" className="w-4 h-4" />
                  <span>
                    {orderData?.isTreatmentScheduled?.startTime} -{" "}
                    {orderData?.isTreatmentScheduled?.endTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Amount */}
          <div className="hidden md:block p-2">
            <div className="font-medium">
              ₹ {orderData?.isTreatmentScheduled?.amount}
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="md:border-l-2 p-2">
            <div className="w-full md:w-fit flex flex-col gap-2 mt-4 md:mt-0 p-2">
              <button
                onClick={handleViewDetails}
                className="w-64 md:w-full text-sm md:text-base bg-green text-white px-6 sm:px-20 md:px-10 py-2 rounded-full hover:bg-emerald-700 transition-colors"
              >
                View Details
              </button>

              {isCompleted ? (
                <>
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-64 md:w-full text-sm md:text-base bg-[#F1F9F4] text-black px-6 sm:px-10 md:px-12 py-2 rounded-full hover:bg-emerald-700 transition-colors"
                  >
                    Write a review
                  </button>
                  {showForm && (
                    <ReviewOverlay
                      onClose={() => setShowForm(false)}
                      onSubmit={handleReviewSubmit}
                    />
                  )}
                </>
              ) : (
                <button
                  onClick={handleSupport}
                  className="w-64 md:w-full text-sm md:text-base bg-[#F1F9F4] text-black px-6 sm:px-10 md:px-12 py-2 rounded-full hover:bg-red-200 transition-colors"
                >
                  Contact Support
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TreatmentCard;
