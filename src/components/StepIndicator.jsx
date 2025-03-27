import React from "react";
import { GoDash } from "react-icons/go";

const steps = [{ label: "Personal Details",
	description:"Let's Get to Know You",
 }, { label: "Professional Details" ,	description:"Showcase Your Expertise",}, { label: "Business Details",	description:"Build Your Vision", }, { label: "Payment Page",	description:"Review & Pay", }];

const StepIndicator = ({ currentStep }) => {
	return (
		<div className="bg-white rounded-lg p-3 shadow-md w-72 h-[85%] max-h-[400px] flex flex-col border-1 mb-5">
  <ol className="relative space-y-9 mt-4 p-2 mb-6">
    {steps.map((step, index) => (
      <li key={step.label} className="relative flex items-start py-1">
        {/* Vertical Line */}
        {index !== steps.length - 1 && (
          <span className="absolute left-[12px] top-7 w-[2px] h-20 bg-gray-300"></span>
        )}

        {/* Step Indicator */}
        <span
          className={`relative z-10 flex items-center justify-center w-6 h-6 border-2 rounded-md 
            ${currentStep >= index + 1 ? "bg-green border border-green text-white" : "border-gray-400 bg-white"}
          `}
        >
          {currentStep >= index + 1 && <div className="w-3 h-3 bg-white rounded-sm"></div>}
        </span>

        {/* Step Text */}
        <div className="ml-4 text-left">
          <p className={`font-semibold ${currentStep >= index + 1 ? "text-black" : "text-gray-400"}`}>
            {step.label}
          </p>
          <p className="text-sm text-gray-500">{step.description}</p>
        </div>
      </li>
    ))}
  </ol>
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
