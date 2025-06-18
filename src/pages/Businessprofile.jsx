
import React, { useRef } from 'react'
import ReactGA from "react-ga4";
import { CiCirclePlus } from "react-icons/ci";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import StepIndicatorprofile from "./StepIndicatorprofile";
import { locationUsingPincode, } from "../api/physioConnect";
import { Breadcrumbs, Checkbox } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Button, Input } from "@material-tailwind/react";
import { usePhysio } from "../context/PhysioContext";
import { GoArrowLeft, } from "react-icons/go";
import MultiFileUpload from '../components/MultiFileUpload';


const Businessprofile = () => {
  const [openMode, setOpenMode] = useState(false);
  const dropdownModeRef = useRef(null);

  const location = useLocation();
  const [editMode, setEditMode] = useState(location.state?.editMode || false);
  const [loading, setLoading] = useState(false);
  const { updatePhysioData, physioData } = usePhysio();

  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownModeRef.current && !dropdownModeRef.current.contains(event.target)) {
        setOpenMode(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { userId } = useSelector((e) => e.auth.user || {});
  if (!userId) {
    navigate("login-physio");
  }

  // google analytics
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Profile-Physio" });
  }, []);



  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const generateTimeOptions = () => {
    const times = [];
    const hours = 12;
    const minutes = ["00", "15", "30", "45"];
    const meridiem = ["AM", "PM"];

    meridiem.forEach((m) => {
      for (let h = 1; h <= hours; h++) {
        minutes.forEach((min) => {
          const hour = h.toString().padStart(2, "0");
          times.push(`${hour}:${min} ${m}`);
        });
      }
    });

    return times;
  };


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {

      clinicName: "",
      clinicAddress: "",
      clinicPincode: "",
      clinicCity: "",
      clinicState: "",
      clinicImage: [],
      clinicCharges: "",
      clinicDuration: "",
      clinicWorkingDays: [],
      timings: {
        start: "",
        end: ""
      },
      mode: [],
      morningTimings: {
        start: "",
        end: ""
      },
      eveningTimings: {
        start: "",
        end: ""
      },
      homePincode: "",
      homeCity: "",
      homeState: "",
      homeCharges: "",
      homeDuration: "",
      homeWorkingDays: [],
      // patientImage: [],
      // homecareImage: [],
      serviceType: [],
    },
    validationSchema: Yup.object().shape({
      serviceType: Yup.array().min(1, "Select at least one service type"),

      // Clinic Fields
      clinicName: Yup.string().when("serviceType", {
        is: (val) => val && val.includes("clinic"),
        then: (schema) => schema.required("Clinic Name is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      clinicAddress: Yup.string().when("serviceType", {
        is: (val) => val && val.includes("clinic"),
        then: (schema) => schema.required("Clinic Address is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      clinicPincode: Yup.number()
        .typeError("Clinic Pincode must be a number")
        .when("serviceType", {
          is: (val) => val && val.includes("clinic"),
          then: (schema) => schema.required("Clinic Pincode is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      clinicCity: Yup.string().when("serviceType", {
        is: (val) => val && val.includes("clinic"),
        then: (schema) => schema.required("Clinic City is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      clinicState: Yup.string().when("serviceType", {
        is: (val) => val && val.includes("clinic"),
        then: (schema) => schema.required("Clinic State is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      clinicImage: Yup.array()
        .of(Yup.string().nullable())
        .when("serviceType", {
          is: (val) => val && val.includes("clinic"),
          then: (schema) => schema.min(1, "Clinic image is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      clinicCharges: Yup.number()
        .typeError("Clinic Charges must be a number")
        .when("serviceType", {
          is: (val) => val && val.includes("clinic"),
          then: (schema) => schema.required("Clinic Charges is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      clinicDuration: Yup.number()
        .typeError("Clinic Duration must be a number")
        .when("serviceType", {
          is: (val) => val && val.includes("clinic"),
          then: (schema) => schema.required("Clinic Duration is required"),
          otherwise: (schema) => schema.notRequired(),
        }),

      timings: Yup.object({
        start: Yup.string().when('serviceType', {
          is: (val) => val?.includes('clinic'),
          then: (schema) => schema.required('Start time is required'),
          otherwise: (schema) => schema.notRequired(),
        }),
        end: Yup.string().when(['serviceType', 'timings.start'], {
          is: (serviceType, start) =>
            serviceType?.includes('clinic') && !!start,
          then: (schema) =>
            schema
              .required('End time is required')
              .test('is-after-start', 'End time must be after start time', function (end) {
                const { start } = this.parent;
                return !start || !end || end > start;
              }),
          otherwise: (schema) => schema.notRequired(),
        }),
      }),

      clinicWorkingDays: Yup.array()
        .of(
          Yup.string().oneOf(
            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            'Invalid day'
          )
        )
        .when('serviceType', {
          is: (val) => val?.includes('clinic'),
          then: (schema) =>
            schema.min(1, 'Select at least one clinic working day').required('Clinic working days are required'),
          otherwise: (schema) => schema.notRequired(),
        }),

      homeWorkingDays: Yup.array()
        .of(
          Yup.string().oneOf(
            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            'Invalid day'
          )
        )
        .when('serviceType', {
          is: (val) => val?.includes('home'),
          then: (schema) =>
            schema.min(1, 'Select at least one home working day').required('Home working days are required'),
          otherwise: (schema) => schema.notRequired(),
        }),

      mode: Yup.array()
        .of(Yup.string().oneOf(['Morning', 'Evening']))
        .when('serviceType', {
          is: (val) => val?.includes('home'),
          then: (schema) => schema.min(1, 'Please select at least one mode').required(),
          otherwise: (schema) => schema.notRequired(),
        }),

      morningTimings: Yup.object({
        start: Yup.string().when(['serviceType', 'mode'], {
          is: (serviceType, mode) =>
            serviceType?.includes('home') && mode?.includes('Morning'),
          then: (schema) => schema.required('Morning start time is required'),
          otherwise: (schema) => schema.notRequired(),
        }),
        end: Yup.string().when(['serviceType', 'mode', 'morningTimings.start'], {
          is: (serviceType, mode, start) =>
            serviceType?.includes('home') && mode?.includes('Morning') && !!start,
          then: (schema) =>
            schema
              .required('Morning end time is required')
              .test('morning-after-start', 'Morning end time must be after start time', function (end) {
                const { start } = this.parent;
                return !start || !end || end > start;
              }),
          otherwise: (schema) => schema.notRequired(),
        }),
      }),

      eveningTimings: Yup.object({
        start: Yup.string().when(['serviceType', 'mode'], {
          is: (serviceType, mode) =>
            serviceType?.includes('home') && mode?.includes('Evening'),
          then: (schema) => schema.required('Evening start time is required'),
          otherwise: (schema) => schema.notRequired(),
        }),
        end: Yup.string().when(['serviceType', 'mode', 'eveningTimings.start'], {
          is: (serviceType, mode, start) =>
            serviceType?.includes('home') && mode?.includes('Evening') && !!start,
          then: (schema) =>
            schema
              .required('Evening end time is required')
              .test('evening-after-start', 'Evening end time must be after start time', function (end) {
                const { start } = this.parent;
                return !start || !end || end > start;
              }),
          otherwise: (schema) => schema.notRequired(),
        }),
      }),

      // Home Fields
      homeCharges: Yup.number()
        .typeError("Home Charges must be a number")
        .when("serviceType", {
          is: (val) => val && val.includes("home"),
          then: (schema) => schema.required("Home Charges is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      homePincode: Yup.number()
        .typeError("Home Pincode must be a number")
        .when("serviceType", {
          is: (val) => val && val.includes("home"),
          then: (schema) => schema.required("Home Pincode is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      homeCity: Yup.string().when("serviceType", {
        is: (val) => val && val.includes("home"),
        then: (schema) => schema.required("Home City is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      homeState: Yup.string().when("serviceType", {
        is: (val) => val && val.includes("home"),
        then: (schema) => schema.required("Home State is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
      homeDuration: Yup.number()
        .typeError("Home Duration must be a number")
        .when("serviceType", {
          is: (val) => val && val.includes("home"),
          then: (schema) => schema.required("Home Duration is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      // patientImage: Yup.array()
      //   .of(Yup.string().nullable())
      //   .when("serviceType", {
      //     is: (val) => val && val.includes("home"),
      //     then: (schema) => schema.min(1, "patient image is required"),
      //     otherwise: (schema) => schema.notRequired(),
      //   }),
    }),

    //isko abhi api ke baad set krongi
    onSubmit: (values) => {

      updatePhysioData({
        city: values.clinicCity,
        state: values.clinicState,

        clinic: {
          name: values.clinicName,
          zipCode: values.clinicPincode,
          address: values.clinicAddress,
          imagesClinic: values.clinicImage,
          charges: values.clinicCharges,
          duration: values.clinicDuration,
          timings: {
            start: values.timings?.start || "",
            end: values.timings?.end || "",
          },
          workingDays: values.clinicWorkingDays || [],  // add working days if available
        },

        home: {
          zipCode: values.homePincode,
          homeCity: values.homeCity,
          homeState: values.homeState,
          duration: values.homeDuration,
          charges: values.homeCharges,
          mode: values.mode || [],
          morningTimings: {
            start: values.morningTimings?.start || "",
            end: values.morningTimings?.end || "",
          },
          eveningTimings: {
            start: values.eveningTimings?.start || "",
            end: values.eveningTimings?.end || "",
          },
          workingDays: values.homeWorkingDays || [],  // add working days if available
          // homecareImage: values.homecareImage,
        },

        // patientImage: values.patientImage,
      });


      navigate("/review-profile", { state: { editMode } });
    },
  });


  const [hasUserChangedClinicPincode, setHasUserChangedClinicPincode] = useState(false);
  const [hasUserChangedHomePincode, setHasUserChangedHomePincode] = useState(false);


  const handleClinicPincodeChange = (e) => {
    setHasUserChangedClinicPincode(true);
    formik.handleChange(e);
  };

  const handleHomePincodeChange = (e) => {
    setHasUserChangedHomePincode(true);
    formik.handleChange(e);
  };


  // 1. Load oldPhysioData values initially
  useEffect(() => {
    if (physioData && !formik.values.clinicName && !formik.values.homePincode) {
      formik.setValues({
        ...formik.values,
        serviceType: physioData?.serviceType ?? [],

        // Clinic Data
        clinicName: physioData.clinic?.name ?? "",
        clinicAddress: physioData.clinic?.address ?? "",
        clinicPincode: physioData.clinic?.zipCode?.toString() ?? "",
        clinicCity: physioData?.city ?? "",
        clinicState: physioData?.state ?? "",
        clinicImage: physioData.clinic?.imagesClinic ?? [],
        clinicCharges: physioData.clinic?.charges?.toString() ?? "",
        clinicDuration: physioData.clinic?.duration?.toString() ?? "",
        timings: {
          start: physioData.clinic?.timings?.start ?? "",
          end: physioData.clinic?.timings?.end ?? "",
        },
        clinicWorkingDays: physioData.clinic?.workingDays ?? [],  // added here
        homeWorkingDays: physioData.home?.workingDays ?? [],  // added here


        // Home Data
        homePincode: physioData.home?.zipCode?.toString() ?? "",
        homeCity: physioData.home?.homeCity ?? "",
        homeState: physioData.home?.homeState ?? "",
        homeCharges: physioData.home?.charges?.toString() ?? "",
        homeDuration: physioData.home?.duration?.toString() ?? "",
        mode: Array.isArray(physioData.home?.mode) ? physioData.home.mode : [], // ✅ prefill mode

        morningTimings: {
          start: physioData.home?.morningTimings?.start ?? "",
          end: physioData.home?.morningTimings?.end ?? "",
        },
        eveningTimings: {
          start: physioData.home?.eveningTimings?.start ?? "",
          end: physioData.home?.eveningTimings?.end ?? "",
        },

        // Patient Image
        // patientImage: physioData?.patientImage ?? [],
      });
    }
  }, [physioData]);


  // 4. Trigger city/state lookup only if user changed clinic pincode
  useEffect(() => {
    const fetchCityState = async () => {
      if (hasUserChangedClinicPincode && formik.values.clinicPincode.length === 6) {
        try {
          const res = await locationUsingPincode(formik.values.clinicPincode);
          const components = res.results[0].address_components;

          const city = components.find(d => d.types.includes("locality"))?.long_name || "";
          const state = components.find(d => d.types.includes("administrative_area_level_1"))?.long_name || "";

          formik.setFieldValue("clinicCity", city);
          formik.setFieldValue("clinicState", state);
        } catch (err) {
          console.error("Clinic pincode fetch failed", err);
        }
      }
    };

    fetchCityState();
  }, [formik.values.clinicPincode, hasUserChangedClinicPincode]);

  // 5. Trigger city/state lookup only if user changed home pincode
  useEffect(() => {
    const fetchCityState = async () => {
      if (hasUserChangedHomePincode && formik.values.homePincode.length === 6) {
        try {
          const res = await locationUsingPincode(formik.values.homePincode);
          const components = res.results[0].address_components;

          const city = components.find(d => d.types.includes("locality"))?.long_name || "";
          const state = components.find(d => d.types.includes("administrative_area_level_1"))?.long_name || "";

          formik.setFieldValue("homeCity", city);
          formik.setFieldValue("homeState", state);
        } catch (err) {
          console.error("Home pincode fetch failed", err);
        }
      }
    };

    fetchCityState();
  }, [formik.values.homePincode, hasUserChangedHomePincode]);

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
      <div className=" flex flex-col md:flex md:flex-row min-h-screen bg-transparent py-8 mx-4 sm:mx-12 lg:mx-[120px]   -mt-24 gap-4">
        {/* Sidebar - Step Indicator */}
        <div className=" flex justify-center ">
          <StepIndicatorprofile currentStep={3} showProfilePic={false} />
        </div>

        {/* Main Content */}
        {loading ? (
          <Loading />
        ) : (
          <div className="flex-1 p-8 bg-white rounded-2xl   border-2  border-gray-300">
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-2 flex-1 max-w-screen-lg"
            >
              <div className="flex flex-row gap-4 items-start">
                <div>
                  <h6 className="font-semibold text-3xl">Business Details</h6>
                  <p className="text-sm font-semibold text-gray-700">Fill in your business details below</p>
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




              {/* clinic Name */}
              {formik.values.serviceType?.includes('clinic') && (
                <div>
                  <div className="space-y-2 mb-3">
                    <label
                      htmlFor="clinicName"
                      className="text-sm font-semibold"
                    >
                      Clinic Name
                    </label>
                    <Input
                      disabled={!editMode}
                      name="clinicName"
                      id="clinicName"
                      placeholder="Enter Clinic name"
                      value={formik.values.clinicName}
                      onChange={formik.handleChange}
                      labelProps={{ className: "hidden" }}
                      className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                    />
                  </div>
                  {formik.touched.clinicName && formik.errors.clinicName && (
                    <p className="text-red-500">{formik.errors.clinicName}</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="space-y-2">
                      <label
                        htmlFor="clinicAddress"
                        className="text-sm font-semibold"
                      >
                        Clinic Address
                      </label>
                      <Input
                        disabled={!editMode}
                        name="clinicAddress"
                        id="clinicAddress"
                        placeholder="Enter Clinic Address"
                        value={formik.values.clinicAddress}
                        onChange={formik.handleChange}
                        labelProps={{ className: "hidden" }}
                        className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                      />
                      {formik.touched.clinicAddress && formik.errors.clinicAddress && (
                        <p className="text-red-500">{formik.errors.clinicAddress}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="clinicAddress"
                        className="text-sm font-semibold"
                      >
                        Clinic City
                      </label>
                      <Input

                        name="clinicCity"
                        value={formik.values.clinicCity}
                        onChange={formik.handleChange}
                        labelProps={{ className: "hidden" }}
                        placeholder="Enter City"
                        disabled={formik.values.clinicPincode.length == 6 || !editMode}
                        className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                      />

                      {formik.touched.clinicCity && formik.errors.clinicCity && (
                        <p className="text-red-500">{formik.errors.clinicCity}</p>
                      )}
                    </div>

                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">

                    <div className="space-y-2">
                      <label
                        htmlFor="clinicState"
                        className="text-sm font-semibold"
                      >
                        Clinic State
                      </label>
                      <Input
                        name="clinicState"

                        value={formik.values.clinicState}
                        onChange={formik.handleChange}
                        labelProps={{ className: "hidden" }}
                        placeholder="Enter State"
                        disabled={formik.values.clinicPincode.length == 6 || !editMode}
                        className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                      />

                      {formik.touched.clinicState && formik.errors.clinicState && (
                        <p className="text-red-500">{formik.errors.clinicState}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="clinicPincode"
                        className="text-sm font-semibold"
                      >
                        Pincode
                      </label>
                      <Input
                        disabled={!editMode}
                        name="clinicPincode"
                        id="clinicPincode"
                        placeholder="Enter Pincode"
                        value={formik.values.clinicPincode}
                        onChange={handleClinicPincodeChange}
                        labelProps={{ className: "hidden" }}
                        className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                      />


                      {formik.touched.clinicPincode && formik.errors.clinicPincode && (
                        <p className="text-red-500">{formik.errors.clinicPincode}</p>
                      )}
                    </div>
                  </div>


                  {/* clinic images */}
                  <div className="flex flex-col gap-2 mt-4">
                    <label htmlFor="" className="text-sm font-semibold">
                      Upload clinic Images
                    </label>


                    <MultiFileUpload
                      file={formik.values.clinicImage}
                      setFile={(f) => formik.setFieldValue("clinicImage", f)}
                      maxFiles={8}
                      error={formik.errors.clinicImage}
                      touched={formik.touched.clinicImage}
                      disabled={!editMode}
                    />

                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="space-y-2">
                      <label
                        htmlFor="clinicCharges"
                        className="text-sm font-semibold"
                      >
                        Clinic Consultation Fee
                      </label>
                      <Input
                        name="clinicCharges"
                        id="clinicCharges"
                        placeholder="₹ Enter clinic consultation fee in INR"
                        disabled={!editMode}
                        value={formik.values.clinicCharges}
                        onChange={formik.handleChange}
                        labelProps={{ className: "hidden" }}
                        className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                      />
                      {formik.touched.clinicCharges && formik.errors.clinicCharges && (
                        <p className="text-red-500">{formik.errors.clinicCharges}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="clinicDuration"
                        className="text-sm font-semibold"
                      >
                        Consultation Duration/Session time(in minutes)
                      </label>
                      <Input
                        disabled={!editMode}
                        name="clinicDuration"
                        id="clinicDuration"
                        placeholder="Enter consultation duration in minutes "
                        value={formik.values.clinicDuration}
                        onChange={formik.handleChange}
                        labelProps={{ className: "hidden" }}
                        className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                      />
                      {formik.touched.clinicDuration && formik.errors.clinicDuration && (
                        <p className="text-red-500">{formik.errors.clinicDuration}</p>
                      )}
                    </div>

                  </div>

                  {formik.values.serviceType.includes("clinic") && (
                    <div className="mb-4">
                      <label className="block font-semibold mb-2">Clinic Working Days</label>
                      <div className="flex flex-wrap gap-4">
                        {daysOfWeek.map(day => (
                          <label key={day} className="flex items-center space-x-2">
                            <Checkbox
                              className="rounded-sm h-4 w-4 border-green border-2 checked:bg-green text-green"
                              checked={formik.values.clinicWorkingDays.includes(day)}
                              name="clinicWorkingDays"
                              value={day}
                              disabled={!editMode}
                              onChange={() => {
                                const current = formik.values.clinicWorkingDays;
                                if (current.includes(day)) {
                                  // remove day
                                  formik.setFieldValue(
                                    "clinicWorkingDays",
                                    current.filter(d => d !== day)
                                  );
                                } else {
                                  // add day
                                  formik.setFieldValue(
                                    "clinicWorkingDays",
                                    [...current, day]
                                  );
                                }
                              }}
                              onBlur={formik.handleBlur}
                            />
                            <span>{day}</span>
                          </label>
                        ))}
                      </div>
                      {formik.touched.clinicWorkingDays && formik.errors.clinicWorkingDays && (
                        <p className="text-red-500 text-sm mt-1">{formik.errors.clinicWorkingDays}</p>
                      )}
                    </div>
                  )}

                  {/* timings of clinic */}

                  {formik.values.serviceType.includes("clinic") && (
                    <div className="mb-4">
                      <label className="block font-semibold mb-2">Clinic Timings</label>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        {/* Start Time */}
                        <div className="flex flex-col">
                          <label htmlFor="timings.start" className="text-sm">Start Time</label>
                          <select
                            name="timings.start"
                            value={formik.values.timings.start}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border p-2 rounded"
                            disabled={!editMode}
                          >
                            <option value="">Select Start Time</option>
                            {generateTimeOptions().map((time) => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                          {formik.touched.timings?.start && formik.errors.timings?.start && (
                            <div className="text-red-500 text-sm">{formik.errors.timings.start}</div>
                          )}
                        </div>

                        {/* End Time */}
                        <div className="flex flex-col">
                          <label htmlFor="timings.end" className="text-sm">End Time</label>
                          <select
                            name="timings.end"
                            value={formik.values.timings.end}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="border p-2 rounded"
                            disabled={!editMode}
                          >
                            <option value="">Select End Time</option>
                            {generateTimeOptions().map((time) => (
                              <option key={time} value={time}>{time}</option>
                            ))}
                          </select>
                          {formik.touched.timings?.end && formik.errors.timings?.end && (
                            <div className="text-red-500 text-sm">{formik.errors.timings.end}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}











                  {/* add working days and homecare timings */}
                  {/* <div className="flex flex-col gap-2 mt-4">
                    <label htmlFor="" className="text-sm font-semibold">
                      Add Working Days
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        // Add logic here
                      }}
                      disabled={!editMode || editMode}
                      className="flex items-center gap-2 px-10 py-2 w-fit text-sm font-medium bg-[#e8fae7] border-green border-2 text-green rounded-2xl hover:bg-[#d5f9d4] disabled:opacity-50"
                    >
                      <div >
                        <CiCirclePlus className='h-6 w-6' />
                      </div>
                      Add Working Days
                    </button>
                  </div> */}
                </div>


              )}

              {/* Home Care */}
              {(formik.values.serviceType ?? []).includes('home') && (
                <div>
                  <div className="flex items-center gap-4 mt-4 mb-3">
                    <hr className="flex-1 border-t border-black" />
                    <span className="text-black font-medium">HomeCare Details</span>
                    <hr className="flex-1 border-t border-black" />
                  </div>

                  <div className="">

                    <div className="space-y-2 mb-3">
                      <label
                        htmlFor="homePincode"
                        className="text-sm font-semibold"
                      >
                        Pincode where you want to serve
                      </label>
                      <Input
                        disabled={!editMode}
                        name="homePincode"
                        id="homePincode"
                        placeholder="Enter Pincode"
                        value={formik.values.homePincode}
                        onChange={handleHomePincodeChange}
                        labelProps={{ className: "hidden" }}
                        className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                      />

                      {formik.touched.homePincode && formik.errors.homePincode && (
                        <p className="text-red-500">{formik.errors.homePincode}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="space-y-2">
                        <label
                          htmlFor="homeCity"
                          className="text-sm font-semibold"
                        >
                          City
                        </label>

                        <Input
                          name="homeCity"

                          value={formik.values.homeCity}
                          onChange={formik.handleChange}
                          labelProps={{ className: "hidden" }}
                          placeholder="Enter City"
                          disabled={formik.values.homePincode.length == 6 || !editMode}
                          className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                        />

                        {formik.touched.homeCity && formik.errors.homeCity && (
                          <p className="text-red-500">{formik.errors.homeCity}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="homeState"
                          className="text-sm font-semibold"
                        >
                          State
                        </label>
                        <Input

                          name="homeState"
                          value={formik.values.homeState}
                          onChange={formik.handleChange}
                          labelProps={{ className: "hidden" }}
                          placeholder="Enter State"
                          disabled={formik.values.homePincode.length === 6 || !editMode}
                          className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                        />
                        {formik.touched.homeState && formik.errors.homeState && (
                          <p className="text-red-500">{formik.errors.homeState}</p>
                        )}

                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="space-y-2">
                        <label
                          htmlFor="homeCharges"
                          className="text-sm font-semibold"
                        >
                          Homecare Consultation Fee
                        </label>
                        <Input
                          disabled={!editMode}
                          id="homeCharges"
                          name="homeCharges"
                          placeholder="₹ Enter homecare consultation fee in INR"
                          value={formik.values.homeCharges}
                          onChange={formik.handleChange}
                          labelProps={{ className: "hidden" }}
                          className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                        />
                        {formik.touched.homeCharges && formik.errors.homeCharges && (
                          <p className="text-red-500">{formik.errors.homeCharges}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="duration"
                          className="text-sm font-semibold"
                        >
                          Consultation Time(in minutes)
                        </label>
                        <Input
                          disabled={!editMode}
                          id="homeDuration"
                          name="homeDuration"
                          placeholder="Enter consultation duration in minutes "
                          value={formik.values.homeDuration}
                          onChange={formik.handleChange}
                          labelProps={{ className: "hidden" }}
                          className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                        />
                        {formik.touched.homeDuration && formik.errors.homeDuration && (
                          <p className="text-red-500">{formik.errors.homeDuration}</p>
                        )}
                      </div>
                    </div>





                    {/* patients images */}
                    {/* <div className="flex flex-col gap-2 mt-4">
                      <label htmlFor="" className="text-sm font-semibold">
                        Upload Patients Images
                      </label>

                      <MultiFileUpload
                        file={formik.values.patientImage}
                        maxSize={5 * 1024 * 1024} // 5MB max
                        setFile={(f) => formik.setFieldValue("patientImage", f)}
                        maxFiles={5}
                        error={formik.errors.patientImage}
                        touched={formik.touched.patientImage}
                        disabled={!editMode}
                      />
                    </div> */}


                    {formik.values.serviceType.includes("home") && (
                      <div className="mb-4">
                        <label className="block font-semibold mb-2">Home Working Days</label>
                        <div className="flex flex-wrap gap-4">
                          {daysOfWeek.map(day => (
                            <label key={day} className="flex items-center space-x-2">
                              <Checkbox
                                className="rounded-sm h-4 w-4 border-green border-2 checked:bg-green text-green"
                                checked={formik.values.homeWorkingDays.includes(day)}
                                name="homeWorkingDays"
                                value={day}
                                disabled={!editMode}
                                onChange={() => {
                                  const current = formik.values.homeWorkingDays;
                                  if (current.includes(day)) {
                                    formik.setFieldValue(
                                      "homeWorkingDays",
                                      current.filter(d => d !== day)
                                    );
                                  } else {
                                    formik.setFieldValue(
                                      "homeWorkingDays",
                                      [...current, day]
                                    );
                                  }
                                }}
                                onBlur={formik.handleBlur}
                              />
                              <span>{day}</span>
                            </label>
                          ))}
                        </div>
                        {formik.touched.homeWorkingDays && formik.errors.homeWorkingDays && (
                          <p className="text-red-500 text-sm mt-1">{formik.errors.homeWorkingDays}</p>
                        )}
                      </div>
                    )}


                    {/* home timings */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="mode" className="text-sm font-semibold">
                        Home Visit Mode
                      </label>
                      <div className="relative">
                        {/* Selected Items Display */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {formik.values.mode?.map((selectedMode) => (
                            <div
                              key={selectedMode}
                              className="flex items-center gap-1 bg-[#F2FAF6] text-green px-2 py-1 rounded-full text-sm"
                            >
                              {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}
                              <button
                                type="button"
                                disabled={!editMode}
                                onClick={() => {
                                  const updatedModes = formik.values.mode.filter((m) => m !== selectedMode);
                                  formik.setFieldValue("mode", updatedModes);
                                }}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Dropdown Trigger */}
                        <button
                          type="button"
                          disabled={!editMode}
                          className="flex items-center justify-between border px-3 py-2 rounded-md w-full cursor-pointer"
                          onClick={() => setOpenMode((prev) => !prev)}
                        >
                          <span>Select Mode</span>
                          <img src="/aboutImg/dropdown.png" className="w-4 h-4" alt="Dropdown" />
                        </button>

                        {/* Dropdown Options */}
                        {openMode && (
                          <div
                            ref={dropdownModeRef}
                            className="absolute z-10 w-full bg-white shadow-md rounded-md p-2 mt-1 border max-h-60 overflow-y-auto"
                          >
                            <div className="flex flex-col gap-2">
                              {["Morning", "Evening"].map((modeOption) => {
                                const isSelected = formik.values.mode?.includes(modeOption);
                                return (
                                  <label
                                    key={modeOption}
                                    className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded"
                                  >
                                    <input
                                      type="checkbox"
                                      disabled={!editMode}
                                      className="w-4 h-4"
                                      checked={isSelected}
                                      onChange={() => {
                                        const currentModes = formik.values.mode || [];
                                        const updatedModes = isSelected
                                          ? currentModes.filter((m) => m !== modeOption)
                                          : Array.from(new Set([...currentModes, modeOption]));

                                        formik.setFieldValue("mode", updatedModes);
                                      }}
                                    />
                                    {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                      {formik.touched.mode && formik.errors.mode && (
                        <p className="text-red-500">{formik.errors.mode}</p>
                      )}
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      {formik.values.serviceType.includes("home") &&
                        formik.values.mode.includes("Morning") && (
                          <div className="mb-4">
                            <label className="block font-semibold mb-2">Home Morning Timings</label>
                            <div className="flex flex-col gap-3 sm:flex-row">
                              <div className="flex flex-col">
                                <label className="text-sm">Start Time</label>
                                <select
                                  name="morningTimings.start"
                                  value={formik.values.morningTimings.start}
                                  onChange={formik.handleChange}
                                  className="border p-2 rounded"
                                  disabled={!editMode}
                                >
                                  <option value="">Select Start Time</option>
                                  {generateTimeOptions().map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm">End Time</label>
                                <select
                                  name="morningTimings.end"
                                  value={formik.values.morningTimings.end}
                                  onChange={formik.handleChange}
                                  className="border p-2 rounded"
                                  disabled={!editMode}
                                >
                                  <option value="">Select End Time</option>
                                  {generateTimeOptions().map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}


                      {formik.values.serviceType.includes("home") &&
                        formik.values.mode.includes("Evening") && (
                          <div className="mb-4">
                            <label className="block font-semibold mb-2">Home Evening Timings</label>
                            <div className="flex flex-col gap-3 sm:flex-row">
                              <div className="flex flex-col">
                                <label className="text-sm">Start Time</label>
                                <select
                                  name="eveningTimings.start"
                                  value={formik.values.eveningTimings.start}
                                  onChange={formik.handleChange}
                                  className="border p-2 rounded"
                                  disabled={!editMode}
                                >
                                  <option value="">Select Start Time</option>
                                  {generateTimeOptions().map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex flex-col">
                                <label className="text-sm">End Time</label>
                                <select
                                  name="eveningTimings.end"
                                  value={formik.values.eveningTimings.end}
                                  onChange={formik.handleChange}
                                  className="border p-2 rounded"
                                  disabled={!editMode}
                                >
                                  <option value="">Select End Time</option>
                                  {generateTimeOptions().map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>




                    {/* add working days and homecare timings */}
                    {/* <div className="flex flex-col gap-2 mt-4">
                      <label htmlFor="" className="text-sm font-semibold">
                        Add Working Days
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          // Add logic here
                        }}
                        disabled={!editMode || editMode}
                        className="flex items-center gap-2 px-10 py-2 w-fit text-sm font-medium bg-[#e8fae7] border-green border-2 text-green rounded-2xl hover:bg-[#d5f9d4] disabled:opacity-50"
                      >
                        <div >
                          <CiCirclePlus className='h-6 w-6' />
                        </div>
                        Add Working Days

                      </button>
                    </div> */}




                    {/* homecare images */}
                    {/* <div className="flex flex-col gap-2 mt-4">
                      <label htmlFor="" className="text-sm font-semibold">
                        Upload Homecare Images
                      </label>


                      <MultiFileUpload
                        file={formik.values.homecareImage}
                        maxSize={5 * 1024 * 1024} // 5MB max
                        setFile={(f) => formik.setFieldValue("homecareImage", f)}
                        maxFiles={2}
                        error={formik.errors.homecareImage}
                        touched={formik.touched.homecareImage}
                        disabled={!editMode}
                      />

                    </div> */}

                  </div>
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
                      formik.handleSubmit(); // manually submit the form
                    } else {
                      navigate("/review-profile", { state: { editMode: false } }); // go to next page without saving
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

export default Businessprofile;
