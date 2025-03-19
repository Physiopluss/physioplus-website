import { twMerge } from "tailwind-merge";
import { IoMdMail } from "react-icons/io";
import { FaPhoneAlt } from "react-icons/fa";

const FeaturesCard = ({ type, icon, title, description, color, email, phone }) => {
	return (
		<div
			className={twMerge(
				"flex flex-col px-4 lg:px-8 py-6 rounded-md  bg-lightGreen gap-1",
				type == "feature" && "items-center",
				type == "founder" && "items-center bg-transparent",
				color == "yellow" && "bg-[#FFF5E7]",
				color == "purple" && "bg-[#E7E7FF]",
				color == "blue" && "bg-[#E7F7FF]"
			)}
		>
			<img
				src={icon}
				alt={title}
				className={twMerge(" self-center mb-4", type == "feature" ? "max-h-12 max-w-12" : "max-h-48 max-w-42")}
			/>
			<p
				className={twMerge(
					"text-green font-bold text-lg text-start",
					type != "feature"
						? "text-black"
						: color == "yellow"
						? "text-yellow-800"
						: color == "purple"
						? "text-purple-800"
						: color == "blue"
						? "text-blue-800"
						: null
				)}
			>
				{title}
			</p>
			<p
				className={twMerge(
					"text-green text-sm font-semibold text-start",
					type != "feature"
						? "text-black"
						: color == "yellow"
						? "text-yellow-800"
						: color == "purple"
						? "text-purple-800"
						: color == "blue"
						? "text-blue-800"
						: null
				)}
			>
				{description}
			</p>
			{email && (
				<p className="font-semibold text-sm flex items-center gap-1  text-wrap">
					<IoMdMail />
					{email}
				</p>
			)}
			{phone && (
				<p className="font-semibold text-sm flex items-center gap-1 text-wrap">
					<FaPhoneAlt />
					+91 {phone}
				</p>
			)}
		</div>
	);
};

export default FeaturesCard;
