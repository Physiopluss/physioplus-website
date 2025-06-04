import { Input } from "@material-tailwind/react";
import { Button } from "react-day-picker";
import OTPInput from "react-otp-input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { physioConnectOtpVerify, physioConnectSignUp } from "../../api/physioConnect";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setPhysioConnectPhysioId } from "../../slices/physioConnect";
import { useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";
import { setSuccessModalOpen } from "../../slices/modalSlice";
import SuccessModal from "../../components/SuccessModal";

const PhysioConnectSignup = () => {
	const [show, setShow] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [otp, setOtp] = useState("");

	// google analytics
	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Physio Connect Signup" });
	}, []);

	const formik = useFormik({
		initialValues: {
			fullName: "",
			mobile: "",
		},
		validationSchema: Yup.object().shape({
			fullName: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("name is required"),
			mobile: Yup.string()
				.length(10, "Number should be 10 digits")
				.matches(/[6789]\d{9}$/g, "Phone number is not valid")
				.required("Phone number is required"),
		}),
		onSubmit: (values) => {
			const { mobile } = values;
			physioConnectSignUp(mobile).then((res) => {
				if (res.status >= 200 && res.status < 300) {
					toast.success(res.data.message, { id: "otpSendViaSignup", className: "capitalize" });
					setShow(true);
				} else if (res.status >= 400 && res.status < 500) {
					toast.error(res.data.message, { id: "SignupError1", className: "capitalize" });
				} else {
					toast.error("Something went wrong", { id: "SignupError2", className: "capitalize" });
				}
			});
		},
	});

	const handleOtpSubmit = async () => {
		try {


			const res = await physioConnectOtpVerify(
				formik.values.mobile,
				otp,
				formik.values.fullName
			);



			const isNew = res?.data?.isNew;
			const physioId = res?.data?.physio?._id;

			if (!physioId) {
				throw new Error("Physio ID missing from response");
			}

			// Show appropriate success toast
			toast.success(
				isNew ? "Welcome aboard! Sign-up successful." : "You're already registered. Head to login..",
				{
					id: isNew ? "signupSuccess" : "loginPrompt",
					className: "capitalize z-10",
				}
			);


			// Store ID and update Redux
			sessionStorage.setItem("physioConnectId", physioId);
			dispatch(setPhysioConnectPhysioId(physioId));

			setOtp(""); // Reset OTP input

			// Delay navigation based on user status
			// Then redirect
			setTimeout(() => {
				if (isNew) {
					navigate("/physio-connect/personal-details");
				} else {
					navigate("/login-physio"); // <- You are redirecting to login page
				}
			}, 1500);

		} catch (error) {
			console.error("OTP Submit Error:", error);

			if (error.response?.status >= 400 && error.response?.status < 500) {
				toast.error("Invalid OTP Code", {
					id: "OtpErrorLogin1",
					className: "capitalize z-10",
				});
			} else {
				toast.error("Something went wrong", {
					id: "OtpErrorLogin2",
					className: "capitalize z-10",
				});
			}
		}
	};


	// scroll to top
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);


	return (
		<>
			<div className="flex flex-col sm:flex-row my-auto max-h-screen sm:overflow-hidden">
				{/* left side */}
				<div className="relative hidden md:block md:w-3/5 bg-green">
					<img
						src={
							"https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/Swiper+Gallery/full-shot-woman-physical-rehabilitation+(1)+1+(1)+(1).png "
						}
						alt=""
						className="object-contain"
					/>
					{/* image start absolute logo */}
					<img
						src="/connect/logo.png"
						className="absolute w-24 top-16 left-8 cursor-pointer"
						onClick={() => navigate("/")}
					/>
					{/* image end absolute text */}
					<div className="absolute px-4 w-full bottom-8 text-white flex flex-col items-center gap-4">
						<p className="text-3xl font-semibold text-center">Unlock Your Strength: Join the Path to Recovery Today!</p>
						<div className="flex gap-4">
							<p className="flex gap-2 items-center">
								<img
									src="/connect/tick.png"
									alt=""
									className="w-4 object-cover bg-white p-0 rounded-full"
								/>
								Boost Earnings
							</p>
							<p className="flex gap-2 items-center">
								<img
									src="/connect/tick.png"
									alt=""
									className="w-4 object-cover bg-white p-0 rounded-full"
								/>
								Boost Earnings
							</p>
							<p className="flex gap-2 items-center">
								<img
									src="/connect/tick.png"
									alt=""
									className="w-4 object-cover bg-white p-0 rounded-full"
								/>
								Boost Earnings
							</p>
						</div>
					</div>
				</div>
				{/* right side */}
				<div className="px-8 py-8 min-h-screen sm:py-0 md:w-2/5 flex gap-2 flex-col justify-center items-center text-black">
					<form
						onSubmit={formik.handleSubmit}
						className="flex gap-2 flex-col"
					>
						<div className="my-2 flex flex-col gap-2">
							<img
								src="/connect/logo.png"
								alt=""
								className="w-24 cursor-pointer"
								onClick={() => navigate("/")}
							/>
							<p className="text-lg font-medium">Welcome to Physioplus Community</p>
							<p className="text-3xl ">Get started with your name & phone number</p>
						</div>
						<div className="flex flex-col gap-2 w-full">
							<label
								htmlFor="fullName"
								className="text-sm"
							>
								Name
							</label>
							<Input
								id="fullName"
								size="md"
								name="fullName"
								onChange={formik.handleChange}
								value={formik.values.fullName}
								labelProps={{ className: "hidden" }}
								placeholder="Enter Your Name"
								className="border-none placeholder:text-gray-300 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
							/>
						</div>
						{formik.touched.fullName && formik.errors.fullName ? (
							<div className="text-red-500 mt-2">{formik.errors.fullName}</div>
						) : null}
						<div className="flex flex-col gap-2 w-full">
							<label
								htmlFor="mobile"
								className="text-sm"
							>
								Mobile Number
							</label>
							<Input
								id="mobile"
								size="md"
								name="mobile"
								maxLength={10}
								onChange={formik.handleChange}
								value={formik.values.mobile}
								labelProps={{ className: "hidden" }}
								placeholder="Enter Mobile Number"
								className="border-none placeholder:text-gray-300 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
							/>
						</div>
						{formik.touched.mobile && formik.errors.mobile ? (
							<div className="text-red-500 mt-2">{formik.errors.mobile}</div>
						) : null}
						<hr className="w-full border border-gray-200 my-4" />
						<Button
							type="submit"
							className="mt-2 font-normal text-sm sm:text-base rounded-full w-full bg-green text-white hover:shadow-none px-8 py-2 capitalize"
						>
							{show ? "Resend OTP" : "Send OTP"}
						</Button>
					</form>
					{show && (
						<div className="w-full my-4 flex flex-col gap-2 justify-center">
							<div className="flex flex-col gap-2">
								<p className="text-center">Otp has been sent to your mobile number</p>
								{formik.values.mobile.length === 10 ? <p className="text-center">+91 {formik.values.mobile}</p> : null}
							</div>
							<div className="flex flex-col gap-4 justify-center items-center">
								<p>Verify Otp</p>
								<OTPInput
									value={otp}
									onChange={setOtp}
									numInputs={4}
									inputType="number"
									renderSeparator={<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}
									renderInput={(props) => (
										<input
											required
											{...props}
											// disabled={remainingTime === 0}
											style={{ width: "40px", height: "40px" }}
											className="!border-b-2 text-center rounded-none border-black outline-none text-black  "
										/>
									)}
								/>
							</div>
							<Button
								onClick={
									() =>
										// mobileState
										handleOtpSubmit()
									// : toast.error("Enter valid mobile number", { id: "OtpErrorLogin4", className: "capitalize z-10" })
								}
								className="mt-2 font-normal text-sm sm:text-base rounded-full w-full bg-green text-white hover:shadow-none px-8 py-2 capitalize"
							>
								Submit OTP
							</Button>
						</div>
					)}
				</div>
			</div>
			<SuccessModal
				title={"This Number is Already Registered With Us"}
				// description={"Our representative will Connect with you shortly. In next 48 hour to verify your details"}
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
export default PhysioConnectSignup;
