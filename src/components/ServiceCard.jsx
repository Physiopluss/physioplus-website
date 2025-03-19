const ServiceCard = ({ number, text }) => {
	return (
		<div className="pt-4 md:mt-0 flex flex-col items-center">
			<div className="text-5xl text-transparent inline-block bg-clip-text bg-gradient-to-r from-[#6CB300] to-[#2E4D00]  font-bold mb-1">
				{number}
			</div>
			<div className="text-black text-2xl">{text}</div>
		</div>
	);
};
export default ServiceCard;
