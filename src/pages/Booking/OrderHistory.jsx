import OrderCard from "../../components/OrderCard";
import { useDispatch, useSelector } from "react-redux";
import { allOrders } from "../../api/booking";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import { setLogOut } from "../../slices/authSlice";
import { Breadcrumbs } from "@material-tailwind/react";
import { FiSearch } from "react-icons/fi";


const OrderHistory = () => {
  const { userId, userToken } = useSelector((e) => e.auth.user || {});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");



  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!userId) {
    navigate("login");
  }

  let reversedOrders;
  useEffect(() => {
    allOrders(userId, userToken)
      .then((data) => {
        setLoading;

        setOrders(data.data);
      })
      .catch((err) => toast.error(err))
      .finally(() => setLoading(false));
  }, [userId, userToken]);


  orders != null && (reversedOrders = [...orders]?.reverse());



  const filteredOrders = reversedOrders?.filter((order) => {
    // Status filtering
    const matchesStatus =
      statusFilter === "All" ? true :
        statusFilter === "Completed" ? order?.appointmentCompleted === true :
          statusFilter === "Upcoming" ? order?.appointmentCompleted === false && order?.status !== "Canceled" :
            statusFilter === "Canceled" ? order?.status === "Canceled" :
              true; // default case

    // Search filtering
    const matchesSearch = order?.patientId?.fullName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });



  // google analytics
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Order History" });
  }, []);

  return (

    <div className="font-Urbanist  bg-[#FFFCF0] py-8 px-4 sm:px-12 lg:px-[120px]   ">


      <div className="flex flex-col md:flex-row  w-full  justify-start md:justify-between  h-40    items-start md:items-center mb-4">

        {/* Breadcrumbs */}
        <Breadcrumbs separator=">" className="my-2 md:mx-6 lg:mx-12 text-black bg-transparent">
          <Link to="/profile" className="text-black  font-semibold hover:text-green">My Account</Link>
          <Link to="/order-history"> <span className="text-black hover:text-green font-bold">My Bookings</span></Link> {/* Active breadcrumb */}
        </Breadcrumbs>



        {/* Search box container */}
        <div className="flex items-center border-2  bg-white border-green rounded-md overflow-hidden my-2 mx-4 md:mx-8 lg:mx-16">
          {/* Green circle icon */}
          <div className="bg-green-500 p-2 flex items-center justify-center">
            <FiSearch className="text-black w-4 h-4" />
          </div>

          {/* Input field */}
          <input
            type="text"
            placeholder="Search with physio name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 focus:outline-none"
          />

          {/* Submit Button */}
          <button className="bg-green p-3 flex items-center justify-center">
            <FiSearch className="text-white w-5 h-5" />
          </button>
        </div>

      </div>


      <div className="mx-4 md:mx-8 lg:mx-16 -mt-12 bg-white pb-8 rounded-xl">
        {/* Tabs and Filter Row */}
        <div className="flex justify-between items-center h-14 px-4 pt-4">
          {/* Tabs */}
          <div className="flex gap-4 text-sm md:text-base font-medium">


            <button
              onClick={() => setStatusFilter("Upcoming")}
              className="text-gray-600 hover:text-green-600 pb-1"
            >
              <div className="flex items-center gap-2">
                <img src="/images/upcoming 1.png" alt="" className="h-5 w-5" />
                Upcoming
              </div>
            </button>

            <button
              onClick={() => setStatusFilter("Completed")}
              className="text-gray-600 hover:text-green-600 pb-1"
            >
              <div className="flex items-center gap-2">
                <img src="/images/successful 1.png" alt="" className="h-5 w-5" />
                Completed
              </div>
            </button>

            <button
              onClick={() => setStatusFilter("Canceled")}
              className="text-gray-600 hover:text-green-600 pb-1"
            >
              <div className="flex items-center gap-2">
                <img src="/images/cancelled 1.png" alt="" className="h-5 w-5" />
                Canceled
              </div>
            </button>

          </div>


          {/* Filter Button */}
          <div>
            <button className=" text-black font-semibold px-4 py-1  text-sm md:text-base">
              Filter
            </button>
          </div>
        </div>

        <hr className="my-4" />

        {/* Rest of your content */}
        {/* Main Content */}
        <div className="flex-1 p-4 bg-white  ">
          {loading ? (
            <Loading />
          ) : (filteredOrders?.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order?._id} className="mb-4">
                <OrderCard orderData={order} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No orders found.</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
