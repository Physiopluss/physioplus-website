import { useState } from "react";

const SpecialityCard = ({ img, title, description, link }) => {
	const [flipped, setFlipped] = useState(false);

	return (
		<div
			className="flip-card my-1  rounded-xl cursor-pointer group"
			onClick={() => setFlipped(!flipped)}
		>
			<div className={`flip-card-inner ${flipped ? "rotate" : ""}`}>
				{/* Front Side */}
				<div className="flip-card-front bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden">
					<div className="relative w-full h-full">
						{/* Full-cover image */}
						<img
							src={img}
							alt="Person receiving treatment"
							className="absolute inset-0 w-full h-full object-cover"
						/>

						{/* Full-width transparent overlay for title/button */}
						<div className="absolute bottom-0 left-0 w-full">
							<div className="bg-black/40 backdrop-blur-sm text-white w-full py-2 px-4 text-center ">
								<h2 className="text-md font-medium ">{title} Relief</h2>
							</div>
						</div>
					</div>
				</div>


				{/* Back Side */}
				<div className="flip-card-back bg-green p-6 rounded-xl flex flex-col justify-center ">
					<h2 className=" text-white font-semibold text-xl text-left mb-3 ">{title} Relief</h2>
					<p className="text-sm leading-normal overflow-y-auto  text-white text-left">
						{description}
					</p>
					<div className="flex flex-row mt-4 ">
						<button
							onClick={(e) => {
								e.stopPropagation(); // Prevent click from flipping again
								link();
							}}
							className="text-green-600 text-sm font-medium  px-2 py-1 text-green transition-colors bg-white "
						>
							Book Now
						</button>
					</div>

				</div>
			</div>
		</div>
	);
};

export default SpecialityCard;
