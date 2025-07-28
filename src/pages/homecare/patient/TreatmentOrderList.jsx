import React, { useEffect, useState } from "react";
import { getAllPatientTreatments } from "../../../api/homecare";
import OrderCard from "../../../components/homecare/comp/OrderCard";
import { useNavigate } from "react-router-dom";

const TreatmentOrderList = () => {
  const [treatments, setTreatments] = useState([]);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const patientId =
    JSON.parse(localStorage.getItem("homecareUser"))?.userId ?? null;

  useEffect(() => {
    const fetchTreatments = async () => {
      setLoading(true);
      try {
        const data = await getAllPatientTreatments(patientId);
        setTreatments(data || []);
      } catch (err) {
        setError("Failed to load treatments");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) fetchTreatments();
  }, [patientId]);

  return (
    <div className="min-h-screen p-4 bg-white">
      <h1 className="text-lg font-bold text-center my-5">My Treatments</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : treatments.length === 0 ? (
        <p className="text-center text-gray-600">No treatment records found.</p>
      ) : (
        <div className="space-y-4 flex justify-center items-center flex-col">
          {treatments.map((order) => (
            <OrderCard
              key={order.id || order._id}
              order={order}
              type="treatment"
              onView={() =>
                navigate(
                  `/homecare/prefer-Treatment/${order.id || order._id}`,
                  {
                    state: { order },
                  }
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreatmentOrderList;
