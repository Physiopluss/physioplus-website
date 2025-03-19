import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedSlot } from "../slices/bookingSlice";
import { twMerge } from "tailwind-merge";

const TimeSlot = ({ startTime, endTime, duration }) => {
	const dispatch = useDispatch();
	const bookedSlot = useSelector((date) => date.booking.bookedSlot);
	const selectedDate = useSelector((date) => date.booking.selectedDate);
	const selectedSlot = useSelector((date) => date.booking.selectedSlot);

	const slot = {
		slotInterval: duration,
		openTime: startTime,
		closeTime: endTime,
	};

	const startTimeSlot = moment(slot.openTime, "hh:mm A");
	const endTimeSlot = moment(slot.closeTime, "hh:mm A");
	const currentTime = moment().format("yyyy-MM-DDTHH:mm:ss.SSSSSS"); // "yyyy-MM-DDTHH:mm:ss.SSSSSS"
	const currentDate = moment().format("yyyy-MM-DDTHH:mm:ss.SSSSSS").split("T")[0]; // "yyyy-MM-DD" of today
	const selectedDateInTimeslot = selectedDate.split("T")[0]; // "yyyy-MM-DD" of selected date in daypicker

	const allSlot = [];
	let fiteredSlot = [];
	// making time slot from openTime, closeTime & slotInterval
	while (startTimeSlot <= endTimeSlot) {
		allSlot.push(startTimeSlot.format("hh:mm A"));
		startTimeSlot.add(slot.slotInterval, "minutes");
	}

	// filter currentTime allSlot Array (or Time slot)
	if (selectedDateInTimeslot === currentDate) {
		fiteredSlot = allSlot.filter((time) => {
			const slotTime = moment(time, "hh:mm A");
			return slotTime.isSameOrAfter(currentTime);
		});
	} else {
		fiteredSlot = [...allSlot];
	}

	// filter booked slot from fiteredSlot
	let notbookedAndFilteredSlot = fiteredSlot?.filter(
		(allSlot) => bookedSlot && !bookedSlot?.some((bookedSlot) => allSlot === bookedSlot.timeInString)
	);

	return (
		<>
			{notbookedAndFilteredSlot.map((time, index, row) =>
				index + 1 !== row.length ? (
					<button
						key={index}
						className={twMerge(
							" text-black rounded-md w-24 px-2 py-1",
							selectedSlot == time ? "bg-green text-white" : "border border-gray-400"
						)}
						onClick={(e) => {
							e.preventDefault();
							dispatch(setSelectedSlot(e.target.innerText));
						}}
					>
						{time}{" "}
					</button>
				) : (
					<button
						key={index}
						className="hidden"
					>
						null
					</button>
				)
			)}
		</>
	);
};

export default TimeSlot;
