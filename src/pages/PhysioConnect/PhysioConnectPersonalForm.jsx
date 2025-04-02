import ReactGA from "react-ga4";
import { GoDash } from "react-icons/go";
import { Button, Input, Select, Option } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import {
    getPhysioDataPhysioConnectApi,
    locationUsingPincode,
    physioConnectDegreeApi,
    physioConnectProfessionalsApi,
    physioConnectSpecializationsApi,
} from "../../api/physioConnect";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { setPhysioConnectPhysioId } from "../../slices/physioConnect";
import StepIndicator from "../../components/StepIndicator";

const PhysioConnectPersonalForm = () => {
    const homePincodeRef = useRef();
    const [allDegree, setAllDegree] = useState([]);
    const [allSpecialization, setAllSpecialization] = useState([]);
    const [oldPhysioData, setOldPhysioData] = useState(); //if filling form after first time
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const physioConnectPhysioId = useSelector((state) => state?.physioConnectAuth?.physioId);

    // google analytics
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Physio Connect Personal Form" });
    }, []);

    // getting degree & specialisation from backend
    useEffect(() => {
        const fetchData = async () => {
            await physioConnectDegreeApi().then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    setAllDegree(res.data.data);
                } else if (res.status >= 400 && res.status < 500) {
                    toast.error(res.data.message);
                } else {
                    toast.error("Something went wrong");
                }
            });

            await physioConnectSpecializationsApi().then((res) => {
                if (res.status >= 200 && res.status < 300) {
                    setAllSpecialization(res.data.data);
                } else if (res.status >= 400 && res.status < 500) {
                    toast.error(res.data.message);
                } else {
                    toast.error("Something went wrong");
                }
            });

            await getPhysioDataPhysioConnectApi(physioConnectPhysioId)
                .then((res) => {
                    if (res.status >= 200 && res.status < 300) {
                        setOldPhysioData(res.data);
                    } else {
                        console.log("inside else", res);
                    }
                })
                .catch((err) => console.log(err));
        };

        fetchData();
    }, []);

    const formik = useFormik({
        initialValues: {
            fullName:"",
            gender:"",
            dob: "",
            email:"",
            phone:"",
            degree: [],
            specialization: [],
            serviceType: [],
            clinicName: "",
            clinicAddress: "",
            clinicPincode: "",
            clinicCity: "",
            clinicState: "",
            consultationFees: "",
            treatmentCharges: "",
            homeChargesUpto5km: "",
            homeChargesUpto10km: "",
            homePincode: "",
            homeCity: "",
            homeState: "",
            AnotherTreatmentName: "",
            AnotherTreatmentPrice: "",
            description: "",
        },
        validationSchema: Yup.object().shape({
            fullName: Yup.string("Name is required"),
           gender: Yup.string().required("Gender is required"),
      dob: Yup.string().required("Date of Birth is required"),
      email: Yup.string().email("Invalid email").required("E-mail is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Contact is required"),
          
            description: Yup.string().max(500, "Description cannot exceed 500 characters"),
        }),
        onSubmit: (values) => {
            const {
                fullName,
                gender,
                dob,
                email,
                phone,
                description,
            } = values;
            // if (degree?.length == 0) return toast.error("Degree is Required");
            // if (specialization?.length == 0) return toast.error("Specialization is required");
            if (serviceType?.length == 0) return toast.error("Please select treatment type");
            else {
                physioConnectProfessionalsApi({
                    fullName,
                gender,
                dob,
                email,
                phone,
                description,
                    physioConnectPhysioId,
                    degree,
                    specialization,
                    serviceType,
                    clinicName,
                    clinicAddress,
                    clinicPincode,
                    clinicCity,
                    clinicState,
                    consultationFees,
                    treatmentCharges,
                    homeChargesUpto5km,
                    homeChargesUpto10km,
                    homePincode,
                    homeCity,
                    homeState,
                    AnotherTreatmentName,
                    AnotherTreatmentPrice,
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
        },
    });

    useEffect(() => {
        // // setting degree from database
        // if (oldPhysioData && oldPhysioData.degree.length != 0) {
        //     const tempDegreeId = [];
        //     oldPhysioData.degree.degreeId.forEach((degree) => {
        //         tempDegreeId.push(degree._id);
        //     });

        //     formik.setFieldValue("degree", tempDegreeId);
        // }

        // // setting specialisation from database
        // if (oldPhysioData && oldPhysioData.specialization.length != 0) {
        //     const tempSpecialisationId = [];
        //     oldPhysioData.specialization.forEach((specialisation) => {
        //         tempSpecialisationId.push(specialisation._id);
        //     });
        //     formik.setFieldValue("specialization", tempSpecialisationId);
        // }

        // setting serviceType from database
        if (oldPhysioData && oldPhysioData.serviceType.length != 0) {
            const tempServiceTypeId = [];
            oldPhysioData.serviceType.forEach((type) => {
                tempServiceTypeId.push(type);
            });
            formik.setFieldValue("serviceType", tempServiceTypeId);
        }
        if (oldPhysioData?.description) {
            formik.setFieldValue("description", oldPhysioData.description);
        }
        // setting name from database
        if (
            oldPhysioData &&
            oldPhysioData.fullName != null &&
            oldPhysioData.fullName!= undefined &&
            oldPhysioData.fullName.length != 0
        ) {
            formik.setFieldValue("name", oldPhysioData.fullName);
        }
        // setting email from database
        if (
            oldPhysioData &&
            oldPhysioData.email != null &&
            oldPhysioData.email != undefined &&
            oldPhysioData.email.length != 0
        ) {
            formik.setFieldValue("email", oldPhysioData.email);
        }
        // setting email from database
        if (
            oldPhysioData &&
            oldPhysioData.phone != null &&
            oldPhysioData.phone != undefined &&
            oldPhysioData.phone.length != 0
        ) {
            formik.setFieldValue("phone", oldPhysioData.phone);
        }
        if (
            oldPhysioData &&
            oldPhysioData.dob != null &&
            oldPhysioData.dob != undefined &&
            oldPhysioData.dob.length != 0
        ) {
            formik.setFieldValue("dob", oldPhysioData.dob);
        }
        if (
            oldPhysioData &&
            oldPhysioData.gender != null &&
            oldPhysioData.gender != undefined &&
            oldPhysioData.gender.length != 0
        ) {
            formik.setFieldValue("gender", oldPhysioData.gender);
        }
      
    }, [oldPhysioData]);

    // clinic city and clinic state using pincode by google api
    useEffect(() => {
        const cityAndStateUsingPincode = () => {
            if (formik.values.clinicPincode.length === 6) {
                locationUsingPincode(formik.values.clinicPincode).then((res) => {
                    const city = res.results[0].address_components.find((data) => data.types.includes("locality")).long_name;
                    const state = res.results[0].address_components.find((data) =>
                        data.types.includes("administrative_area_level_1")
                    ).long_name;

                    formik.setFieldValue("clinicCity", city);
                    formik.setFieldValue("clinicState", state);
                });
            }
        };

        cityAndStateUsingPincode();
    }, [formik.values.clinicPincode]);

    // home city and home state using pincode by google api
    useEffect(() => {
        const cityAndStateUsingPincode = () => {
            if (formik.values.homePincode.length === 6) {
                locationUsingPincode(formik.values.homePincode).then((res) => {
                    const city = res.results[0].address_components.find((data) => data.types.includes("locality")).long_name;
                    const state = res.results[0].address_components.find((data) =>
                        data.types.includes("administrative_area_level_1")
                    ).long_name;

                    formik.setFieldValue("homeCity", city);
                    formik.setFieldValue("homeState", state);
                });
            }
        };

        cityAndStateUsingPincode();
    }, [formik.values.homePincode]);

    if (physioConnectPhysioId == null || physioConnectPhysioId.length == 0) {
        const physioConnectPhysioId = sessionStorage.getItem("physioConnectId");
        if (physioConnectPhysioId != null) {
            dispatch(setPhysioConnectPhysioId(physioConnectPhysioId));
        } else {
            return <Navigate to="/physio-connect/signup" />;
        }
    }

    return (
        <>
            
            <div className="flex flex-col md:flex-row gap-4 bg-[#FFFDF5] px-8 py-8 justify-center mx-4 md:mx-8 lg:mx-16">
  {/* Left side - Card */}
  <div className="flex-1 flex justify-center">
  <StepIndicator currentStep={1} />
</div>


   {/* Right side - Form */}
   <div className="w-full max-w-6xl mx-auto border border-gray-200 rounded-lg bg-white px-12 py-8">
  <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 flex-1 max-w-screen-lg">
    <h6 className="font-semibold text-3xl">Personal Details</h6>

    {/* First Row: Name, Email, Phone */}
    <div className="flex flex-col gap-4 sm:flex-row">
  {/* Name Field */}
  <div className="flex-1 space-y-2">
    <label htmlFor="fullName" className="text-sm">Name</label>
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
    <label htmlFor="email" className="text-sm">Email</label>
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
  <div className="flex-1 space-y-2">
    <label htmlFor="phone" className="text-sm">Contact Number</label>
    <Input
      name="phone"
      id="phone"
      placeholder="Enter Your Phone"
      value={formik.values.phone}
      onChange={formik.handleChange}
       className="!border !border-gray-300 bg-white focus:!border-gray-300 focus:!shadow-none rounded-md"
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
  {/* Gender Dropdown */}
  <div className="flex-1 space-y-2">
    <label htmlFor="gender" className="text-sm">Gender</label>
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
      <Option value="male">Male</Option>
      <Option value="female">Female</Option>
      <Option value="other">Other</Option>
    </Select>
    {formik.touched.gender && formik.errors.gender && (
      <p className="text-red-500">{formik.errors.gender}</p>
    )}
  </div>

  {/* Date of Birth Field */}
  <div className="flex-1 space-y-2">
    <label htmlFor="dob" className="text-sm">Date of Birth</label>
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
</div>

    {/* Description Field */}
    <div className="space-y-2">
      <label htmlFor="description" className="text-sm">About Physio</label>
      <textarea
        name="description"
        id="description"
        rows="4"
        placeholder="Enter description..."
        value={formik.values.description}
        onChange={formik.handleChange}
        className="w-full p-2 border border-gray-300 bg-white focus:border-black focus:outline-none rounded-md"
      ></textarea>
      {formik.touched.description && formik.errors.description && (
        <p className="text-red-500">{formik.errors.description}</p>
      )}
    </div>

    {/* Login & Submit Button */}
    <div className="w-full flex flex-row justify-between">
      <p className="text-center mt-4">
        Already have an Account?{' '}
        <span
          onClick={() => navigate('/login')}
          className="text-green hover:text-green hover:underline font-medium cursor-pointer"
        >
          Login
        </span>
      </p>
      <Button className="w-fit hover:shadow-none font-normal px-12 bg-green rounded-full" type="submit">
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
