import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPhysioDetail } from "../slices/physioSlice";
import { FaShoppingBag, FaStar,FaCircle,FaCalendar } from "react-icons/fa";
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
		<div className="bg-white my-4 sm:my-6 p-4 rounded-lg border border-[#EAEBEC] shadow-md">
  {/* Mobile View */}
  <div className="md:hidden">
    <div className="flex flex-col gap-4">
      {/* Doctor Info */}
      <div className="flex gap-4">
        {/* Image with experience */}
        <div className="relative h-fit">
          <div className="w-24 h-24">
            {!imageLoaded && <Skeleton className="w-24 h-24 rounded-lg" />}
            <img
              className={`rounded-lg justify-center bg-[#F1F9F4] w-24 h-24 object-cover cursor-pointer ${
                !imageLoaded ? "hidden" : "block"
              }`}
              src={physio.profileImage}
              alt={physio.fullName}
              onClick={() => navigate(`/physios/${physio?.slug}`)}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
          <div className="absolute -bottom-3 right-1/2 translate-x-1/2 py-1 px-3 border-white border text-nowrap bg-green rounded-2xl text-xs text-white w-fit flex items-center gap-1">
            <FaShoppingBag className="w-2.5 h-2.5" />
            {physio.workExperience ? physio.workExperience : 1}+ Years
            {/* {physio.travelDistance && ` - Distance: ${physio.travelDistance}`} */}
          </div>
        </div>
       
        {/* Name and Speciality */}
        <div className="flex flex-col gap-1 flex-1">
          <div 
            className="font-bold text-lg cursor-pointer"
            onClick={() => navigate(`/physios/${physio?.slug}`)}
          >
            {physio?.fullName}
          </div>
          <p className="text-sm text-gray-600">Specialities</p>
          <div className="flex flex-wrap gap-1 p-0">
            {physio?.specialization?.length !== 0 ? (
              physio?.specialization?.slice(0, 2).map((p, i) => (
                <span className="rounded-full py-1 px-3 bg-[#E6F4EC] text-sm" key={i}>
                  {p.name}
                </span>
              ))
            ) : (
              <span className="rounded-full py-1 px-3 bg-[#E6F4EC] text-xs">General Pain</span>
            )}
          </div>
        </div>
		
      </div>

      {/* Clinic Info */}
      <div className="flex items-start gap-2">
        <ImLocation className="w-4 h-4 mt-0.5 text-green" />
        <div className="text-sm">
          {physio?.serviceType?.includes("clinic") && physio.clinic ? (
            <div className="flex">
              <span className="text-sm">{physio.clinic.name}</span>
			  <FaCircle className="h-1.5 w-2 mt-2 ml-2 mr-2"/>
              {physio.clinic.address}
            </div>
          ) : (
            <div className="text-sm">
               <span>{physio.city.charAt(0).toUpperCase() + physio.city.slice(1)}</span>
              {physio.home?.zipCode && physio.home.zipCode !== 0 && ` - ${physio.home.zipCode}`}
            </div>
          )}
        </div>
      </div>

      {/* Rating and Availability */}
      <div className="flex justify-between items-center">
		<div className="flex">
	  <div className="py-1 px-1 border-white border text-nowrap text-black rounded-2xl text-sm  flex items-center gap-1.5">
	  <FaStar className="w-3 h-3 text-green" />
	  {physio.rating ? physio.rating : "Recently Added"}
      </div>
	  {/* <FaCircle className="h-1.5 w-2 mt-3 ml-2 mr-2"/> */}
	  </div>
      </div>
	  <div className="md:hidden border-t border-gray-200 "></div>
    <div className="flex justify-between items-center mt-0 mb-0">
		{/* <div className="flex"> */}
	  <div className="py-1 px-1 border-white border text-nowrap text-black rounded-2xl text-sm  flex items-center gap-1.5">
	  <FaCalendar className="w-3 h-3 text-green" />
	Available Today
      </div>
      {/* physio.travelDistance && (
      <div className="absolute top-0 right-0 bg-[#E6F4EC] text-green-700 text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
        <ImLocation className="w-4 h-4 text-green" />
        {physio.travelDistance} Km far away
      </div>
    )} */}
    {physio.travelDistance && (
	  <div className="py-1 px-1 bg-[#E6F4EC] border-white border text-nowrap text-black rounded-2xl text-sm  flex items-center gap-1.5">
    <ImLocation className="w-4 h-4 text-green" />
    {physio.travelDistance && `  ${physio.travelDistance} far away`}
      </div>
    )}
      </div>
      {/* Consultation Buttons */}
 {/* Mobile View - Price and Button Section */}
