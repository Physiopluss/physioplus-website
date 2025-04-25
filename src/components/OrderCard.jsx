import { Dialog, IconButton } from "@material-tailwind/react";
import moment from "moment";
import { useState } from "react";
import { FaCalendarAlt, FaClock, FaCopy } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router-dom";
import PrincipleCard from "./PrincipleCard";

const OrderCard = ({ orderData }) => {
	const [open, setOpen] = useState(false);
	const [copied, setCopied] = useState(false);

	const handleOpen = () => setOpen(!open);
	const handleCopy = () => {
		navigator.clipboard.writeText(orderData.otp);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
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
			<div className="w-full max-w-4xl md:bg-[#E6F4EC] rounded-3xl border border-[#E6F4EC] shadow-sm overflow-hidden">
				<div className="border-b border-[#E6F4EC] md:border-b-0 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 text-black">
					<div>
						<div className="font-semibold mb-1">Patient Name</div>
						<div className="font-medium">
							{orderData.patientName ? orderData.patientName : orderData.patientId.fullName}
						</div>
					</div>
					<div>
						<div className="font-semibold mb-1">Service Type</div>
						<div className="font-medium">
							{orderData?.serviceType === 0 ? "Home" : orderData?.serviceType === 1 ? "Clinic" : "Online"} Visit
						</div>
					</div>
					<div className="hidden md:block">
						<div className="font-semibold mb-1">Amount</div>
						<div className="font-medium">₹ {orderData?.amount}</div>
					</div>
					<div className="hidden md:flex justify-between items-start">
						<div>
							<div className="font-semibold mb-1">Appointment id </div>
							<div className="font-medium"># {orderData?._id?.slice(-8)}</div>
						</div>
					</div>
					{orderData?.otp && (
						<div className="mt-2">
							<div className="flex items-center gap-2">
								<button
									onClick={handleCopy}
									className="bg-[#E6F4EC] px-3 py-1 rounded-lg border border-green flex items-center gap-2 hover:bg-[#D4E9D9] transition-colors cursor-pointer relative"
									title={copied ? "Copied!" : "Click to copy"}
								>
									<div className="text-lm font-bold text-gray-500">OTP: </div>
									<span className="font-bold text-green tracking-wider">{orderData.otp}</span>
									{copied ? (
										<span className="text-green text-sm font-medium animate-fade">Copied!</span>
									) : (
										<FaCopy className="w-4 h-4 text-green" />
									)}
								</button>
							</div>
						</div>
					)}
				</div>

				<div className="flex flex-col md:flex-row items-center justify-between bg-white p-4">
					<div className="w-full md:w-fit flex items-center gap-4">
						<div className="relative rounded-full overflow-hidden">
							<img
								src={orderData?.physioId?.profileImage ? orderData.physioId.profileImage : "./mockPhysioMale.png"}
								alt={orderData?.physioId?.fullName}
								className="object-cover w-20 h-20 aspect-square"
							/>
						</div>
						<div className="space-y-2">
							<div>
								<h2 className="text-xl font-medium text-[#4a4e69] mb-1">{orderData?.physioId?.fullName}</h2>
								<p className="text-gray-500">{orderData?.physioId?.specialization?.[0]?.name}</p>
							</div>
							<div className="flex gap-6">
								<div className="flex items-center gap-1 text-gray-600 text-xs md:text-sm lg:text-base">
									<FaCalendarAlt className="w-3 h-3" />
									<span>{moment(orderData?.date).format("DD.MM.YYYY")}</span>
								</div>
								<div className="flex items-center gap-1 text-gray-600 text-xs md:text-sm lg:text-base">
									<FaClock className="w-3 h-3" />
									<span>{orderData?.timeInString}</span>
								</div>
							</div>
						</div>
					</div>
					<div className="w-full md:w-fit flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
						<button
							onClick={handleOpen}
							className="w-1/2 md:w-full text-sm md:text-base bg-green text-white px-4 sm:px-6 md:px-8 py-2 rounded-full hover:bg-emerald-700 transition-colors"
						>
							View Details
						</button>
						<Link
							to={"https://play.google.com/store/apps/details?id=com.physioplus.physioplus&hl=en"}
							target="_blank"
							className="w-1/2 md:w-full text-sm md:text-base bg-[#F1F9F4] text-center text-black px-4 sm:px-6 md:px-8 py-2 rounded-full hover:bg-emerald-700 transition-colors"
						>
							Download App
						</Link>
					</div>
				</div>

				{/* Modal */}
				<Dialog
					size="lg"
					open={open}
					handler={handleOpen}
					className="relative p-10 text-black bg-[#FFFDF5] rounded-3xl m-0 z-10"
				>
					<div className="flex flex-col gap-2 ">
						<div className="flex flex-col-reverse items-center md:justify-between md:flex-row">
							<div className="md:w-3/5 text-black flex flex-col justify-center gap-2.5">
								<h6 className="hidden md:block text-3xl font-semibold mb-1">Unlock Exclusive Details</h6>
								<p className="text-sm md:text-base font-medium">
									Get the full experience at your fingertips. Download our app now to access in-depth insights,
									personalized updates, and so much more. Your next discovery is just a tap away
								</p>
								<p className="text-sm md:text-base font-medium">
									Quick and easy—just scan the QR code to download our app and dive into exclusive details. Don't miss out
									on personalized insights and a seamless experience
								</p>
							</div>
							<div className="md:w-2/5 flex flex-col justify-center items-center">
								<h6 className="block md:hidden text-2xl font-semibold mb-1">Unlock Exclusive Details</h6>
								<img
									src="/patientQR.png"
									alt="qr"
									className="max-w-[160px] md:w-full"
								/>
								<span className="text-[14px] font-semibold bg-gradient-to-br from-[#6CB300] to-[#2E4D00] text-white text-nowrap px-2 py-0.5 rounded-md -mt-1.5">
									Scan QR to Download App
								</span>
							</div>
						</div>
						<div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
							<PrincipleCard
								section={"orderSection"}
								img={
									"https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/Swiper+Gallery/png-transparent-referral-marketing-business-service-word-of-mouth-business-leaf-service-people-thumbnail.png"
								}
								title={"Comprehensive Care"}
								description={"Easy access to your medical records, appointments, and personalized health recommendations"}
							/>
							<PrincipleCard
								section={"orderSection"}
								img={
									"https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/Swiper+Gallery/71-512-removebg-preview.png"
								}
								title={"24/7 Support"}
								description={"Round-the-clock assistance to ensure your health needs are always met"}
							/>
							<PrincipleCard
								section={"orderSection"}
								img={
									"https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/Swiper+Gallery/refund-money-icon-vector-illustration-260nw-572781898-removebg-preview.png"
								}
								title={"User-Friendly Interface"}
								description={"Designed with you in mind, making health management easier than ever"}
							/>
						</div>
						<Link
							to={"https://play.google.com/store/apps/details?id=com.physioplus.physioplus&hl=en"}
							target="_blank"
							className="bg-green text-white text-base font-medium py-2 px-8 rounded-3xl w-fit mt-2"
						>
							Download App Now
						</Link>
					</div>
					<IconButton
						size="sm"
						variant="text"
						className="!absolute right-4 top-4 hover:bg-transparent"
						onClick={handleOpen}
					>
						<IoMdClose className="h-6 w-6 stroke-2" />
					</IconButton>
				</Dialog>
			</div>
		</>
	);
};
export default OrderCard;
