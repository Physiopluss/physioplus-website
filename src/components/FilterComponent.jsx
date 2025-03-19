import { Button } from "@material-tailwind/react";
import { useState } from "react";
import { FaChevronDown, FaStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const FilterComponent = ({
	gender,
	setGender,
	setExperience,
	rating,
	setRating,
	language,
	setLanguage,
	mode,
	allSpecialization,
	setSpecializationFilter,
	setSubSpecializationFilter,
	setMode,
	handleClearFilter,
}) => {
	const [openIndex, setOpenIndex] = useState(null);

	return (
		<>
			<div className="flex pb-4 justify-stretch gap-2">
				<Button
					variant="text"
					className="bg-lightGreen text-black font-semibold rounded-full hover:shadow-none flex justify-between gap-4 items-center"
					onClick={handleClearFilter}
				>
					Clear <IoClose className="w-4 h-4" />
				</Button>
				{/* <Button
					className="bg-green text-white font-normal rounded-full hover:shadow-none"
					onClick={fetch}
				>
					Apply
				</Button> */}
			</div>

			{/* Gender Selection */}
			<div className="border-b border-gray-200 pb-3">
				<div className="flow-root">
					<button className="group flex w-full items-center justify-between bg-white py-2 text-sm text-gray-400 hover:text-gray-500">
						<span className="font-medium text-base text-gray-900">Gender</span>
					</button>
				</div>
				<div className="space-y-4 pt-1.5">
					<div className="flex items-center">
						<input
							id="gender-men"
							name="gender-men"
							value="male"
							type="radio"
							checked={gender === "1"}
							onChange={() => setGender("1")}
							className="cursor-pointer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label
							htmlFor="gender-men"
							className="cursor-pointer ml-3 text-sm text-gray-600"
						>
							Men
						</label>
					</div>
					<div className="flex items-center">
						<input
							id="gender-women"
							name="gender-women"
							value="women"
							type="radio"
							checked={gender === "0"}
							onChange={() => setGender("0")}
							className="cursor-pointer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label
							htmlFor="gender-women"
							className="cursor-pointer ml-3 text-sm text-gray-600"
						>
							Women
						</label>
					</div>
				</div>
			</div>

			{/*New Specialization Selection */}
			<div className="py-3">
				<div className="flow-root">
					<button className="group flex w-full items-center justify-between bg-white py-2 text-sm text-gray-400 hover:text-gray-500">
						<span className="font-medium text-base text-gray-900">Speciality</span>
					</button>
				</div>
				{allSpecialization?.map((specialisation, index) => (
					<div
						key={index}
						className="border-b border-gray-200"
					>
						<button
							className="flex w-full items-center justify-between py-3 text-left text-sm font-medium"
							onClick={() => {
								const newIndex = openIndex === index ? null : index;
								setOpenIndex(newIndex);
								if (newIndex !== null) {
									setSpecializationFilter(specialisation._id);
									setSubSpecializationFilter([]);
								} else {
									setSpecializationFilter("");
									setSubSpecializationFilter([]);
								}
							}}
						>
							{specialisation.name}
							<FaChevronDown className={`h-3 w-3 transition-transform ${openIndex === index ? "rotate-180" : ""}`} />
						</button>
						{openIndex === index && specialisation.subSpecializations.length > 0 && (
							<div className="pb-3">
								{specialisation?.subSpecializations?.map((subSpecializations, subIndex) => (
									<div
										key={subIndex}
										className="flex items-center space-x-2 py-1"
									>
										<input
											type="checkbox"
											id={`${index}-${subIndex}`}
											className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											onChange={(e) => {
												if (e.target.checked) {
													setSubSpecializationFilter((prev) => [...prev, subSpecializations._id]);
												} else {
													setSubSpecializationFilter((prev) => prev.filter((id) => id !== subSpecializations._id));
												}
											}}
										/>
										<label
											htmlFor={`${index}-${subIndex}`}
											className="text-sm font-normal"
										>
											{subSpecializations.name}
										</label>
									</div>
								))}
							</div>
						)}
					</div>
				))}
			</div>

			{/* Consult Type Selection */}
			<div className="border-b border-gray-200 py-3">
				<div className="flow-root">
					<button className="group flex w-full items-center justify-between bg-white py-2 text-sm text-gray-400 hover:text-gray-500">
						<span className="font-medium text-base text-gray-900">Consult Type</span>
					</button>
				</div>
				<div className="space-y-4 pt-1.5">
					<div className="flex items-center">
						<input
							id="mode-home"
							name="mode-home"
							value="home"
							type="checkbox"
							checked={mode.includes("home")}
							onChange={(e) => {
								setMode((prev) =>
									prev.includes(e.target.value) ? prev.filter((m) => m !== e.target.value) : [...prev, e.target.value]
								);
							}}
							className="cursor-pointer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label
							htmlFor="mode-home"
							className="cursor-pointer ml-3 text-sm text-gray-600"
						>
							Home
						</label>
					</div>
					<div className="flex items-center">
						<input
							id="mode-clinic"
							name="mode-clinic"
							value="clinic"
							type="checkbox"
							checked={mode.includes("clinic")}
							onChange={(e) => {
								setMode((prev) =>
									prev.includes(e.target.value) ? prev.filter((m) => m !== e.target.value) : [...prev, e.target.value]
								);
							}}
							className="cursor-pointer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label
							htmlFor="mode-clinic"
							className="cursor-pointer ml-3 text-sm text-gray-600"
						>
							Clinic
						</label>
					</div>
				</div>
			</div>

			{/* language */}
			{/* <div className="border-b border-gray-200 py-3">
				<div className="flow-root">
					<button className="group flex w-full items-center justify-between bg-white py-2 text-sm text-gray-400 hover:text-gray-500">
						<span className="font-medium text-base text-gray-900">Language</span>
					</button>
				</div>
				<div className="space-y-4 pt-1.5">
					{["hindi", "english", "other"].map((lang) => (
						<div
							key={lang}
							className="flex items-center"
						>
							<input
								id={`language-${lang}`}
								name={`language-${lang}`}
								value={lang}
								type="checkbox"
								checked={language.includes(lang)}
								onChange={() =>
									setLanguage((prev) => (prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]))
								}
								className="cursor-pointer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
							/>
							<label
								htmlFor={`language-${lang}`}
								className="ml-3 text-sm text-gray-600 cursor-pointer"
							>
								{lang.charAt(0).toUpperCase() + lang.slice(1)}
							</label>
						</div>
					))}
				</div>
			</div> */}

			{/* rating */}
			<div className="border-b border-gray-200 py-3">
				<div className="flow-root">
					<button className="group flex w-full items-center justify-between bg-white py-2 text-sm text-gray-400 hover:text-gray-500">
						<span className="font-medium text-base text-gray-900">Rating</span>
					</button>
				</div>
				<div className="space-y-4 pt-1.5">
					{[5, 4, 3, 2, 1].map((star) => (
						<div
							key={star}
							className="flex items-center space-x-3"
						>
							<input
								id={`rating-${star}`}
								name={`rating-${star}`}
								value={star}
								type="checkbox"
								checked={rating.includes(star)}
								onChange={() =>
									setRating((prev) => (prev.includes(star) ? prev.filter((r) => r !== star) : [...prev, star]))
								}
								className="cursor-pointer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
							/>
							<label
								htmlFor={`rating-${star}`}
								className="flex items-center text-sm text-gray-600 cursor-pointer"
							>
								<div className="flex items-center gap-0.5">
									{Array.from({ length: 5 }).map((_, i) => (
										<FaStar
											key={i}
											className={i < star ? "text-green" : "text-gray-300"}
										/>
									))}
								</div>
							</label>
						</div>
					))}
				</div>
			</div>

			{/* experience */}
			<div className="border-b border-gray-200 py-3">
				<div className="flow-root">
					<button className="group flex w-full items-center justify-between bg-white py-2 text-sm text-gray-400 hover:text-gray-500">
						<span className="font-medium text-base text-gray-900 cursor-pointer">Experience</span>
					</button>
				</div>
				<div className="space-y-4 pt-1.5">
					<div className="flex items-center">
						<input
							id="experience-0-5"
							name="experience"
							value="0-5"
							type="radio"
							onChange={(e) => setExperience(e.target.value)}
							className="cursor-pointer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label
							htmlFor="experience-0-5"
							className="ml-3 text-sm text-gray-600 cursor-pointer"
						>
							0 - 5 Years
						</label>
					</div>
					<div className="flex items-center">
						<input
							id="experience-5-10"
							name="experience"
							value="5-10"
							type="radio"
							onChange={(e) => setExperience(e.target.value)}
							className="cursor-pointer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label
							htmlFor="experience-5-10"
							className="ml-3 text-sm text-gray-600 cursor-pointer"
						>
							5 - 10 Years
						</label>
					</div>
					<div className="flex items-center">
						<input
							id="experience-10-100"
							name="experience"
							value="10-100"
							type="radio"
							onChange={(e) => setExperience(e.target.value)}
							className="cursor-pointer h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
						/>
						<label
							htmlFor="experience-10-100"
							className="ml-3 text-sm text-gray-600 cursor-pointer"
						>
							10+ Years
						</label>
					</div>
				</div>
			</div>
		</>
	);
};
export default FilterComponent;
