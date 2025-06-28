import OrderCard from "../../components/OrderCard";
import TreatmentCard from "../../components/TreatmentCard";
import { useSelector } from "react-redux";
import { allOrders } from "../../api/booking";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import { Breadcrumbs } from "@material-tailwind/react";
import { FiSearch } from "react-icons/fi";

const OrderHistory = () => {
  const navigate = useNavigate();

  const { userId, userToken } = useSelector((e) => e.auth.user || {});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState("Appointment");

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    setLoading(true);
    allOrders(userId, userToken)
      .then((data) => setOrders(data.data))
      .catch((err) => toast.error(err.message || "Failed to fetch orders"))
      .finally(() => setLoading(false));
  }, [userId, userToken]);

  const reversedOrders = [...(orders || [])].reverse();

  // Type Filtering (Consultation / Treatment)
  const filteredByType = reversedOrders.filter((order) =>
    appointmentStatusFilter === "Appointment"
      ? order?.appointmentStatus === 0 || order?.appointmentStatus === 1
      : order?.appointmentStatus === 1
  );

  // Status Filtering (Upcoming / Completed / Canceled)
  const filteredByStatus = filteredByType.filter((order) => {
    if (appointmentStatusFilter === "Appointment") {
      return statusFilter === "Completed"
        ? order?.appointmentCompleted === true
        : statusFilter === "Upcoming"
        ? order?.appointmentCompleted === false && order?.status !== "Canceled"
        : statusFilter === "Canceled"
        ? order?.status === "Canceled"
        : true;
    } else {
      return statusFilter === "Completed"
        ? order?.isTreatmentScheduled?.isTreatmentCompleted === true
        : statusFilter === "Upcoming"
        ? order?.isTreatmentScheduled?.isTreatmentCompleted === false &&
          order?.status !== "Canceled"
        : statusFilter === "Canceled"
        ? order?.status === "Canceled"
        : true;
    }
  });

  // Search Filtering (only if searchQuery exists)
  const filteredOrders = searchQuery
    ? filteredByStatus.filter((order) =>
        order?.physioId?.fullName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : filteredByStatus;

  // Counts for tabs
  const consultationOrders = reversedOrders.filter(
    (o) => o?.appointmentStatus === 0 || o?.appointmentStatus === 1
  );
  const treatmentOrders = reversedOrders.filter(
    (o) => o?.appointmentStatus === 1
  );

  const consultationCounts = {
    Upcoming: consultationOrders.filter(
      (o) => !o.appointmentCompleted && o.status !== "Canceled"
    ).length,
    Completed: consultationOrders.filter((o) => o.appointmentCompleted).length,
    Canceled: consultationOrders.filter((o) => o.status === "Canceled").length,
  };

  const treatmentCounts = {
    Upcoming: treatmentOrders.filter(
      (o) =>
        !o?.isTreatmentScheduled?.isTreatmentCompleted &&
        o.status !== "Canceled"
    ).length,
    Completed: treatmentOrders.filter(
      (o) => o?.isTreatmentScheduled?.isTreatmentCompleted
    ).length,
    Canceled: treatmentOrders.filter((o) => o.status === "Canceled").length,
  };

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: "Order History",
    });
  }, []);

  return (
    <div className="font-Urbanist bg-[#FFFCF0] py-8 px-4 sm:px-12 lg:px-[120px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <Breadcrumbs separator=">" className="text-black bg-transparent">
          <Link
            to="/profile"
            className="text-black font-semibold hover:text-green"
          >
            My Account
          </Link>
          <span className="text-black font-bold">My Bookings</span>
        </Breadcrumbs>

        {/* Search */}
        <div className="flex items-center border-2 bg-white border-green rounded-md overflow-hidden mt-2 md:mt-0">
          <div className="bg-green-500 p-2 flex items-center justify-center">
            <FiSearch className="text-black w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search with physio name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Card Section */}
      <div className="bg-white rounded-xl shadow-sm">
        {/* Tabs */}
        <div className="flex flex-col md:flex-row justify-between gap-4 p-4">
          {/* Consultation */}
          <div
            onClick={() => {
              setAppointmentStatusFilter("Appointment");
              setStatusFilter("Upcoming");
            }}
            className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer w-full md:w-1/2 ${
              appointmentStatusFilter === "Appointment"
                ? "bg-[#08845f]"
                : "bg-gray-400"
            }`}
          >
            <div className="bg-[#d9ffe3] text-green p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Consultation ({consultationOrders.length})
              </h2>
              <p className="text-sm text-white">Export medical consultations</p>
            </div>
          </div>

          {/* Treatment */}
          <div
            onClick={() => {
              setAppointmentStatusFilter("Treatment");
              setStatusFilter("Upcoming");
            }}
            className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer w-full md:w-1/2 ${
              appointmentStatusFilter === "Treatment"
                ? "bg-[#18c1a7]"
                : "bg-gray-400"
            }`}
          >
            <div className="bg-blue-100 text-white p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2a4 4 0 118 0v2m-4-6v.01M12 6.25a4.25 4.25 0 110 8.5 4.25 4.25 0 010-8.5z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                Treatment ({treatmentOrders.length})
              </h2>
              <p className="text-sm text-white">Export medical treatments</p>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-4 px-4 pt-4 text-sm md:text-base font-medium">
          {["Upcoming", "Completed", "Canceled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`flex items-center gap-2 px-3 py-1 rounded-md ${
                statusFilter === status
                  ? status === "Canceled"
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <img
                src={
                  status === "Upcoming"
                    ? "/images/upcoming 1.png"
                    : status === "Completed"
                    ? "/images/successful 1.png"
                    : "/images/cancelled 1.png"
                }
                alt=""
                className="h-5 w-5"
              />
              {status} (
              {appointmentStatusFilter === "Appointment"
                ? consultationCounts[status]
                : treatmentCounts[status]}
              )
            </button>
          ))}
        </div>

        <hr className="my-4" />

        {/* Orders */}
        <div className="p-4">
          {loading ? (
            <Loading />
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order?._id} className="mb-4">
                {order?.appointmentStatus === 1 ? (
                  <TreatmentCard orderData={order} />
                ) : (
                  <OrderCard orderData={order} />
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
