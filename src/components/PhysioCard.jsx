import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPhysioDetail } from "../slices/physioSlice";
import { FaShoppingBag, FaStar } from "react-icons/fa";
import { Button } from "@material-tailwind/react";
import { ImLocation } from "react-icons/im";
import { IoMdTrendingUp } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useState } from "react";

const PhysioCard = ({ id, physio }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [imageLoaded, setImageLoaded] = useState(false);
	const userToken = useSelector((state) => state?.auth?.user?.userToken);

	const handleImageLoad = () => {
		setImageLoaded(true);
	};

	const handleImageError = (e) => {
		e.target.src = physio.gender === "male" ? "/mockPhysioMale.png" : "/mockPhysioFemale.png";
		setImageLoaded(true);
	};

	return (
		<div className="bg-white my-4 sm:my-6 p-4 rounded-lg grid gap-4 grid-cols-2 md:grid-cols-3 border border-[#EAEBEC] shadow-md divide-y-2 md:divide-y-0 md:divide-x-2">
			<div className="flex col-span-2">
				{/* image and name */}
				<div className="flex gap-4">
					{/* image with experience */}
					<div className="relative h-fit">
						<div className="w-28 h-28">
							{!imageLoaded && <Skeleton className="w-28 h-28 rounded-lg" />}
							<img
								className={`rounded-lg justify-center bg-[#F1F9F4] w-28 h-28 object-cover cursor-pointer ${
									!imageLoaded ? "hidden" : "block"
								}`}
								src={physio.profileImage}
								alt={physio.fullName}
								onClick={() => navigate(`/physios/${physio?.slug}`)}
								onLoad={handleImageLoad}
								onError={handleImageError}
							/>
						</div>

						{/* Work Experience Tag */}
						<div className="absolute -bottom-5 right-1/2 translate-x-1/2 py-1 px-4 border-white border text-nowrap bg-green rounded-2xl text-sm text-white w-fit flex items-center gap-1.5">
							<FaShoppingBag className="w-3 h-3" />
							{physio.workExperience ? physio.workExperience : 1}+ Years
						</div>
					</div>
					{/* name and speciality */}
					<div className="flex flex-col gap-1.5 text-gray-900 font-medium text-base sm:text-xl capitalize">
						<div
							className="font-bold cursor-pointer"
							onClick={() => navigate(`/physios/${physio?.slug}`)}
						>
							<p>{physio?.fullName}</p>
						</div>
						{/* speciality */}
						<div className="flex flex-col gap-1 text-black">
							<p className="text-base text-nowrap">Specialities </p>
							<p className="flex flex-wrap flex-row gap-1.5 text-sm">
								{physio?.specialization?.length !== 0 ? (
									physio?.specialization?.slice(0, 2).map((p, i) => (
										<span
											className="rounded-full py-1 px-4 bg-[#E6F4EC] text-nowrap w-fit"
											key={i}
										>
											{p.name}
										</span>
									))
								) : (
									<span className="rounded-full py-2 px-4 bg-[#E6F4EC] text-nowrap w-fit">General Pain</span>
								)}
							</p>
						</div>
						<div className="pt-1 md:pt-0 gap-1.5 flex justify-around items-center md:flex-col md:items-start">
							{/* rating and reviews */}
							<div className="text-sm flex items-center gap-2.5">
								{/* <div className=" text-nowrap gap-1.5 text-sm hidden md:flex">
									<p>Total Rating</p>
									<p>74</p>
								</div> */}
								<div className="py-1 px-4 border-white border text-nowrap bg-green rounded-2xl text-sm text-white w-fit flex items-center gap-1.5">
									<FaStar className="w-3 h-3" />
									{physio.rating ? physio.rating : "Recently Added"}
								</div>
							</div>
							{/* location */}
							{physio.city == null ? null : (
								<div className="flex items-start gap-1">
									<div className="rounded-full bg-lightGreen w-5 h-5 flex items-center justify-center">
										<ImLocation className="w-4 h-4 p-0.5 text-green" />
									</div>
									<div className="text-sm">
										{physio.city}{" "}
										{physio.home.zipCode != 0 && physio.home.zipCode != null && "- " + physio?.home?.zipCode}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* price and button */}
			<div className="col-span-2 md:col-span-1 flex flex-col justify-around text-nowrap gap-1 sm:gap-1.5 text-xs sm:text-sm min-w-10 pt-2 md:pt-0 md:ps-4">
				<div className="flex flex-row md:flex-col justify-center items-center gap-2 md:gap-2.5">
					<p className="text-center font-semibold text-lg">Consultaion Fees</p>
					{/* <p className="text-sm text-center text-gray-600">(Valid for first 3 consultant)</p> */}
				</div>
				<p className="flex justify-center items-center gap-1.5">
					<span className="text-base text-green font-semibold">
						₹ {physio.clinic.charges ? physio.clinic.charges : physio.home.charges}
					</span>
					{/* <span className="strikethrough-diagonal">
						₹ {physio.clinic.charges ? physio.clinic.charges : physio.home.charges}
					</span>
					<span className="text-green">75% OFF</span> */}
				</p>

				<Button
					onClick={
						userToken == null || userToken?.length == 0
							? () => navigate(`/signup`) && dispatch(setPhysioDetail({ id, physio }))
							: () => navigate(`/physios/${physio?.slug}`)
					}
					className="bg-green rounded-full font-normal hover:shadow-none"
				>
					Book Appointment
				</Button>
			</div>
		</div>
	);
};

export default PhysioCard;
