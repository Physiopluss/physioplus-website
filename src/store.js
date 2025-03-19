import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import modalReducer from "./slices/modalSlice";
import bookingReducer from "./slices/bookingSlice";
import physioDetailReducer from "./slices/physioSlice";
import physioConnectAuthReducer from "./slices/physioConnect";
import bookingFilterReducer from "./slices/bookingFilter";
import { physioDataApi } from "./api/physios";

export const store = configureStore({
	reducer: {
		auth: authReducer,
		modal: modalReducer,
		booking: bookingReducer,
		physioDetail: physioDetailReducer,
		physioConnectAuth: physioConnectAuthReducer,
		bookingFilter: bookingFilterReducer,
		[physioDataApi.reducerPath]: physioDataApi.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(physioDataApi.middleware),
	// devTools: false,
});
