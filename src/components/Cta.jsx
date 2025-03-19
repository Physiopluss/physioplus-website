import { BsWhatsapp } from "react-icons/bs";
import { Button } from "react-day-picker";

const Cta = () => {
	return (
		<a
			href="https://wa.me/+918107333576"
			target="_blank"
			rel="noreferrer"
			className="inline-block fixed bottom-8 right-8 z-10"
		>
			<Button className="bg-green cursor-pointer border-2 rounded-full p-4 sm:px-4 sm:py-4 z-10">
				<BsWhatsapp className="text-white" />
			</Button>
		</a>
	);
};
export default Cta;
