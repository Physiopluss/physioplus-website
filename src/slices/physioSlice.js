import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	physioId: null,
	physioData: null,
};

export const physioDetailSlice = createSlice({
	name: "physioDetail",
	initialState,
	reducers: {
		setPhysioDetail: (state, action) => {
			state.physioId = action.payload.id || action.payload.physioId;
			state.physioData = action.payload.physioData || action.payload.allData;
		},
		emptyPhysio: (state) => {
			state.physioId = null;
			state.physioData = null;
		},
	},
});

export const { setPhysioDetail, emptyPhysio } = physioDetailSlice.actions;

export default physioDetailSlice.reducer;
