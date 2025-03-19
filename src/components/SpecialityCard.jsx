const SpecialityCard = ({ img, title, description, link }) => {
	return (
		<div className="my-1 max-w-md rounded-xl overflow-hidden bg-white shadow-lg border border-gray-200">
			<div className="relative">
				<img
					src={img}
					alt="Person receiving neck treatment"
					className="rounded-md w-full h-[200px] object-cover"
				/>

				{/* Pill-shaped title container */}
				<div className="absolute bottom-4 left-2">
					<div className="bg-white px-3 py-1 rounded-lg shadow-md">
						<h2 className="text-gray-800 text-sm font-medium">{title} Relief</h2>
					</div>
				</div>
			</div>

			<div className="p-4 space-y-2 flex flex-col justify-between ">
				<p className="text-gray-600 text-sm leading-relaxed overflow-scroll h-[130px]">{description}</p>

				<p
					onClick={link}
					className="cursor-pointer text-green inline-block text-green-600 text-sm font-medium  hover:text-green-700 transition-colors"
				>
					Book Now
				</p>
			</div>
		</div>
	);
};
export default SpecialityCard;
