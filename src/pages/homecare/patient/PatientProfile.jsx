import React, { useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import LocationPickerModal from "../../../components/homecare/LocationPickerModal";
import {
  getPatientDetails,
  editPatientDetails,
  getPresignedUrl,
  uploadFileToS3,
} from "../../../api/homecare";

import { setLogOut } from "../../../slices/homecare/newAuthSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const ProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().required("Phone is required"),
  gender: Yup.string().required("Gender is required"),
  dob: Yup.string()
    .matches(/^\d{4}$/, "Enter a valid 4-digit year")
    .required("Year of Birth is required"),
  address: Yup.string().required("Address is required"),
  pincode: Yup.string().required("Pincode is required"),
});

export default function PatientProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const patientId =
    JSON.parse(localStorage.getItem("homecareUser"))?.userId ?? null;

  const setFieldValueRef = useRef(null); // Formik helper reference

  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) return;

      try {
        const data = await getPatientDetails(patientId);
        if (!data) {
          toast.error("Patient not found");
          return;
        }

        setInitialValues({
          name: data.fullName || "",
          phone: data.phone || "",
          gender: data.gender || "Male",
          dob: data.dob || "",
          address: data.appointmentAddress || "",
          nearby: data.nearby || "",
          pincode: data.zipCode || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
        });

        setImagePreview(data.profilePhoto || "");
        setUploadedImageUrl(data.profilePhoto || "");
      } catch (err) {
        toast.error("Failed to fetch patient details");
      }
    };
    fetchData();
  }, [patientId]);

  const handleLocationSelect = ({ address, nearby, pincode, lat, lng }) => {
    if (setFieldValueRef.current) {
      setFieldValueRef.current("address", address || "");
      setFieldValueRef.current("nearby", nearby || "");
      setFieldValueRef.current("pincode", pincode || "");
      setFieldValueRef.current("latitude", lat || "");
      setFieldValueRef.current("longitude", lng || "");
    }
    setShowMapModal(false);
  };

  const handleImageChange = async (e) => {
    const file = e.currentTarget.files[0];
    if (!file) return;

    try {
      const folder = "PhysioApps/patients";
      const { uploadUrl, fileUrl } = await getPresignedUrl(file, folder);
      await uploadFileToS3(file, uploadUrl);

      setImagePreview(fileUrl);
      setUploadedImageUrl(fileUrl);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error("Image upload failed.");
    }
  };

  const handleSubmit = async (values) => {
    try {
      const updated = {
        ...values,
        image: uploadedImageUrl || imagePreview,
      };
      await editPatientDetails(patientId, updated);
      toast.success("Profile updated successfully!");
      setIsEditMode(false);
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  if (!initialValues)
    return <div className="text-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0cb46f] via-[#1aa376] to-[#0b7bb5] p-6 text-white">
      <h1 className="text-3xl flex justify-center my-4 mb-10 font-bold">
        My Profile
      </h1>
      <div className="flex items-center justify-end max-w-xl mx-auto mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className="bg-white text-green px-4 py-1 text-sm rounded-full shadow"
          >
            {isEditMode ? "Cancel Edit" : "Edit Profile"}
          </button>{" "}
          <button
            onClick={() => {
              localStorage.removeItem("homecareUser");
              localStorage.removeItem("homecareUserType");
              dispatch(setLogOut());
              navigate("/homecare");
            }}
            className="bg-red-50 text-red-700 px-4 py-1 text-sm rounded-full shadow"
          >
            LogOut
          </button>
        </div>
      </div>

      <div className="max-w-xl mx-auto bg-white text-black rounded-2xl p-6 shadow-md">
        <Formik
          initialValues={initialValues}
          validationSchema={ProfileSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, values, setFieldValue }) => {
            setFieldValueRef.current = setFieldValue;

            return (
              <Form className="space-y-6">
                {/* Profile Image */}
                <div className="text-center relative">
                  <img
                    src={imagePreview || "https://via.placeholder.com/100"}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover mx-auto border border-green"
                  />
                  {isEditMode && (
                    <>
                      <label
                        htmlFor="imageUpload"
                        className="absolute top-2 right-[35%] bg-green text-white p-1 rounded-full text-xs cursor-pointer"
                      >
                        ✎
                      </label>
                      <input
                        id="imageUpload"
                        name="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Full Name
                  </label>
                  <Field
                    name="name"
                    disabled={!isEditMode}
                    className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                      isEditMode
                        ? "focus:ring-2 focus:ring-green"
                        : "bg-gray-100 text-gray-500 cursor-not-allowed"
                    }`}
                  />
                  {errors.name && touched.name && (
                    <div className="text-red-600 text-sm">{errors.name}</div>
                  )}
                </div>

                {/* Phone (read-only) */}
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Phone
                  </label>
                  <Field
                    name="phone"
                    disabled
                    className="w-full bg-gray-100 border rounded-lg px-3 py-2 mt-1 text-gray-500 text-sm cursor-not-allowed"
                  />
                </div>

                {/* Gender + DOB */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Gender
                    </label>
                    <Field
                      as="select"
                      name="gender"
                      disabled={!isEditMode}
                      className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                        isEditMode
                          ? "focus:ring-2 focus:ring-green bg-white"
                          : "bg-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </Field>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Year of Birth
                    </label>
                    <Field
                      type="number"
                      name="dob"
                      placeholder="1999"
                      disabled={!isEditMode}
                      className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                        isEditMode
                          ? "focus:ring-2 focus:ring-green"
                          : "bg-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                    />
                    {errors.dob && touched.dob && (
                      <div className="text-red-600 text-sm">{errors.dob}</div>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Address
                  </label>
                  <Field
                    name="address"
                    disabled={!isEditMode}
                    className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                      isEditMode
                        ? "focus:ring-2 focus:ring-green"
                        : "bg-gray-100 text-gray-500 cursor-not-allowed"
                    }`}
                  />
                  {isEditMode && (
                    <div className="text-right mt-1">
                      <button
                        type="button"
                        onClick={() => setShowMapModal(true)}
                        className="text-xs text-green underline"
                      >
                        Use Current Location
                      </button>
                    </div>
                  )}
                </div>

                {/* Nearby + Pincode */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Nearby (Optional)
                    </label>
                    <Field
                      name="nearby"
                      disabled={!isEditMode}
                      className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                        isEditMode
                          ? "focus:ring-2 focus:ring-green"
                          : "bg-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600">
                      Pincode
                    </label>
                    <Field
                      name="pincode"
                      disabled={!isEditMode}
                      className={`w-full border rounded-lg px-3 py-2 mt-1 text-sm ${
                        isEditMode
                          ? "focus:ring-2 focus:ring-green"
                          : "bg-gray-100 text-gray-500 cursor-not-allowed"
                      }`}
                    />
                    {errors.pincode && touched.pincode && (
                      <div className="text-red-600 text-sm">
                        {errors.pincode}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hidden lat/lng */}
                <Field type="hidden" name="latitude" />
                <Field type="hidden" name="longitude" />

                {/* Save Button */}
                {isEditMode && (
                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-green text-white px-6 py-2 rounded-full hover:bg-green/90 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>

      {/* Map Modal */}
      <LocationPickerModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}
