import { Dialog } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOtpModalOpen } from "../slices/modalSlice";
import { setUser } from "../slices/authSlice";
import OTPInput from "react-otp-input";
import { IoIosCloseCircle } from "react-icons/io";
import { login, OtpVerify, signUp } from "../api/auth";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export function OtpModal() {
	const modalOpen = useSelector((state) => state.modal.otpModalOpen);
	const phone = useSelector((state) => state.auth.phone);
	const { type, fullName, gender, date, dob } = useSelector((state) => state.auth);
	const [disabled, setDisabled] = useState(true);
	const [timeLeft, setTimeLeft] = useState(60);
	const [otp, setOtp] = useState("");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	let intervalId;


	const redirectPath = location.state?.from || "/physios";
	// Timer starts after dialog opens
	useEffect(() => {
		if (open) {
			setDisabled(true);
			setTimeLeft(60);

			const intervalId = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						setDisabled(false);
						clearInterval(intervalId);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			return () => {
				clearInterval(intervalId);
			};
		}
	}, [modalOpen]);

	// otpVerify
	const submitHandler = async (type) => {
		type === "login"
			? OtpVerify(phone, otp).then((res) => {
				if (res.status >= 200 && res.status < 300) {
					const user = {
						userToken: res?.data.token,
						userId: res?.data.data._id,
						phone: res?.data.data.phone,
					};
					localStorage.setItem("user", JSON.stringify(user));
					dispatch(setUser(user));
					dispatch(setOtpModalOpen());
					toast.success("login successful", { id: "loginSuccess", className: "capitalize z-10" });
					setTimeout(() => navigate(redirectPath), 1500);

				} else if (res.status >= 400 && res.status < 500) {
					toast.error(res.data.message, { id: "OtpErrorLogin1", className: "capitalize z-10" });
				} else {
					toast.error("Something went wrong", { id: "OtpErrorLogin2", className: "capitalize z-10" });
				}
			})
			: OtpVerify(phone, otp, type, fullName, gender, date, dob).then((res) => {
				if (res.status >= 200 && res.status < 300) {
					const user = {
						userToken: res?.data.token,
						userId: res?.data.data._id,
						phone: res?.data.data.phone,
					};
					localStorage.setItem("user", JSON.stringify(user));
					dispatch(setUser(user));
					dispatch(setOtpModalOpen());
					toast.success("login successful", { id: "SignupSuccess", className: "capitalize" });
					setTimeout(() => navigate(redirectPath), 1500);

				} else if (res.status >= 400 && res.status < 500) {
					toast.error(res.data.message, { id: "OtpErrorLogin2", className: "capitalize" });
				} else {
					toast.error("Something went wrong", { id: "OtpErrorLogin2", className: "capitalize" });
				}
			});
	};

	const handleResendOtp = () => {
		type === "login" ? login(phone) : signUp({ fullName, phone, dob, gender });
		setTimeLeft(60);
		setDisabled(true);
		clearInterval(intervalId);
		const newIntervalId = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					setDisabled(false);
					clearInterval(newIntervalId);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
		return () => {
			clearInterval(newIntervalId);
		};
	};

	return (
		<>
			<Dialog
				open={modalOpen}
				handler={() => dispatch(setOtpModalOpen())}
				className="relative bg-white ring-1 ring-gray-300 !h-2/3 !w-1/3 text-black"
			>
				<IoIosCloseCircle
					size={22}
					className="absolute right-1 top-1 h-6 w-6 cursor-pointer text-black"
					onClick={() => dispatch(setOtpModalOpen())}
				/>

				<div
					// onSubmit={submitHandler}
					className="rounded-lg gap-8 h-full flex flex-col justify-center items-center"
				>
					<div className="flex flex-col gap-1">
						<p className="text-xl font-semibold text-center">Verify OTP</p>
						<p className="text-center text-sm">Send on your {phone} mobile</p>
					</div>
					<OTPInput
						value={otp}
						onChange={setOtp}
						numInputs={4}
						renderSeparator={<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>}
						renderInput={(props) => (
							<input
								required
								{...props}
								// disabled={remainingTime === 0}
								style={{ width: "40px", height: "40px" }}
								className=" outline-none text-black  border border-black rounded-md text-center"
							/>
						)}
					/>
					<button
						onClick={() => {
							submitHandler(type);
						}}
						className="w-56 ring-1 ring-green bg-lightGreen hover:text-white py-1 hover:bg-green px-5 font-semibold text-green rounded-lg text-base"
					>
						Submit
					</button>

					<div className="flex justify-center items-center gap-5">
						<div className="text-sm ">
							Didn't receive OTP?{" "}
							{disabled ? (
								<span className="text-gray-400 cursor-not-allowed">
									Resend in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
								</span>
							) : (
								<button
									className="underline text-green-600"
									onClick={handleResendOtp}
								>
									Resend
								</button>
							)}
						</div>
					</div>
				</div>
			</Dialog>
		</>
	);
}

export default OtpModal;
