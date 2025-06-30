import React from "react";
import { GoDash } from "react-icons/go";

const steps = [
  {
    label: "Personal Details",
    description: "Let's Get to Know You",
  },
  { label: "Professional Details", description: "Showcase Your Expertise" },
  { label: "Business Details", description: "Build Your Vision" },
  { label: "Payment Page", description: "Review & Pay" },
];

const StepIndicator = ({ currentStep }) => {
  return (
    <div>
      {/* Keep your original desktop version but hide on mobile */}
      <div className="rounded-lg p-3 shadow-md w-72 h-[85%] max-h-[400px]  flex-col border-1 mb-5 bg-white hidden md:block">
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
    ${
      currentStep > index + 1
        ? "bg-green border  text-white" // ✅ Passed
        : currentStep > index
        ? "bg-green border border-[#2bcb68] text-white" // 🔘 Current
        : "border-gray-400 bg-white" // ⚪ Upcoming
    }
  `}
              >
                {currentStep > index + 1 ? (
                  <span className="text-xs font-bold">✓</span> // ✅ Passed: show check
                ) : currentStep > index ? (
                  <div className="w-2 h-2 bg-white rounded-sm"></div> // 🔘 Current: show dot
                ) : (
                  <div className="w-2 h-2 bg-gray-500 rounded-sm"></div> // ⚪ Upcoming: show gray dot
                )}
              </span>

              {/* Step Text */}
              <div className="ml-4 text-left">
                <p
                  className={`font-semibold ${
                    currentStep >= index + 1 ? "text-black" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    currentStep >= index + 1 ? "text-black" : "text-gray-400"
                  } `}
                >
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Mobile version */}
      <div className="bg-white p-3 shadow-md rounded-lg w-full mb-5 md:hidden overflow-x-auto">
        <div className="relative w-max flex items-start gap-2 sm:gap-8 px-2">
          {steps.map((step, index) => (
            <div
              key={step.label}
              className="flex flex-col items-center relative z-10 min-w-[56px] sm:min-w-[70px] flex-shrink-0"
            >
              {/* Step Indicator */}
              <span
                className={`z-10 flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 border-2 rounded-md
            ${
              currentStep > index + 1
                ? "bg-green border text-white"
                : currentStep > index
                ? "bg-green border border-[#2bcb68] text-white"
                : "border-gray-400 bg-white"
            }`}
              >
                {currentStep > index + 1 ? (
                  <span className="text-[10px] font-bold">✓</span>
                ) : currentStep > index ? (
                  <div className="w-1.5 h-1.5 bg-white rounded-sm" />
                ) : (
                  <div className="w-1.5 h-1.5 bg-gray-500 rounded-sm" />
                )}
              </span>

              {/* Step Label as vertical/column-styled text */}
              <div className="mt-2 text-center w-full px-1">
                <p
                  className={`text-[10px] sm:text-xs font-semibold break-words whitespace-normal leading-tight ${
                    currentStep >= index + 1 ? "text-black" : "text-gray-500"
                  }`}
                  style={{ wordBreak: "break-word", maxWidth: "60px" }}
                >
                  {step.label}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-[12px] left-full h-[2px] w-5 sm:w-6 z-0 ${
                    currentStep > index + 1 ? "bg-green" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
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

export default StepIndicator;
