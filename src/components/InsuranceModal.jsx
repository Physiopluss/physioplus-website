import { Input, Button, Dialog, IconButton, Typography, DialogBody, DialogHeader } from "@material-tailwind/react";
import { useFormik } from "formik";
import { IoMdClose } from "react-icons/io";
import { MdPhoneInTalk } from "react-icons/md";
import * as Yup from "yup";
import { insuranceEnquiry } from "../api/misc";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setSuccessModalOpen } from "../slices/modalSlice";

const InsuranceModal = ({ insuranceModal, handleInsuranceModalOpen }) => {
	const dispatch = useDispatch();

	const formik = useFormik({
		initialValues: { name: "", phone: "", companyName: "", policyNumber: "" },
		validationSchema: Yup.object().shape({
			name: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("name is required"),
			phone: Yup.string()
				.length(10, "Number should be 10 digits")
				.matches(/[6789]\d{9}$/g, "Phone number is not valid")
				.required("Phone number is required"),
			companyName: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Company Name is required"),
			policyNumber: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("Policy Number is required"),
		}),
		onSubmit: (values) => {
			insuranceEnquiry(values)
				.then((res) => {
					if (res.status >= 200 && res.status < 300) {
						handleInsuranceModalOpen();
						dispatch(setSuccessModalOpen());
					} else if (res.status >= 400 && res.status < 600) {
						toast.error(res.data.message);
					}
				})
				.catch((err) => {
					return new Error(err);
				});
		},
	});
	return (
		<Dialog
			size="sm"
			open={insuranceModal}
			handler={handleInsuranceModalOpen}
			className="relative py-6 px-8 bg-[#FFFDF5] rounded-3xl m-0 z-10"
		>
			<DialogHeader className=" m-0 block">
				<Typography
					variant="h6"
					color="blue-gray"
					className="text-2xl font-semibold"
				>
					Check If You’re eligible for coverage with us?
				</Typography>
			</DialogHeader>
			<IconButton
				size="sm"
				variant="text"
				className="!absolute right-4 top-4 hover:bg-transparent"
				onClick={handleInsuranceModalOpen}
			>
				<IoMdClose className="h-6 w-6 stroke-2" />
			</IconButton>
			<form
				onSubmit={formik.handleSubmit}
				method="POST"
			>
				<DialogBody className="space-y-4 pb-6">
					<div>
						<Typography
							variant="small"
							color="blue-gray"
							className="mb-2 text-left text-sm font-medium"
						>
							Policy Holder Name
						</Typography>
						<Input
							color="gray"
							size="lg"
							placeholder="John Doe"
							name="name"
							onChange={formik.handleChange}
							value={formik.values.name}
							labelProps={{ className: "hidden" }}
							className="border !border-gray-400 focus:!border-t-gray-400 placeholder:text-blue-gray-300 placeholder:opacity-100 bg-white"
							containerProps={{
								className: "!min-w-full",
							}}
						/>
					</div>
					{formik.errors.name && formik.touched.name && (
						<span className="text-red-500 text-sm">{formik.errors.name}</span>
					)}
					<div>
						<Typography
							variant="small"
							color="blue-gray"
							className="mb-2 text-left text-sm font-medium"
						>
							Mobile Number
						</Typography>
						<Input
							color="gray"
							size="lg"
							placeholder="+91 9XXXXXXXXX"
							name="phone"
							onChange={formik.handleChange}
							value={formik.values.phone}
							labelProps={{ className: "hidden" }}
							className="border !border-gray-400 focus:!border-t-gray-400 placeholder:text-blue-gray-300 placeholder:opacity-100 bg-white"
							containerProps={{
								className: "!min-w-full",
							}}
						/>
					</div>
					{formik.errors.phone && formik.touched.phone && (
						<span className="text-red-500 text-sm">{formik.errors.phone}</span>
					)}
					<div>
						<Typography
							variant="small"
							color="blue-gray"
							className="mb-2 text-left text-sm font-medium"
						>
							Policy Company Name
						</Typography>
						<Input
							color="gray"
							size="lg"
							placeholder="Enter Policy Company Name"
							name="companyName"
							onChange={formik.handleChange}
							value={formik.values.companyName}
							labelProps={{ className: "hidden" }}
							className="border !border-gray-400 focus:!border-t-gray-400 placeholder:text-blue-gray-300 placeholder:opacity-100 bg-white"
							containerProps={{
								className: "!min-w-full",
							}}
						/>
					</div>
					{formik.errors.companyName && formik.touched.companyName && (
						<span className="text-red-500 text-sm">{formik.errors.companyName}</span>
					)}
					<div>
						<Typography
							variant="small"
							color="blue-gray"
							className="mb-2 text-left text-sm font-medium"
						>
							Policy Number
						</Typography>
						<Input
							color="gray"
							size="lg"
							placeholder="Enter Policy Number"
							name="policyNumber"
							onChange={formik.handleChange}
							value={formik.values.policyNumber}
							labelProps={{ className: "hidden" }}
							className="border !border-gray-400 focus:!border-t-gray-400 placeholder:text-blue-gray-300 placeholder:opacity-100 bg-white"
							containerProps={{
								className: "!min-w-full",
							}}
						/>
					</div>
					{formik.errors.policyNumber && formik.touched.policyNumber && (
						<span className="text-red-500 text-sm">{formik.errors.policyNumber}</span>
					)}
					<Button
						className="w-full text-base font-medium rounded-full hover:shadow-none bg-green"
						type="submit"
					>
						Submit Request
					</Button>

					<hr className="border-gray-200 my-2" />
					<p className="flex items-center gap-2 text-black">
						<MdPhoneInTalk className="min-w-4 h-4 " />I am offering both video sessions and office visit during
						weekends.
					</p>
					<p className="flex items-center gap-2 text-black">
						<MdPhoneInTalk className="min-w-4 h-4" />
						Available both in-person and online.
					</p>
				</DialogBody>
			</form>
		</Dialog>
	);
};
export default InsuranceModal;
