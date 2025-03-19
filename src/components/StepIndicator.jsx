import React from "react";
import { GoDash } from "react-icons/go";

const steps = [{ label: "Professional Details" }, { label: "Business Details" }, { label: "Work Experiences" }];

const StepIndicator = ({ currentStep }) => {
	return (
		<div className="flex flex-col gap-6 text-center justify-center min-h-56 max-w-[100vw]">
			<h6 className="text-black font-semibold text-3xl">Let's Get Started</h6>
			<p className="text-black font-normal text-base">Provide the necessary information to get started.</p>
			<div className="w-full max-w-2xl mx-auto">
				<ol className="flex flex-row mb-4 md:mb-0 items-center justify-around w-full text-sm font-medium text-center sm:text-base">
					{steps.map((step, index) => (
						<React.Fragment key={step.label}>
							<li className={`flex flex-col md:flex-row w-fit items-center`}>
								<span
									className={`mr-2 w-8 h-8 flex items-center justify-center border rounded-full ${
										currentStep == index + 1
											? "border border-green text-green"
											: index < currentStep
											? "text-white bg-green"
											: "border-gray-400 text-gray-400"
									}`}
								>
									{index + 1}
								</span>
								<span className={`text-nowrap ${currentStep >= index + 1 ? "text-green" : "text-gray-400"}`}>
									{step.label}
								</span>
							</li>
							{index < steps.length - 1 && <GoDash className="md:w-16 font-bold rotate-90 md:rotate-0" />}
						</React.Fragment>
					))}
				</ol>
			</div>
		</div>
	);
};

export default StepIndicator;
