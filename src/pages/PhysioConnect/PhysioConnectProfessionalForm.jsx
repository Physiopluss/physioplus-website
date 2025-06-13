import ReactGA from "react-ga4";
import { GoArrowLeft } from "react-icons/go";

import {
  Button,

  Checkbox,

  Input,

} from "@material-tailwind/react";

import { useEffect, useRef, useState } from "react";
import {

  getPhysioDataById,
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

  const [allDegree, setAllDegree] = useState([]);
  const [allSpecialization, setAllSpecialization] = useState([]);
  const [oldPhysioData, setOldPhysioData] = useState(); //if filling form after first time
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [mptDegreeOpen, setMptDegreeOpen] = useState(false);
  const physioConnectPhysioId = useSelector(
    (state) => state?.physioConnectAuth?.physioId
  );
  const [degreeOpen, setDegreeOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownSpRef = useRef(null);
  const dropdownMptRef = useRef(null);



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


    };

    if (open || degreeOpen || mptDegreeOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, degreeOpen, mptDegreeOpen]);

  // google analytics
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: "Physio Connect Professional Form",
    });
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
    };

    fetchOldData();
  }, []);


  const formik = useFormik({
    initialValues: {
      bptDegree: {
        degreeId: "",

      },
      mptDegree: {
        degreeId: "",

      },

      specialization: [],
      experience: "",
      serviceType: [],
      iapMember: "",
      iapNumber: "",
    },
    validationSchema: Yup.object().shape({
      iapMember: Yup.number().required("IAP member is required"),
      iapNumber: Yup.string().when('iapMember', {
        is: 1,
        then: () => Yup.string().required("IAP number is required"),
        otherwise: () => Yup.string().notRequired()
      }),
      bptDegree: Yup.object({
        degreeId: Yup.string().required("BPT Degree is required"),

      }),


      // Validation for image

      specialization: Yup.array().required("Specialization is required"),
      serviceType: Yup.array().required("Service Type is required"),


      experience: Yup.number()
        .typeError("Experience must be a number")
        .required("Experience is required")
        .min(0, "Experience cannot be negative"),
    }),
    onSubmit: (values) => {
      const {
        bptDegree,
        mptDegree,

        specialization,
        experience,
        serviceType,
        iapMember,
        iapNumber,
      } = values;

      if (specialization?.length == 0)
        return toast.error("Specialization is required");
      if (serviceType?.length == 0)
        return toast.error("Please select treatment type");
      else {
        physioConnectProfessionalApi({
          bptDegree: {
            degreeId: bptDegree.degreeId,
          },
          mptDegree: {
            degreeId: mptDegree.degreeId,

          },

          specialization,
          experience,

          serviceType,
          iapMember,
          iapNumber,
          physioConnectPhysioId,
        }).then((res) => {
          if (res.status === 200) {
            toast.success(res.data?.message);
            setTimeout(() => {
              navigate("/physio-connect/business-details");
            }, 1000);
          } else {
            toast.error(res.data?.message);
          }
        });
      }
    },
  });


  useEffect(() => {
    if (oldPhysioData) {
      formik.setValues({


        bptDegree: {
          degreeId: oldPhysioData.bptDegree?.degreeId || "",
        },
        mptDegree: {
          degreeId: oldPhysioData.mptDegree?.degreeId || "",
        },
        specialization: Array.isArray(oldPhysioData.specialization) ? oldPhysioData.specialization : [],
        serviceType: Array.isArray(oldPhysioData.serviceType) ? oldPhysioData.serviceType : [],
        experience: oldPhysioData.workExperience !== undefined ? String(oldPhysioData.workExperience) : "",
        // ensure boolean
        iapMember: Number(oldPhysioData.iapMember) || 0,    // ensure number
        iapNumber: String(oldPhysioData.iapNumber || ""),   // ensure string
      });
    }
  }, [oldPhysioData]);


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
            <label htmlFor="" className="text-sm font-semibold">
              Select Degree
            </label>

            {/* Degree Section */}
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
              {formik.values?.bptDegree?.degreeId?.length > 0 &&
                !formik.values?.mptDegree?.degreeId?.length &&
                formik.values?.specialization?.length === 1 &&
                allSpecialization.find((s) => s.name === "General Physio")?._id === formik.values.specialization[0] && (
                  <p className="text-yellow-900 text-sm font-medium">
                    You selected only BPT. So you only get General Physio.
                  </p>
                )}

              {formik.values?.bptDegree?.degreeId?.length > 0 &&
                formik.values?.mptDegree?.degreeId?.length > 0 && (
                  <p className="text-yellow-900 text-sm font-medium">
                    You can select one more specialization.
                  </p>
                )}

              {formik.touched.specialization && formik.errors.specialization && (
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
