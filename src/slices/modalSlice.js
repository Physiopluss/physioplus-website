import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	otpModalOpen: false,
	successModalOpen: false,
};

export const modalSlice = createSlice({
	name: "modal",
	initialState,
	reducers: {
		setOtpModalOpen: (state) => {
			state.otpModalOpen = !state.otpModalOpen;
		},
		setSuccessModalOpen: (state) => {
			state.successModalOpen = !state.successModalOpen;
		},
	},
});

export const { setOtpModalOpen, setSuccessModalOpen } = modalSlice.actions;

export default modalSlice.reducer;
