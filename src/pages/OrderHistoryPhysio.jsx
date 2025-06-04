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

} from "react-icons/md";
import { PiWalletBold, PiHandbagBold } from "react-icons/pi";
import { TbClipboardText } from "react-icons/tb";
import { Breadcrumbs } from "@material-tailwind/react";

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
    <>
      <div className="font-Urbanist   bg-[#FFFCF0] py-8 px-4 sm:px-12 lg:px-[120px] ">

        <div className="h-40 w-full  flex items-center">
          <Breadcrumbs
            separator=">"
            className=" text-black bg-transparent"
          >
            <Link to="/my-account">
              <span className="text-black hover:text-green font-bold">My Account</span></Link> {/* Active breadcrumb */}
          </Breadcrumbs>
        </div>

      </div>


      <div className="mx-4 sm:mx-12 lg:mx-[120px]   -mt-20 bg-white pb-8 rounded-xl ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">

          {/* My Profile Card */}
          <Link to="/profile-physio" className="px-4 py-2 border rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <MdPersonOutline className="text-3xl text-black" />
                <h2 className="text-xl font-semibold">My Profile</h2>
              </div>
              <span className="text-xs font-semibold bg-red-600 text-white px-2 py-0.5 rounded">
                Incomplete Profile
              </span>
            </div>
            <p className="text-sm  mt-3 ml-11">
              Manage your Personal details, Professional details & Business details
            </p>

          </Link>
          {/* My Consultation Card */}
          <div className="px-4 py-2 border rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <PiHandbagBold className="text-3xl text-black" />
              <h2 className="text-xl font-semibold">My Consultation</h2>
            </div>
            <p className="text-sm mt-3 ml-11">
              See and manage your consultation through here only
            </p>
          </div>

          {/* My Wallet Card */}
          <div className="px-4 py-2 border rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <PiWalletBold className="text-3xl text-black" />
                <h2 className="text-xl font-semibold">My Wallet</h2>
              </div>
              <span className="text-xs font-semibold bg-green text-white px-2 py-0.5 rounded">
                ₹0
              </span>
            </div>
            <p className="text-sm  mt-3 ml-11">
              Here you can check the wallet amount and you can withdraw the amount from there
            </p>
          </div>
          {/* View Subscription Card */}
          <div className="px-4 py-2 border rounded-xl shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center gap-3">
              <TbClipboardText className="text-3xl text-black" />
              <h2 className="text-xl font-semibold">View Subscription</h2>
            </div>
            <p className="text-sm  mt-3 ml-11">
              Click to view subscription details
            </p>
          </div>
          {/* Logout Card */}
          <div
            className="px-4 py-2 border rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => {
              localStorage.removeItem("user");
              dispatch(setLogOut());
              navigate("/");
            }}
          >
            <div className="flex items-center gap-3">
              <MdLogout className="text-3xl text-black" />
              <h2 className="text-xl font-semibold">Logout</h2>
            </div>
            <p className="text-sm mt-3 ml-11">
              Logout your profile as a Physio
            </p>
          </div>


        </div>
      </div>

    </>


  );
};

export default OrderHistoryPhysio;
