import { useFormik } from "formik";
import toast from "react-hot-toast";
import { signUp } from "../../api/auth";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSignupData } from "../../slices/authSlice";
import { setOtpModalOpen } from "../../slices/modalSlice";
import OtpModal from "../../components/OtpModal";
import { Radio } from "@material-tailwind/react";
import "react-day-picker/style.css";

const SignUp = () => {
	const dispatch = useDispatch();
	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: 100 }, (_, i) => currentYear - 10 - i);

	const formik = useFormik({
		initialValues: {
			fullName: "",
			phone: "",
			gender: "1",
			date: "",
		},
		validationSchema: Yup.object().shape({
			fullName: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("name is required"),
			phone: Yup.string()
				.length(10, "Number should be 10 digits")
				.matches(/[6789]\d{9}$/g, "Phone number is not valid")
				.required("Phone number is required"),
			date: Yup.number().required("Date is required"),
		}),
		onSubmit: (values) => {
			signUp(values).then((res) => {
				if (res.status >= 200 && res.status < 300) {
					toast.success(res.data.message, { id: "otpSendViaSignup", className: "capitalize" });
					dispatch(setSignupData(values));
					setTimeout(() => {
						dispatch(setOtpModalOpen());
					}, 1500);
				} else if (res.status >= 400 && res.status < 500) {
					toast.error(res.data.message, { id: "SignupError1", className: "capitalize" });
				} else {
					toast.error("Something went wrong", { id: "SignupError2", className: "capitalize" });
				}
			});
		},
	});

	return (
		<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-sm">
				<img
					alt="Physioplus healthcare"
					src="./logo-nobg.png"
					className="mx-auto h-10 w-auto"
				/>
				<h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
					Create an account
				</h2>
			</div>

			<div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
				<form
					onSubmit={formik.handleSubmit}
					method="POST"
					className="space-y-6"
				>
					<div>
						<label
							htmlFor="name"
							className="block text-sm font-medium leading-6 text-gray-900"
						>
							Name
						</label>
						<div className="mt-2">
							<input
								id="name"
								name="fullName"
								type="text"
								placeholder="John Doe"
								className="block ring-1 ring-black w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ps-6 pe-3 placeholder:text-gray-400 sm:leading-6 "
								onChange={formik.handleChange}
								value={formik.values.name}
								autoComplete="off"
							/>
						</div>
						{formik.touched.fullName && formik.errors.fullName ? (
							<div className="text-red-500 mt-2">{formik.errors.fullName}</div>
						) : null}
					</div>
					<div>
						<label
							htmlFor="phone"
							className="block text-sm font-medium leading-6 text-gray-900"
						>
							Phone Number
						</label>

						<div className="relative mt-2  flex">
							<div className="absolute top-1/2 -translate-y-1/2 left-3 ">+91</div>
							<input
								id="phone"
								name="phone"
								placeholder="9XXXXXXXXX"
								maxLength="10"
								className="block ring-1 ring-black w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ps-10 pe-3 placeholder:text-gray-400 sm:leading-6 "
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
						<label
							htmlFor="dob"
							className="block text-sm font-medium leading-6 text-gray-900 mb-2"
						>
							Year of Birth
						</label>
						<select
							id="dob"
							name="date"
							value={formik.values.date}
							onChange={formik.handleChange}
							className="block ring-1 ring-black w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ps-6 pe-3 sm:leading-6"
						>
							<option
								value=""
								disabled
							>
								Select Year
							</option>
							{years.map((year) => (
								<option
									key={year}
									value={year}
								>
									{year}
								</option>
							))}
						</select>
						{formik.touched.date && formik.errors.date ? (
							<div className="text-red-500 mt-2">{formik.errors.date}</div>
						) : null}
					</div>
					<div>
						<label
							htmlFor="gender"
							className="block text-sm font-medium leading-6 text-gray-900"
						>
							Gender
						</label>
						<div className="flex gap-6 mt-2">
							<Radio
								name="gender"
								label="Male"
								id="gender"
								value="1"
								onChange={formik.handleChange}
								defaultChecked
							/>
							<Radio
								name="gender"
								label="Female"
								id="gender"
								value="0"
								onChange={formik.handleChange}
							/>
							<Radio
								name="gender"
								label="Other"
								id="gender"
								value="2"
								onChange={formik.handleChange}
							/>
						</div>
					</div>
					<div>
						<button
							type="submit"
							className="flex w-full justify-center rounded-md bg-green px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-lightGreen hover:text-green ring-1 ring-green"
						>
							Create an account
						</button>
					</div>
				</form>
				<OtpModal />

				<p className="mt-10 text-center text-sm text-gray-500">
					Already have an account
					<Link
						to="/login"
						className="font-semibold text-xs ps-1 underline leading-6  text-green hover:text-black"
					>
						Click here
					</Link>
				</p>
			</div>
		</div>
	);
};
export default SignUp;
