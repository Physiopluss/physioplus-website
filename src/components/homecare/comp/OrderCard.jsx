import React from "react";

const OrderCard = ({ order, type = "consultation", onView }) => (
  <div className="w-full md:w-[50%] md:p-8 bg-white rounded-xl p-4 shadow-sm border border-green mb-5">
    <div className="flex justify-between items-center mb-2 border-b pb-2">
      <p className="text-sm font-medium text-gray-600">{"Home visit"}</p>
      <span
        className={`text-xs px-3 py-1 rounded-full font-semibold
    ${
      order?.appointmentCompleted
        ? "bg-[#f0fcee] text-green"
        : "bg-yellow-100 text-yellow-800"
    }
  `}
      >
        {type == "consultation"
          ? order?.appointmentCompleted
            ? "Completed"
            : "OnGoing"
          : order?.isTreatmentScheduled?.isTreatmentCompleted
          ? "Completed"
          : "OnGoing"}
      </span>
    </div>

    <div className="flex gap-4 items-center">
      <img
        src={order?.physioId?.profileImage || "/default-avatar.png"}
        alt={order?.physioId?.fullName}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div>
        <h3 className="text-base font-semibold">{order?.physioId?.fullName}</h3>
        <p className="text-sm text-gray-600">
          {order?.physioId?.specialization &&
          order.physioId.specialization.length > 0
            ? order.physioId.specialization.map((sp) => sp.name).join(", ")
            : "Specialization not available"}
        </p>
        <p className="text-xs text-gray-500 mt-1">{order.date}</p>
      </div>
    </div>

    <div className="flex gap-4 mt-4">
      <button
        className="w-full border border-green rounded-lg py-1 font-medium text-sm"
        onClick={() => (window.location.href = "/homecare/contact")}
      >
        Support
      </button>
      <button
        className="w-full bg-green text-white rounded-lg py-1 font-medium text-sm"
        onClick={onView}
      >
        View
      </button>
    </div>
  </div>
);

export default OrderCard;
