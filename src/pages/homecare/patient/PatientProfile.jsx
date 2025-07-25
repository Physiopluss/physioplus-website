import React, { useState } from "react";
import LocationPickerModal from "../../../components/homecare/LocationPickerModal";

const PatientProfile = () => {
  const [showMapModal, setShowMapModal] = useState(false);

  const [patient, setPatient] = useState({
    name: "Rohit Sharma",
    email: "rohit.sharma@example.com",
    phone: "+91 9876543210",
    gender: "Male",
    dob: "1995-03-10",
    address: "C5, Shanti Nagar, Gurjar Ki Thadi, Mansarover, Jaipur",
    nearby: "Sodala Bus Stand",
    pincode: "302020",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  });

  const handleChange = (e) => {
    setPatient((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPatient((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleLocationSelect = ({ address, nearby, pincode }) => {
    setPatient((prev) => ({
      ...prev,
      address,
      nearby,
      pincode,
    }));
    setShowMapModal(false);
  };

  const handleSave = () => {
    console.log("Updated Profile:", patient);
    // Call your API to save patient profile here
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0cb46f] via-[#1aa376] to-[#0b7bb5] p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-8">My Profile</h1>

      <div className="max-w-xl mx-auto bg-white text-black rounded-2xl p-6 shadow-md space-y-6">
        {/* Profile Image */}
        <div className="text-center relative">
          <img
            src={patient.image}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mx-auto border border-green"
          />
          <label
            htmlFor="imageUpload"
            className="absolute top-2 right-[35%] bg-green text-white p-1 rounded-full text-xs cursor-pointer"
          >
            ✎
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          {/* ... Name, Email, Phone, Gender, DOB ... */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={patient.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">Email</label>
            <input
              type="email"
              value={patient.email}
              readOnly
              className="w-full bg-gray-100 border rounded-lg px-3 py-2 mt-1 text-gray-500 cursor-not-allowed text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={patient.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Gender
              </label>
              <select
                name="gender"
                value={patient.gender}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 bg-white focus:ring-2 focus:ring-green text-sm"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-600">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={patient.dob}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green text-sm"
            />
          </div>

          {/* Address Fields */}
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={patient.address}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green text-sm"
            />
            <div className="text-right mt-1">
              <button
                type="button"
                onClick={() => setShowMapModal(true)}
                className="text-xs text-green underline"
              >
                Use Current Location
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Nearby (Optional)
              </label>
              <input
                type="text"
                name="nearby"
                value={patient.nearby}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                value={patient.pincode}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green text-sm"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="text-center mt-4">
          <button
            onClick={handleSave}
            className="bg-green text-white px-6 py-2 rounded-full hover:bg-green/90 transition"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Map Modal */}
      <LocationPickerModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
};

export default PatientProfile;
