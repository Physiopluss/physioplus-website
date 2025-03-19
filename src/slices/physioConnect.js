import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	physioId: null,
};

export const physioConnectAuth = createSlice({
	name: "physioConnectAuth",
	initialState,
	reducers: {
		setPhysioConnectPhysioId: (state, value) => {
			state.physioId = value.payload;
		},
	},
});

export const { setPhysioConnectPhysioId } = physioConnectAuth.actions;

export default physioConnectAuth.reducer;
