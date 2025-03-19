import { createSlice } from "@reduxjs/toolkit";
import { emptyBooking } from "./bookingSlice";

const initialState = {
	servicetype: null,
};

export const bookingFilterSlice = createSlice({
	name: "bookingFilter",
	initialState,
	reducers: {
		setBookingFilter: (state, action) => {
			state.servicetype = action.payload;
		},
		emptyBookingFilter: (state) => {
			state.servicetype = null;
		},
	},
});

export const { setBookingFilter, emptyBookingFilter } = bookingFilterSlice.actions;

export default bookingFilterSlice.reducer;
