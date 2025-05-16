import { Card, CardHeader, CardBody, Typography, Avatar } from "@material-tailwind/react";
import { FaStar } from "react-icons/fa6";

const ReviewCard = ({ id, name, img, rating, review, patientType }) => {
	return (
		<Card
			key={id}
			color="transparent"
			shadow={false}
			className="bg-white px-6 py-2 text-black text-wrap overflow-hidden rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 ease-in-out min-h-[220px] max-h-[220px]"
		>
			<CardHeader
				color="transparent"
				floated={false}
				shadow={false}
				className="mx-0 flex items-center gap-4  pt-2 pb-2"
			>

				<div className="flex w-full flex-col gap-0.5">
					<div className="flex flex-col items-start justify-between gap-0.5">
						<Typography
							variant="h5"
							color="blue-gray"
							className="text-lg font-semibold"
						>
							{name}
						</Typography>
						<Typography
							className="text-xs font-medium"
							color="blue-gray"
						>
							1 Yr on PhysioPlus
						</Typography>
					</div>
				</div>
				
				<Avatar
					size="md"
					variant="circular"
					src={img}
					alt={name}
					className="ring-4 ring-gray-300 shadow-md p-0.5 mt-2 mr-2"
				/>
			</CardHeader>
			<CardBody className="flex flex-col gap-4 my-2 p-0 ">


				<Typography className=" text-sm font-normal   text-pretty h-auto pb-2">{review}</Typography>
				<div className="flex items-center justify-end gap-4">
					<div className="flex items-center gap-0.5">
						{Array(rating)
							.fill(rating)
							.map((_, i) => (
								<FaStar
									key={i}
									className="h-3 w-3 text-green"
								/>
							))}
						{Array(5 - rating)
							.fill(5 - rating)
							.map((_, i) => (
								<FaStar
									key={i}
									className="h-3 w-3 text-gray-400"
								/>
							))}
					</div>
					<Typography className="text-xs">2 weeks ago</Typography>
				</div>
			</CardBody>
		</Card>
	);
};

export default ReviewCard;
