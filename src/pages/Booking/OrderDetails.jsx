import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";
import { AiOutlineArrowRight, AiOutlineArrowDown } from "react-icons/ai";
import { Breadcrumbs } from "@material-tailwind/react";
import moment from "moment";

import { RiFileDownloadLine } from "react-icons/ri";
import InvoiceDownloader from "../../components/InvoiceDownloader";
import { requestTreatment, singleOrder } from "../../api/booking";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { userId, userToken } = useSelector((e) => e.auth.user || {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const { state } = useLocation();
  const orderId = state?.appointmentId;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    setLoading(true);
    singleOrder(orderId, userToken)
      .then((data) => setOrderData(data.data))
      .catch((err) => toast.error(err.message || "Failed to fetch orders"))
      .finally(() => setLoading(false));
  }, [userId, userToken]);

  const handleSubmitTreatmentRequest = async () => {
    try {
      setLoading(true);
      console.log("Submitting treatment request...");

      const res = await requestTreatment(
        orderData?._id,
        orderData?.patientId,
        orderData?.physioId?._id,
        userToken
      );

      toast.success("Treatment request submitted successfully!");
      window.location.reload(); // Reload to fetch updated data
      console.log("Treatment request response:", res);
    } catch (err) {
      console.error("Error in request:", err);
      toast.error(
        "Failed to request treatment.",
        err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fix casing and use optional chaining properly
  const displayAmount =
    orderData?.serviceType === 0
      ? orderData?.physioId?.home?.charges
      : orderData?.serviceType === 1
      ? orderData?.physioId?.clinic?.charges
      : orderData?.physioId?.online?.charges;

  // google analytics
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: "Order Details",
    });
  }, []);

  return (
    <div className="font-Urbanist  bg-[#FFFCF0] py-8 px-4 sm:px-12 lg:px-[120px]   ">
      <div className="flex flex-col md:flex-row  w-full  justify-start md:justify-between h-24 md:h-40    items-start md:items-center mb-4">
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator=">"
          className="hidden md:flex my-2 md:mx-6 lg:mx-12 text-black bg-transparent"
        >
          <Link
            to="/profile"
            className="text-black  font-semibold hover:text-green"
          >
            My Account
          </Link>
          <Link
            to="/order-history"
            className="text-black  font-semibold hover:text-green"
          >
            My Bookings
          </Link>
          <Link to="/order-history">
            {" "}
            <span className="text-black hover:text-green font-bold">
              {orderData?.physioId?.fullName}
            </span>
          </Link>{" "}
          {/* Active breadcrumb */}
        </Breadcrumbs>

        <div className="flex md:hidden w-full bg-[#FFFDF5] py-4 px-4 md:px-6 lg:px-12 overflow-x-auto">
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs sm:text-sm md:text-base text-black">
            <Link
              to="/profile"
              className="text-black  font-semibold hover:text-green"
            >
              My Account
            </Link>
            <span className="shrink-0">{">"}</span>
            <Link
              to="/order-history"
              className="text-black  font-semibold hover:text-green"
            >
              My Bookings
            </Link>
            <span className="shrink-0">{">"}</span>
            <Link to="/order-history">
              {" "}
              <span className="text-black hover:text-green font-bold">
                {orderData?.physioId?.fullName || "Consultation Details"}
              </span>
            </Link>{" "}
            {/* Active breadcrumb */}
          </div>
        </div>
      </div>

      <div className="mx-4 md:mx-8 lg:mx-16 -mt-12 bg-white pb-8 rounded-xl">
        {/* Tabs and Filter Row */}
        <div className="flex justify-between items-center h-14 px-4 pt-4">
          {/* Tabs */}
          <div className="flex gap-4 text-sm md:text-base font-medium">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                orderData?.appointmentCompleted
                  ? "bg-[#e9f8f0] text-green"
                  : "bg-[#f7ffcf] text-yellow-700"
              }`}
            >
              {orderData?.appointmentCompleted
                ? "Consultation Completed"
                : "Consultation Pending"}
            </span>
          </div>
        </div>

        <hr className="my-4" />

        <div className="flex flex-col md:flex-row md:justify-between gap-4 px-4">
          <div className="flex flex-col   bg-white w-full md:w-2/3 px-0 ">
            <div className="bg-white flex gap-4   py-4 w-full  ">
              {/* Image */}
              <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={orderData?.physioId?.profileImage || "./user.png"}
                  alt={orderData?.physioId?.fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between w-full">
                {/* Top Row: Name + Visit Type + Date/Time */}
                <div className="space-y-1">
                  <h2 className="text-lg font-medium text-[#4a4e69]">
                    {orderData?.physioId?.fullName}
                  </h2>
                  <p className="text-sm font-semibold text-gray-500">
                    {orderData?.serviceType === "home"
                      ? "Home"
                      : orderData?.serviceType === "clinic"
                      ? "Clinic"
                      : "Online"}{" "}
                    Visit
                  </p>

                  <div className="flex flex-wrap md:flex-row  gap-2 md:gap-6 px-2 md:px-0 mt-1 text-xs md:text-sm text-black font-normal">
                    <div className="flex items-center gap-2">
                      <img
                        src="/images/CalendarBlank.png"
                        className="w-4 h-4"
                        alt="calendar"
                      />
                      <span>
                        {moment(orderData?.date).format("dddd, DD.MM.YYYY")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        src="/images/Clock.png"
                        className="w-4 h-4"
                        alt="clock"
                      />
                      <span>{orderData?.timeInString}</span>
                    </div>

                    {orderData?.otp && (
                      <span className="text-xs md:text-sm text-green font-semibold px-0 md:px-4">
                        OTP : {orderData?.otp}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className=" py-2 flex flex-col md:flex-row items-start justify-between gap-8 bg-white w-full ">
              <div className="w-full mt-4 border border-gray-200 rounded-lg py-4 shadow-sm bg-white">
                {/* Section Title */}
                <div className="flex flex-col gap-1  px-4">
                  <h3 className="text-sm font-semibold text-black">
                    {orderData?.physioId?.clinic?.address &&
                      "Physio Address & "}
                    Booking Date
                  </h3>
                </div>
                <hr className="border-t border-gray-200 mx-0 my-2 p-0" />
                {/* Booking Date */}
                <div className="flex flex-row justify-between gap-2 mt-4 px-4">
                  <h4 className="text-sm text-gray-600 font-semibold">
                    Booking Date
                  </h4>
                  <p className="text-sm font-semibold text-black">
                    {moment(orderData?.date)
                      .toDate()
                      .toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                  </p>
                </div>
                <hr className="border-t border-gray-200 mx-0 p-0 mt-2" />

                {/* Address Section */}
                {orderData?.physioId?.clinic?.address && (
                  <div className="flex flex-row justify-between gap-2 mt-4 px-4">
                    <p className="text-sm text-gray-600 font-semibold line-clamp-2 ">
                      {orderData?.physioId?.clinic?.address}
                    </p>
                    <button className="mt-1 text-xs font-semibold text-green hover:underline ">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          orderData.physioId.clinic.address
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-xs font-semibold text-green hover:underline"
                      >
                        Locate
                      </a>
                    </button>
                  </div>
                )}
              </div>

              <div className="w-full mt-4 border border-gray-200 rounded-lg py-4 shadow-sm bg-white">
                {/* Section Title */}
                <div className="flex flex-col gap-1 mb-4 px-4">
                  <h3 className="text-sm font-semibold text-black">My Issue</h3>
                </div>
                <hr className="border-t border-gray-200 mx-0 my-2 p-0" />
                {/* Therapy/Service */}
                {orderData?.painNotes && (
                  <span className="text-sm text-gray-600 font-semibold px-4 line-clamp-2">
                    {orderData?.painNotes}
                  </span>
                )}
              </div>
            </div>

            {/* Cashback Call-to-Action */}
            <div className="flex flex-col md:flex-row items-center justify-center my-7 p-4 bg-[#f5fef9] gap-2 md:gap-6 text-center">
              <div className="text-xl md:text-2xl text-green font-medium">
                Request Treatment and Get a Chance to Earn{" "}
                <span className="font-bold">70% Cashback</span>
              </div>

              {/* Right arrow for medium and up */}
              <div className="hidden md:flex text-green animate-pulse">
                <AiOutlineArrowRight className="text-4xl md:text-5xl" />
              </div>

              {/* Down arrow for small screens */}
              <div className="flex md:hidden text-green animate-pulse">
                <AiOutlineArrowDown className="text-4xl" />
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-col items-start justify-between gap-2 bg-white w-full md:w-1/4 ">
            {/* payment summery */}
            <div className="w-full mt-4 border border-gray-200 rounded-lg py-4 shadow-sm bg-white">
              {/* Section Title */}
              <div className="flex flex-col gap-1 mb-4 px-4">
                <h3 className="text-md font-semibold text-black">
                  Price Breakup
                </h3>
              </div>
              <hr className="border-t border-gray-200 mx-0 my-2 p-0" />

              <div className="flex flex-row justify-between gap-2 mt-4 px-4">
                <h4 className="text-sm text-gray-600 font-semibold">
                  Consultation Fees
                </h4>
                <p className="text-sm font-semibold text-black">
                  ₹ {displayAmount}
                </p>
              </div>
              <hr className="border-t border-gray-200 mx-0 p-0 mt-2" />
              <div className="flex flex-row justify-between gap-2 mt-4 px-4">
                <h4 className="text-sm text-gray-600 font-semibold">
                  Coupon or Discount
                  <br />
                  {orderData?.couponId?.couponName && (
                    <span className="text-xs px-2 py-1 rounded-full bg-[#e9f8f0]">
                      {orderData.couponId?.couponName}
                    </span>
                  )}
                </h4>

                <p className="text-sm font-semibold text-green">
                  {orderData?.couponId
                    ? orderData?.couponId.couponType === 0
                      ? `- ₹ ${orderData?.couponId.discount}`
                      : orderData?.couponId.couponType === 1 && displayAmount
                      ? `- ₹ ${(
                          (displayAmount * orderData?.couponId.discount) /
                          100
                        ).toFixed(2)}`
                      : "No Discount"
                    : "No Discount"}
                </p>

                {/* <p className="text-sm font-semibold text-green">
                                    {orderData?.couponId._id
                                        ? orderData?.couponId.couponType === 0
                                            ? `- ₹ ${orderData?.couponId.discount}`
                                            : orderData?.couponId.couponType === 1 && displayAmount
                                                ? `- ₹ ${(displayAmount * orderData?.couponId.discount / 100).toFixed(2)}`
                                                : "No Discount"
                                        : "No Discount"}
                                </p> */}
              </div>
              <hr className="border-t border-gray-200 mx-0 p-0 mt-2" />
              <div className="flex flex-row justify-between gap-2 mt-4 px-4">
                <h4 className="text-md text-gray-600 font-semibold">
                  Total Cost
                  {orderData?.paymentmode ? (
                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-[#e9f8f0]">
                      {orderData.paymentmode}
                    </span>
                  ) : (
                    <span className="ml-2 text-xs px-2 py-1 rounded-full bg-[#e9f8f0]">
                      Paid Online
                    </span>
                  )}
                </h4>

                <p className="text-sm font-semibold text-black">
                  {orderData?.amount
                    ? `₹ ${orderData?.amount}`
                    : `₹ ${orderData?.adminAmount}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={!orderData.invoice}
              className="w-full mt-4 rounded-lg py-2 shadow-sm bg-green text-white font-semibold text-lg flex flex-row gap-2 items-center justify-center  disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RiFileDownloadLine className="w-5 h-5" />
              Download Invoice
            </button>
            <InvoiceDownloader
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              orderData={orderData}
              invoiceData={orderData.invoice}
              filename={
                orderData.invoice
                  ? `Invoice_${orderData.invoice.invoiceNumber}.pdf`
                  : "Invoice_unknown.pdf"
              }
            />

            <button
              onClick={handleSubmitTreatmentRequest}
              disabled={orderData?.isTreatmentRequested === true}
              className={`w-full mt-4 rounded-lg py-2 shadow-sm font-semibold text-lg flex flex-row gap-2 items-center justify-center ${
                orderData?.isTreatmentRequested
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
              }`}
            >
              {orderData?.isTreatmentRequested
                ? "Treatment Already Requested"
                : "Request for Treatment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
