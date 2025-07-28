import React, { useEffect, useState } from "react";
import OrderCard from "../../../components/homecare/comp/OrderCard";
import { useNavigate } from "react-router-dom";
import { getAllPatientConsultations } from "../../../api/homecare";

const ConsultationOrderList = () => {
  // If you're getting patientId from props. If not, get it from context, etc.
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const patientId =
    JSON.parse(localStorage.getItem("homecareUser"))?.userId ?? null;

  // Fetch consultations when the component mounts

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError("");
    getAllPatientConsultations(patientId)
      .then((data) => {
        if (mounted) {
          setOrders(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch((err) => {
        setError("Failed to fetch consultations. Please try again.");
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [patientId]);

  return (
    <div className="min-h-screen p-4 bg-white">
      <h1 className="text-lg font-bold text-center my-5">My Consultation</h1>
      {loading && (
        <div className="text-center text-gray-500 mt-10">Loading...</div>
      )}
      {error && <div className="text-center text-red-500 mb-3">{error}</div>}
      {!loading && orders.length === 0 && (
        <div className="text-center text-gray-400 my-8">
          No consultations found.
        </div>
      )}
      <div className="space-y-4 flex justify-center items-center flex-col">
        {orders.map((order) => (
          <OrderCard
            key={order.id || order._id}
            order={order}
            type="consultation"
            onView={() =>
              navigate(
                `/homecare/prefer-consultation/${order.id || order._id}`,
                {
                  state: { order },
                }
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ConsultationOrderList;
