import React from "react";
import OrderCard from "../../../components/homecare/comp/OrderCard";

const mockOrders = [
  {
    id: "1",
    name: "Dr. Anil",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    speciality: "General Physio",
    date: "10 Feb, 2025",
    visitType: "Home Visit",
    status: "On Going",
  },
  {
    id: "2",
    name: "Dr. Anil",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    speciality: "General Physio",
    date: "10 Feb, 2025",
    visitType: "Home Visit",
    status: "On Going",
  },
];

const ConsultationOrderList = () => {
  return (
    <div className="min-h-screen p-4 bg-white">
      <h1 className="text-lg font-bold text-center my-5">My Consultation</h1>
      <div className="space-y-4 flex justify-center items-center flex-col">
        {mockOrders.map((order) => (
          <OrderCard key={order.id} order={order} type="consultation" />
        ))}
      </div>
    </div>
  );
};

export default ConsultationOrderList;
