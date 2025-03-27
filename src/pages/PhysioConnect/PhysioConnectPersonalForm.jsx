import ReactGA from "react-ga4";
import { GoDash } from "react-icons/go";
import { Button, Checkbox, Input } from "@material-tailwind/react";
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
        },
        validationSchema: Yup.object().shape({
            degree: Yup.array().required("Degree is required"),
            specialization: Yup.array().required("Specialization is required"),
            serviceType: Yup.array().required("Service Type is required"),
            clinicName: Yup.string("Clinic Name is required"),
            clinicAddress: Yup.string("Clinic Address is required"),
            clinicPincode: Yup.number("Clinic Pincode is required"),
            clinicCity: Yup.string("Clinic City is required"),
            clinicState: Yup.string("Clinic State is required"),
            consultationFees: Yup.number("Consultation Fees is required"),
            treatmentCharges: Yup.number("Treatment Charges is required"),
            homeChargesUpto5km: Yup.number("Home Charges Upto 5km is required"),
            homeChargesUpto10km: Yup.number("Home Charges Upto 10km is required"),
            homePincode: Yup.number("Home Pincode is required"),
            homeCity: Yup.string("Home City is required"),
            homeState: Yup.string("Home State is required"),
            AnotherTreatmentName: Yup.string("Another Treatment Name is required"),
            AnotherTreatmentPrice: Yup.number("Another Treatment Price is required"),
        }),
        onSubmit: (values) => {
            const {
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
            } = values;
            if (degree?.length == 0) return toast.error("Degree is Required");
            if (specialization?.length == 0) return toast.error("Specialization is required");
            if (serviceType?.length == 0) return toast.error("Please select treatment type");
            else {
                physioConnectProfessionalsApi({
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
        // setting degree from database
        if (oldPhysioData && oldPhysioData.degree.length != 0) {
            const tempDegreeId = [];
            oldPhysioData.degree.degreeId.forEach((degree) => {
                tempDegreeId.push(degree._id);
            });

            formik.setFieldValue("degree", tempDegreeId);
        }

        // setting specialisation from database
        if (oldPhysioData && oldPhysioData.specialization.length != 0) {
            const tempSpecialisationId = [];
            oldPhysioData.specialization.forEach((specialisation) => {
                tempSpecialisationId.push(specialisation._id);
            });
            formik.setFieldValue("specialization", tempSpecialisationId);
        }

        // setting serviceType from database
        if (oldPhysioData && oldPhysioData.serviceType.length != 0) {
            const tempServiceTypeId = [];
            oldPhysioData.serviceType.forEach((type) => {
                tempServiceTypeId.push(type);
            });
            formik.setFieldValue("serviceType", tempServiceTypeId);
        }

        // setting clinic name from database
        if (
            oldPhysioData &&
            oldPhysioData.clinic.name != null &&
            oldPhysioData.clinic.name != undefined &&
            oldPhysioData.clinic.name.length != 0
        ) {
            formik.setFieldValue("clinicName", oldPhysioData.clinic.name);
        }

        // setting clinic address from database
        if (
            oldPhysioData &&
            oldPhysioData.clinic.address != null &&
            oldPhysioData.clinic.address != undefined &&
            oldPhysioData.clinic.address.length != 0
        ) {
            formik.setFieldValue("clinicAddress", oldPhysioData.clinic.address);
        }

        // setting clinic pincode from database
        if (
            oldPhysioData &&
            oldPhysioData.clinic.zipCode != null &&
            oldPhysioData.clinic.zipCode != undefined &&
            oldPhysioData.clinic.zipCode.length != 0
        ) {
            formik.setFieldValue("clinicPincode", oldPhysioData.clinic.zipCode);
        }

        if (
            oldPhysioData &&
            oldPhysioData.clinic.city != null &&
            oldPhysioData.clinic.city != undefined &&
            oldPhysioData.clinic.city.length != 0
        ) {
            formik.setFieldValue("clinicCity", oldPhysioData.clinic.city);
        }
        if (
            oldPhysioData &&
            oldPhysioData.clinic.state != null &&
            oldPhysioData.clinic.state != undefined &&
            oldPhysioData.clinic.state.length != 0
        ) {
            formik.setFieldValue("clinicState", oldPhysioData.clinic.state);
        }

        // setting consultation fees from database
        if (
            oldPhysioData &&
            oldPhysioData.clinic.charges != null &&
            oldPhysioData.clinic.charges != undefined &&
            oldPhysioData.clinic.charges.length != 0
        ) {
            formik.setFieldValue("consultationFees", oldPhysioData.clinic.charges);
        }

        // setting treatment fees from database
        if (
            oldPhysioData &&
            oldPhysioData.clinic.consultationCharges != null &&
            oldPhysioData.clinic.consultationCharges != undefined &&
            oldPhysioData.clinic.consultationCharges.length != 0
        ) {
            formik.setFieldValue("treatmentCharges", oldPhysioData.clinic.consultationCharges);
        }

        // setting home charges upto 5km from database
        if (
            oldPhysioData &&
            oldPhysioData.home.consultationChargesUp5Km != null &&
            oldPhysioData.home.consultationChargesUp5Km != undefined &&
            oldPhysioData.home.consultationChargesUp5Km.length != 0
        ) {
            formik.setFieldValue("homeChargesUpto5km", oldPhysioData.home.consultationChargesUp5Km);
        }

        // setting home charges upto 10km from database
        if (
            oldPhysioData &&
            oldPhysioData.home.consultationChargesUp10Km != null &&
            oldPhysioData.home.consultationChargesUp10Km != undefined &&
            oldPhysioData.home.consultationChargesUp10Km.length != 0
        ) {
            formik.setFieldValue("homeChargesUpto10km", oldPhysioData.home.consultationChargesUp10Km);
        }

        // setting home pincode from database
        if (
            oldPhysioData &&
            oldPhysioData.home.zipCode != null &&
            oldPhysioData.home.zipCode != undefined &&
            oldPhysioData.home.zipCode.length != 0
        ) {
            formik.setFieldValue("homePincode", oldPhysioData.home.zipCode);
        }

        // setting another treatment from database
        if (
            oldPhysioData &&
            oldPhysioData.home.otherTreatmentName != null &&
            oldPhysioData.home.otherTreatmentName != undefined &&
            oldPhysioData.home.otherTreatmentName.length != 0
        ) {
            formik.setFieldValue("AnotherTreatmentName", oldPhysioData.home.otherTreatmentName);
        }

        // setting another treatment price from database
        if (
            oldPhysioData &&
            oldPhysioData.home.otherTreatmentCharges != null &&
            oldPhysioData.home.otherTreatmentCharges != undefined &&
            oldPhysioData.home.otherTreatmentCharges.length != 0
        ) {
            formik.setFieldValue("AnotherTreatmentPrice", oldPhysioData.home.otherTreatmentCharges);
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
            
            <div className="flex flex-col md:flex-row gap-4 bg-white px-8 py-8 justify-center mx-4 md:mx-8 lg:mx-16">
  {/* Left side - Card */}
  <div className="flex-1 flex justify-center">
  <StepIndicator currentStep={1} />
</div>


   {/* Right side - Form */}
   <div className="w-full max-w-6xl mx-auto border border-gray-200 rounded-lg bg-[#FFFDF5] px-12 py-8">

   <form
                    onSubmit={formik.handleSubmit}
                    className="flex flex-col gap-4 flex-1 max-w-screen-lg"
                >
                    <h6 className="font-semibold text-3xl">Personal Details</h6>
                   
                    {/* clinic Name */}
                    {formik.values.serviceType.includes("clinic") && (
                        <div className="">
                            <h6 className="text-base font-semibold">Fill Your Personal Details Below</h6>
                            {/* <div className="space-y-2">
                                <label
                                    htmlFor="clinicName"
                                    className="text-sm"
                                >
                                    Clinic Name
                                </label>
                                <Input
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
                            )} */}
                            <div className="space-y-2 mt-3">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Name Input */}
        <div className="space-y-2">
            <label htmlFor="name" className="text-sm">
                Name
            </label>
            <Input
                name="name"
                placeholder="Enter Your Name"
                value={formik.values.name}  // Changed from clinicAddress to name
                onChange={formik.handleChange}
                labelProps={{ className: "hidden" }}
                className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
            />
            {formik.touched.name && formik.errors.name && (
                <p className="text-red-500">{formik.errors.name}</p>
            )}
        </div>
        
        {/* Pincode Input */}
        <div className="space-y-2">
            <label htmlFor="clinicPincode" className="text-sm">
                Pincode
            </label>
            <Input
                name="clinicPincode"
                placeholder="Pincode"
                value={formik.values.clinicPincode}
                onChange={formik.handleChange}
                ref={homePincodeRef}
                labelProps={{ className: "hidden" }}
                className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
            />
            {formik.touched.clinicPincode && formik.errors.clinicPincode && (
                <p className="text-red-500">{formik.errors.clinicPincode}</p>
            )}
        </div>

        {/* City Input */}
        <div className="space-y-2">
            <label htmlFor="clinicCity" className="text-sm">
                City
            </label>
            <Input
                name="clinicCity"
                value={formik.values.clinicCity}
                onChange={formik.handleChange}
                labelProps={{ className: "hidden" }}
                placeholder="Enter Your City"
                disabled={formik.values.clinicPincode.length == 6}
                className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
            />
            {formik.touched.clinicCity && formik.errors.clinicCity && (
                <p className="text-red-500">{formik.errors.clinicCity}</p>
            )}
        </div>
    </div>
</div>
                            <div className="space-y-2 mt-3">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* date Input */}
        <div className="space-y-2">
            <label htmlFor="name" className="text-sm">
                Date of Birth
            </label>
            <Input
                name="name"
                placeholder=""
                value={formik.values.name}  // Changed from clinicAddress to name
                onChange={formik.handleChange}
                labelProps={{ className: "hidden" }}
                className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
            />
            {formik.touched.name && formik.errors.name && (
                <p className="text-red-500">{formik.errors.name}</p>
            )}
        </div>
        
        {/* gender Input */}
        <div className="space-y-2">
            <label htmlFor="clinicPincode" className="text-sm">
              Gender
            </label>
            <Input
                name="clinicPincode"
                placeholder="Select Your gender"
                value={formik.values.clinicPincode}
                onChange={formik.handleChange}
                ref={homePincodeRef}
                labelProps={{ className: "hidden" }}
                className="border-none placeholder:text-gray-500 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
            />
            {formik.touched.clinicPincode && formik.errors.clinicPincode && (
                <p className="text-red-500">{formik.errors.clinicPincode}</p>
            )}
        </div>

        
    </div>
    <div>
          <label className="block text-sm font-medium mb-1">About Physio</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {['Passionate', 'Hard working', 'Dedicated', 'Experienced', 'Patient-focused'].map((tag) => (
              <span 
                key={tag}
                className="px-3 py-1 bg-white text-black rounded-full text-sm border border-black"
              >
                {tag}
              </span>
            ))}
          </div>
          </div>
</div>
                           
                        </div>
                    )}
                   
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
                        <Button
                            className="w-fit hover:shadow-none font-normal px-12 bg-green rounded-full"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </div>
                </form>
  </div>
</div>
            
            
        </>
    );
};
export default PhysioConnectPersonalForm;
