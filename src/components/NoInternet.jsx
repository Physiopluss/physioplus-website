import { useState, useEffect } from "react";

const NoInternet = ({ children }) => {
	// state variable holds the state of the internet connection
	const [isOnline, setOnline] = useState(true);

	// On initization set the isOnline state.
	useEffect(() => {
		setOnline(navigator.onLine);
	}, []);

	// event listeners to update the state
	window.addEventListener("online", () => {
		setOnline(true);
	});

	window.addEventListener("offline", () => {
		setOnline(false);
	});

	// if user is online, return the child component else return a custom component
	if (isOnline) {
		return children;
	} else {
		return (
			<div className="min-h-screen flex flex-col gap-2 justify-center items-center text-3xl">
				<p>No Internet Connection.</p>
				<p> Please try again later.</p>
			</div>
		);
	}
};

export default NoInternet;
