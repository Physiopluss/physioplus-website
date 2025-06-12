
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";


import { Breadcrumbs } from "@material-tailwind/react";
import moment from "moment";

import { RiFileDownloadLine } from "react-icons/ri";
import InvoiceDownloader from "../../components/InvoiceDownloader";

const ConsultationDetails = () => {
    const { userId, userToken } = useSelector((e) => e.auth.user || {});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { state } = useLocation();
    const orderData = state?.orderData;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    if (!userId) {
        navigate("login-physio");
    }

    const displayAmount =
        orderData?.serviceType === 0
            ? orderData?.physioId?.home?.charges
            : orderData?.serviceType === 1
                ? orderData?.physioId?.clinic?.charges
                : orderData?.physioId?.online?.charges;


    // google analytics
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Order Details" });
    }, []);


    return (
        <div className="font-Urbanist  bg-[#FFFCF0] py-8 px-4 sm:px-12 lg:px-[120px]   ">


            <div className="flex flex-col md:flex-row  w-full  justify-start md:justify-between  h-40    items-start md:items-center mb-4">

                {/* Breadcrumbs */}
                <Breadcrumbs separator=">" className="my-2 md:mx-6 lg:mx-12 text-black bg-transparent">
                    <Link to="/my-account-physio" className="text-black  font-semibold hover:text-green">My Account</Link>
                    <Link to="/all-consultation" className="text-black  font-semibold hover:text-green">My Consultation</Link>
                    <Link to="/consultation-details"> <span className="text-black hover:text-green font-bold">{orderData?.patientId?.fullName}</span></Link> {/* Active breadcrumb */}
                </Breadcrumbs>


            </div>


            <div className="mx-4 md:mx-8 lg:mx-16 -mt-12 bg-white pb-8 rounded-xl">
                {/* Tabs and Filter Row */}
                <div className="flex justify-between items-center h-14 px-4 pt-4">
                    {/* Tabs */}
                    <div className="flex gap-4 text-sm md:text-base font-medium">
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${orderData?.appointmentCompleted
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
                                    src={orderData?.patientId?.profilePhoto
                                        || "./user.png"}
                                    alt={orderData?.patientId?.fullName}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col justify-between w-full">
                                {/* Top Row: Name + Visit Type + Date/Time */}
                                <div className="space-y-1">
                                    <h2 className="text-lg font-medium text-[#4a4e69]">{orderData?.patientId?.fullName}</h2>
                                    <p className="text-sm font-semibold text-gray-500">
                                        {orderData?.serviceType === 0 ? "Home" : orderData?.serviceType === 1 ? "Clinic" : "Online"} Visit
                                    </p>

                                    <div className="flex gap-6 mt-1 text-xs md:text-sm text-black font-normal">
                                        <div className="flex items-center gap-2">
                                            <img src="/images/CalendarBlank.png" className="w-4 h-4" alt="calendar" />
                                            <span>{moment(orderData?.date).format("dddd, DD.MM.YYYY")}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <img src="/images/Clock.png" className="w-4 h-4" alt="clock" />
                                            <span>{orderData?.timeInString}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div className=" py-2 flex flex-col md:flex-row items-start justify-between gap-8 bg-white w-full ">
                            <div className="w-full mt-4 border border-gray-200 rounded-lg py-4 shadow-sm bg-white">
                                {/* Section Title */}
                                <div className="flex flex-col gap-1  px-4">
                                    <h3 className="text-sm font-semibold text-black">
                                        {orderData?.physioId?.clinic?.address && "Patient Address & "}Booking Date
                                    </h3>

                                </div>
                                <hr className="border-t border-gray-200 mx-0 my-2 p-0" />
                                {/* Booking Date */}
                                <div className="flex flex-row justify-between gap-2 mt-4 px-4">


                                    <h4 className="text-sm text-gray-600 font-semibold">Booking Date</h4>
                                    <p className="text-sm font-semibold text-black">
                                        {moment(orderData?.date).toDate().toLocaleDateString("en-IN", {
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
                                            {orderData?.patientId?.
                                                appointmentAddress
                                            }
                                        </p>
                                        <button className="mt-1 text-xs font-semibold text-green hover:underline ">
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(orderData?.patientId?.
                                                    appointmentAddress)}`}
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
                                    <h3 className="text-sm font-semibold text-black">
                                        Patient Issue
                                    </h3>

                                </div>
                                <hr className="border-t border-gray-200 mx-0 my-2 p-0" />
                                {/* Therapy/Service */}
                                {orderData?.painNotes && (
                                    <span className="text-sm text-gray-600 font-semibold px-4 line-clamp-2">
                                        {orderData?.painNotes}"
                                    </span>
                                )}
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


                                <h4 className="text-sm text-gray-600 font-semibold">Consultation Fees</h4>
                                <p className="text-sm font-semibold text-black">
                                    ₹ {displayAmount}
                                </p>

                            </div>
                            <hr className="border-t border-gray-200 mx-0 p-0 mt-2" />
                            <div className="flex flex-row justify-between gap-2 mt-4 px-4">


                                <h4 className="text-sm text-gray-600 font-semibold">
                                    Coupon or Discount<br />
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
                                                ? `- ₹ ${(displayAmount * orderData?.couponId.discount / 100).toFixed(2)}`
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
                                    {orderData?.amount ? `₹ ${orderData?.amount}` : `₹ ${orderData?.adminAmount}`}
                                </p>

                            </div>
                        </div>
                        <button onClick={() => setIsModalOpen(true)}
                            disabled={!orderData.invoice}
                            className="w-full mt-4 rounded-lg py-2 shadow-sm bg-green text-white font-semibold text-lg flex flex-row gap-2 items-center justify-center  disabled:opacity-50 disabled:cursor-not-allowed">
                            <RiFileDownloadLine className="w-5 h-5" />
                            Download Invoice
                        </button>
                        <InvoiceDownloader
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            orderData={orderData}
                            invoiceData={orderData.invoice}
                            filename={orderData.invoice ? `Invoice_${orderData.invoice.invoiceNumber}.pdf` : "Invoice_unknown.pdf"}
                        />
                    </div>


                </div>
            </div>

        </div>



    )
}

export default ConsultationDetails
