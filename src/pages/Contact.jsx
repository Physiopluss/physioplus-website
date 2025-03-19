import { useFormik } from "formik";
import * as Yup from "yup";
import { contactApi } from "../api/misc";
import toast from "react-hot-toast";
import { useEffect } from "react";
import HomeTitleComponent from "../components/HomeTitleComponent";
import HorizontalCard from "../components/HorizontalCard";
import ReactGA from "react-ga4";

const Contact = () => {
	// google analytics
	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Contact" });
	}, []);

	// scroll to top
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	const formik = useFormik({
		initialValues: {
			name: "",
			mobile: "",
			email: "",
			topic: "",
			message: "",
		},
		validationSchema: Yup.object().shape({
			name: Yup.string().min(3, "Too Short!").max(50, "Too Long!").required("name is required"),
			mobile: Yup.number().min(0, "Mobile is required").required("mobile is required"),
			email: Yup.string().email().required("email is required"),
			topic: Yup.string().required("topic is required"),
			message: Yup.string().required("message is required"),
		}),
		onSubmit: (values) => {
			contactApi(values).then((res) => {
				if (res.status >= 200 && res.status < 300) {
					toast.success(res.data.message, { id: "contactSuccess", className: "capitalize" });
				} else if (res.status >= 400 && res.status < 500) {
					toast.error(res.data.message, { id: "contactError1", className: "capitalize" });
				} else {
					toast.error("Something went wrong", { id: "contactError2", className: "capitalize" });
				}
			});
		},
	});

	return (
		<section>
			{/* title  */}
			<div className="bg-[#E6F4EC] flex justify-center items-center min-h-[50vh]">
				<HomeTitleComponent
					sectionText={"Contact Us"}
					title={"Get in Touch with Us"}
				/>
			</div>
			{/* cards */}
			<div className="w-full place-items-center grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 -mt-24 px-4 sm:px-12 lg:px-[120px] mb-12">
				<HorizontalCard
					section={"contact"}
					img={"home/mail.png"}
					title={"Our Email"}
					description={"info@physioplushealthcare.com"}
				/>
				<HorizontalCard
					section={"contact"}
					img={"home/phone.png"}
					title={"Our Contact Number"}
					description={"+91 8107333576"}
				/>
				<HorizontalCard
					section={"contact"}
					img={"home/location.png"}
					title={"Visit Our Office"}
					description={"109,1st Floor,Sankalp Tower,Khatipura Road,Jaipur"}
				/>
			</div>
			{/* form & map */}
			<div className="bg-[#FFFDF5] pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px]">
				<HomeTitleComponent
					sectionText={"Ready to Part of PhysioPlus?"}
					title={"Share your details, and we’ll"}
					subTitle={"reach out to you shortly!"}
					description={
						"Fill in your information below, and our team will get back to you with personalized assistance as soon as possible."
					}
					textColor={""}
				/>
				<div className="flex flex-col md:flex-row gap-4">
					<div className="md:w-1/2">
						<form onSubmit={formik.handleSubmit}>
							<label
								htmlFor="name"
								className="text-base font-medium text-black"
							>
								Name
							</label>
							<input
								name="name"
								type="text"
								className="mt-1 w-full ring-1 ring-[#A9ABB2] rounded-md border-0 text-gray-900 shadow-sm p-2 placeholder:text-gray-400 sm:leading-6 mb-4"
								placeholder="Name"
								onChange={formik.handleChange}
								value={formik.values.name}
							/>
							{formik.touched.name && formik.errors.name ? (
								<div className="text-red-500 -mt-6 mb-2">{formik.errors.name}</div>
							) : null}
							<label
								htmlFor="mobile"
								className="text-base font-medium text-black"
							>
								Mobile
							</label>
							<input
								type="text"
								name="mobile"
								className="mt-1 w-full ring-1 ring-[#A9ABB2] rounded-md border-0 text-gray-900 shadow-sm p-2 placeholder:text-gray-400 sm:leading-6 mb-4"
								placeholder="Mobile"
								onChange={formik.handleChange}
								value={formik.values.mobile}
							/>
							{formik.touched.mobile && formik.errors.mobile ? (
								<div className="text-red-500 -mt-6 mb-2">{formik.errors.mobile}</div>
							) : null}
							<label
								htmlFor="email"
								className="text-base font-medium text-black"
							>
								Email
							</label>
							<input
								type="text"
								name="email"
								className="mt-1 w-full ring-1 ring-[#A9ABB2] rounded-md border-0 text-gray-900 shadow-sm p-2 placeholder:text-gray-400 sm:leading-6 mb-4"
								placeholder="Email"
								onChange={formik.handleChange}
								value={formik.values.email}
							/>
							{formik.touched.email && formik.errors.email ? (
								<div className="text-red-500 -mt-6 mb-2">{formik.errors.email}</div>
							) : null}
							<label
								htmlFor="topic"
								className="text-base font-medium text-black"
							>
								Topic
							</label>
							<input
								type="text"
								name="topic"
								className="mt-1 w-full ring-1 ring-[#A9ABB2] rounded-md border-0 text-gray-900 shadow-sm p-2 placeholder:text-gray-400 sm:leading-6 mb-4"
								placeholder="Topic"
								onChange={formik.handleChange}
								value={formik.values.topic}
							/>
							{formik.touched.topic && formik.errors.topic ? (
								<div className="text-red-500 -mt-6 mb-2">{formik.errors.topic}</div>
							) : null}
							<label
								htmlFor="message"
								className="text-base font-medium text-black"
							>
								Message
							</label>
							<textarea
								name="message"
								id="text"
								className="w-full box-border h-36 ring-1 ring-[#A9ABB2] rounded-md border-0 p-2 text-gray-900 shadow-sm placeholder:text-gray-400 sm:leading-6 mt-1 mb-4"
								placeholder="Your Message"
								onChange={formik.handleChange}
								value={formik.values.message}
							></textarea>
							{formik.touched.message && formik.errors.message ? (
								<div className="text-red-500  -mt-6 mb-2">{formik.errors.message}</div>
							) : null}
							<button className="w-fit h-12 rounded-full bg-green px-8 py-0.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-lightGreen hover:text-green ring-1 ring-green">
								Submit Request
							</button>
						</form>
					</div>
					<div className="md:w-1/2 ">
						<iframe
							className="w-full h-full min-h-96 rounded-md"
							src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.440842202813!2d75.7531905!3d26.921235499999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db37beaac3f33%3A0xf1e3a9a5b66701d3!2sSankalp%20Tower!5e0!3m2!1sen!2sin!4v1736229380688!5m2!1sen!2sin'"
							allowfullscreen=""
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
						></iframe>
					</div>
				</div>
			</div>
		</section>
	);
};
export default Contact;
