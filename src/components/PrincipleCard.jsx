import { Card, Typography } from "@material-tailwind/react";
import { twMerge } from "tailwind-merge";

const PrincipleCard = ({ section, img, title, description, link, buttonText, buttonLink }) => {
	return (
		<Card
			className={`bg-[#E6F4EC]  justify-stretch border border-[#EAEBEC] shadow-none ${
				(section == "physioConnectPayment" && "!pt-4", section == "orderSection" && "!bg-[#FFFFFF]")
			}`}
		>
			<div
				className={`flex flex-row items-center gap-4 px-6 py-4 ${
					(section == "physioConnectPayment" && "flex-col !items-start",
					section == "orderSection" && "flex-col !items-start !gap-1 !py-0 !pt-3 pb-1 !px-3")
				}`}
			>
				<img
					src={img}
					alt={"name"}
					className={`rounded-none rounded-t-lg shadow-none aspect-square  w-8 ${
						(section == "physioConnectPayment" && "w-8 !object-contain",
						section == "physioConnect" && "bg-white p-2 !object-cover !rounded-full")
					}`}
				/>
				<Typography
					variant="h3"
					className={twMerge(`text-xl font-semibold text-black ${section == "physioConnect" && "!text-lg"}`)}
				>
					{title}
				</Typography>
			</div>
			<div
				className={`gap-2 px-6 pb-4 h-full flex flex-col justify-between text-[14px] ${
					section == "orderSection" && "!px-3 !pb-3"
				}`}
			>
				<p>{description}</p>
				{buttonText && (
					<button
						onClick={buttonLink}
						className="flex gap-1 items-center mt-4 w-fit bg-green text-white px-3 py-1 rounded-2xl"
					>
						{buttonText}
					</button>
				)}
			</div>
		</Card>
	);
};
export default PrincipleCard;
