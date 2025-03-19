import { Card, CardBody, Typography } from "@material-tailwind/react";
import moment from "moment/moment";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function BlogCard({ id, title, description, youTubeLink, image, status, views, tags, blogType, date }) {
	const navigate = useNavigate();
	return (
		<Card
			className={"gap-2 border border-[#EAEBEC] shadow-none cursor-pointer text-black items-stretch"}
			onClick={() => navigate(`/blog/${id}`)}
			key={id}
		>
			<img
				src={image}
				alt="card-image"
				className="rounded-md object-cover rounded-t-lg shadow-none w-full h-48"
			/>
			<CardBody className="px-4 pt-2 pb-4 flex flex-1 flex-col gap-1.5 items-stretch justify-stretch">
				<Typography
					variant="h4"
					className="text-lg font-bold "
				>
					{title.slice(0, 40) + "..."}
				</Typography>
				{description && (
					<div
						className="mb-2 text-xs font-normal line-clamp-4"
						dangerouslySetInnerHTML={{
							__html: description.slice(0, 130) + ' <span class="text-green font-semibold">...read more</span>',
						}}
					/>
				)}

				<div className="flex w-full justify-between">
					<Typography
						variant="h6"
						className="text-xs font-base"
					>
						{moment(date).format("ll")}
					</Typography>
					{views && (
						<Typography
							variant="h6"
							className="text-xs font-semibold flex gap-1 items-center"
						>
							<FaEye />
							{views}
						</Typography>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
