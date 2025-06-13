import React from 'react';
import ReactGA from "react-ga4";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '@material-tailwind/react';
import InvoiceDownloader from '../../components/InvoiceDownloader';
import { usePhysio } from '../../context/PhysioContext';
import Loading from '../../components/Loading';
import moment from 'moment';
import { physioRefundRequest } from '../../api/physioConnect';
import toast from 'react-hot-toast';

const Subscription = () => {
  const { userId, userToken } = useSelector((e) => e.auth.user || {});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { physioData, invoiceData } = usePhysio();

  if (!userId) {
    navigate("login-physio");
  }




  // Add this inside your component
  const handleRefundRequest = async (refundPercentage) => {
    try {
      setLoading(true);

      // Call the API
      const response = await physioRefundRequest(
        userId,
        refundPercentage === 1 ? "full" : "partial",
        userToken
      );

      // Handle success
      toast.success(`Refund request submitted successfully!`);

      // Reload the page
      window.location.reload();

    } catch (error) {
      console.error("Refund request failed:", error);
      toast.error(error.message || "Failed to process refund request");
    } finally {
      setLoading(false);
    }
  };

  // Calculate duration between two dates
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return "N/A";

    const start = moment(startDate);
    const end = moment(endDate);

    const days = end.diff(start, 'days');
    const months = end.diff(start, 'months');

    if (months > 0) {
      return `${months} Month${months > 1 ? 's' : ''}`;
    }
    return `${days} Day${days !== 1 ? 's' : ''}`;
  };

  const subscriptionStartedAt = physioData?.subscriptionId?.startAt;
  const patientCount = physioData?.subscriptionId?.patientCount || 0;
  const isApproved = physioData?.activeStatus === 1;
  const isRefunded = physioData?.subscriptionId?.isRefunded;

  const monthsSinceSubscription = moment().diff(moment(subscriptionStartedAt), "months");

  const refundType = (() => {
    if (isRefunded) return null;

    if (isApproved && patientCount === 0 && monthsSinceSubscription < 6) {
      return { type: "partial", percent: 70 };
    }

    if (isApproved && patientCount > 0) {
      return { type: "not_eligible", percent: 0 };
    }

    if (patientCount === 0 && monthsSinceSubscription >= 6) {
      return { type: "full", percent: 100 };
    }

    return null;
  })();

  const subscriptionPlans = [
    {
      name: "Pro Plan",
      amount: 3499,
      gradient: "from-[#039443] to-[#17b882]",
      validFrom: physioData?.subscriptionId?.startAt
        ? moment(physioData.subscriptionId.startAt).format('DD MMM YYYY')
        : 'N/A',
      validTill: physioData?.subscriptionId?.expireAt
        ? moment(physioData.subscriptionId.expireAt).format('DD MMM YYYY')
        : 'N/A',
      paymentDate: physioData?.subscriptionId?.createdAt
        ? moment(physioData.subscriptionId.createdAt).format('DD MMM YYYY')
        : 'N/A',
      duration: calculateDuration(
        physioData?.subscriptionId?.startAt,
        physioData?.subscriptionId?.expireAt
      ),
      isExpired:
        physioData?.subscriptionId?.expireAt
          ? moment().isAfter(moment(physioData.subscriptionId.expireAt))
          : false,
      daysLeft: physioData?.subscriptionId?.expireAt
        ? Math.max(0, moment(physioData.subscriptionId.expireAt).diff(moment(), 'days'))
        : 0,
      active: !(!physioData?.subscriptionId?.expireAt ||
        moment().isAfter(moment(physioData.subscriptionId.expireAt)))
    }
  ];

  // google analytics
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "subscription" });
  }, []);

  // scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const invoice = {

    invoiceNumber: invoiceData.invoiceNumber,
    createdAt: invoiceData.createdAt,
    paymentMode: invoiceData.paymentMode,
    transactionId: invoiceData?.transactionId?._id,
    type: invoiceData.type,
    physioName: physioData.fullName,
    physioAddress: invoiceData.physioAddress,
    physioCity: physioData.city,
    physioState: physioData.state,
    amount: invoiceData.amount,
    couponName: invoiceData.couponName,
    couponType: invoiceData.couponType,
    couponDiscount: invoiceData.couponDiscount,

  };




  return (
    <>
      <div className="font-Urbanist bg-[#FFFCF0] py-8 px-4 sm:px-12 lg:px-[120px]">
        <div className="h-40 w-full flex items-center">
          <Breadcrumbs separator=">" className="text-black bg-transparent">
            <Link to="/my-account-physio" className="text-black font-semibold hover:text-green">
              My Account
            </Link>
            <Link to="/Subscription">
              <span className="text-black hover:text-green font-bold">View Subscription</span>
            </Link>
          </Breadcrumbs>
        </div>
      </div>

      <div className="flex flex-col md:flex-row min-h-screen bg-transparent py-8 mx-4 sm:mx-12 lg:mx-[120px] -mt-24 gap-4">
        {loading ? (
          <Loading />
        ) : (
          <div className="flex-1 p-8 bg-white rounded-2xl border-2 border-gray-300">
            {/* Subscription Cards */}
            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {subscriptionPlans.map((plan, idx) => (
                <div
                  key={idx}
                  className={`p-6 rounded-xl shadow bg-gradient-to-br ${plan.gradient} flex flex-col justify-between relative min-h-[180px]`}
                >
                  {/* Top Row */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                      <p className="text-sm font-semibold mt-1 text-white">₹ {plan.amount.toLocaleString("en-IN")}</p>
                    </div>
                    <button
                      className={`text-xs font-semibold px-4 py-1 rounded border ${plan.active
                        ? "bg-white text-green border-white"
                        : "text-white border-white hover:bg-white hover:text-green"
                        } transition-all`}
                    >
                      {plan.active ? "Active" : plan.isExpired ? "Expired" : "Subscribe"}
                    </button>
                  </div>

                  {/* Bottom Row - Dates */}
                  <div className="my-6 grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-10 justify-center text-xs font-medium text-white text-center">
                    <div>
                      <span className="block opacity-80">Valid From</span>
                      <span>{plan.validFrom}</span>
                    </div>
                    <div>
                      <span className="block opacity-80">Valid Till</span>
                      <span>{plan.validTill}</span>
                    </div>
                    <div>
                      <span className="block opacity-80">Payment Date</span>
                      <span>{plan.paymentDate}</span>
                    </div>
                    <div>
                      <span className="block opacity-80">Duration</span>
                      <span>{plan.duration}</span>
                    </div>
                  </div>

                  {/* Days remaining indicator */}
                  {!plan.isExpired && plan.daysLeft > 0 && (
                    <div className="absolute bottom-2 right-2 text-xs text-white">
                      {plan.daysLeft} day{plan.daysLeft !== 1 ? 's' : ''} remaining
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-4 text-sm text-gray-600">
              {/* Case: Refund Already Requested */}
              {physioData?.isPhysioConnectRefundRequest && (
                <>
                  <p className="text-sm text-blue-700">
                    Refund request already submitted. Our team will review and process it soon.
                  </p>
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-semibold cursor-not-allowed"
                    disabled
                  >
                    Refund Requested
                  </button>
                </>
              )}

              {/* Case: Partial Refund (70%) */}
              {!physioData?.isPhysioConnectRefundRequest && refundType?.type === "partial" && (
                <>
                  <p className="text-sm text-green-700">
                    You are eligible for a <span className="font-bold">70% refund</span> as you haven't received any patients yet.
                  </p>
                  <button
                    onClick={() => handleRefundRequest(0.7)}
                    className="bg-green text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-600 transition-colors"
                  >
                    Issue Refund (70%)
                  </button>
                </>
              )}

              {/* Case: Full Refund (100%) */}
              {!physioData?.isPhysioConnectRefundRequest && refundType?.type === "full" && (
                <>
                  <p className="text-sm text-green-700">
                    You're eligible for a <span className="font-bold text-green">100% full refund</span> as no patients were referred in 6 months.
                  </p>
                  <button
                    onClick={() => handleRefundRequest(1)}
                    className="bg-green text-white px-4 py-2 rounded text-sm font-semibold hover:bg-green-600 transition-colors"
                  >
                    Issue Full Refund
                  </button>
                </>
              )}

              {/* Case: Not Eligible */}
              {!physioData?.isPhysioConnectRefundRequest && refundType?.type === "not_eligible" && (
                <>
                  <p className="text-sm text-red-600">
                    Not eligible for refund since you've received patient(s).
                  </p>
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-semibold cursor-not-allowed"
                    disabled
                  >
                    Not Eligible
                  </button>
                </>
              )}

              {/* Case: Pending Evaluation */}
              {!physioData?.isPhysioConnectRefundRequest && !refundType && (
                <p className="text-sm text-gray-600">
                  Refund eligibility will be assessed after your profile is approved and usage is evaluated.
                </p>
              )}

              {/* Policy Links */}
              <p className="text-sm text-gray-600 mt-4">
                View Our&nbsp;
                <span
                  onClick={() => window.open('/physio-terms&condition', '_blank')}
                  className="text-green cursor-pointer font-semibold hover:underline"
                >
                  Terms of Service
                </span>
                &nbsp;and&nbsp;
                <span
                  onClick={() => window.open('/physio-refund-policy', '_blank')}
                  className="text-green cursor-pointer font-semibold hover:underline"
                >
                  Refund Policy
                </span>
              </p>
            </div>


            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-green text-white px-4 py-2 my-4 rounded text-sm font-semibold"
            >
              Download Invoice
            </button>

            <InvoiceDownloader
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              invoiceData={invoice}
              filename={`Invoice_${invoice.invoiceNumber}.pdf`}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Subscription;