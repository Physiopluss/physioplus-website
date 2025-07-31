import React, { useState, useEffect } from "react";
import {
  ActivitySquare,
  ArrowLeft,
  CheckCircle,
  Star,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { getPhysioById } from "../../api/homecare";
import { BsBagCheckFill, BsFillPinMapFill } from "react-icons/bs";
import { useSelector } from "react-redux";

export default function PhysioProfile() {
  const navigate = useNavigate();
  const { physioId } = useParams();
  const [physio, setPhysio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFull, setShowFull] = useState(false);
  const isUser = useSelector((e) => e.authNew.user);
  useEffect(() => {
    const fetchPhysio = async () => {
      try {
        const data = await getPhysioById(physioId);
        setPhysio(data);
      } catch (err) {
        console.error("Error fetching physio:", err);
        navigate("/not-found");
      } finally {
        setLoading(false);
      }
    };
    fetchPhysio();
  }, [physioId]);

  if (loading) return <div className="text-center mt-4">Loading...</div>;
  if (!physio) return <div className="text-center mt-4">Physio not found</div>;

  const MAX_LENGTH = 150;
  const isLong = physio?.about?.length > MAX_LENGTH;
  const displayedText = showFull
    ? physio?.about
    : physio?.about?.slice(0, MAX_LENGTH) + (isLong ? "..." : "");

  return (
    <div className=" mx-auto md:max-w-4xl max-w-sm  px-4 py-4 ">
      {/* Top Bar */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-green-700" />
        </button>
        <h2 className="ml-auto mr-auto text-sm font-medium text-green">
          View Profile
        </h2>
      </div>

      {/* Profile Card */}
      <div className="bg-[#f1fff4] p-4 rounded-xl shadow-sm">
        <div className="flex gap-4 items-start">
          <img
            src={physio?.profileImage}
            alt={physio.fullName}
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div className="flex-1">
            <h3 className="text-md font-semibold text-green">
              {physio?.fullName}
            </h3>
            <p className="flex gap-2  text-sm">
              <ActivitySquare className="w-4 h-4 flex-shrink-0 mt-1" />
              <span className="break-words flex flex-wrap">
                {[
                  physio?.bptDegree?.degreeId?.name,
                  physio?.mptDegree?.degreeId?.name,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </p>

            <div className="flex gap-2   text-sm">
              <Users className="w-4 h-4" /> {physio?.patientCount} Patient
              Treated
            </div>
            <p className="flex gap-2 text-sm">
              <Star className="w-4 h-4" />
              {physio?.rating} Rating
            </p>
          </div>
        </div>

        {/* Specialties */}
        <div className="flex gap-2 mt-2 flex-wrap">
          {physio?.specialization?.map((item, i) => (
            <span
              key={i}
              className="bg-white text-green font-semibold px-3 py-1 rounded text-xs border border-green"
            >
              {item?.name}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center mt-4">
          <div className="bg-white rounded-lg border p-2">
            <CheckCircle className="inline-block mb-1 text-green" />
            <p className="text-sm font-medium text-green">Speak</p>
            <p className="text-xs">Hindi, English</p>
          </div>
          <div className="bg-white rounded-lg border p-2">
            <BsBagCheckFill className="inline-block mb-1 text-green" />
            <p className="text-sm font-medium text-green">
              {physio?.workExperience}+ Years
            </p>

            <p className="text-xs">Experience</p>
          </div>
          <div className="bg-white rounded-lg border p-2">
            <BsFillPinMapFill className="inline-block mb-1 text-green" />
            <p className="text-sm font-medium text-green">{physio?.city}</p>
            <p className="text-xs">{physio?.zipCode}</p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mt-6">
        <h4 className="font-semibold text-sm mb-1">About Physio</h4>
        <p className="text-sm text-gray-700">{displayedText}</p>
        {isLong && (
          <button
            onClick={() => setShowFull(!showFull)}
            className="text-green-700 text-sm font-medium mt-1"
          >
            {showFull ? "See less" : "See more"}
          </button>
        )}
      </div>

      {/* Sub-Specialty Swiper */}
      <div className="mt-6 w-full ">
        <h4 className="font-semibold text-sm mb-2">Sub-Specialty</h4>

        <Swiper
          spaceBetween={8}
          slidesPerView="auto"
          className="!overflow-hidden block md:hidden"
        >
          {physio?.subspecializationId?.map((tag, idx) => (
            <SwiperSlide key={idx} style={{ width: "auto" }}>
              <span className="block bg-[#ebf7ee] text-green border border-[#a5ffb6] px-4 py-2 text-xs rounded-full text-center whitespace-nowrap">
                {tag?.name}
              </span>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className=" flex-wrap gap-2 hidden md:flex mt-2">
          {physio?.subspecializationId?.map((tag, idx) => (
            <span
              key={idx}
              className="bg-[#ebf7ee] text-green border border-[#a5ffb6] px-4 py-1 text-xs rounded-full"
            >
              {tag?.name}
            </span>
          ))}
        </div>
      </div>

      {/* Recovered Patients Swiper */}
      <div className="mt-6 w-full">
        <h4 className="font-semibold text-sm mb-2">Recovered Patients</h4>
        <div className="w-full overflow-x-hidden">
          <Swiper
            spaceBetween={12}
            slidesPerView="auto"
            pagination={{ clickable: true }}
            modules={[Pagination]}
            className="!pl-2 !overflow-hidden"
            breakpoints={{
              0: { slidesPerView: "auto", spaceBetween: 12 },
              480: { slidesPerView: 1 },
              640: { slidesPerView: 1.5 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {physio?.treatedPatient?.map((patient, idx) => (
              <SwiperSlide
                key={idx}
                className="!w-full md:!w-[300px] lg:!w-[320px]"
              >
                <div className="rounded-lg overflow-hidden shadow-sm bg-white">
                  <img
                    src={patient?.patientImage}
                    alt={patient?.patientName}
                    className="w-full h-40 object-cover"
                  />
                  <p className="text-center py-2 text-sm font-medium text-green">
                    {patient?.patientName}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-8">
        <button
          className="w-full bg-green hover:bg-[#15692c] text-white py-3 rounded-xl text-sm font-medium"
          onClick={() => {
            if (isUser) {
              navigate(`/homecare/book/${physio?._id}`, { state: { physio } });
            } else {
              navigate(`/homecare/login-new`);
            }
          }}
        >
          Book Physio Now
        </button>
      </div>
    </div>
  );
}
