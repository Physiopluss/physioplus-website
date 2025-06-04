import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { numberSchema } from "../../validation";
import { useFormik } from "formik";
import * as Yup from "yup";
import OtpModal from "../../components/OtpModal";
import { setOtpModalOpen } from "../../slices/modalSlice";
import { useDispatch } from "react-redux";
import { setPhysioLoginData } from "../../slices/authSlice";
import { Input } from "@material-tailwind/react";
import { physioConnectLogin } from "../../api/physioConnect.js";

const LoginPhysio = () => {
	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: {
			phone: "",
		},
		validationSchema: Yup.object({ phone: numberSchema }),
		onSubmit: (values) => {
			physioConnectLogin(values.phone).then((res) => {
				if (res.status >= 200 && res.status < 300) {
					toast.success(res.data.message, {
						id: "otpSendViaLogin",
						className: "capitalize",
					});
					dispatch(setPhysioLoginData(values.phone));
					setTimeout(() => {
						dispatch(setOtpModalOpen());
					}, 1500);
				} else if (res.status >= 400 && res.status < 500) {
					toast.error(res.data.message, {
						id: "loginError1",
						className: "capitalize",
					});
				} else {
					toast.error("Something went wrong", {
						id: "loginError2",
						className: "capitalize",
					});
				}
			});
		},
	});

	return (
		<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<img
					alt="Physioplus healthcare"
					src="/logo-nobg.png"
					className="mx-auto h-10 w-auto"
				/>
				<h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
					Physio Login
				</h2>
			</div>

			<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
				<form onSubmit={formik.handleSubmit} method="POST" className="space-y-6">
					<div>
						<label htmlFor="phone" className="block text-sm font-medium text-gray-900">
							Phone Number
						</label>
						<div className="relative mt-2 flex">
							<div className="absolute top-[0.45rem] left-3">+91</div>
							<Input
								id="phone"
								name="phone"
								placeholder="9XXXXXXXXX"
								maxLength="10"
								className="block w-full rounded-md !border-none ring-black !ring-1 text-gray-900 shadow-sm ps-11 pe-2 placeholder:text-gray-400 sm:leading-6"
								labelProps={{ className: "hidden" }}
								onChange={formik.handleChange}
								value={formik.values.phone}
								autoComplete="off"
							/>
						</div>
						{formik.touched.phone && formik.errors.phone ? (
							<div className="text-red-500 mt-2">{formik.errors.phone}</div>
						) : null}
					</div>

					<div>
						<button
							type="submit"
							className="flex w-full justify-center rounded-md bg-green px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-lightGreen hover:text-green ring-1 ring-green"
						>
							Send OTP
						</button>
					</div>
				</form>

				{/* ✅ Pass "physio" as type */}
				<OtpModal type="physio" phone={formik.values.phone} />

				<p className="mt-8 text-center text-sm text-gray-500">
					Not registered?
					<Link
						to="/physio-connect/signup"
						className="font-semibold text-xs ps-1 underline leading-6 text-green hover:text-black"
					>
						Create account
					</Link>
				</p>
			</div>
		</div>
	);
};

export default LoginPhysio;
