// import React, { useEffect, useState } from "react";
// import { Button, Input, Select, Option } from "@material-tailwind/react";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { getPhysioDataById, updatePhysioPersonalApi } from "../../api/physioConnect";
// import StepIndicator from "../../components/StepIndicator";

// const UpdatePersonalProfile = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const physioId = useSelector((state) => state?.physioConnectAuth?.physioId);
//   const [loading, setLoading] = useState(true);

//   const formik = useFormik({
//     initialValues: {
//       fullName: "",
//       gender: "",
//       dob: "",
//       email: "",
//       phone: "",
//       about: "",
//       selectedTraits: [],
//       customDescription: ""
//     },
//     validationSchema: Yup.object().shape({
//       fullName: Yup.string().required("Name is required"),
//       gender: Yup.string().required("Gender is required"),
//       dob: Yup.string().required("Date of Birth is required"),
//       email: Yup.string().email("Invalid email").required("E-mail is required"),
//       phone: Yup.string()
//         .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
//         .required("Contact is required"),
//       about: Yup.string().max(500, "Description cannot exceed 500 characters"),
//     }),
//     onSubmit: (values) => {
//       const updatedData = {
//         fullName: values.fullName,
//         gender: values.gender === "male" ? 1 : 0,
//         dob: values.dob,
//         email: values.email,
//         phone: values.phone,
//         about: values.about,
//         physioConnectPhysioId: physioId,
//       };

//       updatePhysioPersonalApi(updatedData).then((res) => {
//         if (res.status === 200) {
//           toast.success("Profile updated successfully!");
//           navigate("/physio-connect/professional-details");
//         } else {
//           toast.error("Failed to update profile.");
//         }
//       });
//     }
//   });

//   useEffect(() => {
//     if (physioId) {
//       getPhysioDataById(physioId).then((res) => {
//         if (res.status === 200) {
//           const data = res.data;
//           formik.setFieldValue("fullName", data.fullName || "");
//           formik.setFieldValue("email", data.email || "");
//           formik.setFieldValue("phone", data.phone || "");
//           formik.setFieldValue("dob", data.dob || "");
//           formik.setFieldValue("gender", data.gender === 1 ? "male" : "female");
//           formik.setFieldValue("about", data.about || "");
//           formik.setFieldValue("customDescription", data.about || "");
//         }
//         setLoading(false);
//       });
//     }
//   }, [physioId]);

//   const traits = ["Passionate", "Hard working", "Dedicated", "Experienced", "Patient-focused"];

//   return (
//     <div className="px-4 py-6 max-w-4xl mx-auto">
//       <StepIndicator currentStep={1} />
//       <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow-md mt-4">
//         <h2 className="text-2xl font-bold mb-6">Update Personal Details</h2>

//         {/* Full Name, Email, Phone */}
//         <div className="flex flex-col md:flex-row gap-4 mb-4">
//           <div className="flex-1">
//             <label htmlFor="fullName" className="block text-sm font-medium">Full Name</label>
//             <Input
//               name="fullName"
//               id="fullName"
//               value={formik.values.fullName}
//               onChange={formik.handleChange}
//               placeholder="Full Name"
//             />
//             {formik.touched.fullName && formik.errors.fullName && (
//               <p className="text-red-500 text-sm">{formik.errors.fullName}</p>
//             )}
//           </div>

//           <div className="flex-1">
//             <label htmlFor="email" className="block text-sm font-medium">Email</label>
//             <Input
//               name="email"
//               id="email"
//               value={formik.values.email}
//               onChange={formik.handleChange}
//               placeholder="Email"
//             />
//             {formik.touched.email && formik.errors.email && (
//               <p className="text-red-500 text-sm">{formik.errors.email}</p>
//             )}
//           </div>

//           <div className="flex-1">
//             <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
//             <Input
//               name="phone"
//               id="phone"
//               value={formik.values.phone}
//               onChange={formik.handleChange}
//               placeholder="Phone"
//             />
//             {formik.touched.phone && formik.errors.phone && (
//               <p className="text-red-500 text-sm">{formik.errors.phone}</p>
//             )}
//           </div>
//         </div>

//         {/* Gender and DOB */}
//         <div className="flex flex-col md:flex-row gap-4 mb-4">
//           <div className="flex-1">
//             <label className="block text-sm font-medium">Gender</label>
//             <Select
//               value={formik.values.gender}
//               onChange={(val) => formik.setFieldValue("gender", val)}
//             >
//               <Option value="male">Male</Option>
//               <Option value="female">Female</Option>
//               <Option value="other">Other</Option>
//             </Select>
//             {formik.touched.gender && formik.errors.gender && (
//               <p className="text-red-500 text-sm">{formik.errors.gender}</p>
//             )}
//           </div>

//           <div className="flex-1">
//             <label htmlFor="dob" className="block text-sm font-medium">Date of Birth</label>
//             <Input
//               type="date"
//               name="dob"
//               id="dob"
//               value={formik.values.dob}
//               onChange={formik.handleChange}
//             />
//             {formik.touched.dob && formik.errors.dob && (
//               <p className="text-red-500 text-sm">{formik.errors.dob}</p>
//             )}
//           </div>
//         </div>

//         {/* About Section */}
//         <div className="mb-4">
//           <label htmlFor="about" className="block text-sm font-medium">About</label>

//           <div className="flex flex-wrap gap-2 my-2">
//             {traits.map((trait) => (
//               <button
//                 key={trait}
//                 type="button"
//                 onClick={() => {
//                   if (!formik.values.selectedTraits.includes(trait)) {
//                     const newTraits = [...formik.values.selectedTraits, trait];
//                     formik.setFieldValue("selectedTraits", newTraits);
//                     formik.setFieldValue("about", `${newTraits.join(" ")} ${formik.values.customDescription}`.trim());
//                   }
//                 }}
//                 className={`px-3 py-1 text-sm rounded-full border ${
//                   formik.values.selectedTraits.includes(trait)
//                     ? "bg-green-100 border-green-500 text-green-800"
//                     : "border-gray-300 hover:bg-gray-100"
//                 }`}
//               >
//                 {trait}
//               </button>
//             ))}
//           </div>

//           <textarea
//             rows="4"
//             className="w-full p-2 border border-gray-300 rounded-md"
//             placeholder="Enter additional description..."
//             value={formik.values.customDescription}
//             onChange={(e) => {
//               const val = e.target.value;
//               formik.setFieldValue("customDescription", val);
//               formik.setFieldValue("about", `${formik.values.selectedTraits.join(" ")} ${val}`.trim());
//             }}
//           />

//           {formik.touched.about && formik.errors.about && (
//             <p className="text-red-500 text-sm">{formik.errors.about}</p>
//           )}
//         </div>

//         {/* Submit */}
//         <div className="flex justify-end">
//           <Button type="submit" className="bg-green rounded-full px-6 py-2">
//             Update & Next
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdatePersonalProfile;
