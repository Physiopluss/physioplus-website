import { Button } from "@material-tailwind/react";
import { MdLocationPin, MdMail, MdPhoneInTalk } from "react-icons/md";

const PhysioConnectRightCard = () => {
	return (
		<div className="h-fit flex flex-col gap-4 bg-white px-4 py-4 border rounded-md w-full md:max-w-60 lg:max-w-sm xl:max-w-sm">
			<p className="text-lg font-semibold">Find Us Here</p>
			<p className="flex items-center gap-2">
				<MdLocationPin className="min-w-4 h-4" />
				109, 1st Floor, Sankalp Tower, Khatipura Road, Jaipur
			</p>
			<p className="flex items-center gap-2">
				<MdPhoneInTalk className="min-w-4 h-4" />
				+91 8107333576
			</p>
			<p className="flex text-wrap items-center gap-2">
				<MdMail className="min-w-4 h-4" />
				<p className="text-wrap">info@physioplushealthcare .com</p>
			</p>
			<Button className="font-normal text-sm sm:text-base rounded-full w-full bg-green text-white hover:shadow-none px-8 py-2 capitalize">
				Call Us Now
			</Button>
			<hr className="border-gray-200 my-2" />
			<p className="flex items-center gap-2">
				<MdPhoneInTalk className="min-w-4 h-4" />
				Guaranteed 100% Patient Referral – At Least 10 New Patients in the Coming Months!
			</p>
			{/* <p className="flex items-center gap-2">
        <MdPhoneInTalk className="min-w-4 h-4" />
        Not Satisfied? Get a 100% Refund – No Questions Asked!
    </p> */}
		</div>
	);
};
export default PhysioConnectRightCard;
