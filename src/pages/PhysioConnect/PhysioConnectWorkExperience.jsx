import { GoDash } from "react-icons/go";
import { Button, Input, Radio } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getPhysioDataPhysioConnectApi, physioConnectBusinessApi } from "../../api/physioConnect";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState, useRef} from "react";

import ReactGA from "react-ga4";
import { setPhysioConnectPhysioId } from "../../slices/physioConnect";
import StepIndicator from "../../components/StepIndicator";

const PhysioConnectWorkExperience = () => {
	const homePincodeRef = useRef();
	const physioConnectPhysioId = useSelector((state) => state?.physioConnectAuth?.physioId);
	const navigate = useNavigate();
	const [oldPhysioData, setOldPhysioData] = useState(); //if filling form after first time
	const dispatch = useDispatch();

	// google analytics
	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Physio Connect Work Experience" });
	}, []);

	// scroll to top & fetch data
	useEffect(() => {
		window.scrollTo(0, 0);

		const fetchData = async () => {
			await getPhysioDataPhysioConnectApi(physioConnectPhysioId)
				.then((res) => {
					if (res.status >= 200 && res.status < 300) {
						setOldPhysioData(res.data);
					} else {
						console.log("inside else", res);
					}
				})
				.catch((err) => console.log(err));
		};

		fetchData();
	}, []);

	const formik = useFormik({
		initialValues: {
         clinicName: "",
		 clinicAddress: "",
		             clinicPincode: "",
		             clinicCity: "",
		             clinicState: "",
                     clinicCharges: "",
                     clinicDuration:"",
					 homeCharges: "",
                     homeCharges10Km:"",
					             homePincode: "",
					             homeCity: "",
					             homeState: "",
                                 homeDuration:"",     
		},
		validationSchema: Yup.object().shape({
			
			   clinicName: Yup.string("Clinic Name is required"),
			clinicAddress: Yup.string("Clinic Address is required"),
			            clinicPincode: Yup.number("Clinic Pincode is required"),
			            clinicCity: Yup.string("Clinic City is required"),
			            clinicState: Yup.string("Clinic State is required"),
			            clinicCharges: Yup.number("Consultation Fees is required"),
                        clinicDuration:Yup.number("Consultation duration needed"),
						homeCharges: Yup.number("Home Charges Upto 5km is required"),
						            homePincode: Yup.number("Home Pincode is required"),
						            homeCity: Yup.string("Home City is required"),
						            homeState: Yup.string("Home State is required"),
                                    homeDuration: Yup.number("Consultation duration needed"),
                                    homeCharges10Km:Yup.number("consultation charge is required"),
                                    
		}),
		//isko abhi api ke baad set krongi
		onSubmit: (values) => {
			const {  clinicName,
                clinicAddress,
                clinicPincode,
                clinicCity,
                clinicState,
                clinicCharges,
                clinicDuration,
                homePincode,
                homeCity,
                homeState,
                homeCharges10Km,
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
                homeCharges10Km,
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

// 	useEffect(() => {
// 		// setting IAP from database
// 		if (oldPhysioData && oldPhysioData.iapMember != null && oldPhysioData.iapMember != undefined) {
// 			if (oldPhysioData.iapMember == 0) {
// 				formik.setFieldValue("IAP", false);
// 			} else {
// 				formik.setFieldValue("IAP", true);
// 			}
// 		}

// 		// setting IAP Number from database
// 		if (oldPhysioData && oldPhysioData.iapNumber != null && oldPhysioData.iapNumber != undefined) {
// 			formik.setFieldValue("IAP_number", oldPhysioData.iapNumber);
// 		}

// 		// setting treatInsuredPatient from database
// 		if (
// 			oldPhysioData &&
// 			oldPhysioData.treatInsuranceclaims != null &&
// 			oldPhysioData.treatInsuranceclaims != undefined
// 		) {
// 			formik.setFieldValue("treatInsuredPatient", oldPhysioData.treatInsuranceclaims);
// 		}

// 		// setting experience from database
// 		if (oldPhysioData && oldPhysioData.workExperience != null && oldPhysioData.workExperience != undefined) {
// 			formik.setFieldValue("experience", oldPhysioData.workExperience);
// 		}
//  // setting clinic name from database
//         if (
//             oldPhysioData &&
//             oldPhysioData.clinic.name != null &&
//             oldPhysioData.clinic.name != undefined &&
//             oldPhysioData.clinic.name.length != 0
//         ) {
//             formik.setFieldValue("clinicName", oldPhysioData.clinic.name);
//         }

// //         // setting clinic address from database
//         if (
//             oldPhysioData &&
//             oldPhysioData.clinic.address != null &&
//             oldPhysioData.clinic.address != undefined &&
//             oldPhysioData.clinic.address.length != 0
//         ) {
//             formik.setFieldValue("clinicAddress", oldPhysioData.clinic.address);
//         }

// //         // setting clinic pincode from database
//         if (
//             oldPhysioData &&
//             oldPhysioData.clinic.zipCode != null &&
//             oldPhysioData.clinic.zipCode != undefined &&
//             oldPhysioData.clinic.zipCode.length != 0
//         ) {
//             formik.setFieldValue("clinicPincode", oldPhysioData.clinic.zipCode);
//         }

//         if (
//             oldPhysioData &&
//             oldPhysioData.clinic.city != null &&
//             oldPhysioData.clinic.city != undefined &&
//             oldPhysioData.clinic.city.length != 0
//         ) {
//             formik.setFieldValue("clinicCity", oldPhysioData.clinic.city);
//         }
//         if (
//             oldPhysioData &&
//             oldPhysioData.clinic.state != null &&
//             oldPhysioData.clinic.state != undefined &&
//             oldPhysioData.clinic.state.length != 0
//         ) {
//             formik.setFieldValue("clinicState", oldPhysioData.clinic.state);
//         }

// //         // setting consultation fees from database
//         if (
//             oldPhysioData &&
//             oldPhysioData.clinic.charges != null &&
//             oldPhysioData.clinic.charges != undefined &&
//             oldPhysioData.clinic.charges.length != 0
//         ) {
//             formik.setFieldValue("consultationFees", oldPhysioData.clinic.charges);
//         }
// 		// setting consultation fees from database
//         if (
//             oldPhysioData &&
//             oldPhysioData.clinic.charges != null &&
//             oldPhysioData.clinic.charges != undefined &&
//             oldPhysioData.clinic.charges.length != 0
//         ) {
//             formik.setFieldValue("consultationFees", oldPhysioData.clinic.charges);
//         }


// //         // setting home charges upto 5km from database
//         if (
//             oldPhysioData &&
//             oldPhysioData.home.consultationChargesUp5Km != null &&
//             oldPhysioData.home.consultationChargesUp5Km != undefined &&
//             oldPhysioData.home.consultationChargesUp5Km.length != 0
//         ) {
//             formik.setFieldValue("homeChargesUpto5km", oldPhysioData.home.consultationChargesUp5Km);
//         }

// //         // setting home charges upto 10km from database
//         if (
//             oldPhysioData &&
//             oldPhysioData.home.consultationChargesUp10Km != null &&
//             oldPhysioData.home.consultationChargesUp10Km != undefined &&
//             oldPhysioData.home.consultationChargesUp10Km.length != 0
//         ) {
//             formik.setFieldValue("homeChargesUpto10km", oldPhysioData.home.consultationChargesUp10Km);
//         }

// //         // setting home pincode from database
//         if (
//             oldPhysioData &&
//             oldPhysioData.home.zipCode != null &&
//             oldPhysioData.home.zipCode != undefined &&
//             oldPhysioData.home.zipCode.length != 0
//         ) {
//             formik.setFieldValue("homePincode", oldPhysioData.home.zipCode);
//         }


// 		// setting Specialization from database
// 	}, [oldPhysioData]);

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
                     <p className="mt-0">fill your business details below</p>
					  {/* clinic Name */}
                      {/* {formik.values.serviceType.includes("clinic") && ( */}
                        <div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="clinicName"
                                    className="text-sm"
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
							
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
                          <label
                                    htmlFor="clinicAddress"
                                    className="text-sm"
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
                                    htmlFor="clinicPincode"
                                    className="text-sm"
                                >
                                    Clinic Pincode
                                </label>
                                <Input
                                    name="clinicPincode"
                                    id="clinicPincode"
                                    placeholder="Enter Clinic Pincode"
                                    value={formik.values.clinicPincode}
                                    onChange={formik.handleChange}
                                    labelProps={{ className: "hidden" }}
                                    className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                                />
                                {formik.touched.clinicPincode && formik.errors.clinicPincode && (
                                    <p className="text-red-500">{formik.errors.clinicPincode}</p>
                                )}
                            </div>
                            </div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
                              <label
                                    htmlFor="clinicAddress"
                                    className="text-sm"
                                >
                                    Clinic City
                                </label>
									<Input
                                        name="clinicCity"
                                        value={formik.values.clinicCity}
                                        onChange={formik.handleChange}
                                        labelProps={{ className: "hidden" }}
                                        placeholder="Enter Your City"
                                        disabled={formik.values.clinicPincode.length == 6}
                                        className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                                    />

                                    {formik.touched.clinicCity && formik.errors.clinicCity && (
                                        <p className="text-red-500">{formik.errors.clinicCity}</p>
                                    )}
</div>
<div className="space-y-2">
                              <label
                                    htmlFor="clinicState"
                                    className="text-sm"
                                >
                                    Clinic Sate
                                </label>
                                    <Input
                                        name="clinicState"
                                        value={formik.values.clinicState}
                                        onChange={formik.handleChange}
                                        labelProps={{ className: "hidden" }}
                                        placeholder="Enter Your State"
                                        disabled={formik.values.clinicPincode.length == 6}
                                        className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                                    />

                                    {formik.touched.clinicState && formik.errors.clinicState && (
                                        <p className="text-red-500">{formik.errors.clinicState}</p>
                                    )}
									</div>
									</div>
									
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
                          <label
                                    htmlFor="clinicCharges"
                                    className="text-sm"
                                >
                                    Consultation Fees
                                </label>
                                <Input
                                    name="clinicCharges"
                                    id="clinicCharges"
                                    placeholder="Enter Consultation Fees"
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
                                    className="text-sm"
                                >
                                    Consultation time (in minutes)
                                </label>
                                <Input
                                    name="clinicDuration"
                                    id="clinicDuration"
                                    placeholder="Enter Consultation time"
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
                      {/* )} */}
                      <div className="flex items-center gap-4 mt-4">
  <hr className="flex-1 border-t border-black" />
  <span className="text-black font-medium">HomeCare Details</span>
  <hr className="flex-1 border-t border-black" />
</div>
							  {/* Home Care */}
                              {/* {formik.values.serviceType.includes("home") && ( */}
                        <div className="">
                            <h6 className="text-lg font-semibold">Home Care </h6>
                            <div className="space-y-2">
                                <label
                                    htmlFor="homePincode"
                                    className="text-sm"
                                >
                                    Pincode
                                </label>
                                <Input
                                    name="homePincode"
                                    id="homePincode"
                                    placeholder="Enter Pincode"
                                    value={formik.values.homePincode}
                                    onChange={formik.handleChange}
                                    labelProps={{ className: "hidden" }}
                                    className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                                />
                                {formik.touched.homePincode && formik.errors.homePincode && (
                                    <p className="text-red-500">{formik.errors.homePincode}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="homeCity"
                                    className="text-sm"
                                >
                                    Home City
                                </label>

                                    <Input
                                        name="homeCity"
                                        value={formik.values.homeCity}
                                        onChange={formik.handleChange}
                                        labelProps={{ className: "hidden" }}
                                        placeholder="Enter Your City"
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
                                    className="text-sm"
                                >
                                    Home State
                                </label>
                                    <Input
                                        name="homeState"
                                        value={formik.values.homeState}
                                        onChange={formik.handleChange}
                                        labelProps={{ className: "hidden" }}
                                        placeholder="Enter Your State"
                                        disabled={formik.values.homePincode.length == 6}
                                        className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                                    />
                                    {formik.touched.homeState && formik.errors.homeState && (
                                        <p className="text-red-500">{formik.errors.homeState}</p>
                                    )}
                       
                            </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="homeCharges"
                                    className="text-sm"
                                >
                                    Consultation fee upto 5 km
                                </label>
                                <Input
                                    id="homeCharges"
                                    name="homeCharges"
                                    placeholder="Enter Amount"
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
                                    htmlFor="homeCharges10Km"
                                    className="text-sm"
                                >
                                    Consultation fee upto 10 km
                                </label>
                                <Input
                                    id="homeCharges10Km"
                                    name="homeCharges10Km"
                                    placeholder="Enter Amount"
                                    value={formik.values.homeCharges10Km}
                                    onChange={formik.handleChange}
                                    labelProps={{ className: "hidden" }}
                                    className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                                />
                                {formik.touched.homeCharges10Km && formik.errors.homeCharges10Km && (
                                    <p className="text-red-500">{formik.errors.homeCharges10Km}</p>
                                )}
                            </div>
                         
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="duration"
                                    className="text-sm"
                                >
                                    Consultation Time(in minutes)
                                </label>
                                <Input
                                    id="homeDuration"
                                    name="homeDuration"
                                    placeholder="Enter Time"
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
                              {/* )}
									 */}
					
                    <div className="w-full flex flex-row justify-between items-center mt-4 gap-4">
  <button
    type="button"
    onClick={() => navigate(-1)}
    className="text-black hover:text-green font-medium flex items-center gap-1 text-sm sm:text-base"
  >
    <GoDash className="w-4 h-4 sm:w-5 sm:h-5" />
    Go Back
  </button>
  <Button
    className="w-fit hover:shadow-none font-normal px-6 sm:px-12 bg-green rounded-full py-3 " 
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
export default PhysioConnectWorkExperience;