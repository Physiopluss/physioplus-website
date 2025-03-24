import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPhysioDetail } from "../slices/physioSlice";
import { FaShoppingBag, FaStar,FaCircle } from "react-icons/fa";
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
							{/* location */}
							{physio?.serviceType?.includes("clinic") ? (
  physio.clinic && (
    <div className="flex items-start gap-1">
      <ImLocation className="w-4 h-4 pt-0.5 text-green" />
      <div className="text-sm flex flex-row">
        <div className="font-medium">{physio.clinic.name}</div><div className="flex flex-row gap-1"><FaCircle className="h-1.5 w-2 mt-2 ml-2 "/> {physio.clinic.address}</div>
      </div>
    </div>
  )
) : physio?.serviceType?.includes("home") ? (
  physio.city && (
    <div className="flex items-start gap-1">
      <ImLocation className="w-4 h-4 pt-0.5 text-green" />
      <div className="text-sm">
        {physio.city}{" "}
        {physio.home?.zipCode && physio.home.zipCode !== 0 && `- ${physio.home.zipCode}`}
      </div>
    </div>
  )
) : null}

							{/* rating and reviews */}
							<div className="text-sm flex items-center gap-2.5">
								{/* <div className=" text-nowrap gap-1.5 text-sm hidden md:flex">
									<p>Total Rating</p>
									<p>74</p>
								</div> */}
								<div className="py-1 px-1 border-white border text-nowrap text-black rounded-2xl text-sm  flex items-center gap-1.5">
									<FaStar className="w-3 h-3 text-green" />
									{physio.rating ? physio.rating : "Recently Added"}
								</div>
							</div>
							{/* <FaCircle className="h-1.5 w-2 mt-2"/> */}
						</div>
					</div>
				</div>
			</div>
			{/* price and button */}
			<div className="col-span-1 sm:col-span-2 md:col-span-1 flex flex-col justify-around text-nowrap gap-1 sm:gap-1.5 text-xs sm:text-sm min-w-10 pt-2 sm:pt-0 sm:ps-4">
			<div className="flex flex-row sm:flex-col items-center justify-between mr-8 sm:gap-2.5">
			  <p className="text-center font-semibold text-lg">Consultation Fees</p>
			  <div className="lg:hidden">
				{physio.city == null ? null : (
				  <div className="flex items-center  border-white border text-nowrap bg-[#E6F4EC] rounded-2xl text-sm text-green p-1">
					<div className="rounded-full bg-lightGreen w-5 h-5 flex items-center justify-center">
					  <ImLocation className="w-4 h-4 p-0.5 text-green" />
					</div>
					{/* <p>{location}</p> */}
					{/* {distance && <p>Distance to Clinic: {distance}</p>} */}
				  </div>
				)}
			  </div>
			</div>
	
			{physio.serviceType == "home" && (
			  <Button
				onClick={
				  userToken == null || userToken?.length == 0
					? () =>
						navigate(`/signup`) &&
						dispatch(setPhysioDetail({ id, physio }))
					: () => navigate(`/physios/${physio?.slug}`)
				}
				className="bg-[#E6F4EC] rounded-full font-normal hover:shadow-none border-green-500 text-light-green-900 hover:bg-green-50"
			  >
				Book Home Consultation at ₹ {physio.home.charges}
			  </Button>
			)}
	
			{physio.serviceType == "clinic" && (
			  <Button
				onClick={
				  userToken == null || userToken?.length == 0
					? () =>
						navigate(`/signup`) &&
						dispatch(setPhysioDetail({ id, physio }))
					: () => navigate(`/physios/${physio?.slug}`)
				}
				className="bg-green rounded-full font-normal hover:shadow-none border-green-500 text-white hover:bg-green-50"
			  >
				Book Clinic Consultation at ₹ {physio.clinic.charges}
			  </Button>
			)}
	
			<div className="flex flex-col gap-3 min-w-[220px]">
			  {physio.serviceType != "home" && physio.serviceType != "clinic" && (
				<>
				  <Button
					onClick={
					  userToken == null || userToken?.length == 0
						? () =>
							navigate(`/signup`) &&
							dispatch(setPhysioDetail({ id, physio }))
						: () => navigate(`/physios/${physio?.slug}`)
					}
					className="bg-[#E6F4EC] rounded-full font-normal hover:shadow-none border-green-500 text-light-green-900 hover:bg-green-50"
				  >
					Book Home Consultation at ₹ {physio.home.charges}
				  </Button>
	
				  <Button
					onClick={
					  userToken == null || userToken?.length == 0
						? () =>
							navigate(`/signup`) &&
							dispatch(setPhysioDetail({ id, physio }))
						: () => navigate(`/physios/${physio?.slug}`)
					}
					className="bg-green rounded-full font-normal hover:shadow-none border-green-500 text-white hover:bg-green-50"
				  >
					Book Clinic Consultation at ₹ {physio.clinic.charges}
				  </Button>
				</>
			  )}
			</div>
		  </div>
		</div>
	);
};

export default PhysioCard;
