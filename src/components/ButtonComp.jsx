import { twMerge } from "tailwind-merge";

const ButtonComp = ({ icon, title, className }) => {
	return (
		<>
			<button
				className={twMerge(
					"text-white border border-green hover:text-green self-center bg-green hover:bg-lightGreen sm:px-8 py-1 sm:py-2 rounded-lg flex items-center my-auto gap-1",
					className
				)}
			>
				{icon && icon} {title}
			</button>
		</>
	);
};


export default ButtonComp;
