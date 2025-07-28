import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    otpModalOpen: false,
    successModalOpen: false,
};

export const newModalSlice = createSlice({
    name: "modalNew",
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

export const { setOtpModalOpen, setSuccessModalOpen } = newModalSlice.actions;

export default newModalSlice.reducer;
