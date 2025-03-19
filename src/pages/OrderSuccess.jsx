import { useEffect } from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<div className="max-w-[100vw] flex flex-col gap-8 justify-center items-center min-h-[calc(100vh-200px)]">
			<img
				src="./success.png"
				alt="success"
				className="w-12 h-12"
			/>
			<p className="flex flex-col gap-2 items-center justify-center text-xl">
				Appointment Booked Succesfully
				<Link
					to="/order-history"
					className="underline text-green underline-offset-2"
				>
					See Orders
				</Link>
			</p>
		</div>
	);
};
export default OrderSuccess;
