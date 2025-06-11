import ReactGA from "react-ga4";
import { Link, useParams } from "react-router-dom";
import { useFetchSinglePhysioDataQuery, useGetPhysioReviewsQuery } from "../../api/physios";
import { setPhysioDetail } from "../../slices/physioSlice";
import { useDispatch } from "react-redux";

import { FaShoppingBag, FaStar, FaCircle } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
import { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Breadcrumbs } from "@material-tailwind/react";
import ReviewCardTwo from "../../components/ReviewCardTwo";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Loading from "../../components/Loading";
import { ImLocation } from "react-icons/im";
import Skeleton from "react-loading-skeleton";
import SlotComponent from "../../components/SlotComponent";
import MediaGallery from "../../components/MediaGallery";


const PhysioDetail = () => {
  const { slug } = useParams();
  const { data, error, isLoading } = useFetchSinglePhysioDataQuery(slug);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const physioData = data?.data;
  const physioId = data?.data?._id;
  // const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } = useGetPhysioReviewsQuery(physioId);
  // useEffect(() => {
  // 	dispatch(setPhysioDetail({ physioId, physioData }));
  //   }, [physioId, physioData, dispatch]);

  // dispatch(setPhysioDetail({ physioId, physioData }));
  // Get reviews data
  const { data: reviewsResponse, isLoading: reviewsLoading, error: reviewsError } = useGetPhysioReviewsQuery(physioId, {
    skip: !physioId // Skip if physioId is not available
  });

  // Extract reviews from the response
  const reviews = reviewsResponse?.data || [];

  // Log reviews to console
  // useEffect(() => {
  //   if (reviewsResponse) {
  //     if (reviews.length > 0) {
  //       console.log("Reviews:", reviews);
  //     } else {
  //       console.log("no reviews");
  //     }
  //   }
  // }, [reviewsResponse, reviews]);




  const [selectedRating, setSelectedRating] = useState("all");
  const [filteredReviews, setFilteredReviews] = useState(reviews);

  useEffect(() => {
    if (selectedRating.toString().toLowerCase() === "all") {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter(r => r.rating === Number(selectedRating)));
    }
  }, [selectedRating, reviews]);



  // Dispatch physio data only once when available
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

  // Placeholder images
  const placeholderImages = ["../clinicImg1.jpg", "../clinicImg2.png", "../clinicImg3.webp"];

  const images = physioData?.serviceType?.includes("clinic")
    ? physioData?.clinic?.imagesClinic?.length > 0
      ? physioData.clinic.imagesClinic
      : placeholderImages
    : null;

  // google analytics
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Physio Detail" });
  }, []);

  // scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return isLoading ? (
    <Loading />
  ) : error ? (
    "Error"
  ) : data.data == null ? (
    "No Data"
  ) : (
    <>
      <div className="h-40 w-full bg-[#FFFDF5] flex items-center">
        <Breadcrumbs
          separator=">"
          className="my-2 mx-2 md:mx-6 lg:mx-12 bg-transparent text-black"
        >
          <Link to="/">Home</Link>
          <Link to="/physios">Physio</Link>
          <Link className="font-semibold">{physioData.fullName}</Link>
        </Breadcrumbs>
      </div>
      <div className="gap-4 justify-center grid grid-cols-1 lg:grid-cols-3 mx-4 md:mx-8 lg:mx-16 -mt-12">
        {/* top */}
        <div className="lg:col-span-2 grid sm:grid-cols-3 bg-white border rounded-lg p-8 shadow-md h-fit relative">
          {/* Distance Section - Top Right */}
          <div className="absolute top-4 right-4 hidden md:flex items-center gap-1 text-sm text-gray-600">
            <ImLocation className="w-4 h-4 text-green" />
            <span>{physioData.city.charAt(0).toUpperCase() + physioData.city.slice(1)}</span>

            {physioData.home.zipCode !== 0 && physioData.home.zipCode !== null && (
              <span>- {physioData.home.zipCode}</span>
            )}

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
                    {physioData.specialization.length !== 0 ? (
                      physioData.specialization.slice(0, 2)?.map((p, i) => (
                        <p
                          className="text-xs sm:text-sm rounded-full py-2 px-4 bg-[#F1F9F4] text-center sm:text-left sm:text-nowrap w-fit"
                          key={i}
                        >
                          {p.name}
                        </p>
                      ))
                    ) : (
                      <p className="rounded-full py-2 px-4 bg-[#F1F9F4] text-nowrap w-fit">General Pain</p>
                    )}
                  </p>
                </div>
                {/* Rating and Reviews */}
                <div className="text-sm flex items-center gap-2.5 lg:flex-col lg:items-start">
                  <div className="py-1 px-4 border-white border text-nowrap bg-green rounded-2xl text-sm text-white w-fit flex items-center gap-1.5 mt-1">
                    <FaStar className="w-3 h-3" />
                    {physioData.rating ? physioData.rating : "Recently Added"}
                  </div>
                  {/* {physioData.city == null ? null : (
        <div className="flex items-start gap-1">
          <div>
            <ImLocation className="w-4 h-4 pt-0.5 text-green" />
          </div>
          <div className="text-sm">
            {physioData.city}{" "}
            {physioData.home.zipCode != 0 &&
              physioData.home.zipCode != null &&
              "- " + physioData?.home?.zipCode}
          </div>
		  <div className="flex flex-row gap-2">
												<FaCircle className="h-1.5 w-2 mt-2"/>
												  {physioData.clinic.address}
												</div>
        </div>
      )} */}
                  {physioData?.serviceType?.includes("clinic") ? (
                    physioData.clinic && (
                      <div className="flex items-start gap-1">
                        <ImLocation className="w-4 h-4 pt-0.5 text-green" />
                        <div className="text-sm flex flex-row">
                          <div className="font-medium">{physioData.clinic.name}</div><div className="flex flex-row gap-1"><FaCircle className="h-1.5 w-2 mt-2 ml-2 " /> {physioData.clinic.address}</div>
                        </div>
                      </div>
                    )
                  ) : physioData?.serviceType?.includes("home") ? (
                    physioData.city && (
                      <div className="flex items-start gap-1">
                        <ImLocation className="w-4 h-4 pt-0.5 text-green" />
                        <div className="text-sm">
                          <span>{physioData.city.charAt(0).toUpperCase() + physioData.city.slice(1)}</span>{" "}
                          {physioData.home?.zipCode && physioData.home.zipCode !== 0 && `- ${physioData.home.zipCode}`}
                        </div>
                      </div>
                    )
                  ) : null}

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
                  {physioData?.specialization?.length !== 0 ? (
                    physioData?.specialization?.slice(0, 2).map((p, i) => (
                      <span className="rounded-full py-1 px-3 bg-[#E6F4EC] text-sm" key={i}>
                        {p.name}
                      </span>
                    ))
                  ) : (
                    <span className="rounded-full py-1 px-3 bg-[#E6F4EC] text-xs">General Pain</span>
                  )}
                </div>
                {/* Clinic Info */}
                <div className="hidden md:block">
                  <div className="flex items-start gap-2">
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
                          {physioData.home?.zipCode && physioData.home.zipCode !== 0 && ` - ${physioData.home.zipCode}`}
                        </div>
                      )}
                    </div>
                  </div>
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
                    {physioData.home?.zipCode && physioData.home.zipCode !== 0 && ` - ${physioData.home.zipCode}`}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-green-50 text-green-700 text-sm px-1 py-1 rounded-full">
              <span className="text-sm sm:text-sm rounded-xl bg-[#F1F9F4] border border-gray-200 text-center py-1 px-2 text-nowrap w-fit sm:w-full">
                IAP Registered : {physioData?.iapNumber ? "Yes" : "No"}
              </span>
            </div>

            {/* degree */}

            {(physioData?.bptDegree?.degreeId?._id || physioData?.mptDegree?.degreeId?._id) && (
              <div className="bg-green-50 text-green-700 text-sm px-1 py-1 gap-2 rounded-full flex flex-wrap">
                {[
                  physioData?.bptDegree?.degreeId,
                  physioData?.mptDegree?.degreeId
                ]
                  .filter((deg) => deg && deg._id)
                  .map((deg, index) => (
                    <span
                      key={index}
                      className="text-xs sm:text-sm rounded-xl bg-[#F1F9F4] border border-gray-200 text-center py-1 px-2 m-1"
                    >
                      {deg.name}
                    </span>
                  ))}
              </div>
            )}



            {/* <div className="bg-green-50 text-green-700 text-sm px-1 py-1 gap-2 rounded-full">
              {physioData?.degree?.degreeId?.length !== 0 ? (
                physioData?.degree?.degreeId?.slice(0, 3)?.map((p, i) => (
                  <span
                    className="text-xs sm:text-sm rounded-xl bg-[#F1F9F4] border border-gray-200 text-center py-1 px-2 gap-2 text-nowrap w-fit sm:w-full "
                    key={i}
                  >
                    {p.name}
                  </span>
                ))
              ) : (
                <span className="rounded-full py-2 px-4 bg-[#E6F4EC] text-nowrap w-fit">General Pain</span>
              )}
            </div> */}
          </div>
        </div>


        {/* right side */}
        <div className="row-span-2">
          <SlotComponent physioData={physioData} />
        </div>

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
          <div className="my-6">
            <p className="text-xl font-semibold mb-4">Speciality</p>
            <p className="pb-3">
              Our expert physiotherapists specialize in providing effective pain relief strategies for conditions such
              as back pain, neck pain, and joint discomfort. Through targeted exercises and hands-on techniques, we aim
              to alleviate pain and restore your quality of life
            </p>
            <div className="sm:hidden w-full mt-1">
              {physioData?.subspecializationId?.length > 0 ? (
                <div className="relative">
                  <Swiper
                    slidesPerView={"auto"}
                    spaceBetween={8}
                    freeMode={true}
                    grabCursor={true}
                    className="specialization-swiper"
                  >
                    {physioData.subspecializationId.map((item, i) => (
                      <SwiperSlide key={i} className="!w-auto">
                        <div className="border text-[#515662] border-[#EAEBEC] bg-[#F1F9F4] py-1.5 px-3 text-sm sm:text-sm rounded-full whitespace-nowrap">
                          {item.name}
                        </div>
                      </SwiperSlide>
                    ))}
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
                  ).map((item, i) => (
                    <div
                      key={i}
                      className="border text-[#515662] border-[#EAEBEC] bg-[#F1F9F4] py-1.5 px-3 text-xs sm:text-sm rounded-md"
                    >
                      {item.name}
                    </div>
                  ))}

                  {physioData.subspecializationId.length > 10 && (
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="text-blue-600 text-xs sm:text-sm underline ml-2"
                    >
                      {showAll ? "Show less" : `+${physioData.subspecializationId.length - 10} more`}
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






          {/* Treatment Charges */}
          {/* <div className="my-6">
						<p className="text-xl font-semibold mb-4">Treatment Charges</p>
						<div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg mb-1.5">
							<span className="text-base">Treatment name</span>
							<span className="text-base font-medium">₹ 450</span>
						</div>
						<div className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg mb-1.5">
							<span className="text-base">Treatment name</span>
							<span className="text-base font-medium">₹ 450</span>
						</div>
					</div> */}
          {/* <hr className="my-4" /> */}
          {/* Treatment Charges Section */}
          {/* <div className="my-6">
  <p className="text-xl font-semibold mb-4">Treatment Charges</p>
  <div className="space-y-2">
    {[450, 450, 450, 450, 450, 450].map((charge, index) => (
      <div key={index} className="flex justify-between items-center px-3 py-2 border border-gray-300 rounded-lg">
        <span className="text-base">Treatment name</span>
        <span className="text-base font-medium">₹ {charge}</span>
      </div>
    ))}
  </div>
</div> */}
          {/* <hr className="my-4" /> */}


          {/* reviews */}
          <section className="my-8">
            <p className="text-xl font-semibold mb-4">Reviews & Ratings</p>

            <div className="flex gap-2 flex-wrap mb-4">
              {["all", 5, 4, 3, 2].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border-2
          ${selectedRating === rating
                      ? "bg-green text-white border-green"
                      : "bg-white text-green border-green"
                    }`}
                >
                  <FaStar className="text-yellow-400" />
                  {rating === "all" ? "All" : `${rating} Star`}
                </button>
              ))}
            </div>

            <Swiper
              spaceBetween={10}
              slidesPerView={1}
              breakpoints={{
                540: { slidesPerView: 1 },
                720: { slidesPerView: 2 },
                960: { slidesPerView: 2 },
                1140: { slidesPerView: 2 },
              }}
              className="max-w-auto"
            >
              {reviewsLoading ? (
                <SwiperSlide><div>Loading reviews...</div></SwiperSlide>
              ) : reviewsError ? (
                <SwiperSlide><div>Error loading reviews</div></SwiperSlide>
              ) : filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <SwiperSlide key={review._id}>
                    {/* <div className="p-4 border rounded shadow-sm">
            <p className="font-semibold mb-1">
              Patient {review.patientId.slice(-4)}
            </p>
            <p className="text-yellow-500 mb-2">{"★".repeat(review.rating)}</p>
            <p>{review.comment}</p>
            <p className="text-xs mt-2 text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</p> */}
                    {/* </div> */}

                    <ReviewCardTwo

                      id={review._id}
                      name={`Patient ${review.patientId?.fullName}` || "Anonymous"}
                      img={review.patientId?.profilePhoto || "/user.png"}
                      rating={review.rating}
                      review={review.comment}  // Using 'comment' from API
                      patientType="Patient"
                      date={review.createdAt}

                    />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <div>No reviews found for this rating.</div>
                </SwiperSlide>
              )}
            </Swiper>


          </section>


        </div>
      </div>
    </>
  );
};
export default PhysioDetail;
