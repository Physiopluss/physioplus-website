import { GoDash } from "react-icons/go";
import { Button, Input, Radio } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getPhysioDataPhysioConnectApi, physioConnectWorkExperiencePageApi } from "../../api/physioConnect";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import PhysioConnectRightCard from "../../components/PhysioConnectRightCard";
import { setPhysioConnectPhysioId } from "../../slices/physioConnect";
import StepIndicator from "../../components/StepIndicator";

const PhysioConnectWorkExperience = () => {
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
			IAP: true,
			IAP_number: "",
			treatInsuredPatient: true,
			experience: "",
		},
		validationSchema: Yup.object().shape({
			IAP: Yup.boolean().required("IAP is required"),
			IAP_number: Yup.string(),
			treatInsuredPatient: Yup.boolean().required("treatInsuredPatient is required"),
			experience: Yup.string().required("experience is required"),
		}),
		onSubmit: (values) => {
			const { IAP, IAP_number, treatInsuredPatient, experience } = values;
			const IAPInDigit = IAP ? 1 : 0;
			const treatInsuredPatientInDigit = treatInsuredPatient ? "true" : "false";
			physioConnectWorkExperiencePageApi(
				IAPInDigit,
				IAP_number,
				treatInsuredPatientInDigit,
				experience,
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

	useEffect(() => {
		// setting IAP from database
		if (oldPhysioData && oldPhysioData.iapMember != null && oldPhysioData.iapMember != undefined) {
			if (oldPhysioData.iapMember == 0) {
				formik.setFieldValue("IAP", false);
			} else {
				formik.setFieldValue("IAP", true);
			}
		}

		// setting IAP Number from database
		if (oldPhysioData && oldPhysioData.iapNumber != null && oldPhysioData.iapNumber != undefined) {
			formik.setFieldValue("IAP_number", oldPhysioData.iapNumber);
		}

		// setting treatInsuredPatient from database
		if (
			oldPhysioData &&
			oldPhysioData.treatInsuranceclaims != null &&
			oldPhysioData.treatInsuranceclaims != undefined
		) {
			formik.setFieldValue("treatInsuredPatient", oldPhysioData.treatInsuranceclaims);
		}

		// setting experience from database
		if (oldPhysioData && oldPhysioData.workExperience != null && oldPhysioData.workExperience != undefined) {
			formik.setFieldValue("experience", oldPhysioData.workExperience);
		}

		// setting Specialization from database
	}, [oldPhysioData]);

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
					onSubmit={formik.handleSubmit}
					className="flex flex-col gap-4 flex-1 max-w-screen-lg"
				>
					<h6 className="font-semibold text-3xl">Work Experience</h6>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="IAP"
							className="text-sm"
						>
							Are you registered with IAP
						</label>
						<div className="flex gap-2">
							<Radio
								className="w-4 h-4 hover:before:opacity-0"
								label="Yes"
								name="IAP"
								value={formik.values.IAP}
								checked={formik.values.IAP == true}
								onChange={() => formik.setFieldValue("IAP", true)}
							/>
							<Radio
								className="w-4 h-4 hover:before:opacity-0"
								label="No"
								name="IAP"
								value={formik.values.IAP}
								checked={formik.values.IAP == false}
								onChange={() => formik.setFieldValue("IAP", false)}
							/>
						</div>
					</div>
					{formik.touched.IAP && formik.errors.IAP ? (
						<div className="text-red-500 mt-2">{formik.errors.IAP}</div>
					) : null}

					{formik.values.IAP == true && (
						<div className="flex flex-col gap-2">
							<label
								htmlFor="IAP_number"
								className="text-sm"
							>
								If yes
							</label>
							<Input
								size="md"
								name="IAP_number"
								value={formik.values.IAP_number}
								onChange={formik.handleChange}
								labelProps={{ className: "hidden" }}
								placeholder="Enter IAP Number"
								className="border-none placeholder:text-gray-300 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
							/>
						</div>
					)}
					{formik.touched.IAP_number && formik.errors.IAP_number ? (
						<div className="text-red-500 mt-2">{formik.errors.IAP_number}</div>
					) : null}

					<div className="flex flex-col gap-2">
						<label
							htmlFor="treatInsuredPatient"
							className="text-sm"
						>
							Like to treat Insurance claim Patient?
						</label>
						<div className="flex gap-2">
							<Radio
								className="w-4 h-4 hover:before:opacity-0"
								label="yes"
								name="treatInsuredPatient"
								checked={formik.values.treatInsuredPatient == true}
								value={formik.values.treatInsuredPatient}
								onChange={() => formik.setFieldValue("treatInsuredPatient", true)}
							/>
							<Radio
								className="w-4 h-4 hover:before:opacity-0"
								label="no"
								name="treatInsuredPatient"
								checked={formik.values.treatInsuredPatient == false}
								value={formik.values.treatInsuredPatient}
								onChange={() => formik.setFieldValue("treatInsuredPatient", false)}
							/>
						</div>
						<p className="text-sm text-gray-600">Note : Money will be settled in 45 days.</p>
					</div>
					{formik.touched.treatInsuredPatient && formik.errors.treatInsuredPatient ? (
						<div className="text-red-500 mt-2">{formik.errors.treatInsuredPatient}</div>
					) : null}

					<div className="flex flex-col gap-2">
						<label
							htmlFor="experience"
							className="text-sm"
						>
							Work Experience (in years)
						</label>
						<Input
							size="md"
							name="experience"
							value={formik.values.experience}
							onChange={formik.handleChange}
							type="number"
							labelProps={{ className: "hidden" }}
							placeholder="Enter your experience"
							className="border-none placeholder:text-gray-300 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
						/>
					</div>
					{formik.touched.experience && formik.errors.experience ? (
						<div className="text-red-500 mt-2">{formik.errors.experience}</div>
					) : null}

					<div className="w-full flex justify-center">
						<Button
							className="w-fit hover:shadow-none font-normal px-12 bg-green rounded-full"
							type="submit"
						>
							Submit
						</Button>
					</div>
				</form>
				{/* right side */}
				<PhysioConnectRightCard />
			</div>
		</>
	);
};
export default PhysioConnectWorkExperience;
