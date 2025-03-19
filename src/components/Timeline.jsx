import { FaPlus } from "react-icons/fa";
import { timelineItems } from "../Mock/physioConnectPageData";

export default function Timeline() {
	return (
		<div className="relative bg-transparent text-white p-6 md:p-8 lg:p-10">
			<div className="space-y-12">
				{timelineItems.map((item, index) => (
					<div
						key={index}
						className="flex items-start space-x-8"
					>
						<div className="flex-shrink-0 w-16 h-16 bg-white rounded-lg flex items-center justify-center">
							<FaPlus className="w-2 h-2 text-green" />
							<span className="text-black font-bold text-lg">{item.number}</span>
						</div>
						<div className="flex-grow">
							<h2 className="text-xl md:text-2xl font-bold mb-2">{item.title}</h2>
							<p className="text-sm md:text-base text-gray-300">{item.description}</p>
						</div>
						{index < timelineItems.length - 1 && (
							<div className="absolute left-6 md:left-12 mt-12 w-0.5 h-20 md:h-16 bg-white"></div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
