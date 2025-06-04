
import ReactGA from "react-ga4";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import StepIndicatorprofile from "./StepIndicatorprofile";
import { Breadcrumbs } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Button, Input, Checkbox } from "@material-tailwind/react";
import { usePhysio } from "../context/PhysioContext";
import { GoArrowLeft } from "react-icons/go";
import { physioConnectDegreeApi, physioConnectSpecializationsApi } from '../api/physioConnect';
import SingleFileUpload from "../components/SingleFileUpload";

import { useLocation } from "react-router-dom";


const Professionalprofile = () => {
  const location = useLocation();
  const [editMode, setEditMode] = useState(location.state?.editMode || false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allDegree, setAllDegree] = useState([]);
  const [allSpecialization, setAllSpecialization] = useState([]);

  const [open, setOpen] = useState(false);
  const [mptDegreeOpen, setMptDegreeOpen] = useState(false);
  console.log(allDegree);

  const [degreeOpen, setDegreeOpen] = useState(false);
  const [openSub, setOpenSub] = useState(false);
  const dropdownSubRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownSpRef = useRef(null);
  const dropdownMptRef = useRef(null);

  const { updatePhysioData, physioData } = usePhysio();
  const { userId } = useSelector((e) => e.auth.user || {});
  if (!userId) {
    navigate("login-physio");
  }
  // google analytics
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Profile-Physio" });
  }, []);




  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDegreeOpen(false);
      }

      if (dropdownMptRef.current && !dropdownMptRef.current.contains(event.target)) {
        setMptDegreeOpen(false);
      }

      if (dropdownSpRef.current && !dropdownSpRef.current.contains(event.target)) {
        setOpen(false);
      }

      if (dropdownSubRef.current && !dropdownSubRef.current.contains(event.target)) {
        setOpenSub(false);
      }
    };

    if (open || degreeOpen || openSub || mptDegreeOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, degreeOpen, openSub, mptDegreeOpen]);


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


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      bptDegree: {
        degreeId: "",
        image: null,
      },
      mptDegree: {
        degreeId: "",
        image: null,
      },
      achievement: [
        {
          title: "",
          achievementImage: null,
        },
      ],
      specialization: [],
      subspecializationId: [],
      experience: "",
      serviceType: [],
      iapMember: 0,
      iapNumber: "",
      iapImage: null,
    },
    validationSchema: Yup.object().shape({
      iapMember: Yup.number().required("IAP member is required"),
      iapNumber: Yup.string().when('iapMember', {
        is: 1,
        then: () => Yup.string().required("IAP number is required"),
        otherwise: () => Yup.string().notRequired()
      }),
      iapImage: Yup.mixed().when("iapMember", {
        is: 1,
        then: (schema) => schema.required("IAP image is required"),
        otherwise: (schema) => schema.notRequired(),
      }),


      // Validation for image
      bptDegree: Yup.object({
        degreeId: Yup.string().required("BPT Degree is required"),
        image: Yup.string().nullable().required("BPT Degree image is required"),
      }),
      mptDegree: Yup.object({
        degreeId: Yup.string().nullable(),
        image: Yup.string().nullable(),
      }).test(
        "mpt-degree-pair-required",
        "Both MPT degree and image are required if one is provided",
        function (value) {
          const hasDegreeId = Boolean(value?.degreeId?.trim?.());
          const hasImage = Boolean(value?.image?.trim?.());

          if (!hasDegreeId && !hasImage) return true; // MPT not provided - valid
          if (hasDegreeId && hasImage) return true;   // Both provided - valid

          // One is missing - return error
          return this.createError({
            path: hasDegreeId ? "mptDegree.image" : "mptDegree.degreeId",
            message: hasDegreeId
              ? "MPT degree image is required"
              : "MPT degree selection is required",
          });
        }
      ),


      achievement: Yup.array().of(
        Yup.object().shape({
          title: Yup.string().required("Title is required"),
          achievementImage: Yup.string().required("Image is required"),
        })
      ),
      specialization: Yup.array().required("Specialization is required"),
      subspecializationId: Yup.array()
        .min(1, 'At least one sub-speciality must be selected')
        .required('This field is required'),
      serviceType: Yup.array().required("Service Type is required"),


      experience: Yup.number()
        .typeError("Experience must be a number")
        .required("Experience is required")
        .min(0, "Experience cannot be negative"),
    }),
    onSubmit: (values) => {
      console.log("Submitting values:", values);

      updatePhysioData({

        bptDegree: {
          degreeId: values.bptDegree.degreeId,  // ✅ extract string
          image: values.bptDegree.image         // ✅ extract image
        },
        mptDegree: {
          degreeId: values.mptDegree.degreeId,
          image: values.mptDegree.image
        },
        achievement: values.achievement,
        specialization: values.specialization,
        subspecializationId: values.subspecializationId,
        serviceType: values.serviceType,
        workExperience: Number(values.experience),

        iapMember: Number(values.iapMember),
        iapNumber: values.iapNumber,
        iapImage: values.iapImage,
      });

      navigate("/business", { state: { editMode } });
    },

  });

  useEffect(() => {
    if (physioData) {
      const specialization = Array.isArray(physioData.specialization)
        ? physioData.specialization
        : [];

      const subspecializationId = Array.isArray(physioData.subspecializationId)
        ? physioData.subspecializationId
        : [];

      const serviceType = Array.isArray(physioData.serviceType)
        ? physioData.serviceType
        : [];

      const experience =
        physioData.workExperience !== undefined
          ? String(physioData.workExperience)
          : "";


      const iapMember = Number(physioData.iapMember) || 0;
      const iapNumber = String(physioData.iapNumber || "");
      const iapImage = physioData.iapImage || null;

      // 🆕 Handle bptDegree and mptDegree separately
      const bptDegree = {
        degreeId: physioData.bptDegree?.degreeId || "",
        image: physioData.bptDegree?.image || null,
      };

      const mptDegree = {
        degreeId: physioData.mptDegree?.degreeId || "",
        image: physioData.mptDegree?.image || null,
      };

      const achievement =
        Array.isArray(physioData.achievement) && physioData.achievement.length
          ? physioData.achievement
          : [{ title: "", achievementImage: null }];

      formik.setValues({
        specialization,
        subspecializationId,
        serviceType,
        experience,

        iapMember,
        iapNumber,
        iapImage,
        bptDegree,
        mptDegree,
        achievement,
      });
    }
  }, [physioData]);





  useEffect(() => {


    const generalSpecialization = allSpecialization.find(
      (s) => s.name === "General Physio"
    );

    if (!generalSpecialization) {
      console.warn("General specialization not found!");
      return;
    }

    const generalId = generalSpecialization._id;
    console.log("General ID:", generalId);

    const hasDegree = formik.values.bptDegree.degreeId
      ? formik.values.bptDegree.degreeId.length > 0
      : false;

    const hasMaster = formik.values.mptDegree.degreeId
      ? formik.values.mptDegree.degreeId.length > 0
      : false;

    if (hasDegree) {
      // If no specialization is selected or general is missing, auto-select General
      const current = formik.values.specialization || [];
      if (!current.includes(generalId)) {
        formik.setFieldValue("specialization", [generalId]);
      }



    } else {
      // If no degree selected, clear specialization

      formik.setFieldValue("specialization", []);
    }
  }, [formik.values.bptDegree, formik.values.mptDegree, allSpecialization]);


  const filteredSubSpecializations = formik.values.specialization
    .flatMap((specId) => {
      const specialization = allSpecialization.find((s) => s._id === specId);
      return specialization?.subSpecializations || [];
    });

  // scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
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
      <div className="flex flex-col md:flex md:flex-row min-h-screen bg-transparent py-8 mx-4 sm:mx-12 lg:mx-[120px]   -mt-24 gap-4">
        {/* Sidebar - Step Indicator */}
        <div className=" flex justify-center ">
          <StepIndicatorprofile currentStep={2} showProfilePic={true} />
        </div>

        {/* Main Content */}
        {loading ? (
          <Loading />
        ) : (
          <div className="flex-1 p-8 bg-white rounded-2xl   border-2  border-gray-300">
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-4 flex-1 max-w-screen-lg"
            >
              <div className="flex flex-row gap-4 items-start">
                <div>
                  <h6 className="font-semibold text-3xl">Professional Details</h6>
                  <p className="text-sm font-semibold text-gray-700">Fill in your professional details below</p>
                </div>
                {/* Edit Button aligned to the right */}
                <div className="ml-auto">
                  <Button
                    onClick={() => setEditMode(!editMode)}
                    className={`!px-4 !py-2 rounded-md font-bold border-2 flex items-center gap-2 ${editMode
                      ? "border-gray-400 text-gray-400 bg-white cursor-not-allowed"
                      : "border-green text-green bg-white hover:bg-green/10 "
                      }`}
                    disabled={editMode}
                  >
                    {editMode ? "Editing..." : "Edit"}
                    <MdOutlineEdit className="text-green-600 opacity-80" size={18} />

                  </Button>
                </div>
              </div>
              <label htmlFor="" className="text-sm font-semibold">
                Select Degree
              </label>

              {/* Degree Section */}
              <div className="flex flex-col gap-2">
                {/* BPT Degree Selection */}
                <div className="relative" ref={dropdownRef}>
                  {/* Selected Degree Chip */}
                  {formik.values.bptDegree.degreeId && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(() => {
                        const selectedItem = allDegree.find(
                          (item) => item._id === formik.values.bptDegree.degreeId
                        );
                        return (
                          selectedItem && (
                            <div
                              key={selectedItem._id}
                              className="flex items-center gap-1 bg-[#F2FAF6] text-green px-2 py-1 rounded-full text-sm"
                            >
                              {selectedItem.name}
                              <button
                                type="button"
                                disabled={!editMode}
                                onClick={() =>
                                  formik.setFieldValue("bptDegree.degreeId", null)
                                }
                                className="text-gray-600 hover:text-gray-800"
                              >
                                ×
                              </button>
                            </div>
                          )
                        );
                      })()}
                    </div>
                  )}

                  {/* Dropdown Trigger */}
                  <button
                    disabled={!editMode}
                    type="button"
                    className="flex items-center justify-between border px-3 py-2 rounded-md w-full cursor-pointer"
                    onClick={() => setDegreeOpen(!degreeOpen)}
                  >
                    <span>Select BPT degree</span>
                    <img src="/aboutImg/dropdown.png" className="w-4 h-4" alt="" />
                  </button>

                  {/* Dropdown Options */}
                  {degreeOpen && (
                    <div className="absolute z-10 w-full bg-white shadow-md rounded-md p-2 mt-1 border max-h-60 overflow-y-auto">
                      <div className="flex flex-col gap-2">
                        {allDegree
                          .filter(
                            (i) =>
                              i.name === "Bachelor of Physiotherapy(BPT)" ||
                              i.name === "Diploma in Physiotherapy"
                          )
                          .map((i) => {
                            const isSelected = formik.values.bptDegree.degreeId === i._id;
                            return (
                              <label
                                htmlFor="bptdegree"
                                key={i._id}
                                className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded"
                                onClick={() =>
                                  formik.setFieldValue(
                                    "bptDegree.degreeId",
                                    isSelected ? null : i._id
                                  )
                                }
                              >
                                <input
                                  type="checkbox"
                                  name="bptdegree"
                                  className="w-4 h-4"
                                  value={i._id}
                                  disabled={!editMode}
                                  checked={isSelected}
                                  onChange={() => { }}
                                />
                                {i.name}
                              </label>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Validation Error */}
                {formik.touched.bptDegree?.degreeId && formik.errors.bptDegree?.degreeId && (
                  <p className="text-red-500">{formik.errors.bptDegree.degreeId}</p>
                )}
              </div>

              {/* Image Upload Section */}
              <div className="flex flex-col gap-2 mt-4">
                <label htmlFor="bptImage" className="text-sm font-semibold">
                  Upload Image
                </label>

                <SingleFileUpload
                  maxSize={2 * 1024 * 1024}
                  file={formik.values.bptDegree.image}
                  setFile={(f) => formik.setFieldValue("bptDegree.image", f)}
                  error={formik.errors.bptDegree?.image}
                  touched={formik.touched.bptDegree?.image}
                  disabled={!editMode}
                />
              </div>




              {/* mpt degree */}
              <div className="flex flex-col gap-2 mt-6">
                {/* MPT Degree Selection */}
                <div className="relative" ref={dropdownMptRef}>
                  {/* Selected Degree Chip */}
                  {formik.values.mptDegree.degreeId && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(() => {
                        const selectedItem = allDegree.find(
                          (item) => item._id === formik.values.mptDegree.degreeId
                        );
                        return (
                          selectedItem && (
                            <div
                              key={selectedItem._id}
                              className="flex items-center gap-1 bg-[#F2FAF6] text-green px-2 py-1 rounded-full text-sm"
                            >
                              {selectedItem.name}
                              <button
                                type="button"
                                disabled={!editMode}
                                onClick={() =>
                                  formik.setFieldValue("mptDegree.degreeId", null)
                                }
                                className="text-gray-600 hover:text-gray-800"
                              >
                                ×
                              </button>
                            </div>
                          )
                        );
                      })()}
                    </div>
                  )}

                  {/* Dropdown Trigger */}
                  <button
                    disabled={!editMode}
                    type="button"
                    className="flex items-center justify-between border px-3 py-2 rounded-md w-full cursor-pointer"
                    onClick={() => setMptDegreeOpen(!mptDegreeOpen)}
                  >
                    <span>Select MPT degree</span>
                    <img src="/aboutImg/dropdown.png" className="w-4 h-4" alt="" />
                  </button>

                  {/* Dropdown Options */}
                  {mptDegreeOpen && (
                    <div className="absolute z-10 w-full bg-white shadow-md rounded-md p-2 mt-1 border max-h-60 overflow-y-auto">
                      <div className="flex flex-col gap-2">
                        {allDegree
                          .filter(
                            (i) =>
                              i.name === "Master of Physiotherapy"
                          )

                          .map((i) => {
                            const isSelected = formik.values.mptDegree.degreeId === i._id;
                            return (
                              <label
                                htmlFor="mptdegree"
                                key={i._id}
                                className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded"
                                onClick={() =>
                                  formik.setFieldValue(
                                    "mptDegree.degreeId",
                                    isSelected ? null : i._id
                                  )
                                }
                              >
                                <input
                                  type="checkbox"
                                  name="mptdegree"
                                  className="w-4 h-4"
                                  value={i._id}
                                  disabled={!editMode}
                                  checked={isSelected}
                                  onChange={() => { }}
                                />
                                {i.name}
                              </label>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Validation Error */}
                {formik.touched.mptDegree?.degreeId && formik.errors.mptDegree?.degreeId && (
                  <p className="text-red-500">{formik.errors.mptDegree.degreeId}</p>
                )}
              </div>

              {/* Image Upload Section */}
              <div className="flex flex-col gap-2 mt-4">
                <label htmlFor="mptImage" className="text-sm font-semibold">
                  Upload Image
                </label>

                <SingleFileUpload
                  maxSize={2 * 1024 * 1024}
                  file={formik.values.mptDegree.image}
                  setFile={(f) => formik.setFieldValue("mptDegree.image", f)}
                  error={formik.errors.mptDegree?.image}
                  touched={formik.touched.mptDegree?.image}
                  disabled={!editMode}
                />
              </div>



              {/* Achievements Section */}
              <div className="flex flex-col gap-4 mt-4">
                <label className="text-sm font-semibold">Achievements</label>

                {formik.values.achievement?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 relative bg-transparent w-full"
                  >
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...formik.values.achievement];
                        updated.splice(index, 1);
                        formik.setFieldValue("achievement", updated);
                      }}
                      className="absolute top-2 -right-7 w-6 h-6 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-full text-md font-bold shadow"
                      disabled={!editMode}
                    >
                      ×
                    </button>

                    {/* Achievement Title */}
                    <Input
                      name={`achievement[${index}].title`}
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...formik.values.achievement];
                        updated[index].title = e.target.value;
                        formik.setFieldValue("achievement", updated);
                      }}
                      placeholder="Enter Achievement Title"
                      disabled={!editMode}
                      className="border-none placeholder:text-gray-300 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                    />

                    {/* Achievement Image Upload */}
                    <SingleFileUpload
                      file={item.achievementImage}
                      setFile={(file) => {
                        const updated = [...formik.values.achievement];
                        updated[index].achievementImage = file;
                        formik.setFieldValue("achievement", updated);
                      }}
                      maxSize={5 * 1024 * 1024}
                      disabled={!editMode}
                      error={
                        formik.errors.achievement &&
                        (formik.errors.achievement[index]?.achievementImage ||
                          formik.errors.achievement[index]?.title)
                      }
                      touched={
                        formik.touched.achievement &&
                        (formik.touched.achievement[index]?.achievementImage ||
                          formik.touched.achievement[index]?.title)
                      }
                    />
                  </div>
                ))}

                {/* Add Achievement Button */}
                <button
                  type="button"
                  onClick={() => {
                    const updated = [
                      ...formik.values.achievement,
                      { title: "", achievementImage: null },
                    ];
                    formik.setFieldValue("achievement", updated);
                  }}
                  disabled={!editMode}
                  className="text-blue-600 text-sm hover:underline"
                >
                  + Add Another Achievement
                </button>
              </div>





              <div className="flex flex-col gap-2">
                <label htmlFor="specialization" className="text-sm font-semibold">
                  Select Speciality
                </label>
                <div className="relative">
                  {/* Selected Items Display (Chips with Cross) */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formik.values.specialization.map((selectedId) => {
                      const selectedItem = allSpecialization.find(
                        (item) => item._id === selectedId
                      );
                      return (
                        selectedItem && (
                          <div
                            key={selectedId}
                            className="flex items-center gap-1  bg-[#F2FAF6] text-green px-2 py-1 rounded-full text-sm"
                          >
                            {selectedItem.name}
                            <button
                              type="button"
                              disabled={!editMode}
                              onClick={() => {
                                const updatedSpecializations =
                                  formik.values.specialization.filter(
                                    (id) => id !== selectedId
                                  );
                                formik.setFieldValue(
                                  "specialization",
                                  updatedSpecializations
                                );
                              }}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              ×
                            </button>
                          </div>
                        )
                      );
                    })}
                  </div>

                  {/* Dropdown Trigger Button */}
                  <button
                    disabled={!editMode}
                    type="button"
                    className="flex items-center justify-between border px-3 py-2 rounded-md w-full cursor-pointer"
                    onClick={() => setOpen(!open)}
                  >
                    <span>Select
                      Speciality</span>
                    <img
                      src="/aboutImg/dropdown.png"
                      className="w-4 h-4"
                      alt=""
                    />
                  </button>

                  {/* Dropdown Options */}
                  {open && (
                    <div ref={dropdownSpRef} className="absolute z-10 w-full bg-white shadow-md rounded-md p-2 mt-1 border max-h-60 overflow-y-auto">
                      <div className="flex flex-col gap-2">
                        {allSpecialization.map((i) => (
                          <label htmlFor="specialization"
                            key={i._id}
                            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded"
                            onClick={() => {
                              const generalId = allSpecialization.find((s) => s.name === "General Physio")?._id;
                              const isSelected = formik.values.specialization.includes(i._id);

                              if (!formik.values.mptDegree?.degreeId) return;



                              if (i._id === generalId) return; // Don't allow toggling General


                              const currentSpecializations = formik.values.specialization;


                              let newSpecializations;

                              if (isSelected) {
                                // Deselect the clicked one (but keep General)
                                newSpecializations = currentSpecializations.filter(
                                  (id) => id !== i._id
                                );
                              } else {
                                // Deselect any non-general specialization and add new one
                                newSpecializations = currentSpecializations
                                  .filter((id) => id === generalId)
                                  .concat(i._id);
                              }

                              formik.setFieldValue("specialization", newSpecializations);
                            }}

                          >
                            <input
                              disabled={!editMode}
                              type="checkbox"
                              name="specialization"
                              className="w-4 h-4"
                              value={i._id}
                              checked={formik.values.specialization.includes(
                                i._id
                              )}
                              onChange={() => { }}
                            />
                            {i.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {formik.touched.specialization &&
                  formik.errors.specialization && (
                    <p className="text-red-500">{formik.errors.specialization}</p>
                  )}
              </div>

              {/* Sub Specialization */}
              <div className="flex flex-col gap-2 mt-4">
                <label htmlFor="subspecializationId" className="text-sm font-semibold">
                  Select Sub-Speciality
                </label>

                {/* Selected Chips */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {formik.values.subspecializationId.map((selectedId) => {
                    const selected = filteredSubSpecializations.find((sub) => sub._id === selectedId);
                    return (
                      selected && (
                        <div
                          key={selectedId}
                          className="flex items-center gap-1 bg-[#F2FAF6] text-green px-2 py-1 rounded-full text-sm"
                        >
                          {selected.name}
                          <button
                            type="button"
                            disabled={!editMode}
                            onClick={() => {
                              const updated = formik.values.subspecializationId.filter((id) => id !== selectedId);
                              formik.setFieldValue("subspecializationId", updated);
                            }}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            ×
                          </button>
                        </div>
                      )
                    );
                  })}
                </div>

                {/* Dropdown Button */}
                <button
                  disabled={!editMode}
                  type="button"
                  className="flex items-center justify-between border px-3 py-2 rounded-md w-full cursor-pointer"
                  onClick={() => setOpenSub(!openSub)}
                >
                  <span>Select Sub-Speciality</span>
                  <img src="/aboutImg/dropdown.png" className="w-4 h-4" alt="dropdown" />
                </button>

                {/* Dropdown Options */}
                {openSub && (
                  <div
                    ref={dropdownSubRef}
                    className="absolute z-10 w-full bg-white shadow-md rounded-md p-2 mt-1 border max-h-60 overflow-y-auto"
                  >
                    <div className="flex flex-col gap-2">
                      {filteredSubSpecializations.length > 0 ? (
                        filteredSubSpecializations.map((sub) => {
                          const isChecked = formik.values.subspecializationId.includes(sub._id);
                          return (
                            <label
                              key={sub._id}
                              className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded"
                            >
                              <input
                                disabled={!editMode}
                                type="checkbox"
                                name="subspecializationId"
                                className="w-4 h-4"
                                checked={isChecked}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  let newSelections = [];

                                  if (checked) {
                                    newSelections = [...formik.values.subspecializationId, sub._id];
                                  } else {
                                    newSelections = formik.values.subspecializationId.filter((id) => id !== sub._id);
                                  }

                                  // Replace Formik value with this new array
                                  formik.setFieldValue("subspecializationId", newSelections);
                                }}
                              />
                              {sub.name}
                            </label>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-500">No sub-specializations available.</p>
                      )}
                    </div>
                  </div>
                )}

                {formik.touched.subspecializationId && formik.errors.subspecializationId && (
                  <p className="text-red-500">{formik.errors.subspecializationId}</p>
                )}
              </div>



              {/* work exp.  */}

              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="experience" className="text-sm font-semibold ">
                    Experience (in years)
                  </label>
                  <Input
                    disabled={!editMode}
                    size="md"
                    name="experience"
                    value={formik.values.experience}
                    onChange={formik.handleChange}
                    type="number"
                    labelProps={{ className: "hidden" }}
                    placeholder="Enter your experience"
                    className="border-none placeholder:text-gray-300 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                  />
                </div>
                {formik.touched.experience && formik.errors.experience ? (
                  <div className="text-red-500 mt-2">
                    {formik.errors.experience}
                  </div>
                ) : null}

              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="iapMember" className="text-sm font-semibold">
                  Are you registered with IAP?
                </label>

                <select
                  id="iapMember"
                  name="iapMember"
                  disabled={!editMode}
                  value={formik.values.iapMember === "" ? "" : formik.values.iapMember.toString()}
                  onChange={(e) => {
                    const value = Number(e.target.value); // convert to number (0 or 1)
                    formik.setFieldValue("iapMember", value);

                    if (value === 0) {
                      formik.setFieldValue("iapNumber", ""); // reset IAP number
                      formik.setFieldValue("iapImage", []); // reset images
                    }
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 w-full cursor-pointer focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white"
                >
                  <option value="" disabled hidden>
                    Select an option
                  </option>
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select>


                {formik.touched.iapMember && formik.errors.iapMember && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.iapMember}</div>
                )}
              </div>


              {formik.values.iapMember === 1 && (
                <>
                  {/* IAP Number Input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="iapNumber" className="text-sm font-semibold">
                      Enter your IAP Number
                    </label>
                    <Input
                      disabled={!editMode}
                      size="md"
                      name="iapNumber"
                      required={formik.values.iapMember === 1}
                      value={formik.values.iapNumber}
                      onChange={formik.handleChange}
                      labelProps={{ className: "hidden" }}
                      placeholder="Enter IAP Number"
                      className="border-none placeholder:text-gray-300 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                    />
                  </div>
                  {formik.touched.iapNumber && formik.errors.iapNumber ? (
                    <div className="text-red-500 mt-2">
                      {formik.errors.iapNumber}
                    </div>
                  ) : null}
                  {/* IAP Image Upload */}
                  <div className="flex flex-col gap-2 mt-4">
                    <label htmlFor="iapImage" className="text-sm font-semibold">
                      Upload your IAP Certificate (PDF or Image)
                    </label>
                    {/* For single file */}


                    <SingleFileUpload
                      maxSize={2 * 1024 * 1024}
                      file={formik.values.iapImage}
                      setFile={(f) => formik.setFieldValue("iapImage", f)}
                      error={formik.errors.iapImage}
                      touched={formik.touched.iapImage}
                      disabled={!editMode}
                    />


                  </div>
                </>
              )}


              <div className="flex flex-col gap-2">
                <label htmlFor="serviceType" className="text-sm font-semibold">
                  Select Service Type
                </label>
                <div className="flex gap-2 mt-2">
                  <label className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                    <Checkbox
                      className="rounded-sm h-4 w-4 border-green border-2  hover:before:opacity-0 checked:bg-green text-green"
                      checked={formik.values.serviceType.includes("clinic")}
                      name="serviceType"
                      disabled={!editMode}
                      value="clinic"
                      type="checkbox"
                      onChange={formik.handleChange}

                    />
                    Clinic
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-900 font-medium">

                    <Checkbox
                      className="rounded-sm h-4 w-4 border-green border-2  hover:before:opacity-0 checked:bg-green text-green"
                      checked={formik.values.serviceType.includes("home")}
                      type="checkbox"
                      name="serviceType"
                      disabled={!editMode}
                      value="home"
                      onChange={formik.handleChange}

                    />
                    Home Care
                  </label>

                </div>
                {formik.touched.serviceType && formik.errors.serviceType && (
                  <p className="text-red-500">{formik.errors.serviceType}</p>
                )}
              </div>
              {/* submit  btn */}
              <div className="w-full flex flex-col md:flex-row  justify-between items-center mt-4 gap-4">
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
                      formik.handleSubmit(); // manually submit the form
                    } else {
                      navigate("/business", { state: { editMode: false } }); // go to next page without saving
                    }
                  }}
                >
                  {editMode ? "Submit & Next" : "Next"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>


  );
};

export default Professionalprofile;
