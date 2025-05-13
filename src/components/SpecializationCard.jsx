import { Button, Card, Typography } from "@material-tailwind/react";

const SpecializationCard = ({ title, description, img, onclickFn }) => {
	return (
		<Card className="min-h-[250px] flex flex-row border-2 border-green rounded-lg p-0.5 shadow-none max-w-[100vw] gap-1  bg-white  mt-6  group hover:bg-green  hover:text-white">
			<img
				loading="lazy"
				src={img}
				alt={"name"}
				className="block  w-1/2 -my-6 ml-6  shadow-none rounded-xl bg-white border-2  object-cover"
			/>

			<div className="w-auto flex flex-col justify-around  pl-2.5 py-2.5 mr-6 ">
				<div className="flex flex-col gap-1">
					<Typography
						variant="h6"
						className="text-2xl font-bold text-black group-hover:text-white"
					>
						{title}
					</Typography>
					<Typography
						variant="h6"
						className="text-lg font-medium text-black group-hover:text-white"
					>
						{description}
					</Typography>
				</div>
				<div
					className="
				flex justify-end"><Button
						onClick={onclickFn}
						className="w-fit py-1.5 px-4  shadow-none  justify-center rounded-full capitalize border-2 border-green hover:shadow-none text-sm font-semibold bg-white  text-black   group-hover:text-white  group-hover:bg-green group-hover:border-white  ease-in-out group-hover:active:bg-white group-hover:active:text-green transition-all duration-200  "
					>
						Book Appointment
					</Button></div>


			</div>
		</Card>
	);
};

export default SpecializationCard;
