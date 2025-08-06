import { useEffect, useState } from "react";
import { FaRegUser, FaStethoscope } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { googleLocationLatLong, specializationApi } from "../api/misc";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function PhysioFinder() {
  const [speciality, setSpeciality] = useState("");
  const [serviceType, setServiceType] = useState("home");
  const [location, setLocation] = useState("");
  const [allSpecialization, setAllSpecialization] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    specializationApi()
      .then((res) =>
        res.status == 200 ? setAllSpecialization(res.data) : null
      )
      .catch((err) => new Error(err));
  }, []);

  // getting current location & calling google api
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) =>
        googleLocationLatLong(
          position.coords.latitude,
          position.coords.longitude
        ).then((res) => {
          const locality = res?.data?.results[0].address_components.find(
            (item) => item.types.includes("locality")
          ).short_name;
          setLocation(locality);
        })
      );
    }
  }, []);

  return (
    <div className="mx-auto border border-[#EAEBEC] rounded-2xl p-3 bg-white">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Find Physio Now
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Location Input */}
        <div className="relative bg-[#E6F4EC87] rounded-lg px-4 py-2">
          <div className="flex items-center justify-left md:justify-start gap-3">
            <div
              className="flex justify-center items-center 
                              text-green p-1.5 bg-white rounded-full 
                              w-8 h-8 object-contain aspect-square"
            >
              <MdLocationOn />
            </div>
            <div className="flex flex-col overflow-hidden">
              <label className="text-sm text-black">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                className="bg-transparent border-none py-1.5 !ps-0 text-black focus:outline-none placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Speciality Dropdown */}
        {/* <div className="relative bg-[#E6F4EC87] rounded-lg px-4 py-2">
          <div className="flex items-center justify-left md:justify-start gap-3">
            <div
              className="flex justify-center items-center 
                        text-green p-1.5 bg-white rounded-full 
                        w-8 h-8 object-contain aspect-square"
            >
              <FaStethoscope />
            </div>
            <div className="flex flex-col relative w-full">
              <label className="text-sm text-black">Speciality</label>
              <div className="relative">
                <select
                  value={
                    speciality === " " ? "Select Specialisation" : speciality
                  }
                  onChange={(e) => setSpeciality(e.target.value)}
                  className="border-none bg-transparent focus:outline-none py-2 text-gray-700 w-full cursor-pointer appearance-none pr-8"
                >
                  <option value="Select Specialisation">
                    Select Specialisation
                  </option>
                  {allSpecialization.map((specialisation, index) => (
                    <option key={index} value={specialisation._id}>
                      {specialisation.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Service Type Dropdown */}
        <div className="relative bg-[#E6F4EC87] rounded-lg px-4 py-2">
          <div className="flex items-center justify-left md:justify-start gap-3">
            <div
              className="flex justify-center items-center 
                      text-green p-1.5 bg-white rounded-full 
                      w-8 h-8 object-contain aspect-square"
            >
              <FaRegUser />
            </div>
            <div className="flex flex-col relative w-full">
              <label className="text-sm text-black">Service Type</label>
              <div className="relative">
                <select
                  value={serviceType || ""}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="border-none bg-transparent focus:outline-none py-2 text-gray-700 w-full cursor-pointer appearance-none pr-8"
                >
                  <option value="home">Home Care</option>
                </select>
                {/* Dropdown Icon */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={() => {
            if (location === "" && serviceType === "") {
              toast.error("Please fill all the fields");
            } else {
              navigate("/homecare", {
                state: {
                  location,
                  serviceType,
                },
              });
            }
          }}
          className="bg-green text-white px-8 py-4 rounded-lg whitespace-nowrap transition-colors"
        >
          Search Physio
        </button>
      </div>
    </div>
  );
}
