import ReactGA from "react-ga4";
import { GoDash } from "react-icons/go";
import {
  Button,
  Checkbox,
  Input,
  Option,
  Select,
  Radio,
} from "@material-tailwind/react";

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

const PhysioConnectProfessionalForm = () => {
  const homePincodeRef = useRef();
  const [allDegree, setAllDegree] = useState([]);
  const [allSpecialization, setAllSpecialization] = useState([]);
  const [oldPhysioData, setOldPhysioData] = useState(); //if filling form after first time
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const physioConnectPhysioId = useSelector(
    (state) => state?.physioConnectAuth?.physioId
  );
  const [degreeOpen, setDegreeOpen] = useState(false);
  // google analytics
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: "Physio Connect Professional Form",
    });
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
  const handleRemove = (id) => {
    formik.setFieldValue(
      "specialization",
      formik.values.specialization.filter((item) => item !== id)
    );
  };

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
      treatInsuredPatient: true,
      experience: "",
      IAP: true,
      IAP_number: "",
      iapImage: null, // Added for image upload
    },
    validationSchema: Yup.object().shape({
      IAP: Yup.boolean().required("IAP is required"),
      IAP_number: Yup.string(),
      iapImage: Yup.mixed()
        .nullable()
        .required("IAP Certificate Image is required"), // Validation for image
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
      treatInsuredPatient: Yup.boolean().required(
        "treatInsuredPatient is required"
      ),
      experience: Yup.string().required("experience is required"),
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
      if (specialization?.length == 0)
        return toast.error("Specialization is required");
      if (serviceType?.length == 0)
        return toast.error("Please select treatment type");
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
              navigate("/physio-connect/work-experience");
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
    // setting IAP from database
    if (
      oldPhysioData &&
      oldPhysioData.iapMember != null &&
      oldPhysioData.iapMember != undefined
    ) {
      if (oldPhysioData.iapMember == 0) {
        formik.setFieldValue("IAP", false);
      } else {
        formik.setFieldValue("IAP", true);
      }
    }

    // setting IAP Number from database
    if (
      oldPhysioData &&
      oldPhysioData.iapNumber != null &&
      oldPhysioData.iapNumber != undefined
    ) {
      formik.setFieldValue("IAP_number", oldPhysioData.iapNumber);
    }
    //  setting treatInsuredPatient from database
    if (
      oldPhysioData &&
      oldPhysioData.treatInsuranceclaims != null &&
      oldPhysioData.treatInsuranceclaims != undefined
    ) {
      formik.setFieldValue(
        "treatInsuredPatient",
        oldPhysioData.treatInsuranceclaims
      );
    }

    // setting experience from database
    if (
      oldPhysioData &&
      oldPhysioData.workExperience != null &&
      oldPhysioData.workExperience != undefined
    ) {
      formik.setFieldValue("experience", oldPhysioData.workExperience);
    }
  }, [oldPhysioData]);

  // clinic city and clinic state using pincode by google api
  useEffect(() => {
    const cityAndStateUsingPincode = () => {
      if (formik.values.clinicPincode.length === 6) {
        locationUsingPincode(formik.values.clinicPincode).then((res) => {
          const city = res.results[0].address_components.find((data) =>
            data.types.includes("locality")
          ).long_name;
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
          const city = res.results[0].address_components.find((data) =>
            data.types.includes("locality")
          ).long_name;
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
          <StepIndicator currentStep={2} />
        </div>

        {/* Right side - Form */}
        {/* Right side - Form */}
        <div className="w-full max-w-6xl mx-auto border border-gray-200 rounded-lg bg-white px-12 py-8">
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-4 flex-1 max-w-screen-lg"
          >
            <h6 className="font-semibold text-3xl">Professional Details</h6>

            {/* Updated Degree Section - Multi-select Dropdown */}
            <div className="flex flex-col gap-2">
              <label htmlFor="degree" className="text-sm">
                Degree
              </label>
              <div className="relative">
                {/* Selected Items Display (Chips with Cross) */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {formik.values.degree.map((selectedId) => {
                    const selectedItem = allDegree.find(
                      (item) => item._id === selectedId
                    );
                    return (
                      selectedItem && (
                        <div
                          key={selectedId}
                          className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm"
                        >
                          {selectedItem.name}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedDegrees =
                                formik.values.degree.filter(
                                  (id) => id !== selectedId
                                );
                              formik.setFieldValue("degree", updatedDegrees);
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
                  type="button"
                  className="flex items-center justify-between border px-3 py-2 rounded-md w-full cursor-pointer"
                  onClick={() => setDegreeOpen(!degreeOpen)}
                >
                  <span>Select Degrees</span>
                  <img
                    src="/aboutImg/dropdown.png"
                    className="w-4 h-4"
                    alt=""
                  />
                  {/* <Button className="w-4 h-4" /> */}
                </button>

                {/* Dropdown Options */}
                {degreeOpen && (
                  <div className="absolute z-10 w-full bg-white shadow-md rounded-md p-2 mt-1 border max-h-60 overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      {allDegree.map((i) => (
                        <label
                          key={i._id}
                          className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded"
                          onClick={() => {
                            const isSelected = formik.values.degree.includes(
                              i._id
                            );
                            let newDegrees;
                            if (isSelected) {
                              newDegrees = formik.values.degree.filter(
                                (id) => id !== i._id
                              );
                            } else {
                              newDegrees = [...formik.values.degree, i._id];
                            }
                            formik.setFieldValue("degree", newDegrees);
                          }}
                        >
                          <input
                            type="checkbox"
                            name="degree"
                            className="w-4 h-4"
                            value={i._id}
                            checked={formik.values.degree.includes(i._id)}
                            onChange={() => {}}
                          />
                          {i.name}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {formik.touched.degree && formik.errors.degree && (
                <p className="text-red-500">{formik.errors.degree}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="specialization" className="text-sm">
                Specialization
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
                          className="flex items-center gap-1 bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm"
                        >
                          {selectedItem.name}
                          <button
                            type="button"
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
                  type="button"
                  className="flex items-center justify-between border px-3 py-2 rounded-md w-full cursor-pointer"
                  onClick={() => setOpen(!open)}
                >
                  <span>Select Specializations</span>
                  <img
                    src="/aboutImg/dropdown.png"
                    className="w-4 h-4"
                    alt=""
                  />
                </button>

                {/* Dropdown Options */}
                {open && (
                  <div className="absolute z-10 w-full bg-white shadow-md rounded-md p-2 mt-1 border max-h-60 overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      {allSpecialization.map((i) => (
                        <label
                          key={i._id}
                          className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded"
                          onClick={() => {
                            const isSelected =
                              formik.values.specialization.includes(i._id);
                            let newSpecializations;
                            if (isSelected) {
                              newSpecializations =
                                formik.values.specialization.filter(
                                  (id) => id !== i._id
                                );
                            } else {
                              newSpecializations = [
                                ...formik.values.specialization,
                                i._id,
                              ];
                            }
                            formik.setFieldValue(
                              "specialization",
                              newSpecializations
                            );
                          }}
                        >
                          <input
                            type="checkbox"
                            name="specialization"
                            className="w-4 h-4"
                            value={i._id}
                            checked={formik.values.specialization.includes(
                              i._id
                            )}
                            onChange={() => {}}
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

            {/* Treat Insured Patient Dropdown */}

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="experience" className="text-sm">
                  Work Experience (in years)
                </label>
                <Input
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
              <label htmlFor="treatInsuredPatient" className="text-sm">
                Do you treat insured patients?
              </label>
              <div className="relative">
                <select
                  name="treatInsuredPatient"
                  value={formik.values.treatInsuredPatient.toString()}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "treatInsuredPatient",
                      e.target.value === "true"
                    )
                  }
                  className="border border-gray-300 rounded-md px-3 py-2 w-full cursor-pointer focus:outline-none focus:ring-1 focus:ring-black focus:border-black appearance-none pr-8 bg-white"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <img
                    src="/aboutImg/dropdown.png"
                    className="w-4 h-4"
                    alt=""
                  />
                </div>
              </div>
              {formik.touched.treatInsuredPatient &&
                formik.errors.treatInsuredPatient && (
                  <p className="text-red-500">
                    {formik.errors.treatInsuredPatient}
                  </p>
                )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="IAP" className="text-sm">
                Are you registered with IAP?
              </label>
              <div className="flex gap-2">
                <Radio
                  className="w-4 h-4 hover:before:opacity-0"
                  label="Yes"
                  name="IAP"
                  value={formik.values.IAP}
                  checked={formik.values.IAP === true}
                  onChange={() => formik.setFieldValue("IAP", true)}
                />
                <Radio
                  className="w-4 h-4 hover:before:opacity-0"
                  label="No"
                  name="IAP"
                  value={formik.values.IAP}
                  checked={formik.values.IAP === false}
                  onChange={() => {
                    formik.setFieldValue("IAP", false);
                    formik.setFieldValue("IAP_number", ""); // Reset IAP number
                    formik.setFieldValue("iapImage", []); // Reset uploaded images
                  }}
                />
              </div>
            </div>
            {formik.touched.IAP && formik.errors.IAP ? (
              <div className="text-red-500 mt-2">{formik.errors.IAP}</div>
            ) : null}

            {formik.values.IAP === true && (
              <>
                {/* IAP Number Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="IAP_number" className="text-sm">
                    If yes, enter your IAP Number
                  </label>
                  <Input
                    size="md"
                    name="IAP_number"
                    value={formik.values.IAP_number}
                    onChange={formik.handleChange}
                    labelProps={{ className: "hidden" }}
                    placeholder="Enter IAP Number"
                    className="border-none placeholder:text-gray-300 placeholder:opacity-100 bg-white ring-1 ring-[#A9ABB2] focus:ring-2 focus:ring-black"
                  />
                </div>
                {formik.touched.IAP_number && formik.errors.IAP_number ? (
                  <div className="text-red-500 mt-2">
                    {formik.errors.IAP_number}
                  </div>
                ) : null}

                {/* IAP Image Upload */}
                <div>
	<label htmlFor="iapImages" className="block text-sm font-medium text-gray-700">
		Upload IAP Certificates
	</label>
	<input
		type="file"
		id="iapImages"
		name="iapImages"
		accept="image/*"
		multiple
		onChange={(event) => {
			const files = Array.from(event.target.files);
			formik.setFieldValue("iapImages", [...(formik.values.iapImages || []), ...files]);
		}}
		className="mt-1 block w-full border border-gray-300 shadow-sm sm:text-sm rounded-md"
	/>
	{formik.errors.iapImages && formik.touched.iapImages && (
		<p className="text-red-500 text-sm mt-1">{formik.errors.iapImages}</p>
	)}

	{/* Preview the uploaded images */}
	{formik.values.iapImages && formik.values.iapImages.length > 0 && (
		<div className="mt-2 flex flex-wrap gap-2">
			{formik.values.iapImages.map((file, index) => (
				<div key={index} className="relative">
					<img
						src={URL.createObjectURL(file)}
						alt={`IAP Certificate ${index + 1}`}
						className="h-32 w-auto rounded-lg border"
					/>
					<button
						type="button"
						className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded"
						onClick={() => {
							const newFiles = formik.values.iapImages.filter((_, i) => i !== index);
							formik.setFieldValue("iapImages", newFiles);
						}}
					>
						X
					</button>
				</div>
			))}
		</div>
	)}
</div>

              </>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="serviceType" className="text-sm">
                Which type of service you provide
              </label>
              <div className="flex gap-2">
                <Checkbox
                  name="serviceType"
                  className="w-4 h-4 hover:before:opacity-0"
                  label="Clinic"
                  value="clinic"
                  checked={formik.values.serviceType.includes("clinic")}
                  onChange={formik.handleChange}
                />
                <Checkbox
                  name="serviceType"
                  className="w-4 h-4 hover:before:opacity-0"
                  label="Home Care"
                  value="home"
                  checked={formik.values.serviceType.includes("home")}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.touched.serviceType && formik.errors.serviceType && (
                <p className="text-red-500">{formik.errors.serviceType}</p>
              )}
            </div>
            {/* Login & Submit Button */}
            <div className="w-full flex flex-row justify-end">
              <Button
                className="w-fit hover:shadow-none font-normal px-12 bg-green rounded-full"
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
export default PhysioConnectProfessionalForm;
