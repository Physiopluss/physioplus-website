import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	type: null,
	phone: null,
	user: null,
	fullName: null,
	dob: null,
	gender: null,
};

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setLoginData: (state, value) => {
			state.phone = value.payload;
			state.type = "login";
		},

		setSignupData: (state, value) => {
			state.phone = value.payload.phone;
			state.fullName = value.payload.fullName;
			state.dob = value.payload.date;
			state.gender = value.payload.gender;
			state.type = "signup";
		},
		setPhysioLoginData: (state, value) => {
			state.phone = value.payload;
			state.type = "physio";
		},
		setPhysioSignupData: (state, value) => {
			state.phone = value.payload.phone;
			state.fullName = value.payload.fullName;
			state.type = "physio-signup";
		},

		setUser: (state, value) => {
			state.user = value.payload;
		},
		setLogOut: (state) => {
			state.phone = null;
			state.user = null;
		},
	},
});

export const { setSignupData, setLoginData, setUser, setLogOut, setPhysioLoginData, setPhysioSignupData } = authSlice.actions;

export default authSlice.reducer;
