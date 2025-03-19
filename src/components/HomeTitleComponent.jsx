import { twMerge } from "tailwind-merge";

const HomeTitleComponent = ({ sectionText, subTitle, title, description, textColor, inlineSubtext,description50 }) => {
	return (
		<div className="mb-8 sm:mb-12 flex flex-col items-center">
			{sectionText && (
				<p className="border bg-[#E6F7F1] font-medium text-center text-sm px-4 py-2 mb-3 sm:mb-4">{sectionText}</p>
			)}
			<div className={`flex flex-col ${inlineSubtext && "lg:flex-row gap-2 justify-center items-center "} `}>
				{title && (
					<h6 className={twMerge(`text-3xl md:text-5xl text-center font-semibold`)}>
						{title.split(" ").map((word, index, array) => (
							<span
								key={index}
								className={`${index >= array.length - 2 ? `text-[#008037]` : `text-${textColor}`}`}
							>
								{word}{" "}
							</span>
						))}
					</h6>
				)}

				{subTitle && (
					<p
						className={twMerge(
							`mt-1 sm:mt-1 text-center text-3xl md:text-5xl font-semibold text-[#008037] ${
								inlineSubtext && "!mt-0 sm:mt-0"
							}`
						)}
					>
						{subTitle}
					</p>
				)}
			</div>
			{description && <p className={twMerge(`mt-4 sm:mt-6 text-center text-lg text-${textColor} ${description50 && "md:w-1/2"}`)}>{description}</p>}
		</div>
	);
};
export default HomeTitleComponent;