<div className="md:hidden">
  <div className="flex flex-col gap-3 mt-2 mb-4 p-2">
    {/* Home Consultation - Only shown when serviceType is home or both */}
	{physio.serviceType == "home" && (
        <Button
          onClick={
            userToken == null || userToken?.length == 0
              ? () => navigate(`/signup`) && dispatch(setPhysioDetail({ id, physio }))
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
              ? () => navigate(`/signup`) && dispatch(setPhysioDetail({ id, physio }))
              : () => navigate(`/physios/${physio?.slug}`)
          }
          className="bg-green rounded-full font-normal hover:shadow-none border-green-500 text-white hover:bg-green-50"
        >
          Book Clinic Consultation at ₹ {physio.clinic.charges}
        </Button>
      )}
	{physio.serviceType != "home" && physio.serviceType != "clinic" && (
          <>
            <Button
              onClick={
                userToken == null || userToken?.length == 0
                  ? () => navigate(`/signup`) && dispatch(setPhysioDetail({ id, physio }))
                  : () => navigate(`/physios/${physio?.slug}`)
              }
              className="bg-[#E6F4EC] rounded-full font-normal hover:shadow-none border-green-500 text-light-green-900 hover:bg-green-50"
            >
              Book Home Consultation at ₹ {physio.home.charges}
            </Button>

            <Button
              onClick={
                userToken == null || userToken?.length == 0
                  ? () => navigate(`/signup`) && dispatch(setPhysioDetail({ id, physio }))
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
  </div>

  {/* Desktop View */}
  <div className="hidden md:grid gap-4 grid-cols-2 lg:grid-cols-3 divide-y-0 divide-x-2">
  <div className="flex col-span-2 flex-col relative">
    
    {/* Location Tag - Styled Like the Reference */}
    {physio.travelDistance && (
      <div className="absolute top-0 right-0 bg-[#E6F4EC] text-green text-sm font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
        <ImLocation className="w-4 h-4 text-green" />
        {physio.travelDistance} far away
      </div>
    )}
      {/* Your existing desktop content remains unchanged */}
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
                  <span>{physio.city.charAt(0).toUpperCase() + physio.city.slice(1)}</span>{" "}
                    {physio.home?.zipCode && physio.home.zipCode !== 0 && `- ${physio.home.zipCode}`}
                  </div>
                </div>
              )
            ) : null}

            {/* rating and reviews */}
            <div className="text-sm flex items-center gap-2.5">
              <div className="py-1 px-1 border-white border text-nowrap text-black rounded-2xl text-sm  flex items-center gap-1.5">
                <FaStar className="w-3 h-3 text-green" />
                {physio.rating ? physio.rating : "Recently Added"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* price and button - Desktop */}
    <div className="col-span-1 flex flex-col justify-around text-nowrap gap-1 sm:gap-1.5 text-xs sm:text-sm min-w-10 pt-2 sm:pt-0 sm:ps-4">
      <div className="flex flex-row sm:flex-col items-center justify-between mr-8 sm:gap-2.5">
        <p className="text-center font-semibold text-lg">Consultation Fees</p>
      </div>

      {physio.serviceType == "home" && (
        <Button
          onClick={
            userToken == null || userToken?.length == 0
              ? () => navigate(`/signup`) && dispatch(setPhysioDetail({ id, physio }))
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
              ? () => navigate(`/signup`) && dispatch(setPhysioDetail({ id, physio }))
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
                  ? () => navigate(`/signup`) && dispatch(setPhysioDetail({ id, physio }))
                  : () => navigate(`/physios/${physio?.slug}`)
              }
              className="bg-[#E6F4EC] rounded-full font-normal hover:shadow-none border-green-500 text-light-green-900 hover:bg-green-50"
            >
              Book Home Consultation at ₹ {physio.home.charges}
            </Button>

            <Button
              onClick={
                userToken == null || userToken?.length == 0
                  ? () => navigate(`/signup`) && dispatch(setPhysioDetail({ id, physio }))
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
</div>
		
	);
};

export default PhysioCard;
