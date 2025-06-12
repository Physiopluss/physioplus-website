import { Breadcrumbs } from '@material-tailwind/react';
import React, { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { allOrders } from '../../api/booking';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import ReactGA from "react-ga4";
import { PiWalletBold } from 'react-icons/pi';
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { physioWalletData, physioWalletTransaction, physioWalletWithdrawTransaction, physioWithdrawalRequest } from '../../api/physioConnect';


const Wallet = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [walletHistory, setWalletHistory] = useState([]);
  const { userId, userToken } = useSelector((e) => e.auth.user || {});
  const [activeTab, setActiveTab] = useState("wallet");
  const [orders, setOrders] = useState([]);

  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [walletHistoryData, setWalletHistoryData] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [wallet, setWallet] = useState();


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // or 5, 20, etc.


  if (!userId) {
    navigate("login-physio");
  }

  // const handleTopUp = async () => {
  //     if (!topUpAmount || isNaN(topUpAmount) || topUpAmount <= 0) {
  //       setError("Please enter a valid amount");
  //       return;
  //     }
  //     setLoading(true);
  //     setError("");
  //     setSuccess(false);

  //     try {
  //       const res = await fetch("/api/wallet/topup", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${userToken}`,
  //         },
  //         body: JSON.stringify({ topUpAmount: Number(topUpAmount) }),
  //       });

  //       if (!res.ok) {
  //         const data = await res.json();
  //         throw new Error(data.message || "Top-up failed");
  //       }

  //       setSuccess(true);
  //       setTopUpAmount("");
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };



  const withdrawalSchema = Yup.object().shape({
    amount: Yup.number()
      .typeError("Amount must be a number")
      .min(1, "Amount must be at least ₹1")
      .required("Amount is required"),
  });

  useEffect(() => {
    if (!userId || !userToken) return;

    const fetchWalletData = async () => {
      try {
        const walletRes = await physioWalletData(userId, userToken);
        setWallet(walletRes || []);
      } catch (err) {
        console.error("Error fetching wallet:", err);
        setError("Failed to load wallet");
      }
    };

    const fetchWalletHistory = async () => {
      try {
        const walletRes = await physioWalletTransaction(userId, userToken);
        setWalletHistoryData(walletRes?.data || []);
      } catch (err) {
        console.error("Error fetching wallet history:", err);
        setError("Failed to load wallet transactions.");
      }
    };

    const fetchWithdrawalRequests = async () => {
      try {
        const withdrawalRes = await physioWalletWithdrawTransaction(userId, userToken);
        setWithdrawalRequests(withdrawalRes?.data?.transactions || []);
      } catch (err) {
        console.error("Error fetching withdrawal requests:", err);
        setError("Failed to load withdrawal requests.");
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([fetchWalletData(), fetchWalletHistory(), fetchWithdrawalRequests()]);
      setLoading(false);
    };

    fetchAllData();
  }, [userId, userToken]);



  const statusColors = {
    pending: "text-yellow-600 bg-yellow-50",
    paid: "text-green bg-[#f0ffee]",
    failed: "text-red-600 bg-red-50",
  };


  // Filtered Wallet History
  const filteredWalletHistory = walletHistoryData.filter((item) => {
    const search = searchQuery.toLowerCase();
    const amountMatch = item.amount?.toString().includes(search);
    const patientNameMatch = item.patientId?.fullName?.toLowerCase().includes(search);
    const paymentModeMatch = item.paymentMode?.toLowerCase().includes(search);
    return amountMatch || paymentModeMatch || patientNameMatch;
  });

  // Filtered Withdrawal Requests
  const filteredWithdrawals = (statusFilter === "all"
    ? withdrawalRequests
    : withdrawalRequests.filter((item) => {
      if (statusFilter === "approved") return item.paymentStatus === "paid";
      if (statusFilter === "pending") return item.paymentStatus === "pending";
      if (statusFilter === "cancelled") return item.paymentStatus === "failed";
      return true;
    })
  ).filter((item) => {
    const search = searchQuery.toLowerCase();
    const dateString = new Date(item.createdAt).toLocaleDateString("en-GB");
    const amountString = item.amount?.toString();
    return dateString.includes(search) || amountString.includes(search);
  });

  const displayedData =
    activeTab === "wallet" ? filteredWalletHistory : filteredWithdrawals;
  const totalPages = Math.ceil(displayedData.length / itemsPerPage);
  const paginatedData = displayedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "wallet" });
  }, []);
  return (
    <>
      <div className="font-Urbanist  bg-[#FFFCF0] py-8 px-4 sm:px-12 lg:px-[120px]   ">


        <div className="flex flex-col md:flex-row  w-full  justify-start md:justify-between  h-40    items-start md:items-center mb-4">

          {/* Breadcrumbs */}
          <Breadcrumbs separator=">" className="my-2 md:mx-6 lg:mx-12 text-black bg-transparent">
            <Link to="/my-account-physio" className="text-black  font-semibold hover:text-green">My Account</Link>
            <Link to="/wallet"> <span className="text-black hover:text-green font-bold">My Wallet</span></Link> {/* Active breadcrumb */}
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
              placeholder="Search"
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
      </div>


      <div className="font-Urbanist  mx-4 sm:mx-12 lg:mx-[120px]  -mt-20 ">
        <div className="mx-auto md:mx-8 lg:mx-16 bg-white pb-8 rounded-xl  ">
          <div className="flex justify-between items-center h-14 px-4 ">
            {/* Left Section: Wallet Info */}
            <div className="flex items-center gap-3">
              <PiWalletBold className="text-sm text-black" />
              <h2 className="text-sm font-semibold">My Wallet</h2>
              <span className="text-xs font-semibold bg-green text-white px-2 py-0.5 rounded">
                ₹ {(wallet?.physioWallet || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: (wallet?.physioWallet % 1 === 0 ? 0 : 2),
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>

            {/* Right Section: Buttons */}
            <div className="flex gap-2">
              <button className="text-green border border-green text-xs font-semibold px-3 py-1 rounded hover:bg-green  hover:text-white transition-all" onClick={() => setShowWithdrawalModal(true)}>
                Create Withdrawal Request
              </button>



              {/* <button className="text-green border border-green text-xs font-semibold px-3 py-1 rounded hover:bg-green hover:text-white  transition-all"
                onClick={() => setIsModalOpen(true)}
              >
                Wallet Top Up
              </button> */}

              {/* {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
                    <h2 className="text-lg font-semibold mb-4">Enter the amount which you want to Top Up in Wallet</h2>

                    <input
                      type="number"
                      min="1"
                      placeholder="Enter amount"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-green"
                      disabled={loading}
                    />

                    {loading && <p>Processing top-up...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {success && <p className="text-green-600">Wallet topped up successfully!</p>}

                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        className="px-8 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition"
                        onClick={() => setIsModalOpen(false)}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-8 py-2 rounded-lg border-green border text-green hover:bg-green hover:text-white transition"
                        onClick={handleTopUp}
                        disabled={loading}
                      >
                        Top Up
                      </button>
                    </div>
                  </div>
                </div>
              )} */}

            </div>

            {showWithdrawalModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg">
                  <h2 className="text-lg font-semibold mb-4">
                    Enter the amount which you want to request Withdrawal
                  </h2>

                  <Formik
                    initialValues={{ amount: "" }}
                    validationSchema={withdrawalSchema}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                      try {
                        const res = await physioWithdrawalRequest(userId, values.amount, userToken);
                        console.log("Success:", res.message);
                        resetForm();
                        setShowWithdrawalModal(false);

                        // ✅ Reload the page to refetch data
                        setTimeout(() => {
                          window.location.reload();
                        }, 300); // small delay to ensure modal closes smoothly
                      } catch (err) {
                        console.error("Error:", err.message);
                      } finally {
                        setSubmitting(false);
                      }
                    }}

                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <Field
                          type="number"
                          name="amount"
                          placeholder="₹ Enter amount"
                          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-green"
                        />
                        <ErrorMessage
                          name="amount"
                          component="div"
                          className="text-red-500 text-xs mb-3"
                        />

                        <div className="flex justify-end gap-4">
                          <button
                            type="button"
                            onClick={() => setShowWithdrawalModal(false)}
                            className="px-8 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition"
                            disabled={isSubmitting}
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            className="px-8 py-2 rounded-lg border-green border text-green hover:bg-green hover:text-white transition"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Requesting..." : "Request"}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            )}



          </div>

          <div className="flex flex-col md:flex-row gap-4 px-4">
            {/* Wallet Balance Card */}
            <div className="flex items-center border rounded-lg px-4 py-3 w-full md:w-1/3">
              <div className="p-2 bg-[#f0ffee] rounded-full">
                <PiWalletBold className="text-2xl text-green" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Wallet Balance</p>
                <p className="text-lg font-semibold">₹ {(wallet?.physioWallet || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: (wallet?.physioWallet % 1 === 0 ? 0 : 2),
                  maximumFractionDigits: 2,
                })}</p>
              </div>
            </div>

            {/* Physioplus 22% Card */}
            <div className="flex items-center border rounded-lg px-4 py-3 w-full md:w-1/3">
              <div className="p-2 bg-[#f0ffee] rounded-full ">
                <PiWalletBold className="text-2xl text-green" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Physioplus 22%</p>
                <p className="text-lg font-semibold">   ₹ {(wallet?.physioPlusEarning || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: (wallet?.physioPlusEarning % 1 === 0 ? 0 : 2),
                  maximumFractionDigits: 2,
                })}
                </p>
              </div>
            </div>

            {/* GST 18% Card */}
            <div className="flex items-center border rounded-lg px-4 py-3 w-full md:w-1/3">
              <div className="p-2 bg-[#f0ffee] rounded-full">
                <PiWalletBold className="text-2xl text-green" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">GST 18%</p>
                <p className="text-lg font-semibold">₹ {(wallet?.gstAmount || 0).toLocaleString("en-IN", {
                  minimumFractionDigits: (wallet?.gstAmount % 1 === 0 ? 0 : 2),
                  maximumFractionDigits: 2,
                })}</p>
              </div>
            </div>
          </div>

          <div className="p-6 max-w-6xl mx-auto">
            {/* Tabs */}
            <div className="flex gap-6 border-b mb-4">
              {["wallet", "request"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                    setSearchQuery("");
                  }}
                  className={`pb-2 font-semibold transition-all ${activeTab === tab
                    ? "text-green border-b-2 border-green"
                    : "text-gray-500"
                    }`}
                >
                  {tab === "wallet" ? "Wallet History" : "Request Withdrawal"}
                </button>
              ))}
            </div>

            {/* Subheading and Filters */}
            {activeTab === "request" && (
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Withdrawal Request
                  </h2>
                  <p className="text-sm text-gray-500">
                    Check the withdrawal requests
                  </p>
                </div>

                {/* Status Filter */}
                <div className="flex gap-3 mb-4">
                  {["all", "pending", "approved", "cancelled"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setStatusFilter(status);
                        setCurrentPage(1);
                      }}
                      className={`text-sm px-3 py-1 border rounded-full ${statusFilter === status
                        ? "text-green border-green"
                        : "text-gray-500 border-gray-300"
                        }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    {activeTab === "wallet" ? (
                      <>
                        <th className="px-6 py-3 text-left">Patient Name</th>
                        <th className="px-6 py-3 text-left">Transaction Amount</th>
                        <th className="px-6 py-3 text-left">Price Breakup</th>
                        <th className="px-6 py-3 text-left">Payment Method</th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-3 text-left">Request Date</th>
                        <th className="px-6 py-3 text-left">Requested Amount</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-left">Approved Date</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, idx) =>
                    activeTab === "wallet" ? (
                      <tr key={idx} className="border-t">
                        <td className="px-6 py-3 font-medium">
                          {item?.patientId?.fullName}
                          <div className="text-xs text-gray-500">{item.type}</div>
                        </td>
                        <td className="px-6 py-3">₹{item.amount}</td>
                        <td className="px-6 py-3">
                          ₹
                          {(item.amount -
                            item.physioPlusAmount -
                            item.gstAmount
                          )?.toFixed(2)}
                          <span className="text-xs text-gray-500">
                            {" "}
                            + ₹{item.physioPlusAmount?.toFixed(2)} (PhysioPlus) + ₹
                            {item.gstAmount?.toFixed(2)} (GST)
                          </span>
                        </td>
                        <td className="px-6 py-3">{item.paymentMode}</td>
                      </tr>
                    ) : (
                      <tr key={idx} className="border-t">
                        <td className="px-6 py-3">
                          {new Date(item.createdAt).toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-6 py-3">₹{item.amount?.toLocaleString()}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[item.paymentStatus] ||
                              "text-gray-500 bg-gray-100"
                              }`}
                          >
                            {item.paymentStatus === "paid"
                              ? "Approved"
                              : item.paymentStatus === "pending"
                                ? "Pending"
                                : item.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          {item.paymentStatus === "paid"
                            ? new Date(item.updatedAt).toLocaleDateString("en-GB")
                            : "--"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button
                  className="flex items-center gap-1 px-3 py-1 border rounded text-sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <FiArrowLeft className="text-xs" /> Previous
                </button>

                <div className="flex items-center gap-1 text-sm">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`px-2 py-1 rounded ${pg === currentPage
                        ? "bg-green text-white"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {pg}
                    </button>
                  ))}
                </div>

                <button
                  className="flex items-center gap-1 px-3 py-1 border rounded text-sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next <FiArrowRight className="text-xs" />
                </button>
              </div>
            )}
          </div>



        </div>
      </div>

    </>
  )
}

export default Wallet
