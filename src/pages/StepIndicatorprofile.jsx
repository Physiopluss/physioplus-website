import React, { useRef, useState } from "react";
import { GoDash } from "react-icons/go";
import { getPresignedUrl, uploadFileToS3 } from "../api/physioConnect";
import { usePhysio } from "../context/PhysioContext";
import toast from "react-hot-toast";

const steps = [{
  label: "Personal Details",
  description: "Let's Get to Know You",
}, { label: "Professional Details", description: "Showcase Your Expertise", }, { label: "Business Details", description: "Build Your Vision", }, { label: "Review Profile", description: "Details are up to date", }];



const StepIndicatorprofile = ({ currentStep, showProfilePic = true }) => {
  const { updatePhysioData, physioData } = usePhysio();
  const [preview, setPreview] = useState(physioData?.profileImage || "/mockPhysioMale.png");
  const fileInputRef = useRef(null);



  const onImageChange = async (file) => {
    console.log("Received image file:", file);
    const folder = "PhysioApps/physio"; // folder in your S3 bucket

    try {
      // Step 1: Get a presigned URL
      const { uploadUrl, fileUrl, fileKey } = await getPresignedUrl(file, folder);

      // Step 2: Upload the file to S3
      await uploadFileToS3(file, uploadUrl);

      console.log("File successfully uploaded to S3:", fileUrl);

      // Step 3: Send the file info to update Physio profile
      updatePhysioData({
        ...physioData,
        profileImage: fileUrl,
      });

      setPreview(fileUrl);

      toast.success("Profile image updated successfully!");
    } catch (error) {
      console.error("Error uploading image or updating profile:", error);
      toast.error("Failed to upload image or update profile.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && typeof onImageChange === 'function') {
      onImageChange(file);
    } else {
      console.warn("onImageChange is not a function");
    }
  };


  return (
    <div>
      {/* Keep your original desktop version but hide on mobile */}
      {showProfilePic && (
        <div className="rounded-lg p-3  w-72  flex-col  mb-5 bg-white border-2  border-gray-300 hidden md:flex">
          <div
            className="relative flex-row flex justify-start items-center gap-4 cursor-pointer group"
            onClick={() => fileInputRef.current.click()}
          >
            <img
              src={preview}
              alt="Profile"
              className="w-20 h-20 p-2 rounded-full object-cover border-2 border-green"
            />
            <div className="flex flex-col">
              <p className="text-black text-sm font-medium">Change Profile Pic</p>
              <p className="text-gray-600 text-sm">Tap to edit</p>
            </div>

            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition items-center justify-center hidden md:flex">
              <p className="text-white text-xs">Change</p>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

      )}


      <div className="rounded-lg p-3 border-2  border-gray-300 w-72 h-[85%] max-h-[400px]  flex-col border-1 mb-5 bg-white hidden md:block">
        <ol className="relative space-y-9 mt-4 p-2 mb-6">
          {steps.map((step, index) => (
            <li key={step.label} className="relative flex items-start py-1">
              {/* Vertical Line */}
              {index !== steps.length - 1 && (
                <span
                  className={`absolute left-[12px] top-[36px] w-[2px] h-[52px] 
      ${currentStep >= index + 2 ? "bg-[#2bcb68]" : "bg-gray-300"}`}
                />
              )}


              {/* Step Indicator */}
              <span
                className={`relative z-10 flex items-center justify-center w-6 h-6 border-2 rounded-md 
    ${currentStep > index + 1
                    ? "bg-green border  text-white"     // ✅ Passed
                    : currentStep > index
                      ? "bg-green border border-[#2bcb68] text-white"     // 🔘 Current
                      : "border-gray-400 bg-white"                        // ⚪ Upcoming
                  }
  `}
              >
                {currentStep > index + 1 ? (
                  <span className="text-xs font-bold">✓</span>  // ✅ Passed: show check
                ) : currentStep > index ? (
                  <div className="w-2 h-2 bg-white rounded-sm"></div> // 🔘 Current: show dot
                ) : (
                  <div className="w-2 h-2 bg-gray-500 rounded-sm"></div> // ⚪ Upcoming: show gray dot
                )}
              </span>


              {/* Step Text */}
              <div className="ml-4 text-left">
                <p className={`font-semibold ${currentStep >= index + 1 ? "text-black" : "text-gray-500"}`}>
                  {step.label}
                </p>
                <p className={`text-sm font-semibold ${currentStep >= index + 1 ? "text-black" : "text-gray-400"} `}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>


      {/* Mobile version */}
      <div className="bg-white p-4 shadow-md rounded-lg w-full mb-5 md:hidden overflow-x-auto">
        <div className="flex flex-row items-start gap-6 relative whitespace-nowrap">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="flex flex-col items-center relative z-10 min-w-[80px] flex-shrink-0"
            >
              {/* Step Indicator */}
              <span
                className={`relative z-10 flex items-center justify-center w-6 h-6 border-2 rounded-md 
            ${currentStep > index + 1
                    ? "bg-green border text-white"
                    : currentStep > index
                      ? "bg-green border border-[#2bcb68] text-white"
                      : "border-gray-400 bg-white"
                  }
          `}
              >
                {currentStep > index + 1 ? (
                  <span className="text-xs font-bold">✓</span>
                ) : currentStep > index ? (
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                ) : (
                  <div className="w-2 h-2 bg-gray-500 rounded-sm"></div>
                )}
              </span>

              {/* Step Label */}
              <div className="mt-2 text-center">
                <p
                  className={`text-xs font-semibold ${currentStep >= index + 1 ? "text-black" : "text-gray-500"
                    }`}
                >
                  {step.label}
                </p>
              </div>

              {/* Horizontal Connector Line */}
              {index < steps.length - 1 && (
                <div className="absolute top-[12px] left-full w-6 h-[2px] bg-gray-300 z-0"></div>
              )}
            </div>
          ))}
        </div>
      </div>


      {/* phone version */}
      {showProfilePic && (
        <div className="rounded-lg p-3  w-full  flex-col  mb-5 bg-white border-2  border-gray-300 flex md:hidden">
          <div
            className="relative flex-row flex justify-start items-center gap-4 cursor-pointer group"
            onClick={() => fileInputRef.current.click()}
          >
            <img
              src={preview}
              alt="Profile"
              className="w-20 h-20 p-2 rounded-full object-cover border-2 border-green"
            />
            <div className="flex flex-col">
              <p className="text-black text-sm font-medium">Change Profile Pic</p>
              <p className="text-gray-600 text-sm">Tap to edit</p>
            </div>

            <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition items-center justify-center hidden md:flex">
              <p className="text-white text-xs">Change</p>
            </div>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

      )}




    </div>


  );
};


// // Usage (Replacing <PhysioConnectRightCard />)
// const ParentComponent = ({ steps, currentStep }) => {
//   return (
//     <div className="flex-1 flex justify-center">
//       <StepperCard steps={steps} currentStep={currentStep} />
//     </div>
//   );
// };

export default StepIndicatorprofile;
