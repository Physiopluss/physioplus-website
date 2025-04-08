import { useDispatch, useSelector } from "react-redux";
// import { allOrders } from "../../api/booking";
import { allOrders } from "../api/booking";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { setLogOut } from "../slices/authSlice";
import OrderCard from "../components/OrderCard";
import {
  MdLogout,
  MdPersonOutline,
  MdOutlineWallet,
} from "react-icons/md";
import { LuClipboardList } from "react-icons/lu";
import { FaRegClipboard } from "react-icons/fa6";

const OrderHistoryPhysio = () => {
  const { userId, userToken } = useSelector((e) => e.auth.user || {});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!userId) {
    navigate("/login");
  }

  let reversedOrders;
  useEffect(() => {
    allOrders(userId, userToken)
      .then((data) => {
        setOrders(data.data);
      })
      .catch((err) => toast.error(err))
      .finally(() => setLoading(false));
  }, [userId, userToken]);

  orders != null && (reversedOrders = [...orders]?.reverse());

  // google analytics
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: "Order History",
    });
  }, []);

  return (
    <div className="font-Urbanist flex min-h-screen bg-[#FFFCF0] py-8 px-4 sm:px-12 lg:px-[120px]">
      {/* Main Content - Updated to match the image cards */}
      <div className="w-full bg-white rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-8">My Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
         {/* My Profile Card */}
<Link to="/profile-physio" className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-all">
  <div className="flex items-start justify-between">
    <div className="flex items-center gap-3">
      <MdPersonOutline className="text-3xl text-gray-600" />
      <h2 className="text-xl font-semibold">My Profile</h2>
    </div>
    <span className="text-xs font-semibold bg-red-600 text-white px-2 py-0.5 rounded">
      Incomplete Profile
    </span>
  </div>
  <p className="text-sm text-gray-500 mt-3 ml-11">
    Manage your Personal details, Professional details & Business details
  </p>
</Link>
          {/* View Subscription Card */}
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <FaRegClipboard className="text-3xl text-gray-600" />
              <h2 className="text-xl font-semibold">View Subscription</h2>
            </div>
            <p className="text-sm text-gray-500 mt-3 ml-11">
              Click to view subscription details
            </p>
          </div>

          {/* My Consultation Card */}
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-all bg-[#E6F4EC] text-emerald-700 border-emerald-100">
            <div className="flex items-center gap-3">
              <LuClipboardList className="text-3xl" />
              <h2 className="text-xl font-semibold">My Consultation</h2>
            </div>
            <p className="text-sm mt-3 ml-11">
              See and manage your consultation through here only
            </p>
          </div>

          {/* Logout Card */}
          <div 
            className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => {
              localStorage.removeItem("user");
              dispatch(setLogOut());
              navigate("/");
            }}
          >
            <div className="flex items-center gap-3">
              <MdLogout className="text-3xl text-gray-600" />
              <h2 className="text-xl font-semibold">Logout</h2>
            </div>
            <p className="text-sm text-gray-500 mt-3 ml-11">
              Logout your profile as a Physio
            </p>
          </div>

          {/* My Wallet Card */}
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <MdOutlineWallet className="text-3xl text-gray-600" />
                <h2 className="text-xl font-semibold">My Wallet</h2>
              </div>
              <span className="text-xs font-semibold bg-green-600 text-white px-2 py-0.5 rounded">
                ₹0
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-3 ml-11">
              Here you can check the wallet amount and you can withdraw the amount from there
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPhysio;
