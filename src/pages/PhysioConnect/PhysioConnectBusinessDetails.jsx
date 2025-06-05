import ReactGA from "react-ga4";
import { MdOutlineFileUpload } from "react-icons/md";
import { GoDash } from "react-icons/go";
import { Button, Input } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { physioConnectBusinessDetailsApi } from "../../api/physioConnect";
import { useSelector } from "react-redux";
import PhysioConnectRightCard from "../../components/PhysioConnectRightCard";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import StepIndicator from "../../components/StepIndicator";

const PhysioConnectBusinessDetails = () => {
	const physioConnectPhysioId = useSelector((state) => state?.physioConnectAuth?.physioId);
	const [physioImage, setPhysioImage] = useState();
	const [clinicImages, setClinicImages] = useState([]);
	const [patientImages, setPatientImages] = useState([]);
	const [degreeImages, setDegreeImages] = useState([]);
	const [achievement, setAchievement] = useState("");
	const [linkedinURL, setLinkedinURL] = useState("");
	const [loading, setLoading] = useState(false);
	const physioImageRef = useRef(null);
	const clinicImagesRef = useRef(null);
	const patientImagesRef = useRef(null);
	const degreeImagesRef = useRef(null);

	const navigate = useNavigate();

	// google analytics
	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Physio Connect Business Details" });
	}, []);

	// scroll to top
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	// const handlePhysioImageDrop = (e) => {
	// 	e.preventDefault();
	// 	const file = e.target.files?.[0];
	// 	if (file) {
	// 		setPhysioImage(file);
	// 	}
	// };

	const handlePhysioImageChange = (e) => {
		const file = e.target.files?.[0];
		if (file) {
			setPhysioImage(file);
		}
	};

	const handleClinicImagesChange = (e) => {
		const file = e.target.files;
		if (file) {
			setClinicImages((prev) => [...prev, ...file]);
		}
	};
	const handlePatientImagesChange = (e) => {
		const file = e.target.files;
		if (file) {
			setPatientImages((prev) => [...prev, ...file]);
		}
	};
	const handleDegreeImagesChange = (e) => {
		const file = e.target.files;
		if (file) {
			setDegreeImages((prev) => [...prev, ...file]);
		}
	};

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		try {
			if (!physioImage) {
				toast.error("Physio Image is required");
			} else if (!linkedinURL) {
				toast.error("Linked url is required");
			} else {
				const formData = new FormData();
				formData.append("physioId", physioConnectPhysioId);
				formData.append("profileImage", physioImage);
				formData.append("linkedinUrl", linkedinURL);
				formData.append("achievement", achievement);
				clinicImages.forEach((image) => {
					formData.append("imagesClinic", image);
				});
				patientImages.forEach((image) => {
					formData.append("patientImage", image);
				});
				degreeImages.forEach((image) => {
					formData.append("degreeImage", image);
				});

				setLoading(true);
				physioConnectBusinessDetailsApi(formData)
					.then((res) => {
						if (res.status >= 200 && res.status < 300) {
							toast.success(res.data?.message);
							setLoading(false);
							setTimeout(() => {
								navigate("/physio-connect/work-experience");
							}, 1000);
						} else if (res.status >= 400 && res.status < 500) {
							toast.success(res.data?.message);
						} else {
							toast.error("Something went wrong");
						}
					})
					.catch((err) => console.log(err));
			}
		} catch (error) {
			console.error("Error uploading images:", error);
		}
	};

	if (physioConnectPhysioId == null || physioConnectPhysioId.length == 0) {
		return <Navigate to="/physio-connect/signup" />;
	}

	return (
		<>
			<StepIndicator currentStep={2} />

			<div className="gap-4 border border-gray-200 rounded-lg bg-[#FFFDF5] px-8 py-8 justify-center flex flex-col md:flex-row mx-4 md:mx-8 lg:mx-16">
				{/* left side */}
				<form
					encType="multipart/form-data"
					onSubmit={handleFormSubmit}
					className="flex flex-col gap-4 flex-1 max-w-screen-lg"
				>
					<h6 className="font-semibold text-3xl">Business Details</h6>
					<div className="flex flex-col gap-2">
						<label
							htmlFor="physioImage"
							className="text-sm"
						>
							Physio Image
						</label>
						<div className="w-full mx-auto">
							<div
								className="border-2 border-dashed bg-white border-gray-300 rounded-lg p-8 text-center cursor-pointer"
								onClick={() => physioImageRef.current?.click()}
								// onDrop={handlePhysioImageDrop}
							>
								<input
									name="physioImage"
									type="file"
									ref={physioImageRef}
									onChange={handlePhysioImageChange}
									className="hidden"
									accept="*/*"
								/>
								<div className="mb-4">
									<div className="mx-auto bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
										<MdOutlineFileUpload className="w-8 h-8 text-green" />
									</div>
								</div>
								<h3 className="text-lg font-semibold mb-2">
									<span className="text-green">Click to Upload</span> or drag and drop
								</h3>
								<p className="text-sm text-gray-500">(Max. File size: 25 MB)</p>
								{physioImage && <p className="mt-4 text-sm text-gray-700">Selected file: {physioImage.name}</p>}
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<label
							htmlFor="clinicImages"
							className="text-sm"
						>
							Clinic Images
						</label>
						<div className="w-full mx-auto">
							<div
								className="border-2 border-dashed bg-white border-gray-300 rounded-lg p-8 text-center cursor-pointer"
								onClick={() => clinicImagesRef.current?.click()}
							>
								<input
									name="clinicImages"
									type="file"
									ref={clinicImagesRef}
									onChange={handleClinicImagesChange}
									className="hidden"
									accept="*/*"
								/>
								<div className="mb-4">
									<div className="mx-auto bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
										<MdOutlineFileUpload className="w-8 h-8 text-green" />
									</div>
								</div>
								<h3 className="text-lg font-semibold mb-2">
									<span className="text-green">Click to Upload</span> or drag and drop
								</h3>
								<p className="text-sm text-gray-500">(Max. File size: 25 MB)</p>
								{clinicImages && (
									<p className="mt-4 text-sm text-gray-700">
										Selected file: {clinicImages.map((e) => e.name).join(", ")}
									</p>
								)}
							</div>
						</div>
						<p className="txt-sm text-gray-500">Note : You need to upload at least 5 images.</p>
					</div>
					<div className="flex flex-col gap-2">
						<label
							htmlFor="patientImages"
							className="text-sm"
						>
							Patient Images
						</label>
						<div className="w-full mx-auto">
							<div
								className="border-2 border-dashed bg-white border-gray-300 rounded-lg p-8 text-center cursor-pointer"
								onClick={() => patientImagesRef.current?.click()}
							>
								<input
									name="patientImages"
									type="file"
									ref={patientImagesRef}
									onChange={handlePatientImagesChange}
									className="hidden"
									accept="*/*"
								/>
								<div className="mb-4">
									<div className="mx-auto bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
										<MdOutlineFileUpload className="w-8 h-8 text-green" />
									</div>
								</div>
								<h3 className="text-lg font-semibold mb-2">
									<span className="text-green">Click to Upload</span> or drag and drop
								</h3>
								<p className="text-sm text-gray-500">(Max. File size: 25 MB)</p>
								{patientImages && (
									<p className="mt-4 text-sm text-gray-700">
										Selected file: {patientImages.map((e) => e.name).join(", ")}
									</p>
								)}
							</div>
						</div>
						<p className="txt-sm text-gray-500">Note : You need to upload at least 5 images.</p>
					</div>
					<div className="flex flex-col gap-2">
						<label
							htmlFor="degreeImages"
							className="text-sm"
						>
							Degree Images
						</label>
						<div className="w-full mx-auto">
							<div
								className="border-2 border-dashed bg-white border-gray-300 rounded-lg p-8 text-center cursor-pointer"
								onClick={() => degreeImagesRef.current?.click()}
							>
								<input
									name="degreeImages"
									type="file"
									ref={degreeImagesRef}
									onChange={handleDegreeImagesChange}
									className="hidden"
									accept="*/*"
								/>
								<div className="mb-4">
									<div className="mx-auto bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
										<MdOutlineFileUpload className="w-8 h-8 text-green" />
									</div>
								</div>
								<h3 className="text-lg font-semibold mb-2">
									<span className="text-green">Click to Upload</span> or drag and drop
								</h3>
								<p className="text-sm text-gray-500">(Max. File size: 25 MB)</p>
								{degreeImages && (
									<p className="mt-4 text-sm text-gray-700">
										Selected file: {degreeImages.map((e) => e.name).join(", ")}
									</p>
								)}
							</div>
						</div>
						<p className="txt-sm text-gray-500">Note : You need to upload at least 5 images.</p>
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="achievement"
							className="text-sm"
						>
							Any Achievement
						</label>
						<Input
							size="md"
							name="achievement"
							value={achievement}
							onChange={(e) => setAchievement(e.target.value)}
							labelProps={{ className: "hidden" }}
							placeholder="Enter your achievement"
							className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label
							htmlFor="linkedinURL"
							className="text-sm"
						>
							Linkedin URL
						</label>
						<div className="w-full mx-auto">
							<div className="flex items-center border border-[#A9ABB2] focus:border-2 focus:border-black rounded-lg overflow-hidden shadow-sm">
								<div className="flex-shrink-0 bg-white p-2 border-r border-gray-300">
									<p className="w-fit h-5 text-gray-500">http://</p>
								</div>
								<input
									name="linkedinURL"
									type="text"
									value={linkedinURL}
									onChange={(e) => setLinkedinURL(e.target.value)}
									placeholder="Enter your linkedin url"
									className="flex-grow p-2 focus:outline-none"
								/>
							</div>
						</div>
					</div>

					<div className="w-full flex justify-center">
						<Button
							className="w-fit hover:shadow-none font-normal px-12 bg-green rounded-full"
							type="submit"
							disabled={loading}
						>
							{!loading ? (
								"Submit"
							) : (
								<img
									src="/loading.png"
									className="animate-spin w-4 h-4"
								/>
							)}
						</Button>
					</div>
				</form>
				{/* right side */}
				<PhysioConnectRightCard />
			</div>
		</>
	);
};
export default PhysioConnectBusinessDetails;
