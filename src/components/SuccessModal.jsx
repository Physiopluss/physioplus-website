import { Dialog, DialogBody, DialogHeader, Button } from "@material-tailwind/react";
import { useSelector } from "react-redux";

const SuccessModal = ({ title, description, btnOne, btnOneFunction, btnTwo, btnTwoFunction }) => {
	const successModalOpen = useSelector((e) => e.modal.successModalOpen);
	return (
		<Dialog
			size="xs"
			open={successModalOpen}
			className="py-6 px-8 bg-[#FFFDF5] rounded-3xl m-0 z-10"
		>
			<DialogHeader className="relative m-0 block">
				{/* <IconButton
					size="sm"
					variant="text"
					className="!absolute right-3.5 top-3.5 hover:bg-transparent"
					onClick={() => {
						dispatch(setSuccessModalOpen());
					}}
				>
					<IoMdClose className="h-6 w-6 stroke-2" />
				</IconButton> */}
			</DialogHeader>
			<form method="POST">
				<DialogBody className="space-y-4 pb-6">
					<img
						src="/success.png"
						alt=""
						className="w-[60px] h-[60px] mx-auto"
					/>
					<div className="text-3xl font-semibold text-black text-center">{title}</div>
					<div className="text-base font-semibold text-[#858991] text-center">{description}</div>
					<div className="flex gap-4">
						{btnOne && (
							<Button
								className="py-2.5 px-4 w-full text-base font-medium rounded-full text-white hover:shadow-none bg-green"
								onClick={(e) => {
									e.preventDefault();
									btnOneFunction();
								}}
							>
								{btnOne}
							</Button>
						)}
						{btnTwo && (
							<Button
								className="py-2.5 px-4 w-full text-base font-medium rounded-full text-white hover:shadow-none bg-green"
								onClick={(e) => {
									e.preventDefault();
									btnTwoFunction();
								}}
							>
								{btnTwo}
							</Button>
						)}
					</div>
				</DialogBody>
			</form>
		</Dialog>
	);
};
export default SuccessModal;
