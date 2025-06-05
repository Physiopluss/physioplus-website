import ReactGA from "react-ga4";
import { Button, Input, Select, Option } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {

  getPhysioDataById,
  physioConnectPersonalApi,
} from "../../api/physioConnect";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { setPhysioConnectPhysioId } from "../../slices/physioConnect";
import StepIndicator from "../../components/StepIndicator";

const PhysioConnectPersonalForm = () => {

  const [oldPhysioData, setOldPhysioData] = useState(); //if filling form after first time
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const physioConnectPhysioId = useSelector((state) => state?.physioConnectAuth?.physioId);


  // google analytics
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Physio Connect Personal Form" });
  }, []);

  useEffect(() => {
    const fetchOldData = async () => {
      try {
        const res = await getPhysioDataById(physioConnectPhysioId);
        if (res.success) {
          setOldPhysioData(res.physioData); // assuming `data` contains the physio details object
        } else {
          console.error("Error in response:", res.message);
        }
      } catch (error) {
        console.error("Error fetching physio data:", error);
      }
    };

    fetchOldData();
  }, []);



  const autofillTexts = {
    "Passionate": "I am dedicated to guiding patients on their journey to recovery with energy, empathy, and unwavering commitment.",
    "Experienced": "With years of hands-on practice, I've developed the skills and knowledge to provide effective, personalized treatments that address each patient's unique needs.",
    "Compassionate": "I understand the challenges of recovery and approach each patient with care, patience, and empathy to make their healing journey as comfortable as possible.",
    "Innovative": "I constantly explore new techniques and technologies to enhance treatments, ensuring my patients receive cutting-edge care that's both effective and engaging.",
    "Trustworthy": "Building strong, honest relationships with my patients is my priority, creating a safe space where they feel comfortable sharing their concerns and goals.",
    "Motivated": "I am driven to help patients achieve their best possible outcomes, encouraging them every step of the way to stay positive and committed to their recovery.",
    "Approachable": "I maintain an open and friendly environment where patients feel heard, understood, and supported."
  };


  const formik = useFormik({
    initialValues: {
      fullName: "",
      gender: "",
      dob: "",
      email: "",
      phone: "",
      about: "",
    },
    validationSchema: Yup.object().shape({
      fullName: Yup.string().required("Name is required"),
      gender: Yup.number().required("Gender is required"),
      dob: Yup.string().required("Date of Birth is required"),
      email: Yup.string().email("Invalid email").required("E-mail is required"),
      phone: Yup.string().required("Contact is required"),

      about: Yup.string()
        .required("Description is required")
        .max(500, "Description cannot exceed 500 characters"),


    }),

    onSubmit: (values) => {
      const {
        fullName,
        gender,
        dob,
        email,
        phone,
        about,
        // ...other fields as needed
      } = values;




      physioConnectPersonalApi({
        fullName,
        gender: gender,
        dob,
        email,
        phone,
        about,
        physioConnectPhysioId,
      }).then((res) => {
        if (res.status === 200) {
          toast.success(res.data?.message);
          setTimeout(() => {
            navigate("/physio-connect/professional-details");
          }, 1000);
        } else {
          toast.error(res.data?.message);
        }
      });
    }

  });
  useEffect(() => {
    if (oldPhysioData) {


      formik.setValues({
        fullName: oldPhysioData.fullName || "",
        gender: oldPhysioData.gender != null
          ? oldPhysioData.gender.toString()
          : "",
        dob: oldPhysioData.dob?.split("T")[0] || "",
        email: oldPhysioData.email || "",
        phone: oldPhysioData.phone || "",
        about: oldPhysioData.about || "",
      });
    }
  }, [oldPhysioData]);







  if (physioConnectPhysioId == null || physioConnectPhysioId.length == 0) {
    const physioConnectPhysioId = sessionStorage.getItem("physioConnectId");
    if (physioConnectPhysioId != null) {
      dispatch(setPhysioConnectPhysioId(physioConnectPhysioId));
    } else {
      return <Navigate to="/physio-connect/signup" />;
    }
  }


  // scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  return (
    <>

      <div className="flex flex-col md:flex-row gap-4 bg-[#FFFDF5] px-2 py-4 justify-center mx-4 md:mx-8 lg:mx-16">
        {/* Left side - Card */}
        <div className="flex-1 flex justify-center">
          <StepIndicator currentStep={1} />
        </div>


        {/* Right side - Form */}
        <div className="w-full max-w-6xl mx-auto border border-gray-200 rounded-lg bg-white px-12 py-8">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 flex-1 max-w-screen-lg">
            <h6 className="font-semibold text-3xl">Personal Details</h6>

            <p className="text-sm font-semibold text-gray-700">Fill in your personal details below</p>

            {/* First Row: Name, Email, Phone */}
            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Name Field */}
              <div className="flex-1 space-y-2">
                <label htmlFor="fullName" className="text-sm font-semibold">Name</label>
                <Input
                  name="fullName"
                  id="fullName"
                  placeholder="Enter Your Name"
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

              {/* Autofill Buttons */}
              <div className="flex gap-2 flex-wrap">
                {Object.entries(autofillTexts).map(([key, text]) => {
                  const isSelected = formik.values.about?.includes(text);

                  return (
                    <button
                      type="button"
                      key={key}
                      className={`px-3 py-1 rounded-md text-sm border transition-all duration-200
            ${isSelected
                          ? 'bg-[#e6f5e8] text-green border-green font-semibold'
                          : 'bg-white text-green border-gray-300 hover:bg-gray-100'}
          `}
                      onClick={() => {
                        const current = formik.values.about || "";
                        let updatedText;

                        if (isSelected) {
                          const regex = new RegExp(`\\s*${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`, 'g');
                          updatedText = current.replace(regex, " ").replace(/\s+/g, " ").trim();
                        } else {
                          updatedText = `${current} ${text}`.trim();
                        }

                        formik.setFieldValue("about", updatedText);
                      }}

                    >
                      {key}
                    </button>
                  );
                })}
              </div>

              {/* Custom Textarea */}
              <textarea
                rows="4"
                placeholder="Enter additional description..."
                className="w-full p-2 border border-gray-300 bg-white focus:border-black focus:outline-none rounded-md"
                value={formik.values.about || ''}

                onChange={(e) => formik.setFieldValue("about", e.target.value)}
              />

              {/* Validation Error */}
              {formik.touched.about && formik.errors.about && (
                <p className="text-red-500">{formik.errors.about}</p>
              )}
            </div>


            {/* Login & Submit Button - Responsive Version */}
            <div className="w-full flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-4">
              <p className="text-center sm:text-left text-sm sm:text-base">
                Already have an Account?{' '}
                <span
                  onClick={() => navigate('/login-physio')}
                  className="text-green hover:text-green hover:underline font-medium cursor-pointer"
                >
                  Login
                </span>
              </p>
              <Button
                className="w-full sm:w-fit hover:shadow-none font-semibold px-6 sm:px-8 bg-green rounded-full py-3 sm:py-3"
                type="submit"
              >
                Submit & Next
              </Button>
            </div>
          </form>
        </div>

      </div>


    </>
  );
};
export default PhysioConnectPersonalForm;
