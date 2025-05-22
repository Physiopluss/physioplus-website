import { Button, Checkbox } from "@material-tailwind/react";
import { Navigate, useNavigate } from "react-router-dom";
import PrincipleCard from "../../components/PrincipleCard";
import { useEffect, useState } from "react";
import {
	physioConnectCouponApi,
	// physioConnectFreePayment,
	physioConnectPhysioDataApi,
	physioConnectPriceAndExperienceApi,
	physioConnectRazorPayOrderApi,
} from "../../api/physioConnect";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import SuccessModal from "../../components/SuccessModal";
import { setSuccessModalOpen } from "../../slices/modalSlice";
import ReactGA from "react-ga4";
import { SwipeableButton } from "react-swipeable-button";
import { setPhysioConnectPhysioId } from "../../slices/physioConnect";
import Modal from "../../components/Modal";
import StepIndicator from "../../components/StepIndicator";

const PhysioConnectPayment = () => {
	const physioConnectPhysioId = useSelector((state) => state?.physioConnectAuth?.physioId);
	const dispatch = useDispatch();
	const [coupon, setCoupon] = useState("NEW500");
	const [couponApplied, setCouponApplied] = useState();
	const [couponResponse, setCouponResponse] = useState({});
	// const [priceAccordingToExperience, setPriceAccordingToExperience] = useState();
	const [mobileNumber, setMobileNumber] = useState();
	const navigate = useNavigate();
	const [selectedPrice, SetSelectedPrice] = useState(0);
	const [selectedExperienceId, SetSelectedExperienceId] = useState();
	const [discountedPrice, SetDiscountedPrice] = useState();
	const [amoutToPay, setAmountToPay] = useState();
	const [showCouponInput, setShowCouponInput] = useState(false);
	const [showPayment, setShowPayment] = useState(false);
	//const [modal,setModal] = useState(false); // Added state to manage Terms of Service modal visibility
	const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility
	// Function to open the modal
	const openModal = () => {
		setIsModalOpen(true);
	};

	// Function to close the modal
	const closeModal = () => {
		setIsModalOpen(false);
	};
	// google analytics
	useEffect(() => {
		ReactGA.send({
			hitType: "pageview",
			page: window.location.pathname,
			title: "Physio Connect Payment",
		});
	}, []);

	// scroll to top
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// getting coupon response
	useEffect(() => {
		coupon && couponResponse && couponResponse.couponName == coupon && SetDiscountedPrice(couponResponse.discount);
	}, [coupon, couponResponse]);

	// price according to experience logic
	//
	//
	// getting physiodata & price according to experience
	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		const [priceData, physioData] = await Promise.all([
	// 			physioConnectPriceAndExperienceApi(),
	// 			physioConnectPhysioDataApi(physioConnectPhysioId),
	// 		]);
	// 		setPriceAccordingToExperience(priceData);
	// 		setMobileNumber(physioData.data.phone);

	// 		let tmpPrice;
	// 		if (physioData.data.workExperience < 16) {
	// 			tmpPrice = priceData.data.filter((item) => item.experience > physioData.data.workExperience);
	// 		} else {
	// 			tmpPrice = priceData.data.filter((item) => item.experience == 16);
	// 		}

	// 		if (tmpPrice.length > 1) {
	// 			SetSelectedPrice(tmpPrice.reduce((max, item) => (item.price > max.price ? item : max)).price);
	// 			const tempExperience = tmpPrice.filter((item) => item.price == selectedPrice);
	// 			SetSelectedExperienceId(tempExperience[0]._id);
	// 		} else {
	// 			SetSelectedPrice(tmpPrice[0].price);
	// 			SetSelectedExperienceId(tmpPrice[0]._id);
	// 		}
	// 	};
	// 	fetchData();
	// }, [physioConnectPhysioId, selectedPrice]);

	// remove coupon if price is more than 1000
	// useEffect(() => {
	// 	if (selectedPrice > 1000) {
	// 		setCoupon("PHYSIO300");
	// 	}
	// }, [selectedPrice]);
	//
	// end here

	useEffect(() => {
		const fetchData = async () => {
			const [priceData, physioData] = await Promise.all([
				physioConnectPriceAndExperienceApi(),
				physioConnectPhysioDataApi(physioConnectPhysioId),
			]);
			// setPriceAccordingToExperience(priceData);
			setMobileNumber(physioData.data.phone);

			let tmpPrice = priceData.data.filter((item) => item.experience == 100);

			if (tmpPrice.length > 1) {
				SetSelectedPrice(tmpPrice.reduce((max, item) => (item.price > max.price ? item : max)).price);
				const tempExperience = tmpPrice.filter((item) => item.price == selectedPrice);
				SetSelectedExperienceId(tempExperience[0]._id);
			} else {
				SetSelectedPrice(tmpPrice[0].price);
				SetSelectedExperienceId(tmpPrice[0]._id);
			}
		};
		fetchData();
	}, [physioConnectPhysioId, selectedPrice]);

	// getting total price after applying coupon
	useEffect(() => {
		discountedPrice != 0 && discountedPrice != null && discountedPrice != undefined
			? couponResponse.couponType == 0
				? discountedPrice > selectedPrice
					? setAmountToPay(0)
					: setAmountToPay(selectedPrice - discountedPrice)
				: (discountedPrice * selectedPrice) / 100 > selectedPrice
					? setAmountToPay(0)
					: setAmountToPay(selectedPrice - (discountedPrice * selectedPrice) / 100)
			: setAmountToPay(selectedPrice);
	}, [selectedPrice, discountedPrice, couponResponse]);

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const screenHeight = window.innerHeight;

			// Show the payment section if scrolled halfway
			if (scrollPosition > screenHeight / 4) {
				setShowPayment(true);
			} else {
				setShowPayment(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	if (physioConnectPhysioId == null || physioConnectPhysioId.length == 0) {
		const physioConnectPhysioId = sessionStorage.getItem("physioConnectId");
		if (physioConnectPhysioId != null) {
			dispatch(setPhysioConnectPhysioId(physioConnectPhysioId));
		} else {
			return <Navigate to="/physio-connect/signup" />;
		}
	}

	return (
		<>
			<div className="flex flex-col md:flex-row gap-4 bg-white px-2 py-4 justify-center mx-4 md:mx-8 lg:mx-16">
				{/* Left side - Card */}
				<div className="flex-1 flex justify-center">
					<StepIndicator currentStep={4} />
				</div>

				<div className="hidden md:block w-full max-w-6xl mx-auto border border-gray-200 rounded-lg bg-white px-12 py-8">
					{/* left side */}
					<form
						className="flex flex-col gap-4"
						onSubmit={(e) => e.preventDefault()}
					>
						<div className="flex flex-col gap-1">
							<h6 className="font-semibold ">Payment Page</h6>
							<p className="text-sm font-semibold text-gray-700">Review & Pay</p>

						</div>


						{/* sub form */}
						<div className="flex flex-col gap-4 border border-gray-200 rounded-lg bg-white p-4 shadow-sm">
							<p className="text-base font-semibold">Listing Charges</p>
							<div className="flex justify-between text-sm font-semibold">
								<p>Amount to be Paid Per Year</p>
								<p>{"₹ 3,499" || selectedPrice} </p>
							</div>
							{amoutToPay != 0 && (
								<>
									<div className="relative flex w-full">
										<input
											name="coupon"
											placeholder="Enter coupon code"
											className="w-full h-full bg-transparent text-base text-blue-gray-700 font-sans font-normal outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 focus:placeholder:opacity-100 px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-black placeholder:text-blue-gray-300 placeholder:opacity-100 ring-1 ring-[#EAEBEC]"
											value={"PHYSIOFIRST" || coupon}
											onChange={(e) => setCoupon(e.target.value)}
										/>
										<div className="absolute right-0.5 top-0 h-full flex items-center">
											<Button
												size="sm"
												className="py-2.5 px-8 text-black bg-[#E6F4EC] shadow-none hover:shadow-none w-auto"
											//   onClick={(e) => {
											//     e.preventDefault();
											//     if (coupon) {
											//       physioConnectCouponApi(coupon)
											//         .then((res) => {
											//           if (res.status >= 200 && res.status < 300) {
											//             setCouponResponse(res.data);
											//             setCouponApplied(res.data.couponName);
											//           } else {
											//             toast.error(res.data.message);
											//           }
											//         })
											//         .catch((err) => {
											//           toast.error(err.message);
											//         });
											//     } else {
											//       toast.error("Please enter a valid coupon code");
											//     }
											//   }}
											>
												Apply
											</Button>
										</div>
									</div>

									{/* Optional: Add a button to reset the coupon if needed */}
									{couponApplied && (
										<div className="flex justify-end">
											<button
												className="text-right text-green"
												onClick={() => {
													setCoupon("");
													setCouponResponse({});
													setCouponApplied(null);
													SetDiscountedPrice(null);
												}}
											>
												Remove Coupon
											</button>
										</div>
									)}
								</>
							)}
							<hr className="border-gray-200" />
							<div className="flex justify-between text-sm font-semibold text-green">
								<p>Discount</p>
								{discountedPrice ? (
									couponResponse.couponType === 0 ? (
										<p>₹ {discountedPrice}</p>
									) : (
										<p>{discountedPrice} %</p>
									)
								) : (
									<p>₹ 1,000</p>
								)}
							</div>


							{amoutToPay != 0 && <hr className="border-black" />}
							<div className="flex justify-between  text-md font-semibold">
								<p>Total Amount to pay</p>

								<p> ₹ {amoutToPay}</p>
							</div>
						</div>


					</form>

					{/* Render the Modal */}
					<Modal
						isOpen={isModalOpen}
						closeModal={closeModal}
					/>

					<div
						className={`h-fit flex flex-col gap-0 bg-white px-6 py-6 border rounded-lg shadow-md 
		w-full fixed bottom-0 left-0 
		md:static md:mt-14 md:w-full 
		z-20 transition-transform duration-300 
		${showPayment ? "translate-y-0" : "translate-y-full"} 
		md:translate-y-0`}
					>
						{/* Payment Method Header */}
						<div className="text-lg font-semibold">Payment Method</div>

						{/* Payment Option */}
						<div className="flex items-center space-x-2">
							<Checkbox className="w-4 h-4 hover:before:opacity-0 checked:bg-green text-green" defaultChecked checked={true} />
							<p className="text-base font-medium">Online</p>
						</div>

						<hr className="my-2 border-gray-300" />

						{/* Terms & Conditions */}
						<div className="flex items-start space-x-2">
							<Checkbox className="w-4 h-4 hover:before:opacity-0 checked:bg-green text-green" defaultChecked checked={true} />
							<p className="text-sm">
								By proceeding, I agree to Physioplus{" "}
								<span className="text-green underline cursor-pointer" onClick={openModal}>
									Terms of Service
								</span>{" "}
								and{" "}
								<span className="text-green underline cursor-pointer" onClick={openModal}>
									Refund Policy
								</span>.
							</p>
						</div>

						{/* Pay Now Button */}
						<div className="w-full flex justify-center">
							<Button
								className="w-full text-white text-base font-medium py-3 rounded-full bg-green hover:bg-green-700 transition-all duration-300"
								onClick={() => {
									physioConnectRazorPayOrderApi(physioConnectPhysioId, amoutToPay, mobileNumber, couponApplied, selectedExperienceId)
										.then(() => {
											dispatch(setSuccessModalOpen());
										})
										.catch((err) => {
											toast.error(err);
										});
								}}
							>
								Pay Now
							</Button>
						</div>
					</div>


					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-8">
						<PrincipleCard
							section={"physioConnectPayment"}
							img={
								"https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/Swiper+Gallery/png-transparent-referral-marketing-business-service-word-of-mouth-business-leaf-service-people-thumbnail.png"
							}
							title={"Expand Your Client"}
							description={
								"Increase your visibility and connect with more clients,offering sevices.Your practice grows steadily."
							}
						/>
						<PrincipleCard
							section={"physioConnectPayment"}
							img={
								"https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/Swiper+Gallery/71-512-removebg-preview.png"
							}
							title={"Boost Your Income"}
							description={
								"Maximize your earning potential by taking on additional clients at your convenience, allowing flexible, supplemental income opportunities"
							}
						/>
						<PrincipleCard
							section={"physioConnectPayment"}
							img={
								"https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/Swiper+Gallery/refund-money-icon-vector-illustration-260nw-572781898-removebg-preview.png"
							}
							title={"Elevate Your Digital Presence"}
							description={
								"In today's digital world,your online presence matters just as much as your in-clinic experise"
							}
						/>
					</div>
				</div>
				<SuccessModal
					title={"Thank you for reaching us."}
					description={
						<>
							Our representative will connect with you shortly.
							<br />
							In the next 48 hours to verify your details.
						</>
					}

					btnOne={"Go to  Login & Submit Details"}
					btnOneFunction={() => {
						dispatch(setSuccessModalOpen());
						// Push the current state and replace it to clear history
						window.history.pushState(null, null, window.location.href);
						window.history.replaceState(null, null, "/physio-connect");
						navigate("/physio-connect", { replace: true });

						// Prevent back navigation
						window.addEventListener("popstate", () => {
							navigate("/physio-connect", { replace: true });
						});
					}}
				/>
				<div className="w-full mx-auto bg-[#FFFDF5] px-4 py-4 md:hidden">
					{/* Mobile Payment Header */}
					<h6 className="font-semibold text-2xl mb-4">Payment Page</h6>
					<p className="text-base font-semibold mb-3">Review & Pay</p>
					{/* Review & Pay Section */}
					<div className="flex flex-col gap-4 border border-gray-200 rounded-lg bg-white p-4 shadow-sm">

						{/* Listing Charges */}
						<div className="flex flex-col justify-between text-sm py-2 border-b border-gray-100">
							<p className="text-base font-semibold">Listing Charges</p>
							<div className="flex justify-between text-sm font-semibold">
								<p>Amount to be Paid Per Year</p>
								<p>{"₹ 3,499" || selectedPrice} </p>
							</div>
						</div>

						{amoutToPay != 0 && (
							<>
								<div className="relative flex w-full">
									<input
										name="coupon"
										placeholder="Enter coupon code"
										className="w-full h-full bg-transparent text-base text-blue-gray-700 font-sans font-normal outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 focus:placeholder:opacity-100 px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-black placeholder:text-blue-gray-300 placeholder:opacity-100 ring-1 ring-[#EAEBEC]"
										value={"PHYSIOFIRST" || coupon}
										onChange={(e) => setCoupon(e.target.value)}
									/>
									<div className="absolute right-0.5 top-0 h-full flex items-center">
										<Button
											size="sm"
											className="py-2.5 px-8 text-black bg-[#E6F4EC] shadow-none hover:shadow-none w-auto"
										//   onClick={(e) => {
										//     e.preventDefault();
										//     if (coupon) {
										//       physioConnectCouponApi(coupon)
										//         .then((res) => {
										//           if (res.status >= 200 && res.status < 300) {
										//             setCouponResponse(res.data);
										//             setCouponApplied(res.data.couponName);
										//           } else {
										//             toast.error(res.data.message);
										//           }
										//         })
										//         .catch((err) => {
										//           toast.error(err.message);
										//         });
										//     } else {
										//       toast.error("Please enter a valid coupon code");
										//     }
										//   }}
										>
											Apply
										</Button>
									</div>
								</div>

								{/* Optional: Add a button to reset the coupon if needed */}
								{couponApplied && (
									<div className="flex justify-end">
										<button
											className="text-right text-green"
											onClick={() => {
												setCoupon("");
												setCouponResponse({});
												setCouponApplied(null);
												SetDiscountedPrice(null);
											}}
										>
											Remove Coupon
										</button>
									</div>
								)}
							</>
						)}

						{/* Discount - Same conditional rendering as web */}
						<hr className="border-gray-200" />
						<div className="flex justify-between text-sm font-semibold text-green">
							<p>Discount</p>
							{discountedPrice ? (
								couponResponse.couponType === 0 ? (
									<p>₹ {discountedPrice}</p>
								) : (
									<p>{discountedPrice} %</p>
								)
							) : (
								<p>₹ 1,000</p>
							)}
						</div>

						{amoutToPay != 0 && <hr className="border-black" />}
						<div className="flex justify-between  text-md font-semibold">
							<p>Total Amount to pay</p>

							<p> ₹ {amoutToPay}</p>
						</div>
					</div>

					{/* Benefits Cards - Stacked vertically for mobile */}
					<div className="space-y-4 mt-6">
						<div className="bg-white p-4 rounded-lg shadow-sm">
							<div className="flex items-start gap-3">
								<img
									src="https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/Swiper+Gallery/png-transparent-referral-marketing-business-service-word-of-mouth-business-leaf-service-people-thumbnail.png"
									className="w-12 h-12 object-contain"
									alt="Expand"
								/>
								<div>
									<p className="font-medium">Expand Your Client</p>
									<p className="text-sm text-gray-600 mt-1">
										Increase your visibility and connect with more clients, offering services. Your practice grows steadily
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white p-4 rounded-lg shadow-sm">
							<div className="flex items-start gap-3">
								<img
									src="https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/Swiper+Gallery/71-512-removebg-preview.png"
									className="w-12 h-12 object-contain"
									alt="Income"
								/>
								<div>
									<p className="font-medium">Boost Your Income</p>
									<p className="text-sm text-gray-600 mt-1">
										Maximize your earning potential by taking on additional clients at your convenience, allowing flexible
									</p>
								</div>
							</div>
						</div>

						<div className="bg-white p-4 rounded-lg shadow-sm">
							<div className="flex items-start gap-3">
								<img
									src="https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/Swiper+Gallery/refund-money-icon-vector-illustration-260nw-572781898-removebg-preview.png"
									className="w-12 h-12 object-contain"
									alt="Digital"
								/>
								<div>
									<p className="font-medium">Elevate Your Digital Presence</p>
									<p className="text-sm text-gray-600 mt-1">
										In today's digital world, your online presence matters just as much as your in-clinic expertise
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Payment Method - Fixed at bottom */}
					<div className=" fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t z-10">
						{/* Payment Method Header */}
						<div className="text-lg font-semibold">Payment Method</div>

						{/* Payment Option */}
						<div className="flex items-center space-x-2">
							<Checkbox className="w-4 h-4 hover:before:opacity-0 checked:bg-green text-green" defaultChecked checked={true} />
							<p className="text-sm font-medium">Online</p>
						</div>

						<hr className="my-2 border-gray-300" />
						<div className="flex items-center justify-between mb-3">

							<div className="flex items-center space-x-2">
								<Checkbox className="w-4 h-4 hover:before:opacity-0 checked:bg-green text-green" defaultChecked checked={true} />
								<p className="text-sm">I agree to Terms & Conditions</p>
							</div>
							<p className="font-semibold">₹2,499</p>
						</div>
						<Button
							className="w-full text-white text-base font-medium py-3 rounded-full bg-green hover:bg-green-700"
							onClick={() => {
								physioConnectRazorPayOrderApi(physioConnectPhysioId, amoutToPay, mobileNumber, couponApplied, selectedExperienceId)
									.then(() => {
										dispatch(setSuccessModalOpen());
									})
									.catch((err) => {
										toast.error(err);
									});
							}}
						>
							Pay Now
						</Button>
					</div>
				</div>
			</div>
		</>
	);
};
export default PhysioConnectPayment;
