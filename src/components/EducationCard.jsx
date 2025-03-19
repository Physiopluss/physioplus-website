const EducationCard = ({ img, title, description }) => {
	return (
		<div className="flex gap-4 my-4 border border-gray-400 rounded-md px-8 py-4">
			<div className="rounded-md border border-gray-400 p-1 min-w-20 max-w-28 h-fit justify-center items-center">
				<img
					src={img}
					alt={title}
					className="object-contain bg-yellow-600 rounded-md "
				/>
			</div>
			<div className="flex flex-col justify-center gap-1">
				<p className="text-base sm:text-lg font-semibold">{title}</p>
				<p className="text-xs sm:text-sm">{description}</p>
			</div>
		</div>
	);
};
export default EducationCard;
