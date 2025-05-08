import { Button } from "@material-tailwind/react";
import { FaArrowLeft } from "react-icons/fa6";
import Navbar from "./Navbar";
import { useRouteError } from "react-router-dom";

const ErrorComp = () => {
	const error = useRouteError();

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />
			<div className="flex-1 bg-white flex items-center justify-center p-4">
				<div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-evenly gap-8">
					<div className="flex-1 max-w-md">
						<p className="text-6xl font-bold text-red-400 mb-2">Error {error?.status} </p>
						<h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
							{error?.status === 404 ? "Page Not Found" : "Internal Server Error"}
						</h1>
						<p className="text-gray-600 text-lg mb-8">
							{error?.status === 404
								? <p>Sorry, the page you’re looking for doesn’t exist.<br/>Here are some helpful links to get you back on track:</p>
								: "Sorry, Server is under maintenance. Please try again later OR check your internet connection"}
						</p>
						<div className="flex gap-4 justify-center md:justify-start">
							<Button
								className="flex gap-2 bg-green text-white"
								onClick={() => window.history.back()}
							>
								<FaArrowLeft className="w-4 h-4" />
								Go back
							</Button>
							<Button
								className="bg-black text-white"
								onClick={() => (window.location.href = "/")}
							>
								Take me home
							</Button>
						</div>
					</div>
					<div className="flex-1 max-w-lg">
						<div className="relative w-full aspect-square">
							<img
								src="./error.png"
								alt="Error"
								className="w-full h-full object-contain"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ErrorComp;
