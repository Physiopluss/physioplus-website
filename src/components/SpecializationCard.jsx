import { Button, Card, Typography } from "@material-tailwind/react";

const SpecializationCard = ({ title, description, img, onclickFn }) => {
	return (
		<Card className="min-h-[280px] flex !flex-row border border-[#EAEBEC] rounded-lg p-0.5 shadow-none max-w-[100vw] gap-1">
			<img
				loading="lazy"
				src={img}
				alt={"name"}
				className="block w-1/2 rounded-lg object-cover shadow-none"
			/>

			<div className="w-1/2 flex flex-col justify-around px-2.5 py-2.5 overflow-hidden">
				<Typography
					variant="h6"
					className="text-xl font-bold text-black "
				>
					{title}
				</Typography>
				<Typography
					variant="h6"
					className="text-base font-medium text-black"
				>
					{description}
				</Typography>

				<Button
					onClick={onclickFn}
					className="w-fit py-2.5 px-5 bg-green shadow-none justify-center rounded-full capitalize hover:shadow-none text-base font-semibold"
				>
					Book Appointment
				</Button>
			</div>
		</Card>
	);
};

export default SpecializationCard;
