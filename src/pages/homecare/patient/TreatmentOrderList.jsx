import React from "react";
import OrderCard from "../../../components/homecare/comp/OrderCard";

const mockOrders = [
  {
    id: "2",
    name: "Dr. Riya",
    image: "https://randomuser.me/api/portraits/women/55.jpg",
    speciality: "Neuro Specialist",
    date: "15 Mar, 2025",
    visitType: "Home Visit",
    status: "Completed",
  },
];

const TreatmentOrderList = () => {
  return (
    <div className="min-h-screen p-4 bg-white">
      <h1 className="text-lg font-bold text-center my-5">My Treatments</h1>
      <div className="space-y-4 flex justify-center items-center flex-col">
        {mockOrders.map((order) => (
          <OrderCard key={order.id} order={order} type="treatment" />
        ))}
      </div>
    </div>
  );
};

export default TreatmentOrderList;
