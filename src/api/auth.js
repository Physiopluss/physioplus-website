import { instance } from "./axiosConfig";

export const login = async (phone) => {
	try {
		const response = await instance.post(`web/patient/loginOtp`, {
			phone: phone,
		});
		if (response.status >= 200 && response.status < 300) {
			return response;
		} else if (response.status >= 400 && response.status < 500) {
			return response;
		} else {
			return new Error("Something went wrong");
		}
	} catch (error) {
		if (error.response) {
			return error.response;
		} else {
			return error.message;
		}
	}
};

export const OtpVerify = async (phone, otp, type, fullName, gender, date, dob) => {
	try {
		const response = await instance.post(`web/patient/verifyOtp`, {
			phone,
			otp,
			type,
			fullName,
			gender,
			date,
			dob,
		});
		if (response.status >= 200 && response.status < 300) {
			return response;
		} else if (response.status >= 400 && response.status < 500) {
			return response;
		} else {
			return new Error("Something went wrong");
		}
	} catch (error) {
		return error.response;
	}
};

export const signUp = async (values) => {
	try {
		const response = await instance.post(`web/patient/signUpOtp`, {
			fullName: values.fullName,
			phone: values.phone,
			dob: values.date,
			gender: values.gender,
		});
		if (response.status >= 200 && response.status < 300) {
			return response;
		} else if (response.status >= 400 && response.status < 500) {
			return response;
		} else {
			return new Error("Something went wrong");
		}
	} catch (error) {
		return error.response;
	}
};
