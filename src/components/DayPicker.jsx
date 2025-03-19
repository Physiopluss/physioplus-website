import moment from "moment";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import { fetchBookedSlot } from "../api/booking";
import { useDispatch, useSelector } from "react-redux";
import { setBookedSlot, setSelectedDate } from "../slices/bookingSlice";

function DatePicker() {
	const physioData = useSelector((state) => state.physioDetail.physioData);
	const bookingType = useSelector((e) => e.booking.physioBookingType);
	const WorkingDay = physioData[bookingType]?.workingDays;

	function getRemainingDayIndices(inputDays) {
		const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		const inputDaysSet = new Set(inputDays);
		const remainingIndices = [];

		for (let i = 0; i < daysOfWeek.length; i++) {
			if (!inputDaysSet.has(daysOfWeek[i])) {
				remainingIndices.push(i);
			}
		}

		return remainingIndices;
	}

	const remainingIndices = getRemainingDayIndices(WorkingDay);

	const dispatch = useDispatch();
	const defaultClassNames = getDefaultClassNames();
	const physioId = useSelector((e) => e.physioDetail.physioId);
	const selectedDate = useSelector((date) => date.booking.selectedDate);
	let clickedDate;

	const handleClick = (e) => {
		dispatch(setSelectedDate(null));
		clickedDate = moment(e).format("yyyy-MM-DDTHH:mm:ss.SSSSSS");
		dispatch(setSelectedDate(moment(e).format("yyyy-MM-DDTHH:mm:ss.SSSSSS")));
		fetchBookedSlot(physioId, clickedDate)
			.then((e) => {
				dispatch(setBookedSlot(e.data));
			})
			.catch((err) => {
				return err;
			});
	};

	return (
		<DayPicker
			mode="single"
			startMonth={new Date(moment().year(), moment().month())}
			endMonth={new Date(moment().year(), moment().month() + 1)}
			//Only show today to next 7 days
			disabled={[
				{ dayOfWeek: [...remainingIndices] },
				{ before: new Date(moment()), after: new Date(moment().add(7, "days")) },
			]}
			classNames={{
				month: "bg-lightGreen p-2 rounded-2xl",
				today: `text-green font-bold`,
				selected: `bg-green rounded-full text-white`,
				calendar: `${defaultClassNames.calendar} shadow-lg !bg-lightGreen text-black`,
				chevron: ``,
				month_grid: ``,
				day_button: "",
				month_caption: "ps-4 text-xl py-2",
				nav: "fill-green absolute right-2 top-2.5",
			}}
			selected={selectedDate}
			onDayClick={handleClick}
		/>
	);
}

export default DatePicker;
