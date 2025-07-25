import React from "react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order, type = "consultation" }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full md:w-[50%] md:p-8 bg-white rounded-xl p-4 shadow-sm border border-green mb-5">
      <div className="flex justify-between items-center mb-2 border-b pb-2">
        <p className="text-sm font-medium text-gray-600">{order.visitType}</p>
        <span className="text-xs bg-[#f0fcee] text-green px-3 py-1 rounded-full">
          {order.status}
        </span>
      </div>

      <div className="flex gap-4 items-center">
        <img
          src={order.image}
          alt={order.name}
          className="w-16 h-16 rounded-lg object-cover"
        />
        <div>
          <h3 className="text-base font-semibold">{order.name}</h3>
          <p className="text-sm text-gray-600">{order.speciality}</p>
          <p className="text-xs text-gray-500 mt-1">{order.date}</p>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          className="w-full border border-green rounded-lg py-1 font-medium text-sm"
          onClick={() => navigate(`/homecare/contact`, { state: { order } })}
        >
          Support
        </button>
        <button
          className="w-full bg-green text-white rounded-lg py-1 font-medium text-sm"
          onClick={() =>
            navigate(
              `/homecare/${
                type === "treatment"
                  ? "treatment-detail"
                  : "consultation-detail"
              }/${order.id}`,
              {
                state: { order },
              }
            )
          }
        >
          View
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
