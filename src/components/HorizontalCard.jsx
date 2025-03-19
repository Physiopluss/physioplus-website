import { Card, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const HorizontalCard = ({ section, img, title, description, link }) => {
	const navigate = useNavigate();
	return (
		<Card
			className={twMerge(
				"justify-stretch gap-4 bg-[#FFFDF5] border border-[#EAEBEC] shadow-none w-fit",
				section == "contact" && "w-80 h-full bg-[#F5FAF7]",
				section == "whyChooseUs" && "bg-white",
				section == "physioConnect" && "bg-gradient-to-tl from-100% from-[#16CE67] to-[#012D14] text-white",
				section == "painCard" && "h-[460px]"
			)}
		>
			<img
				src={img}
				alt={"name"}
				className={twMerge(
					"rounded-none object-cover rounded-t-lg shadow-none aspect-square w-full",
					section == "contact" && "w-16 h-16 self-center mt-8",
					section == "physioConnect" && "w-16 h-16 self-center mt-8",
					section != "whyChooseUs" && "max-h-[200px] object-cover",
					section == "whyChooseUs" && "w-16 h-16 self-center mt-8"
				)}
			/>
			<div className="flex flex-col gap-4 px-6 py-4 h-full justify-between">
				<div className="flex flex-col gap-1">
					<Typography
						variant="h3"
						className={twMerge(
							"text-2xl text-black",
							section == "contact" && "text-center !text-xl",
							section == "whyChooseUs" && "text-center !text-xl",
							section == "physioConnect" && "text-center !text-xl text-white"
						)}
					>
						{title}
					</Typography>

					<div
						className={twMerge(
							"text-[14px]",
							section == "contact" && "text-center",
							section == "whyChooseUs" && "text-center",
							section == "physioConnect" && "text-center"
						)}
					>
						{description}
					</div>
				</div>
				{link && (
					<p
						onClick={() => {
							navigate(link);
						}}
						className={`cursor-pointer underline underline-offset-2 shadow-none justify-center rounded-full capitalize hover:shadow-none ${
							section == "painCard" && "text-green"
						}`}
					>
						Book Now
					</p>
				)}
			</div>
		</Card>
	);
};
export default HorizontalCard;
