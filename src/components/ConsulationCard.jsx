import React, { useState } from 'react'

import moment from "moment";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import InvoiceDownloader from './InvoiceDownloader';



const ConsulationCard = ({ orderData }) => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);



    const handleViewDetails = () => {
        navigate('/consultation-details', { state: { orderData } });
    };
    return (
        <>
            <style>
                {`
					@keyframes fadeIn {
						from { opacity: 0; transform: translateY(-2px); }
						to { opacity: 1; transform: translateY(0); }
					}
					.animate-fade {
						animation: fadeIn 0.2s ease-out;
					}
				`}
            </style>
            <div className="w-full  md:bg-[#E6F4EC]  rounded-3xl border border-[#E6F4EC] shadow-md overflow-hidden ">


                <div className="flex flex-col md:flex-row items-center justify-between bg-white ">
                    <div className="w-full md:w-fit flex items-center gap-4 p-2">
                        <div className="relative rounded-full overflow-hidden ">
                            <img
                                src={orderData?.patientId?.profilePhoto
                                    ? orderData.patientId.profilePhoto
                                    : "./user.png"}
                                alt={orderData?.patientId?.fullName}
                                className="object-cover w-20 h-20 aspect-square"
                            />
                        </div>
                        <div className="space-y-2">
                            <div>
                                <h2 className="text-lg font-medium text-[#4a4e69] mb-1">{orderData?.patientId?.fullName}</h2>
                                <div className="font-semibold text-gray-500 text-md">
                                    {orderData?.serviceType === 0 ? "Home" : orderData?.serviceType === 1 ? "Clinic" : "Online"} Consultation
                                </div>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-1 text-black font-normal text-xs md:text-sm lg:text-base">

                                    <img src="\images\CalendarBlank.png" alt="" className="w-4 h-4" />
                                    <span>{moment(orderData?.date).format("dddd, DD.MM.YYYY")}</span>

                                </div>
                                <div className="flex items-center gap-1 text-black font-normal text-xs md:text-sm lg:text-base">
                                    <img src="\images\Clock.png" alt="" className="w-4 h-4" />
                                    <span>{orderData?.timeInString}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block p-2">

                        <div className="font-medium">₹ {orderData?.amount}</div>
                    </div>

                    <div className="md:border-l-2 p-2 ">
                        <div className=" w-full md:w-fit flex flex-col gap-2 mt-4 md:mt-0  p-2 ">
                            <button
                                onClick={handleViewDetails}
                                className="w-64 md:w-full text-sm md:text-base bg-green text-white  px-6 sm:px-20 md:px-10 py-2 rounded-full hover:bg-emerald-700 transition-colors"
                            >
                                View Details
                            </button>
                            {/* <Link
								to={"https://play.google.com/store/apps/details?id=com.physioplus.physioplus&hl=en"}
								target="_blank"
								className="w-64 md:w-full text-sm md:text-base bg-[#F1F9F4] text-center text-black px-6 sm:px-10 md:px-12 py-2 rounded-full hover:bg-emerald-700 transition-colors"
							>
								Download App
							</Link> */}
                            <button
                                onClick={() => setIsModalOpen(true)}
                                disabled={!orderData.invoice}
                                className="w-64 md:w-full text-sm md:text-base bg-[#F1F9F4] text-center text-black px-6 sm:px-10 md:px-12 py-2 rounded-full hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Download Invoice
                            </button>

                            <InvoiceDownloader
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                invoiceData={orderData.invoice}
                                filename={orderData.invoice ? `Invoice_${orderData.invoice.invoiceNumber}.pdf` : "Invoice_unknown.pdf"}
                            />

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ConsulationCard
