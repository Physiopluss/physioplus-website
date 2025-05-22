import ReactGA from "react-ga4";
import { GoArrowLeft } from "react-icons/go";

import {
  Button,

  Input,

} from "@material-tailwind/react";

import { useEffect, useRef, useState } from "react";
import {
  getPhysioDataPhysioConnectApi,
  locationUsingPincode,
  physioConnectDegreeApi,
  physioConnectProfessionalApi,
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
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setDegreeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
      MPT: "",
      experience: "",
      iapMember: "",
      iapNumber: "",
      iapImage: null, // Added for image upload
    },
    validationSchema: Yup.object().shape({
      iapMember: Yup.boolean().required("IAP is required"),
      iapNumber: Yup.string(),
      iapImage: Yup.mixed()
        .nullable()
      , // Validation for image
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
      MPT: Yup.boolean().required(
        "check yes or no is required"
      ),
      experience: Yup.string().required("experience is required"),
    }),
    onSubmit: (values) => {
      const {
        degree,
        specialization,
        experience,
        MPT,
        serviceType,
        iapMember,
        iapNumber,
      } = values;
      if (degree?.length == 0) return toast.error("Degree is Required");
      if (specialization?.length == 0)
        return toast.error("Specialization is required");
      if (serviceType?.length == 0)
        return toast.error("Please select treatment type");
      else {
        physioConnectProfessionalApi({
          degree,
          specialization,
          experience,
          MPT,
          serviceType,
          iapMember,
          iapNumber,
          physioConnectPhysioId,
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
        formik.setFieldValue("iapMember", false);
      } else {
        formik.setFieldValue("iapMember", true);
      }
    }

    // setting IAP Number from database
    if (
      oldPhysioData &&
      oldPhysioData.iapNumber != null &&
      oldPhysioData.iapNumber != undefined
    ) {
      formik.setFieldValue("iapNumber", oldPhysioData.iapNumber);
    }
    //  setting MPT from database
    if (
      oldPhysioData &&
      oldPhysioData.MPT != null &&
      oldPhysioData.MPT != undefined
    ) {
      formik.setFieldValue(
        "MPT",
        oldPhysioData.MPT
      );
    }

    // setting experience from database
    if (
      oldPhysioData &&
      oldPhysioData.experience != null &&
      oldPhysioData.experience != undefined
    ) {
      formik.setFieldValue("experience", oldPhysioData.experience);
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
      <div className="flex flex-col md:flex-row gap-4 bg-[#FFFDF5] px-2 py-4  justify-center mx-4 md:mx-8 lg:mx-16">
        {/* Left side - Card */}
        <div className="flex-1 flex justify-center">
          <StepIndicator currentStep={2} />
        </div>

        {/* Right side - Form */}
        <div className="w-full max-w-6xl mx-auto border border-gray-200 rounded-lg bg-white px-12 py-8">
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-4 flex-1 max-w-screen-lg"
          >
            <h6 className="font-semibold text-3xl">Professional Details</h6>
            <p className="text-sm font-semibold text-gray-700">Fill in your professional details below</p>

            {/* Degree Section */}
            <div className="flex flex-col gap-2">
              <label htmlFor="degree" className="text-sm font-semibold">
                Select Degree
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
                  <div ref={dropdownRef} className="absolute z-10 w-full bg-white shadow-md rounded-md p-2 mt-1 border max-h-60 overflow-y-auto">
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
                            onChange={() => { }}
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
            {/* MPT Section */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold">
                Have you completed MPT?
              </label>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="MPT"
                    value="true"
                    checked={formik.values.MPT === true}
                    onChange={() => formik.setFieldValue("MPT", true)}
                    className="accent-black"
                  />
                  <span className="text-sm">Yes</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="MPT"
                    value="false"
                    checked={formik.values.MPT === false}
                    onChange={() => formik.setFieldValue("MPT", false)}
                    className="accent-black"
                  />
                  <span className="text-sm">No</span>
                </label>
              </div>

              {formik.touched.MPT && formik.errors.MPT && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.MPT}</div>
              )}
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
                  <div ref={dropdownRef} className="absolute z-10 w-full bg-white shadow-md rounded-md p-2 mt-1 border max-h-60 overflow-y-auto">
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

            {/* work exp.  */}

            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="experience" className="text-sm font-semibold ">
                  Experience (in years)
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

            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="iapMember" className="text-sm font-semibold">
                Are you registered with IAP?
              </label>

              <select
                id="iapMember"
                name="iapMember"
                value={formik.values.iapMember === "" ? "" : formik.values.iapMember.toString()}
                onChange={(e) => {
                  const value = e.target.value === "true";
                  formik.setFieldValue("iapMember", value);

                  // Reset related fields if "No" is selected
                  if (!value) {
                    formik.setFieldValue("iapMember", false);
                    formik.setFieldValue("iapNumber", ""); // Reset IAP number
                    formik.setFieldValue("iapImage", []); // Reset uploaded images
                  }
                }}
                className="border border-gray-300 rounded-md px-3 py-2 w-full cursor-pointer focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white"
              >
                <option value="" disabled hidden>
                  Select an option
                </option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>

              {formik.touched.iapMember && formik.errors.iapMember && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.iapMember}</div>
              )}
            </div>


            {formik.values.iapMember === true && (
              <>
                {/* IAP Number Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="iapNumber" className="text-sm font-semibold">
                    Enter your IAP Number
                  </label>
                  <Input
                    size="md"
                    name="iapNumber"
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
                {/* <div>
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
                {/* {formik.values.iapImages && formik.values.iapImages.length > 0 && (
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
</div> */}

              </>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="serviceType" className="text-sm font-semibold">
                Select Service Type
              </label>
              <div className="flex gap-2 mt-2">
                <label className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                  <input
                    type="checkbox"
                    name="serviceType"
                    value="clinic"
                    checked={formik.values.serviceType.includes("clinic")}
                    onChange={formik.handleChange}
                    className="w-4 h-4"
                  />
                  Clinic
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                  <input
                    type="checkbox"
                    name="serviceType"
                    value="home"
                    checked={formik.values.serviceType.includes("home")}
                    onChange={formik.handleChange}
                    className="w-4 h-4"
                  />
                  Home Care
                </label>

              </div>
              {formik.touched.serviceType && formik.errors.serviceType && (
                <p className="text-red-500">{formik.errors.serviceType}</p>
              )}
            </div>
            {/* submit  btn */}
            <div className="w-full flex flex-row justify-between items-center mt-4 gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-black hover:text-green font-medium flex items-center gap-1 text-sm sm:text-base"
              >
                <GoArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Go Back
              </button>
              <Button
                className="w-fit  font-semibold hover:shadow-none  px-6 sm:px-12 bg-green rounded-full py-3 "
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
