import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

import ReactGA from "react-ga4";

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

import { useDispatch, useSelector } from "react-redux";
import StepIndicatorprofile from "../pages/StepIndicatorprofile";

import { Breadcrumbs } from "@material-tailwind/react";


import { Button } from "@material-tailwind/react";
import { usePhysio } from "../context/PhysioContext";
import { GoArrowLeft, } from "react-icons/go";

import Skeleton from 'react-loading-skeleton';
import { FaCircle, FaShoppingBag, FaStar } from 'react-icons/fa';
import { ImLocation } from 'react-icons/im';

import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';


import MediaGallery from '../components/MediaGallery';
import { setPhysioDetail } from '../slices/physioSlice';
import { physioConnectDegreeApi, physioConnectSpecializationsApi } from '../api/physioConnect';

const Reviewprofile = () => {
  const location = useLocation();
  const [editMode, setEditMode] = useState(location.state?.editMode || false);
  const [loading, setLoading] = useState(false);
  const { submitFinalData, updatePhysioData, physioData } = usePhysio();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const physioId = physioData?._id;
  const { userId } = useSelector((e) => e.auth.user || {});
  if (!userId) {
    navigate("login-physio");
  }
  // google analytics
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Profile-Physio" });
  }, []);



  const [allDegree, setAllDegree] = useState([]);
  const [allSpecialization, setAllSpecialization] = useState([]);

  const handleSubmit = async () => {
    const success = await submitFinalData(); // Await the result
    if (success) {
      navigate("/my-account-physio");
      setTimeout(() => {
        window.location.href = "/my-account-physio";
      }, 100);


      // Navigate only if submission was successful
    }
  };


  useEffect(() => {
    const fetchOldData = async () => {
      try {
        await physioConnectDegreeApi().then((res) => {
          if (res.status >= 200 && res.status < 300) {
            setAllDegree(res.data.data);
          } else if (res.status >= 400 && res.status < 500) {
            toast.error(res.data.message);
          } else {
            toast.error("Something went wrong");
          }
        });
      } catch (error) {
        console.error("Error fetching degree:", error);
      }
      await physioConnectSpecializationsApi().then((res) => {
        if (res.status >= 200 && res.status < 300) {
          setAllSpecialization(res.data.data);
        } else if (res.status >= 400 && res.status < 500) {
          toast.error(res.data.message);
        } else {
          toast.error("Something went wrong");
        }
      });
    };

    fetchOldData();
  }, []);


  useEffect(() => {
    if (physioId && physioData) {
      dispatch(setPhysioDetail({ physioId, physioData }));
    }
  }, [physioId, physioData, dispatch]);
  const [truncate, setTruncate] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };



  const handleImageError = (e) => {
    e.target.src = physioData.gender === 1 ? "/mockPhysioMale.png" : "/mockPhysioFemale.png";
    setImageLoaded(true);
  };

  const placeholderImages = ["../clinicImg1.jpg", "../clinicImg2.png", "../clinicImg3.webp"];

  const images = physioData?.serviceType?.includes("clinic")
    ? physioData?.clinic?.imagesClinic?.length > 0
      ? physioData.clinic.imagesClinic
      : placeholderImages
    : null;

  // scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const zipCode = physioData?.home?.zipCode;

  return (
    <>
      <div className="font-Urbanist   bg-[#FFFCF0] py-8 px-4 sm:px-12 lg:px-[120px] ">

        <div className="h-40 w-full  flex items-center">
          <Breadcrumbs
            separator=">"
            className=" text-black bg-transparent"
            placeholder=""

          >
            <Link to="/my-account-physio" className="text-black  font-semibold hover:text-green">My Account</Link>
            <Link to="/profile-physio">
              <span className="text-black hover:text-green font-bold">
                {physioData?.fullName?.replace(/\b\w/g, (char) => char.toUpperCase())}
              </span>
            </Link> {/* Active breadcrumb */}
          </Breadcrumbs>
        </div>
      </div>
      <div className=" flex flex-col md:flex md:flex-row min-h-screen bg-transparent py-8 mx-4 sm:mx-12 lg:mx-[120px]   -mt-24 gap-4">
        {/* Sidebar - Step Indicator */}
        <div className=" flex justify-center ">
          <StepIndicatorprofile currentStep={4} showProfilePic={false} />
        </div>


        <div className="">

          {/* top */}
          <div className="lg:col-span-2 grid sm:grid-cols-3 bg-white border rounded-lg p-8 shadow-md h-fit relative">
            {/* Distance Section - Top Right */}
            <div className="absolute top-4 right-4 hidden md:flex items-center gap-1 text-sm text-gray-600">
              <ImLocation className="w-4 h-4 text-green" />
              <span>
                {physioData.city
                  ? physioData.city.charAt(0).toUpperCase() + physioData.city.slice(1)
                  : "N/A"}
              </span>
              {zipCode && zipCode !== 0 && <span>- {zipCode}</span>}

            </div>


            {/* Image and Name Section */}
            <div className="flex gap-4 col-span-1 sm:col-span-2">
              {/* Image with Experience */}
              <div className="relative h-fit">
                <div className="w-28 h-28">
                  {!imageLoaded && <Skeleton className="w-28 h-28 rounded-lg" />}
                  <img
                    loading="lazy"
                    className={`rounded-lg justify-center bg-[#F1F9F4] w-28 h-28 object-cover cursor-pointer ${!imageLoaded ? "hidden" : "block"
                      }`}
                    src={physioData.profileImage ? physioData.profileImage : "/mockPhysioMale.png"}
                    alt={physioData.fullName}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    onClick={() => setIsModalOpen(true)}
                  />
                </div>

                {isModalOpen && (
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-[100vw] h-[100vh] object-contain"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <div className="relative">
                      <button
                        className="absolute top-4 right-4 text-white bg-green px-2.5 rounded-full text-2xl"
                        onClick={() => setIsModalOpen(false)}
                      >
                        &times;
                      </button>
                      <img
                        src={physioData.profileImage}
                        alt={physioData.fullName}
                        className="max-w-[100vw] max-h-[90vh] aspect-square"
                      />
                    </div>
                  </div>
                )}

                <div className="absolute -bottom-5 right-1/2 translate-x-1/2 py-1 px-4 border-white border text-nowrap bg-green rounded-2xl text-sm text-white w-fit flex items-center gap-1.5">
                  <FaShoppingBag className="w-3 h-3" />
                  {physioData.workExperience ? physioData.workExperience : 1}+ Years
                </div>
              </div>
              {/* Name and Speciality */}
              <div className="hidden sm:block">
                <div className="flex flex-col gap-1 text-gray-900 font-medium text-base sm:text-xl capitalize">
                  <div className="font-bold">
                    <p>{physioData?.fullName}</p>
                  </div>
                  {/* Speciality */}
                  <div className="flex flex-col gap-1 text-black">
                    <p className="text-base text-nowrap">Specialities </p>
                    <p className="flex flex-wrap flex-row gap-1.5 text-sm">
                      {physioData?.specialization?.length !== 0 ? (
                        physioData.specialization.slice(0, 2).map((id, i) => {
                          const specializationName = allSpecialization?.find(spec => spec._id === id)?.name;
                          return (
                            <span
                              className="text-xs sm:text-sm rounded-full py-2 px-4 bg-[#F1F9F4] text-center sm:text-left sm:text-nowrap w-fit"
                              key={i}
                            >
                              {specializationName || "Unknown"}
                            </span>
                          );
                        })
                      ) : (
                        <span className="rounded-full py-2 px-4 bg-[#F1F9F4] text-nowrap w-fit">
                          General Pain
                        </span>
                      )}
                    </p>

                  </div>
                  {/* Rating and Reviews */}
                  <div className="text-sm flex items-center gap-2.5 lg:flex-col lg:items-start">
                    <div className="py-1 px-4 border-white border text-nowrap bg-green rounded-2xl text-sm text-white w-fit flex items-center gap-1.5 mt-1">
                      <FaStar className="w-3 h-3" />
                      {physioData.rating ? physioData.rating : "Recently Added"}
                    </div>

                    {/* Clinic Info */}
                    <div className='hidden md:flex flex-row '>
                      {physioData?.serviceType?.includes("clinic") && physioData.clinic && (
                        <div className="flex items-start gap-2 mt-2">
                          <ImLocation className="w-4 h-4 mt-0.5 text-green" />
                          <div className="text-sm flex flex-wrap items-center gap-2">
                            <span className="font-medium">{physioData.clinic.name}</span>
                            {physioData.clinic.address && <span>{physioData.clinic.address}</span>}
                            {physioData.city && <span>{physioData.city}</span>}
                            {physioData.state && <span>{physioData.state}</span>}

                          </div>
                        </div>
                      )}

                      {/* Home Info */}
                      {physioData?.serviceType?.includes("home") && physioData.home && (
                        <div className="flex items-start gap-2 mt-2">
                          <FaCircle className="h-1.5 w-1.5 mt-2 text-gray-500" />
                          <div className="text-sm flex flex-wrap items-center gap-2">
                            <span className="font-medium">Home Visit</span>
                            {physioData.home.city && <span>{physioData.home.city}</span>}
                            {physioData.home.state && <span>{physioData.home.state}</span>}
                            {physioData.home.zipCode && physioData.home.zipCode !== 0 && (
                              <span>- {physioData.home.zipCode}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>




                  </div>
                </div>
              </div>
              <div className="block sm:hidden">
                <div className="flex flex-col gap-1 flex-1">
                  <div
                    className="font-bold text-lg cursor-pointer"
                    onClick={() => navigate(`/physios/${physioData?.slug}`)}
                  >
                    {physioData?.fullName}
                  </div>
                  <p className="text-sm text-gray-600">Specialities</p>
                  <div className="flex flex-wrap gap-1.5 p-0 mt-1">
                    {Array.isArray(physioData?.specialization) && physioData.specialization.length > 0 ? (
                      physioData.specialization.slice(0, 2).map((id, i) => {
                        const specializationName = allSpecialization?.find(spec => spec._id === id)?.name;
                        return (
                          <span className="rounded-full py-1 px-3 bg-[#E6F4EC] text-sm" key={i}>
                            {specializationName || "Unknown"}
                          </span>
                        );
                      })
                    ) : (
                      <span className="rounded-full py-1 px-3 bg-[#E6F4EC] text-xs">
                        General Pain
                      </span>
                    )}
                  </div>



                </div>
              </div>

            </div>


            {/* Degree Section Aligned to Start */}

            <div className="flex flex-wrap gap-2 justify-start mt-2 col-span-1 sm:col-span-3">
              <div className="flex items-start gap-2 md:hidden mt-1">
                <ImLocation className="w-4 h-4 mt-0.5 text-green" />
                <div className="text-sm">
                  {physioData?.serviceType?.includes("clinic") && physioData.clinic ? (
                    <div className="flex">
                      <span className="text-sm">{physioData.clinic.name}</span>
                      <FaCircle className="h-1.5 w-2 mt-2 ml-2 mr-2" />
                      {physioData.clinic.address}
                    </div>
                  ) : (
                    <div className="text-sm">
                      {physioData.city}
                      {physioData.home?.zipCode && physioData.home?.zipCode !== 0 && ` - ${physioData.home.zipCode}`}
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-green-50 text-green-700 text-sm px-1 py-1 rounded-full">
                <span className="text-sm sm:text-sm rounded-xl bg-[#F1F9F4] border border-gray-200 text-center py-1 px-2 text-nowrap w-fit sm:w-full">
                  IAP Registered : {physioData?.iapNumber ? "Yes" : "No"}
                </span>
              </div>
              <div className="bg-green-50 text-green-700 text-sm px-1 py-1 gap-2 rounded-full flex flex-wrap">
                {[physioData?.bptDegree?.degreeId, physioData?.mptDegree?.degreeId]
                  .filter(Boolean) // removes undefined/null entries
                  .map((id, i) => {
                    const degreeName = allDegree?.find((degree) => degree._id === id)?.name;
                    return (
                      <span
                        key={i}
                        className="text-xs sm:text-sm rounded-xl bg-[#F1F9F4] border border-gray-200 text-center py-1 px-2 gap-2 text-nowrap w-fit sm:w-full"
                      >
                        {degreeName || "Unknown Degree"}
                      </span>
                    );
                  })}

                {/* If neither BPT nor MPT is present, show fallback */}
                {!physioData?.bptDegree?.degreeId && !physioData?.mptDegree?.degreeId && (
                  <span className="rounded-full py-2 px-4 bg-[#E6F4EC] text-nowrap w-fit">
                    General Pain
                  </span>
                )}
              </div>


            </div>
          </div>


          {/* right side */}
          {/* <div className="row-span-2">
                <SlotComponent physioData={physioData} />
              </div> */}

          {/* bottom */}
          <div className="lg:col-span-2 bg-white border rounded-lg p-8 shadow-md">
            {/* Clinic Images */}

            <div>
              {physioData?.serviceType?.includes("clinic") && <p className="text-xl font-semibold mb-4">Clinic Photos</p>}
              <MediaGallery
                items={images}
                type="images"
              />
              <hr className="my-4" />
            </div>





            {/* about section */}
            <div className="mb-6 ">
              <p className="text-xl font-semibold mb-4">About Me</p>
              <p className={twMerge("line-clamp-4", truncate && "line-clamp-none")}>
                <p>{physioData?.about}</p>
                <p className="mt-2">
                  India's top-rated and most reliable physiotherapists can be found on PhysioplusHealthcare.com. The
                  platform connects you with physiotherapists who have over 43 years of experience. Explore profiles of
                  professionals, read patient testimonials, and make an informed choice when selecting the best
                  physiotherapist for your needs.
                </p>
              </p>
              {physioData?.about?.length > 100 ? (
                <button
                  onClick={() => setTruncate(!truncate)}
                  className="mt-2"
                >
                  {truncate ? (
                    <p className="flex gap-1 items-center text-blue-600 underline underline-offset-2">
                      Hide <IoIosArrowUp />
                    </p>
                  ) : (
                    <p className="flex gap-1 items-center text-blue-600 underline underline-offset-2">
                      Show More <IoIosArrowDown />
                    </p>
                  )}
                </button>
              ) : null}
              <hr className="my-4" />
            </div>



            {/* speciality section */}
            <div className="my-6 w-full md:block flex flex-col justify-center items-center">
              <p className="text-xl font-semibold mb-4 p-0">Speciality</p>
              <p className="pb-3">
                Our expert physiotherapists specialize in providing effective pain relief strategies for conditions such
                as back pain, neck pain, and joint discomfort. Through targeted exercises and hands-on techniques, we aim
                to alleviate pain and restore your quality of life
              </p>

              <div className="md:hidden w-full max-w-sm mt-1  overflow-hidden">

                {physioData?.subspecializationId?.length > 0 ? (
                  <div className="relative">
                    <Swiper
                      slidesPerView={"auto"}
                      spaceBetween={8}
                      freeMode={true}
                      grabCursor={true}
                      className="specialization-swiper "
                    >
                      {physioData?.subspecializationId?.map((subId, i) => {
                        // Find the name from nested subSpecializations
                        let subSpecName = "";

                        for (const specialization of allSpecialization) {
                          const match = specialization.subSpecializations.find((sub) => sub._id === subId);
                          if (match) {
                            subSpecName = match.name;
                            break;
                          }
                        }

                        return (
                          <SwiperSlide key={i} className="!w-auto">
                            <div className="border text-[#515662] border-[#EAEBEC] bg-[#F1F9F4] py-1.5 px-3 text-sm sm:text-sm rounded-full whitespace-nowrap">
                              {subSpecName || "Unknown"}
                            </div>
                          </SwiperSlide>
                        );
                      })}

                    </Swiper>
                    <div className="text-xs text-gray-400 text-center mt-1">
                      ← Swipe to see more →
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No specializations listed</div>
                )}
              </div>
              {/* Desktop Grid View (shows only on desktop) */}

              <div className="hidden sm:flex flex-wrap gap-2">
                {physioData?.subspecializationId?.length > 0 ? (
                  <>
                    {(showAll
                      ? physioData.subspecializationId
                      : physioData.subspecializationId.slice(0, 10)
                    ).map((subId, i) => {
                      // Find the name from nested subSpecializations
                      let subSpecName = "";
                      for (const specialization of allSpecialization) {
                        const match = specialization.subSpecializations.find(
                          (sub) => sub._id === subId
                        );
                        if (match) {
                          subSpecName = match.name;
                          break;
                        }
                      }

                      return (
                        <div
                          key={i}
                          className="border text-[#515662] border-[#EAEBEC] bg-[#F1F9F4] py-1.5 px-3 text-xs sm:text-sm rounded-md"
                        >
                          {subSpecName || "Unknown"}
                        </div>
                      );
                    })}

                    {physioData.subspecializationId.length > 10 && (
                      <button
                        onClick={() => setShowAll(!showAll)}
                        className="text-blue-600 text-xs sm:text-sm underline ml-2"
                      >
                        {showAll
                          ? "Show less"
                          : `+${physioData.subspecializationId.length - 10} more`}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-gray-500">No specializations listed</div>
                )}
              </div>

              <hr className="my-4" />
            </div>
            {/*Certificate & Award or Recoginazation  */}
            {/* Certificate Images */}
            {physioData?.achievement?.length > 0 && (
              <div className="my-6">
                <p className="text-xl font-semibold mb-4">Certificate & Awards or Recognition</p>
                <div className="flex gap-2 rounded-md my-2 overflow-x-hidden">
                  {physioData.achievement.map((achievement, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <img
                        src={achievement.achievementImage}
                        alt={achievement.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <p className="text-sm mt-2">{achievement.title}</p>
                    </div>
                  ))}
                </div>
                <hr className="my-4" />
              </div>
            )}
            <div className="w-full flex flex-col md:flex-row justify-between items-center mt-4 gap-4  ">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-black hover:text-green font-medium flex items-center gap-1 text-sm sm:text-base"
              >
                <GoArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Go Back
              </button>
              <Button
                className="w-full sm:w-fit hover:shadow-none font-semibold px-6 sm:px-8 bg-green rounded-full py-3 sm:py-3"
                type="button"
                onClick={() => {
                  if (editMode) {
                    handleSubmit();
                  } else {
                    navigate("/my-account-physio", { state: { editMode: false } }); // go to next page without saving
                  }
                }}
              >
                {editMode ? "Review & Submit" : "Exit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Reviewprofile
