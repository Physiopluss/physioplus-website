import { Button } from "@material-tailwind/react";

const TextContainer = ({ title, description, list, buttonTitle, lastText, buttonClickFunction }) => {
	return (
		<>
			<div className="md:w-1/2 flex flex-col text-center md:text-left gap-4 lg:gap-6">
				{title && <h3 className="text-left text-2xl sm:text-3xl md:text-4xl font-bold !leading-snug">{title}</h3>}
				<p className="text-left text-sm lg:text-base font-normal text-zinc-500">{description}</p>
				{list && <ul className="flex flex-col gap-2 text-sm lg:text-base text-left list-outside list-disc">{list}</ul>}
				{lastText && <p className="text-left text-sm lg:text-base font-normal text-zinc-500">{lastText}</p>}
				{buttonTitle && (
					<Button
						onClick={() => buttonClickFunction()}
						className="bg-green w-fit hover:shadow-none rounded-full"
					>
						{buttonTitle}
					</Button>
				)}
			</div>
		</>
	);
};

export default TextContainer;
