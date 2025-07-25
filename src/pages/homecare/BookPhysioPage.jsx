import React, { useState } from "react";
import {
  ActivitySquare,
  ArrowLeft,
  CheckCircle,
  Star,
  Users,
  X,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SlotDates from "../../components/homecare/SlotDates";
import { BsBagCheckFill, BsFillPinMapFill } from "react-icons/bs";
import LocationPickerModal from "../../components/homecare/LocationPickerModal";

export default function BookPhysioPage() {
  const { physioId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const physio = state?.physio;

  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    problem: "",
    address: "",
    nearby: "",
    pincode: "",
  });

  const fullToShortDay = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };

  const workingDaysAbbreviated =
    physio?.home?.workingDays?.map((day) => fullToShortDay[day]) || [];

  const handleLocationSelect = ({ address,nearby, pincode }) => {
    setFormData((prev) => ({
      ...prev,
      address,
      nearby,
      pincode,
    }));
  };

  return (
    <div className="relative md:max-w-4xl max-w-sm mx-auto px-4 py-4 min-h-screen bg-white">
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
            <p className="flex gap-2 text-sm">
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

            <div className="flex gap-2 text-sm">
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

      {/* Date Selector */}
      <div className="mt-6 w-full">
        <h4 className="font-semibold text-sm mb-2">Select Date</h4>
        <SlotDates
          workingDays={workingDaysAbbreviated}
          selected={selectedDate}
          onSelect={(date) => setSelectedDate(date)}
        />
      </div>

      {/* Booking Section */}
      <div className="my-8">
        {!showForm ? (
          <button
            className="w-full bg-green hover:bg-[#15692c] text-white py-3 rounded-xl text-sm font-medium"
            onClick={() => setShowForm(true)}
          >
            Book Physio Now
          </button>
        ) : (
          <div className="bg-white w-full rounded-xl px-4 py-6 border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-semibold">Add Patient Details</h3>
              <button onClick={() => setShowForm(false)}>
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Please provide details to continue.
            </p>

            <div className="space-y-3">
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Patient Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Enter Your Age"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              />
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-500"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <option>Gender (Select or Edit)</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Describe your problem"
                value={formData.problem}
                onChange={(e) =>
                  setFormData({ ...formData, problem: e.target.value })
                }
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setShowMapModal(true)}
                  className="text-xs text-green-700 underline"
                >
                  Use Current Location
                </button>
              </div>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
              <div className="flex gap-2">
                <input
                  className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Nearby (Optional)"
                  value={formData.nearby}
                  onChange={(e) =>
                    setFormData({ ...formData, nearby: e.target.value })
                  }
                />
                <input
                  className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={(e) =>
                    setFormData({ ...formData, pincode: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              className="mt-5 w-full bg-green hover:bg-[#15692c] text-white py-3 rounded-xl text-sm font-medium"
              onClick={() => {
                navigate("/book/summary", {
                  state: {
                    physio,
                    formData,
                    selectedDate,
                  },
                });
              }}
            >
              Continue to Pay
            </button>
          </div>
        )}
      </div>

      <LocationPickerModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}
