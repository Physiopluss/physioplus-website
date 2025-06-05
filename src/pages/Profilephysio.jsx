import ReactGA from "react-ga4";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineEdit } from "react-icons/md";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import StepIndicatorprofile from "../pages/StepIndicatorprofile";
import { physioConnectPhysioDataApi } from "../api/physioConnect";
import { Breadcrumbs } from "@material-tailwind/react";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { Button, Input, Select, Option } from "@material-tailwind/react";
import { usePhysio } from "../context/PhysioContext";
const Profilephysio = () => {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updatePhysioData, physioData } = usePhysio();
  const { userId } = useSelector((e) => e.auth.user || {});

  const autofillTexts = {
    "Passionate": "I am dedicated to guiding patients on their journey to recovery with energy, empathy, and unwavering commitment.",
    "Experienced": "With years of hands-on practice, I've developed the skills and knowledge to provide effective, personalized treatments that address each patient's unique needs.",
    "Compassionate": "I understand the challenges of recovery and approach each patient with care, patience, and empathy to make their healing journey as comfortable as possible.",
    "Innovative": "I constantly explore new techniques and technologies to enhance treatments, ensuring my patients receive cutting-edge care that's both effective and engaging.",
    "Trustworthy": "Building strong, honest relationships with my patients is my priority, creating a safe space where they feel comfortable sharing their concerns and goals.",
    "Motivated": "I am driven to help patients achieve their best possible outcomes, encouraging them every step of the way to stay positive and committed to their recovery.",
    "Approachable": "I maintain an open and friendly environment where patients feel heard, understood, and supported."
  };

  if (!userId) {
    navigate("login-physio");
  }
  // google analytics
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Profile-Physio" });
  }, []);


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: "",
      gender: "",
      dob: "",
      email: "",
      phone: "",
      about: "",
      selectedTraits: [],
      customDescription: "",
    },
    validationSchema: Yup.object().shape({
      fullName: Yup.string().required("Name is required"),
      gender: Yup.string().required("Gender is required"),
      dob: Yup.string().required("Date of Birth is required"),
      email: Yup.string().email("Invalid email").required("E-mail is required"),
      phone: Yup.string().required("Contact is required"),
      about: Yup.string()
        .required("Description is required")
        .max(500, "Description cannot exceed 500 characters"),
      selectedTraits: Yup.array()
        .of(Yup.string())
        .max(10, "You can select up to 10 traits"),
      customDescription: Yup.string()
        .max(400, "Custom description too long"),
    }),
    onSubmit: (values) => {
      updatePhysioData({ ...values });
      navigate("/professional", { state: { editMode } });
    },
  });

  // Load old data
  useEffect(() => {
    if (physioData && physioData.fullName && !formik.values.fullName) {
      formik.setValues({
        fullName: physioData.fullName || "",
        gender: physioData.gender?.toString() || "",
        dob: physioData.dob?.split("T")[0] || "",
        email: physioData.email || "",
        phone: physioData.phone || "",
        about: physioData.about || "",
      });
    }
  }, [physioData]);

  // scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <div className="font-Urbanist   bg-[#FFFCF0] py-8 px-4 sm:px-12 lg:px-[120px]  ">

        <div className="h-40 w-full  flex items-center">
          <Breadcrumbs
            separator=">"
            className=" text-black bg-transparent"
          ><Link to="/my-account-physio" className="text-black  font-semibold hover:text-green">My Account</Link>
            <Link to="/profile-physio">
              <span className="text-black hover:text-green font-bold">
                {physioData?.fullName?.replace(/\b\w/g, (char) => char.toUpperCase())}
              </span></Link> {/* Active breadcrumb */}
          </Breadcrumbs>
        </div>

      </div>


      <div className="  flex flex-col md:flex md:flex-row min-h-screen bg-transparent py-8 mx-4 sm:mx-12 lg:mx-[120px]    -mt-24 gap-4">
        {/* Sidebar - Step Indicator */}
        <div className=" flex justify-center ">
          <StepIndicatorprofile currentStep={1} showProfilePic={true} />
        </div>

        {/* Main Content */}
        {loading ? (
          <Loading />
        ) : (
          <div className="flex-1 p-8 bg-white rounded-2xl   border-2  border-gray-300 ">


            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 flex-1 max-w-screen-lg">
              <div className="flex flex-row gap-4 items-start">
                <div>
                  <h6 className="font-semibold text-3xl">Personal Details</h6>
                  <p className="text-sm font-semibold text-gray-700">
                    Fill in your personal details below
                  </p>
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

              {/* First Row: Name, Email, Phone */}
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Name Field */}
                <div className="flex-1 space-y-2">
                  <label htmlFor="fullName" className="text-sm font-semibold">Name</label>
                  <Input
                    name="fullName"
                    id="fullName"
                    placeholder="Enter Your Name"
                    disabled={!editMode}
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    className="!border !border-gray-300 bg-white focus:!border-gray-300 focus:!shadow-none rounded-md"
                    labelProps={{
                      className: "hidden"
                    }}
                    containerProps={{
                      className: "min-w-0"
                    }}
                  />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <p className="text-red-500">{formik.errors.fullName}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="flex-1 space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold">Email</label>
                  <Input
                    name="email"
                    id="email"
                    placeholder="Enter Your Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    disabled={!editMode}
                    className="!border !border-gray-300 bg-white focus:!border-gray-300 focus:!shadow-none rounded-md"
                    labelProps={{
                      className: "hidden"
                    }}
                    containerProps={{
                      className: "min-w-0"
                    }}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500">{formik.errors.email}</p>
                  )}
                </div>

                {/* Phone Field */}
                {/* Phone Field */}
                <div className="flex-1 space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold">Contact Number</label>
                  <Input
                    name="phone"
                    id="phone"
                    placeholder="Enter Your Phone"
                    disabled={!editMode}
                    value={formik.values.phone}
                    readOnly // 👈 prevents editing but keeps the value visible
                    className="!border !border-gray-300 bg-gray-100 cursor-not-allowed text-gray-500 focus:!border-gray-300 focus:!shadow-none rounded-md"
                    labelProps={{
                      className: "hidden"
                    }}
                    containerProps={{
                      className: "min-w-0"
                    }}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <p className="text-red-500">{formik.errors.phone}</p>
                  )}
                </div>

              </div>

              {/* Second Row: Gender, Date of Birth */}
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Date of Birth Field */}
                <div className="flex-1 space-y-2">
                  <label htmlFor="dob" className="text-sm font-semibold">Date of Birth</label>
                  <Input
                    type="date"
                    name="dob"
                    id="dob"
                    value={formik.values.dob}
                    disabled={!editMode}
                    onChange={formik.handleChange}
                    className="!border !border-gray-300 bg-white focus:!border-gray-300 focus:!shadow-none rounded-md"
                    labelProps={{
                      className: "hidden"
                    }}
                    containerProps={{
                      className: "min-w-0"
                    }}
                  />
                  {formik.touched.dob && formik.errors.dob && (
                    <p className="text-red-500">{formik.errors.dob}</p>
                  )}
                </div>
                {/* Gender Dropdown */}
                <div className="flex-1 space-y-2">
                  <label htmlFor="gender" className="text-sm font-semibold">Gender</label>
                  <Select
                    id="gender"
                    name="gender"
                    value={formik.values.gender}
                    onChange={(value) => formik.setFieldValue("gender", value)}
                    disabled={!editMode}
                    className="!border !border-gray-300 bg-white focus:!border-gray-300 focus:!shadow-none rounded-md"
                    labelProps={{
                      className: "hidden"
                    }}
                    containerProps={{
                      className: "min-w-0"
                    }}
                  >
                    <Option value="" disabled>
                      Select your gender
                    </Option>
                    <Option value="1">Male</Option>
                    <Option value="0">Female</Option>
                    <Option value="2">Other</Option>
                  </Select>
                  {formik.touched.gender && formik.errors.gender && (
                    <p className="text-red-500">{formik.errors.gender}</p>
                  )}
                </div>

              </div>

              {/* Description Field */}

              <div className="space-y-2">
                <label htmlFor="about" className="text-sm font-semibold">About Physio</label>

                {/* Small blocks for quick selection */}
                <div className="flex gap-2">
                  {Object.entries(autofillTexts).map(([key, text]) => (
                    <Button type="button" key={key} variant="outline" onClick={() => formik.setFieldValue("about", `${formik.values.about || ""} ${text}`.trim())}>
                      {key}
                    </Button>
                  ))}
                </div>

                {/* Visible textarea for custom input only */}
                <textarea
                  rows="4"
                  placeholder="Enter additional description..."
                  className="w-full p-2 border border-gray-300 bg-white focus:border-black focus:outline-none rounded-md"
                  value={formik.values.about || ''}
                  disabled={!editMode}
                  onChange={(e) => {
                    formik.setFieldValue("about", e.target.value);
                  }}
                />

                {formik.touched.about && formik.errors.about && (
                  <p className="text-red-500">{formik.errors.about}</p>
                )}
              </div>
              {/* Login & Submit Button - Responsive Version */}
              <div className="w-full flex flex-col-reverse sm:flex-row justify-end items-center gap-4 mt-4">

                <Button
                  className="w-full sm:w-fit hover:shadow-none font-semibold px-6 sm:px-8 bg-green rounded-full py-3 sm:py-3"
                  type="button"
                  onClick={() => {
                    if (editMode) {
                      formik.handleSubmit(); // manually submit the form
                    } else {
                      navigate("/professional", { state: { editMode } }); // go to next page without saving
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

export default Profilephysio;