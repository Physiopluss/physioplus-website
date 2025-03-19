import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "bookingState";

const initialState = {
	selectedDate: null, //date selected by user
	bookedSlot: null, //booked slots of physio from API
	selectedSlot: null, // slot selected by user
	physioBookingTiming: null, //from physioData on selection of appointment type
	physioBookingType: "", //type of appointment
	bookingDetails: {
		patientName: "", //String
		age: "", //string
		gender: "", //Number 0 - Male, 1 - Female, 2 - Other
		phoneNumber: "", //String
		painDescription: "", //String
	},
};

// Load initial state from session storage
const loadState = () => {
	try {
		const serializedState = sessionStorage.getItem(STORAGE_KEY);
		if (serializedState === null) {
			return initialState;
		}
		return JSON.parse(serializedState);
	} catch (err) {
		console.error("Error loading state from session storage:", err);
		return initialState;
	}
};

// Save state to session storage
const saveState = (state) => {
	try {
		const serializedState = JSON.stringify(state);
		sessionStorage.setItem(STORAGE_KEY, serializedState);
	} catch (err) {
		console.error("Error saving state to session storage:", err);
	}
};

export const bookingSlice = createSlice({
	name: "booking",
	initialState: loadState(),
	reducers: {
		setSelectedDate: (state, action) => {
			state.selectedDate = action.payload;
			saveState(state);
		},
		setBookedSlot: (state, action) => {
			state.bookedSlot = action.payload;
			saveState(state);
		},
		setPhysioBookingType: (state, action) => {
			state.physioBookingType = action.payload;
			saveState(state);
		},
		setSelectedSlot: (state, action) => {
			state.selectedSlot = action.payload;
			saveState(state);
		},
		setPhysioBookingTiming: (state, action) => {
			state.physioBookingTiming = action.payload;
			saveState(state);
		},
		emptyBooking: (state) => {
			state.selectedDate = "";
			state.bookedSlot = "";
			state.selectedSlot = "";
			state.physioBookingTiming = "";
			state.physioBookingType = "";
			state.bookingDetails = {};
			saveState(state);
		},
	},
});

export const {
	setSelectedDate,
	setBookedSlot,
	setPhysioBookingType,
	setSelectedSlot,
	setPhysioBookingTiming,
	emptyBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
