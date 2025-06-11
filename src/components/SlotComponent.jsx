import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/scrollbar";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setPhysioDetail } from "../slices/physioSlice";
import { setBookedSlot, setPhysioBookingType, setSelectedSlot } from "../slices/bookingSlice";
import { fetchBookedSlot } from "../api/booking";

export default function SlotComponent({ physioData }) {
	let { slug } = useParams();
	const navigate = useNavigate();
	const userToken = useSelector((state) => state?.auth?.user?.userToken);
	const dispatch = useDispatch();
	const [timeSlots, setTimeSlots] = useState([]);

	// get service type
	const service = useMemo(() => {
		return physioData?.serviceType?.filter((type) => type !== "online") || [];
	}, [physioData?.serviceType]);

	const [activeTab, setActiveTab] = useState(service[0]);
	const [WorkingDaySlot, setWorkingDaySlot] = useState([]); // from physioData
	const [selectedDate, setSelectedDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
	const [selectedTime, setSelectedTime] = useState(null);
	const [bookedSlots, setBookedSlots] = useState(null);
	const serviceSelected = activeTab == "home" ? 0 : 1;
	const [isLoadingSlots, setIsLoadingSlots] = useState(false);

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		setSelectedDate(moment(new Date()).format("YYYY-MM-DD"));
		setSelectedTime(null);
		dispatch(setPhysioBookingType(tab));
		dispatch({
			type: "booking/setSelectedDate",
			payload: "",
		});
		dispatch(setSelectedSlot(""));
	};

	const generateTimeSlots = (start, end, duration) => {
		const slots = [];
		let startTime = moment(start, "h:mm A");
		const endTime = moment(end, "h:mm A");
		const now = moment();

		const isToday = selectedDate && moment(selectedDate).isSame(moment(), "day");

		// Generate all possible time slots
		while (startTime < endTime) {
			const timeSlot = startTime.format("hh:mm A");


			console.log("slots", slots);
			// For today, only add future time slots
			if (isToday) {
				const slotTime = moment(selectedDate).set({
					hour: startTime.get("hour"),
					minute: startTime.get("minute"),
				});

				if (slotTime > now) {
					slots.push(timeSlot);
				}
			} else {
				slots.push(timeSlot);
			}

			startTime = startTime.add(duration, "minutes");
		}

		// Filter out booked slots
		if (bookedSlots?.length > 0) {
			return slots.filter((slot) => !bookedSlots.includes(slot));
		}
		return slots;
	};

	const handleDateSlotSelection = (slot) => {
		setSelectedTime(null);
		dispatch(setSelectedSlot(""));
		setSelectedDate(slot);
		setBookedSlots([]); // Clear booked slots when new date is selected
		dispatch({
			type: "booking/setSelectedDate",
			payload: moment(slot).format("YYYY-MM-DDTHH:mm:ss.SSSSSS"),
		});
	};

	const handleTimeSlotSelection = (time) => {
		setSelectedTime(time);
		const selectedDateTime = moment(selectedDate)
			.set({
				hour: moment(time, "hh:mm A").get("hour"),
				minute: moment(time, "hh:mm A").get("minute"),
			})
			.format("YYYY-MM-DDTHH:mm:ss.SSSSSS");

		dispatch(setSelectedSlot(selectedDateTime));
	};

	// set today's slot to redux on component load
	useEffect(() => {
		dispatch({
			type: "booking/setSelectedDate",
			payload: moment(selectedDate).format("YYYY-MM-DDTHH:mm:ss.SSSSSS"),
		});
	}, []);

	// fetch booked slot
	useEffect(() => {
		if (selectedDate) {
			setIsLoadingSlots(true);
			fetchBookedSlot(physioData?._id, moment(selectedDate).format("YYYY-MM-DDTHH:mm:ss.SSSSSS"), serviceSelected)
				.then((e) => {
					dispatch(setBookedSlot(e.data));
					const temp = e.data.map((booking) => booking.timeInString);
					setBookedSlots(temp);
				})
				.catch((err) => {
					return err;
				})
				.finally(() => {
					setIsLoadingSlots(false);
				});
		}
	}, [selectedDate]);

	// set working days
	useEffect(() => {
		const workingDays = physioData?.[activeTab]?.workingDays || [];
		const slots = [];

		for (let i = 0; i < 14; i++) {
			const day = moment().add(i, "days");
			const dayName = day.format("dddd");
			if (workingDays.includes(dayName)) {
				slots.push(day.format("yyyy-MM-DD"));
			}
		}
		setWorkingDaySlot(slots);

		// Auto-select today's date if it's part of working days
		const today = moment().format("yyyy-MM-DD");
		if (slots.includes(today)) {
			setSelectedDate(today);
			dispatch({
				type: "booking/setSelectedDate",
				payload: moment(today).format("YYYY-MM-DDTHH:mm:ss.SSSSSS"),
			});
		}

	}, [activeTab, physioData]);

	// set time slots
	useEffect(() => {
		if (!selectedDate) {
			setTimeSlots([]);
			return;
		}

		if (activeTab === "clinic") {
			const startTime = physioData?.clinic?.timings.start;
			const endTime = physioData?.clinic?.timings.end;
			const duration = physioData?.clinic?.duration;
			setTimeSlots(generateTimeSlots(startTime, endTime, duration));
		} else if (activeTab === "home") {
			const morningStartTime = physioData?.home?.morningTimings.start;
			const morningEndTime = physioData?.home?.morningTimings.end;
			const eveningStartTime = physioData?.home?.eveningTimings.start;
			const eveningEndTime = physioData?.home?.eveningTimings.end;
			const duration = physioData?.home?.duration;
			const morningSlots = generateTimeSlots(morningStartTime, morningEndTime, duration);
			const eveningSlots = generateTimeSlots(eveningStartTime, eveningEndTime, duration);
			setTimeSlots([...morningSlots, ...eveningSlots]);
		}
	}, [activeTab, selectedDate, bookedSlots, physioData]);

	// set physio booking type for first time
	useEffect(() => {
		dispatch(setPhysioBookingType(activeTab));
	}, []);

	return (
		<div className="w-full mx-auto bg-white border rounded-lg p-4 shadow-md ">
			{/* Tabs */}
			<Tabs value={activeTab}>
				<TabsHeader
					className="rounded-none border-b border-gray-400 bg-transparent p-0"
					indicatorProps={{
						className: "bg-transparent border-b-2 border-green shadow-none rounded-none",
					}}
				>
					{service.map((service, index) => (
						<Tab
							key={index}
							value={service}
							onClick={() => handleTabChange(service)}
							className="capitalize"
						>
							{service}
						</Tab>
					))}
				</TabsHeader>
				<TabsBody>
					<TabPanel
						key={"home"}
						value={"home"}
						className="p-0"
					>
						<div className="flex flex-col gap-4 my-4 text-black">
							<div className="flex items-center justify-between gap-4">
								<h2 className="text-lg font-semibold">Home Visit</h2>
								<div className="flex items-center gap-2">
									{/* <span className="text-xl text-green">₹99</span> */}
									<span className="text-base font-semibold text-green">₹ {physioData?.[activeTab]?.charges}</span>
								</div>
							</div>
							<div className="flex gap-2">
								<Swiper spaceBetween={10} slidesPerView="auto" modules={[Navigation, FreeMode, Thumbs]} freeMode={true}>
									{WorkingDaySlot.length === 0 ? (
										<div className="text-sm font-semibold text-red-500 text-center">No Slot Available</div>
									) : (
										WorkingDaySlot.map((slot, index) => (
											<SwiperSlide key={index} style={{ width: "auto" }}>
												<div
													className={`flex flex-col items-center justify-center text-xs font-semibold border border-[#EAEBEC] py-2 px-4 cursor-pointer rounded-xl bg-[#F8FAFC] ${selectedDate === slot ? "bg-green text-white" : "text-black"
														}`}
													onClick={(e) => {
														e.preventDefault();
														handleDateSlotSelection(slot);
													}}
													value={slot}
												>
													<span className="text-sm">{moment(slot).format("ddd")}</span> {/* Day (Mon, Tue, etc.) */}
													<span className="text-lg font-medium">{moment(slot).format("D")}</span> {/* Date (10, 11, etc.) */}
												</div>
											</SwiperSlide>
										))
									)}
								</Swiper>
							</div>
							<div className="flex flex-col gap-2">
								<h3 className="text-base font-medium">Time Slot</h3>
								<div className="w-full">
									<Swiper
										spaceBetween={10}
										slidesPerView="auto"
										modules={[Navigation, FreeMode, Thumbs]}
										freeMode={true}
									>
										{isLoadingSlots ? (
											<div className="text-base font-semibold text-gray-500 text-center">Loading slots...</div>
										) : WorkingDaySlot.length == 0 || timeSlots.length == 0 ? (
											<div className="text-sm font-semibold text-red-500 text-center">No Slot Available</div>
										) : (
											timeSlots.map((time, index) => (
												<SwiperSlide
													key={index}
													style={{ width: "auto" }}
												>
													<div
														onClick={(e) => {
															e.preventDefault();
															handleTimeSlotSelection(time);
														}}
														className={`text-xs font-semibold border border-[#EAEBEC] py-2 px-4 text-nowrap rounded-xl text-center cursor-pointer ${selectedTime === time ? "bg-green text-white" : "bg-[#F8FAFC] text-black"
															}`}
													>
														{time}
													</div>
												</SwiperSlide>
											))
										)}
									</Swiper>
								</div>
							</div>
						</div>
					</TabPanel>
					<TabPanel
						key={"clinic"}
						value={"clinic"}
						className="p-0"
					>
						<div className="flex flex-col gap-4 my-4 text-black">
							<div className="flex items-center justify-between gap-4">
								<h2 className="text-lg font-semibold">Clinic Visit</h2>
								<div className="flex items-center gap-2">
									{/* <span className="text-xl text-green">₹99</span> */}
									<span className="text-base font-semibold text-green">₹ {physioData?.[activeTab]?.charges}</span>
								</div>
							</div>
							<div className="flex gap-2">
								<Swiper spaceBetween={10} slidesPerView="auto" modules={[Navigation, FreeMode, Thumbs]} freeMode={true}>
									{WorkingDaySlot.length === 0 ? (
										<div className="text-sm font-semibold text-red-500 text-center">No Slot Available</div>
									) : (
										WorkingDaySlot.map((slot, index) => (
											<SwiperSlide key={index} style={{ width: "auto" }}>
												<div
													className={`flex flex-col items-center justify-center text-xs font-semibold border border-[#EAEBEC] py-2 px-4 cursor-pointer rounded-xl bg-[#F8FAFC] ${selectedDate === slot ? "bg-green text-white" : "text-black"
														}`}
													onClick={(e) => {
														e.preventDefault();
														handleDateSlotSelection(slot);
													}}
													value={slot}
												>
													<span className="text-sm">{moment(slot).format("ddd")}</span> {/* Day (Mon, Tue, etc.) */}
													<span className="text-lg font-medium">{moment(slot).format("D")}</span> {/* Date (10, 11, etc.) */}
												</div>
											</SwiperSlide>
										))
									)}
								</Swiper>
							</div>
							<div className="flex flex-col gap-2">
								<h3 className="text-base font-medium">Time Slot</h3>
								<div className="w-full">
									<Swiper
										spaceBetween={10}
										slidesPerView="auto"
										modules={[Navigation, FreeMode, Thumbs]}
										freeMode={true}
									>
										{WorkingDaySlot.length == 0 ? null : timeSlots.length == 0 ? (
											<div className="text-sm font-semibold text-red-500 text-center">No Slot Available</div>
										) : (
											timeSlots.map((time, index) => (
												<SwiperSlide
													key={index}
													style={{ width: "auto" }}
												>
													<div
														onClick={(e) => {
															e.preventDefault();
															handleTimeSlotSelection(time);
														}}
														className={`text-xs font-semibold border border-[#EAEBEC] py-2 px-4 text-nowrap rounded-xl text-center cursor-pointer  ${selectedTime === time ? "bg-green text-white" : "bg-[#F8FAFC] text-black"
															}`}
													>
														{time}
													</div>
												</SwiperSlide>
											))
										)}
									</Swiper>
								</div>
							</div>
						</div>
					</TabPanel>
				</TabsBody>
			</Tabs>

			{/* Continue Button */}
			<button
				className="w-full py-1.5 bg-green text-white rounded-full text-lg mt-2"
				onClick={() => {
					if (!userToken) {
						navigate("/login", { state: { from: `/booking/${slug}` } });
						return;
					}


					if (!selectedDate || !selectedTime) {
						toast.error("Please Select Date and Time");
						return;
					}

					dispatch(setPhysioDetail({ slug, physioData }));
					navigate(`/booking/${slug}`);
				}}
			>
				Continue Booking
			</button>
		</div>
	);
}
