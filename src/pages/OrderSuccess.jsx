import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
const OrderSuccess = () => {
	const location = useLocation();
	const { physioName, Date,
		timeInString } = location.state || {};



	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
			<div className="bg-[#FFFCF0] rounded-xl shadow-xl p-8 flex flex-col items-center gap-4 w-[90%] max-w-md">
				<img src="./success.png" alt="success" className="w-12 h-12" />
				<p className="text-xl text-center font-semibold">
					Your appointment has been <br />
					successfully booked
				</p>
				<p className="text-sm text-center ">
					You booked an appointment with {physioName} on {Date}, at {timeInString}
				</p>
				<Link
					to="/order-history"
					className="bg-green border-2 border-white rounded-full w-full py-2 text-white text-sm flex justify-center items-center text-center"
				>
					Go to my bookings
				</Link>
			</div>
		</div>
	);
};

export default OrderSuccess;
