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
			<StepIndicator currentStep={3} />

			<div className="gap-4 border border-gray-200 rounded-lg bg-[#FFFDF5] px-8 py-8 justify-center flex flex-col md:flex-row mx-4 md:mx-8 lg:mx-16">
				{/* left side */}
				<form
					className="flex flex-col gap-4"
					onSubmit={(e) => e.preventDefault()}
				>
					<h6 className="font-semibold text-3xl">Payment Page</h6>

					{/* sub form */}
					<div className="flex flex-col gap-4 border border-gray-200 rounded-lg bg-white p-4">
						<p className="text-base font-semibold">Listing Charges</p>
						<div className="flex justify-between text-sm font-normal">
							<p>Amount to be Paid Per Year</p>
							<p>₹ {selectedPrice}</p>
						</div>
						{amoutToPay != 0 && (
							<>
								{showCouponInput ? (
									<div className="relative flex w-full">
										<input
											name="coupon"
											placeholder="Enter coupon code"
											className="w-full h-full bg-transparent text-base text-blue-gray-700 font-sans font-normal outline-none transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 focus:placeholder:opacity-100 px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-black placeholder:text-blue-gray-300 placeholder:opacity-100 ring-1 ring-[#EAEBEC]"
											value={coupon}
											onChange={(e) => setCoupon(e.target.value)}
										/>
										<div className="absolute right-0.5 top-0 h-full flex items-center">
											<Button
												size="sm"
												className="py-2.5 px-8 text-black bg-[#E6F4EC] shadow-none hover:shadow-none w-auto"
												onClick={(e) => {
													e.preventDefault();
													if (coupon) {
														physioConnectCouponApi(coupon)
															.then((res) => {
																if (res.status >= 200 && res.status < 300) {
																	setCouponResponse(res.data);
																	setCouponApplied(res.data.couponName);
																} else {
																	toast.error(res.data.message);
																}
															})
															.catch((err) => {
																toast.error(err.message);
															});
													} else {
														toast.error("Please enter a valid coupon code");
													}
												}}
											>
												Apply
											</Button>
										</div>
									</div>
								) : (
									<div className="flex flex-col gap-1 w-full font-sans font-semibold">
										<SwipeableButton
											style={{
												width: "100%", // Ensure it adapts to screen size
												maxWidth: "320px", // Constrain max width
												margin: "0 auto", // Center within parent
											}}
											onSuccess={() => {
												if (coupon) {
													physioConnectCouponApi(coupon)
														.then((res) => {
															if (res.status >= 200 && res.status < 300) {
																setCouponResponse(res.data);
																setCouponApplied(res.data.couponName);
															} else {
																toast.error(res.data.message);
															}
														})
														.catch((err) => {
															toast.error(err.message);
														});
												}
											}}
											text="Best Offer for You"
											text_unlocked="You Saved ₹500 !!!"
											sliderTextColor="#fff"
											sliderIconColor="#fff"
											sliderColor="green"
											background_color="#eee"
											borderRadius={30}
											circle
											autoWidth
											disabled={false}
											name="coupon-btn"
										/>
									</div>
								)}
								{/* add button to replace swipable with input for applying more coupon  */}
								<div className="flex justify-end">
									<button
										className="text-right text-green"
										onClick={() => {
											!showCouponInput ? setCoupon("") : setCoupon("NEW500");
											setShowCouponInput(!showCouponInput);
											setCouponResponse({});
											setCouponApplied(null);
											SetDiscountedPrice(null);
										}}
									>
										{!showCouponInput ? "Have Coupon Code" : "Didn't Have Coupon Code"}
									</button>
								</div>
							</>
						)}
						{discountedPrice && (
							<>
								<hr className="border-gray-200" />
								<div className="flex justify-between text-sm font-normal">
									<p>Discount</p>
									{couponResponse.couponType == 0 ? <p>₹ {discountedPrice}</p> : <p>{discountedPrice} %</p>}
								</div>
							</>
						)}

						{amoutToPay != 0 && <hr className="border-black" />}
						<div className="flex justify-between text-sm font-normal">
							<p>Total Amount to pay</p>

							<p> ₹ {amoutToPay}</p>
						</div>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
						<PrincipleCard
							section={"physioConnectPayment"}
							img={
								"https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/Swiper+Gallery/png-transparent-referral-marketing-business-service-word-of-mouth-business-leaf-service-people-thumbnail.png"
							}
							title={"Guaranteed Patient Referrals"}
							description={
								"We guarantee at least 10 new patient referrals over the next few months, ensuring your practice grows steadily with our proven patient acquisition strategies."
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
							title={"100% Refund"}
							description={
								"Not Satisfied? Get a 100% Refund – No Questions Asked! guide me in creating a three word tittle or a headind for these points."
							}
						/>
					</div>
				</form>

				{/* Render the Modal */}
				<Modal
					isOpen={isModalOpen}
					closeModal={closeModal}
				/>

				<div
					className={`h-fit flex flex-col gap-4 bg-white px-4 py-4 border rounded-md w-full 
						fixed bottom-0 left-0 
						md:static md:mt-14 md:min-w-52 
						lg:max-w-xs xl:max-w-sm 
						z-20 transition-transform duration-300 
						${showPayment ? "translate-y-0" : "translate-y-full"} 
						md:translate-y-0`}
				>
					{/* payment */}
					<div className="text-base font-semibold">Payment Option</div>

					<div className="flex justify-between">
						<div>
							<p className="text-base font-medium">Total Amount to pay</p>
							<p className="text-xs font-normal">included taxes</p>
						</div>
						<div className="text-lg font-medium">₹{amoutToPay}</div>
					</div>

					<div className="flex flex-col gap-1">
						<Checkbox
							className="w-4 h-4 hover:before:opacity-0  "
							defaultChecked
							checked={true}
							label="Online"
						/>
						<hr className="my-2" />
						<div className="flex items-start space-x-2">
							<Checkbox
								className="w-4 h-4 hover:before:opacity-0 checked:bg-green text-green "
								defaultChecked
								checked={true}
							/>
							<label className="text-xs">
								By proceeding, I agree to Physioplus,{" "}
								<span
									className="text-green underline cursor-pointer"
									onClick={openModal}
								>
									Terms of Service
								</span>{" "}
								and Cancellation Policies.
							</label>
						</div>
					</div>

					<div className="w-full flex justify-center">
						<Button
							className="w-full hover:shadow-none font-normal px-12 bg-green rounded-full"
							// onClick={() =>
							// 	selectedPrice != 0
							// 		? physioConnectRazorPayOrderApi(
							// 				physioConnectPhysioId,
							// 				amoutToPay,
							// 				mobileNumber,
							// 				couponApplied,
							// 				selectedExperienceId
							// 		  )
							// 				.then(() => {
							// 					dispatch(setSuccessModalOpen());
							// 				})
							// 				.catch((err) => {
							// 					toast.error(err);
							// 				})
							// 		: physioConnectFreePayment(physioConnectPhysioId, selectedExperienceId)
							// 				.then(() => {
							// 					dispatch(setSuccessModalOpen());
							// 				})
							// 				.catch((err) => {
							// 					toast.error(err);
							// 				})
							// }
							onClick={() => {
								physioConnectRazorPayOrderApi(
									physioConnectPhysioId,
									amoutToPay,
									mobileNumber,
									couponApplied,
									selectedExperienceId
								)
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
			<SuccessModal
				title={"Thank you for reaching us."}
				description={"Our representative will Connect with you shortly. In next 48 hour to verify your details"}
				btnOne={"Go to main menu"}
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
		</>
	);
};
export default PhysioConnectPayment;
