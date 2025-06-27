import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";
import { Breadcrumbs } from "@material-tailwind/react";
import { RiFileDownloadLine } from "react-icons/ri";
import moment from "moment";
import toast from "react-hot-toast";
import InvoiceDownloader from "../../components/InvoiceDownloader";
import CashbackModal from "../../components/CashbackModal";
import {
  makeTreatmentPaymentToRazorpay,
  singleOrder,
  treatmentTransactions,
  checkCashback,
  updateCashback,
} from "../../api/booking";
import TransactionModal from "../../components/TransactionModal";

const TreatmentDetails = () => {
  const { userId, userToken } = useSelector((e) => e.auth.user || {});
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCashbackModalOpen, setIsCashbackModalOpen] = useState(false);
  const [isCheckingCashback, setIsCheckingCashback] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [cashbackData, setCashbackData] = useState(null);
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState([]);
  const [isAllDaysPaid, setIsAllDaysPaid] = useState(false);
  const orderId = state?.treatmentId;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Check If Payment is Done for All Treatment Days
  useEffect(() => {
    const isAllPaid = orderData?.isTreatmentScheduled?.treatmentDate?.every((s) => s?.isPaid);
    setIsAllDaysPaid(isAllPaid);
  }, [orderData])

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

  const treatmentInfo = orderData?.isTreatmentScheduled;

  const displayAmount =
    orderData?.serviceType === 0
      ? orderData?.physioId?.home?.charges
      : orderData?.serviceType === 1
        ? orderData?.physioId?.clinic?.charges
        : orderData?.physioId?.online?.charges;

  const handleViewHistory = async () => {
    try {
      const result = await treatmentTransactions(orderId, userToken);
      const txns = result?.data || []; // make sure to use the right field from your backend
      setTransactions(txns);
      setIsTransactionModalOpen(true);
    } catch (err) {
      console.error("❌ Failed to fetch transactions:", err);
    }
  };

  const handleCheckCashback = async () => {
    try {
      setIsCheckingCashback(true);
      const appointmentId = orderData?._id;
      const cashback = await checkCashback(appointmentId);
      console.log("Cashback:", cashback.data);

      if (!cashback.data) {
        return toast.error(cashback?.message || 'No cashback available for redemption');
      }

      // cashback = {
      //   "_id": "685d13ff237dc29c48700155",
      //   "userId": "685d0dd0237dc29c486fdbf1",
      //   "transactionId": "685d13ff237dc29c48700148",
      //   "rewardAmount": 0.6,
      //   "userUpiId": null,
      //   "appointmentId": "685d1138aaaa585fb2ee7cec",
      //   "rewardPercentage": "5%",
      //   "status": "pending",
      //   "expiresAt": "2025-06-28T09:33:51.942Z",
      //   "createdAt": "2025-06-26T09:33:51.943Z",
      //   "updatedAt": "2025-06-26T09:33:51.943Z",
      //   "__v": 0
      // }

      if (cashback.data?.status !== "pending") {
        toast.success('Cashback is already being processed or completed!');
        return;
      }

      setCashbackData(cashback.data);
      setIsCashbackModalOpen(true);
    } catch (err) {
      console.error("❌ Failed to check cashback:", err);
      toast.error(err?.message || 'Failed to check cashback availability');
    } finally {
      setIsCheckingCashback(false);
    }
  };

  const handleRedeemCashback = async (upiId) => {
    if (!cashbackData?._id || !upiId) return;

    try {
      setIsRedeeming(true);
      const result = await updateCashback(cashbackData._id, upiId);

      if (result && result.success) {
        toast.success('Cashback redemption request submitted successfully!');
        setIsCashbackModalOpen(false);
      } else {
        throw new Error(result?.message || 'Failed to process cashback redemption');
      }
    } catch (err) {
      console.error("❌ Failed to redeem cashback:", err);
      toast.error(err?.message || 'Failed to process cashback redemption');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleTreatmentPayment = async ({ sessionId = null }) => {
    if (!orderData || !userToken || !userId) {
      toast.error("Missing user or order details.");
      return;
    }

    const treatment = orderData?.isTreatmentScheduled;

    const dateIdArray = sessionId
      ? [sessionId]
      : treatment?.treatmentDate?.filter((s) => !s?.isPaid).map((s) => s?._id);

    if (!dateIdArray?.length) {
      toast.success("All sessions are already paid.");
      return;
    }

    const amountToPay = treatment.amount * dateIdArray.length;

    try {
      const result = await makeTreatmentPaymentToRazorpay({
        userToken,
        appointmentsId: orderData._id,
        dateIdArray,
        isRazorpay: true,
        patientId: userId,
        appointmentAmount: treatment.amount,
        amount: amountToPay,
        couponId: orderData?.couponId?._id || null,
      });
      console.log(result);

      if (result.success === true && result.status === 200) {
        toast.success("Payment successful!");
      } else {
        toast.error("Payment might have failed.");
      }
    } catch (err) {
      console.error("❌ Payment Error:", err);
      toast.error(err?.message || "Payment failed.");
    }
  };

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: "Treatment Details",
    });
  }, []);

  return (
    <div className="font-Urbanist bg-[#FFFCF0] py-8 px-4 sm:px-12 lg:px-[120px]">
      {/* Breadcrumbs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <Breadcrumbs separator=">" className="text-black bg-transparent">
          <Link
            to="/profile"
            className="text-black font-semibold hover:text-green"
          >
            My Account
          </Link>
          <Link
            to="/order-history"
            className="text-black font-semibold hover:text-green"
          >
            My Bookings
          </Link>
          <span className="text-black hover:text-green font-bold">
            {orderData?.physioId?.fullName}
          </span>
        </Breadcrumbs>
      </div>

      {/* Top Info Section */}
      <div className="mx-4 md:mx-8 lg:mx-16  bg-white pb-8   rounded-xl">
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

                  <div className="flex gap-6 mt-1 text-xs md:text-sm text-black font-normal">
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
                      <span className="text-sm text-green font-semibold px-4">
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
          </div>
          <div className="flex flex-col md:flex-col items-center justify-between gap-2 bg-white w-full md:w-1/4 ">
            {/* payment summery */}
            <div className="w-full mt-4 border border-gray-200 rounded-lg py-4 shadow-sm bg-white">
              {/* Section Title */}
              <div className="flex flex-col gap-1 mb-4 px-4">
                <h3 className="text-md font-semibold text-black">
                  Consultation Price Breakup
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
              disabled={!orderData.invoice || orderData.invoice.type != "treatment"}
              className="w-full mt-4 rounded-lg py-2 shadow-sm bg-green text-white font-semibold text-lg flex flex-row gap-2 items-center justify-center  disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RiFileDownloadLine className="w-5 h-5" />
              Download Invoice
            </button>
            <p className="text-xs text-gray-600 mt-2">* Available after treatment completion</p>
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
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="mx-4 md:mx-8 lg:mx-16 mt-6 bg-white rounded-xl divide-y divide-gray-200">
        <details open className="p-4">
          <summary className="font-semibold text-lg text-black cursor-pointer">
            General Details
          </summary>
          <div className="mt-4 text-sm space-y-1">
            <p>
              <strong>Patient Name:</strong> {orderData?.patientName}
            </p>
            <p>
              <strong>Patient Age:</strong> {orderData?.age} years
            </p>
            <p>
              <strong>Gender:</strong>{" "}
              {orderData?.gender === 0
                ? "Female"
                : orderData?.gender === 1
                  ? "Male"
                  : "Other"}
            </p>
            <p>
              <strong>Service Type:</strong>{" "}
              {orderData?.serviceType === 0
                ? "Home Visit"
                : orderData?.serviceType === 1
                  ? "Clinic Visit"
                  : "Online Visit"}
            </p>
            <p>
              <strong>Consultation Amount:</strong> ₹ {orderData?.amount}
            </p>
            <p>
              <strong>Payment:</strong> {orderData?.paymentmode || "Online"} -{" "}
              <span
                className={`font-semibold ${orderData?.paymentStatus === 1 ? "text-green" : "text-red-500"
                  }`}
              >
                {orderData?.paymentStatus === 1 ? "Paid" : "Unpaid"}
              </span>
            </p>
          </div>
        </details>

        <details className="p-4">
          <summary className="font-semibold text-lg text-black cursor-pointer">
            Your Problem
          </summary>
          <div className="mt-4 text-sm text-gray-700 border p-2 rounded bg-gray-50">
            {orderData?.painNotes || "Patient problem described by patient"}
          </div>
        </details>

        <details className="p-4">
          <summary className="font-semibold text-lg text-black cursor-pointer">
            Physio Prescription
          </summary>
          <div className="mt-4 text-sm text-gray-700 border p-2 rounded bg-gray-50">
            {treatmentInfo?.prescriptionNotes ||
              "Prescription not provided yet"}
          </div>
        </details>

        <details className="p-4">
          <summary className="font-semibold text-lg text-black cursor-pointer">
            Treatment Report
          </summary>
          <div className="mt-4 text-sm space-y-1">
            <p>
              <strong>Treatment Type:</strong>{" "}
              {orderData?.serviceType === 0
                ? "Home Visit"
                : orderData?.serviceType === 1
                  ? "Clinic Visit"
                  : "Online Visit"}
            </p>
            <p>
              <strong>Treatment Days:</strong>{" "}
              {treatmentInfo?.treatmentDate?.length} Days Plan
            </p>
            <p>
              <strong>Treatment Duration:</strong>{" "}
              {treatmentInfo?.treatmentDate?.length > 0
                ? `${moment(treatmentInfo.treatmentDate[0].date).format(
                  "D MMM"
                )} - ${moment(
                  treatmentInfo.treatmentDate[
                    treatmentInfo.treatmentDate.length - 1
                  ].date
                ).format("D MMM")}`
                : "-"}
            </p>
            <p>
              <strong>Treatment Amount:</strong> ₹{" "}
              {(treatmentInfo?.amount || 0).toLocaleString("en-IN")}
            </p>
          </div>

          {/* Daily Sessions */}
          <div className="mt-4">
            {treatmentInfo?.treatmentDate?.map((session, index) => (
              <div
                key={index}
                className="flex justify-between border-b py-1 text-sm items-center"
              >
                <span>{moment(session.date).format("D MMM")}</span>
                <span
                  className={`font-semibold flex items-center gap-2 ${session?.isPaid ? "text-green" : "text-red-500"
                    }`}
                >
                  ₹ {(treatmentInfo?.amount || 0).toLocaleString("en-IN")}
                  {session?.isPaid ? (
                    <span className="font-medium text-green">Paid</span>
                  ) : (
                    <span
                      onClick={() =>
                        handleTreatmentPayment({ sessionId: session._id })
                      }
                      className="underline cursor-pointer text-green"
                    >
                      Pay
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </details>

        {/* Cashback Call-to-Action */}
        <div className="p-4 bg-[#f5fef9]">
          <h3 className="text-sm font-semibold text-black mb-2">
            Payment Overview
          </h3>
          <div className="text-xl text-green font-medium mb-4 text-center">
            Pay at once and get a chance to get{" "}
            <span className="font-bold">70% Cashback</span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleViewHistory}
              className="w-full py-2 border border-green text-green rounded-lg font-semibold hover:bg-green hover:text-white transition"
            >
              View History
            </button>

            {isAllDaysPaid ? (
              <button
                onClick={handleCheckCashback}
                disabled={isCheckingCashback}
                className="w-full py-2 bg-green text-white rounded-lg font-semibold hover:bg-green-dark transition"
              >
                {isCheckingCashback ? "Checking..." : "Get Cashback"}
              </button>
            ) : (
              // Pay at once button
              <button
                className="w-full py-2 bg-green text-white rounded-lg font-semibold hover:bg-green-dark transition"
                onClick={() => handleTreatmentPayment({ sessionId: null })}
              >
                Pay at once
              </button>
            )}
          </div>

          <TransactionModal
            orderData={orderData}
            isOpen={isTransactionModalOpen}
            onClose={() => setIsTransactionModalOpen(false)}
            transactions={transactions}
          />
        </div>
      </div>
      <CashbackModal
        isOpen={isCashbackModalOpen}
        onClose={() => setIsCashbackModalOpen(false)}
        onRedeem={async (upiId) => {
          try {
            await handleRedeemCashback(upiId);
            // Show success state in the modal
            setCashbackData(prev => ({
              ...prev,
              status: 'process',
              userUpiId: upiId
            }));
          } catch (error) {
            // Error is already handled in handleRedeemCashback
            console.error("Error redeeming cashback:", error);
          }
        }}
        loading={isRedeeming}
        cashbackData={cashbackData}
      />
    </div>
  );
};

export default TreatmentDetails;
