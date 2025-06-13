import React from 'react'
import { GoArrowLeft, } from "react-icons/go";
import { Button, Input, } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getPhysioDataPhysioConnectApi, physioConnectBusinessApi, locationUsingPincode, getPhysioDataById } from "../../api/physioConnect";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState, useRef } from "react";

import ReactGA from "react-ga4";
import { setPhysioConnectPhysioId } from "../../slices/physioConnect";
import StepIndicator from "../../components/StepIndicator";




const PhysioConnectBusinessDetails = () => {
	const physioConnectPhysioId = useSelector((state) => state?.physioConnectAuth?.physioId);
	const navigate = useNavigate();
	const [oldPhysioData, setOldPhysioData] = useState(); //if filling form after first time
	const dispatch = useDispatch();



	// google analytics
	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Physio Connect Work Experience" });
	}, []);


	useEffect(() => {
		const fetchOldData = async () => {
			try {
				const res = await getPhysioDataById(physioConnectPhysioId);
				if (res.success) {
					setOldPhysioData(res.physioData); // assuming `data` contains the physio details object
				} else {
					console.error("Error in response:", res.message);
				}
			} catch (error) {
				console.error("Error fetching physio data:", error);
			}
		};

		fetchOldData();
	}, []);

	// scroll to top
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	const formik = useFormik({

		initialValues: {
			clinicName: "",
			clinicAddress: "",
			clinicPincode: "",
			clinicCity: "",
			clinicState: "",
			clinicCharges: "",
			clinicDuration: "",
			homePincode: "",
			homeCity: "",
			homeState: "",
			homeCharges: "",
			homeDuration: "",
			serviceType: "",
		},
		validationSchema: Yup.object().shape({
			serviceType: Yup.array().min(1, "Select at least one service type"),

			// Clinic Fields
			clinicName: Yup.string().when("serviceType", {
				is: (val) => val && val.includes("clinic"),
				then: (schema) => schema.required("Clinic Name is required"),
				otherwise: (schema) => schema.notRequired(),
			}),
			clinicAddress: Yup.string().when("serviceType", {
				is: (val) => val && val.includes("clinic"),
				then: (schema) => schema.required("Clinic Address is required"),
				otherwise: (schema) => schema.notRequired(),
			}),
			clinicPincode: Yup.number()
				.typeError("Clinic Pincode must be a number")
				.when("serviceType", {
					is: (val) => val && val.includes("clinic"),
					then: (schema) => schema.required("Clinic Pincode is required"),
					otherwise: (schema) => schema.notRequired(),
				}),
			clinicCity: Yup.string().when("serviceType", {
				is: (val) => val && val.includes("clinic"),
				then: (schema) => schema.required("Clinic City is required"),
				otherwise: (schema) => schema.notRequired(),
			}),
			clinicState: Yup.string().when("serviceType", {
				is: (val) => val && val.includes("clinic"),
				then: (schema) => schema.required("Clinic State is required"),
				otherwise: (schema) => schema.notRequired(),
			}),
			clinicCharges: Yup.number()
				.typeError("Clinic Charges must be a number")
				.when("serviceType", {
					is: (val) => val && val.includes("clinic"),
					then: (schema) => schema.required("Clinic Charges is required"),
					otherwise: (schema) => schema.notRequired(),
				}),
			clinicDuration: Yup.number()
				.typeError("Clinic Duration must be a number")
				.when("serviceType", {
					is: (val) => val && val.includes("clinic"),
					then: (schema) => schema.required("Clinic Duration is required"),
					otherwise: (schema) => schema.notRequired(),
				}),

			// Home Fields
			homeCharges: Yup.number()
				.typeError("Home Charges must be a number")
				.when("serviceType", {
					is: (val) => val && val.includes("home"),
					then: (schema) => schema.required("Home Charges is required"),
					otherwise: (schema) => schema.notRequired(),
				}),
			homePincode: Yup.number()
				.typeError("Home Pincode must be a number")
				.when("serviceType", {
					is: (val) => val && val.includes("home"),
					then: (schema) => schema.required("Home Pincode is required"),
					otherwise: (schema) => schema.notRequired(),
				}),
			homeCity: Yup.string().when("serviceType", {
				is: (val) => val && val.includes("home"),
				then: (schema) => schema.required("Home City is required"),
				otherwise: (schema) => schema.notRequired(),
			}),
			homeState: Yup.string().when("serviceType", {
				is: (val) => val && val.includes("home"),
				then: (schema) => schema.required("Home State is required"),
				otherwise: (schema) => schema.notRequired(),
			}),
			homeDuration: Yup.number()
				.typeError("Home Duration must be a number")
				.when("serviceType", {
					is: (val) => val && val.includes("home"),
					then: (schema) => schema.required("Home Duration is required"),
					otherwise: (schema) => schema.notRequired(),
				}),
		}),

		//isko abhi api ke baad set krongi
		onSubmit: (values) => {
			const { clinicName,
				clinicAddress,
				clinicPincode,
				clinicCity,
				clinicState,
				clinicCharges,
				clinicDuration,
				homePincode,
				homeCity,
				homeState,
				homeDuration,
				homeCharges,
			} = values;
			// const IAPInDigit = IAP ? 1 : 0;
			// const treatInsuredPatientInDigit = treatInsuredPatient ? "true" : "false";
			physioConnectBusinessApi(
				clinicName,
				clinicAddress,
				clinicPincode,
				clinicCity,
				clinicState,
				clinicCharges,
				clinicDuration,
				homePincode,
				homeCity,
				homeState,
				homeDuration,
				homeCharges,
				physioConnectPhysioId
			).then((res) => {
				if (res.status >= 200 && res.status < 300) {
					toast.success(res.data.message);
					setTimeout(() => {
						navigate("/physio-connect/payment");
					}, 1000);
				} else if (res.status >= 400 && res.status < 500) {
					toast.error(res.data.message);
				} else {
					toast.error("Something went wrong");
				}
			});
		},
	});


	const [hasUserChangedClinicPincode, setHasUserChangedClinicPincode] = useState(false);
	const [hasUserChangedHomePincode, setHasUserChangedHomePincode] = useState(false);


	const handleClinicPincodeChange = (e) => {
		setHasUserChangedClinicPincode(true);
		formik.handleChange(e);
	};

	const handleHomePincodeChange = (e) => {
		setHasUserChangedHomePincode(true);
		formik.handleChange(e);
	};


	// 1. Load oldPhysioData values initially
	useEffect(() => {
		if (oldPhysioData) {
			formik.setValues({
				serviceType: oldPhysioData?.serviceType ?? [],
				clinicName: oldPhysioData.clinic?.name ?? "",
				clinicAddress: oldPhysioData.clinic?.address ?? "",
				clinicPincode: oldPhysioData.clinic?.zipCode?.toString() ?? "",
				clinicCity: oldPhysioData?.city ?? "",
				clinicState: oldPhysioData?.state ?? "",
				clinicCharges: oldPhysioData.clinic?.charges?.toString() ?? "",
				clinicDuration: oldPhysioData.clinic?.duration?.toString() ?? "",

				homePincode: oldPhysioData.home?.zipCode?.toString() ?? "",
				homeCity: oldPhysioData.home?.homeCity ?? "",
				homeState: oldPhysioData.home?.homeState ?? "",
				homeCharges: oldPhysioData.home?.charges?.toString() ?? "",
				homeDuration: oldPhysioData.home?.duration?.toString() ?? "",
			});
		}
	}, [oldPhysioData]);



	// 4. Trigger city/state lookup only if user changed clinic pincode
	useEffect(() => {
		const fetchCityState = async () => {
			if (hasUserChangedClinicPincode && formik.values.clinicPincode.length === 6) {
				try {
					const res = await locationUsingPincode(formik.values.clinicPincode);
					const components = res.results[0].address_components;

					const city = components.find(d => d.types.includes("locality"))?.long_name || "";
					const state = components.find(d => d.types.includes("administrative_area_level_1"))?.long_name || "";

					formik.setFieldValue("clinicCity", city);
					formik.setFieldValue("clinicState", state);
				} catch (err) {
					console.error("Clinic pincode fetch failed", err);
				}
			}
		};

		fetchCityState();
	}, [formik.values.clinicPincode, hasUserChangedClinicPincode]);

	// 5. Trigger city/state lookup only if user changed home pincode
	useEffect(() => {
		const fetchCityState = async () => {
			if (hasUserChangedHomePincode && formik.values.homePincode.length === 6) {
				try {
					const res = await locationUsingPincode(formik.values.homePincode);
					const components = res.results[0].address_components;

					const city = components.find(d => d.types.includes("locality"))?.long_name || "";
					const state = components.find(d => d.types.includes("administrative_area_level_1"))?.long_name || "";

					formik.setFieldValue("homeCity", city);
					formik.setFieldValue("homeState", state);
				} catch (err) {
					console.error("Home pincode fetch failed", err);
				}
			}
		};

		fetchCityState();
	}, [formik.values.homePincode, hasUserChangedHomePincode]);



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
			<div className="flex flex-col md:flex-row gap-4 bg-[#FFFDF5] px-2 py-4 justify-center mx-4 md:mx-8 lg:mx-16">
				{/* Left side - Card */}
				<div className="flex-1 flex justify-center">
					<StepIndicator currentStep={3} />
				</div>


				<div className="w-full max-w-6xl mx-auto border border-gray-200 rounded-lg bg-white px-12 py-8">
					{/* left side */}
					<form
						onSubmit={formik.handleSubmit}
						className="flex flex-col gap-2 flex-1 max-w-screen-lg"
					>
						<h6 className="font-semibold text-3xl">Business Details</h6>
						<p className="text-sm font-semibold text-gray-700">Fill in your business details below</p>



						{/* clinic Name */}
						{formik.values.serviceType?.includes('clinic') && (
							<div>
								<div className="space-y-2 mb-3">
									<label
										htmlFor="clinicName"
										className="text-sm font-semibold"
									>
										Clinic Name
									</label>
									<Input
										name="clinicName"
										id="clinicName"
										placeholder="Enter Clinic name"
										value={formik.values.clinicName}
										onChange={formik.handleChange}
										labelProps={{ className: "hidden" }}
										className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
									/>
								</div>
								{formik.touched.clinicName && formik.errors.clinicName && (
									<p className="text-red-500">{formik.errors.clinicName}</p>
								)}

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
									<div className="space-y-2">
										<label
											htmlFor="clinicAddress"
											className="text-sm font-semibold"
										>
											Clinic Address
										</label>
										<Input
											name="clinicAddress"
											id="clinicAddress"
											placeholder="Enter Clinic Address"
											value={formik.values.clinicAddress}
											onChange={formik.handleChange}
											labelProps={{ className: "hidden" }}
											className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
										/>
										{formik.touched.clinicAddress && formik.errors.clinicAddress && (
											<p className="text-red-500">{formik.errors.clinicAddress}</p>
										)}
									</div>
									<div className="space-y-2">
										<label
											htmlFor="clinicAddress"
											className="text-sm font-semibold"
										>
											Clinic City
										</label>
										<Input
											name="clinicCity"
											value={formik.values.clinicCity}
											onChange={formik.handleChange}
											labelProps={{ className: "hidden" }}
											placeholder="Enter City"
											disabled={formik.values.clinicPincode.length == 6}
											className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
										/>

										{formik.touched.clinicCity && formik.errors.clinicCity && (
											<p className="text-red-500">{formik.errors.clinicCity}</p>
										)}
									</div>

								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">

									<div className="space-y-2">
										<label
											htmlFor="clinicState"
											className="text-sm font-semibold"
										>
											Clinic State
										</label>
										<Input
											name="clinicState"
											value={formik.values.clinicState}
											onChange={formik.handleChange}
											labelProps={{ className: "hidden" }}
											placeholder="Enter State"
											disabled={formik.values.clinicPincode.length == 6}
											className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
										/>

										{formik.touched.clinicState && formik.errors.clinicState && (
											<p className="text-red-500">{formik.errors.clinicState}</p>
										)}
									</div>
									<div className="space-y-2">
										<label
											htmlFor="clinicPincode"
											className="text-sm font-semibold"
										>
											Pincode
										</label>
										<Input
											name="clinicPincode"
											id="clinicPincode"
											placeholder="Enter Pincode"
											value={formik.values.clinicPincode}
											onChange={handleClinicPincodeChange}
											labelProps={{ className: "hidden" }}
											className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
										/>


										{formik.touched.clinicPincode && formik.errors.clinicPincode && (
											<p className="text-red-500">{formik.errors.clinicPincode}</p>
										)}
									</div>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
									<div className="space-y-2">
										<label
											htmlFor="clinicCharges"
											className="text-sm font-semibold"
										>
											Clinic Consultation Fee
										</label>
										<Input
											name="clinicCharges"
											id="clinicCharges"
											placeholder="₹ Enter clinic consultation fee in INR"
											value={formik.values.clinicCharges}
											onChange={formik.handleChange}
											labelProps={{ className: "hidden" }}
											className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
										/>
										{formik.touched.clinicCharges && formik.errors.clinicCharges && (
											<p className="text-red-500">{formik.errors.clinicCharges}</p>
										)}
									</div>
									<div className="space-y-2">
										<label
											htmlFor="clinicDuration"
											className="text-sm font-semibold"
										>
											Consultation Duration/Session time (in minutes)
										</label>
										<Input
											name="clinicDuration"
											id="clinicDuration"
											placeholder="Enter consultation duration in minutes "
											value={formik.values.clinicDuration}
											onChange={formik.handleChange}
											labelProps={{ className: "hidden" }}
											className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
										/>
										{formik.touched.clinicDuration && formik.errors.clinicDuration && (
											<p className="text-red-500">{formik.errors.clinicDuration}</p>
										)}
									</div>

								</div>
							</div>


						)}

						{/* Home Care */}
						{(formik.values.serviceType ?? []).includes('home') && (
							<div>
								<div className="flex items-center gap-4 mt-4 mb-3">
									<hr className="flex-1 border-t border-black" />
									<span className="text-black font-medium">HomeCare Details</span>
									<hr className="flex-1 border-t border-black" />
								</div>

								<div className="">

									<div className="space-y-2 mb-3">
										<label
											htmlFor="homePincode"
											className="text-sm font-semibold"
										>
											Pincode where you want to serve
										</label>
										<Input
											name="homePincode"
											id="homePincode"
											placeholder="Enter Pincode"
											value={formik.values.homePincode}
											onChange={handleHomePincodeChange}
											labelProps={{ className: "hidden" }}
											className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
										/>

										{formik.touched.homePincode && formik.errors.homePincode && (
											<p className="text-red-500">{formik.errors.homePincode}</p>
										)}
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
										<div className="space-y-2">
											<label
												htmlFor="homeCity"
												className="text-sm font-semibold"
											>
												City
											</label>

											<Input
												name="homeCity"
												value={formik.values.homeCity}
												onChange={formik.handleChange}
												labelProps={{ className: "hidden" }}
												placeholder="Enter City"
												disabled={formik.values.homePincode.length == 6}
												className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
											/>

											{formik.touched.homeCity && formik.errors.homeCity && (
												<p className="text-red-500">{formik.errors.homeCity}</p>
											)}
										</div>
										<div className="space-y-2">
											<label
												htmlFor="homeState"
												className="text-sm font-semibold"
											>
												State
											</label>
											<Input
												name="homeState"
												value={formik.values.homeState}
												onChange={formik.handleChange}
												labelProps={{ className: "hidden" }}
												placeholder="Enter State"
												disabled={formik.values.homePincode.length == 6}
												className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
											/>
											{formik.touched.homeState && formik.errors.homeState && (
												<p className="text-red-500">{formik.errors.homeState}</p>
											)}

										</div>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
										<div className="space-y-2">
											<label
												htmlFor="homeCharges"
												className="text-sm font-semibold"
											>
												Homecare Consultation Fee
											</label>
											<Input
												id="homeCharges"
												name="homeCharges"
												placeholder="₹ Enter homecare consultation fee in INR"
												value={formik.values.homeCharges}
												onChange={formik.handleChange}
												labelProps={{ className: "hidden" }}
												className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
											/>
											{formik.touched.homeCharges && formik.errors.homeCharges && (
												<p className="text-red-500">{formik.errors.homeCharges}</p>
											)}
										</div>

										<div className="space-y-2">
											<label
												htmlFor="duration"
												className="text-sm font-semibold"
											>
												Consultation Time(in minutes)
											</label>
											<Input
												id="homeDuration"
												name="homeDuration"
												placeholder="Enter consultation duration in minutes "
												value={formik.values.homeDuration}
												onChange={formik.handleChange}
												labelProps={{ className: "hidden" }}
												className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
											/>
											{formik.touched.homeDuration && formik.errors.homeDuration && (
												<p className="text-red-500">{formik.errors.homeDuration}</p>
											)}
										</div>
									</div>

								</div>
							</div>
						)}


						<div className="w-full flex flex-row justify-between items-center mt-4 gap-4 ">
							<button
								type="button"
								onClick={() => navigate(-1)}
								className="text-black hover:text-green font-medium flex items-center gap-1 text-sm sm:text-base"
							>
								<GoArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
								Go Back
							</button>
							<Button
								className="w-fit hover:shadow-none  px-6 sm:px-12 bg-green rounded-full py-3 font-semibold "
								type="submit"
							>
								Submit & Pay
							</Button>
						</div>
					</form>
					{/* right side */}

				</div>
			</div>
		</>

	);
};

export default PhysioConnectBusinessDetails
