import axios from "axios";
const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_KEY;
import { instance } from "./axiosConfig";

export const contactApi = async (values) => {
	try {
		const data = await instance.post(`web/add-help-contact`, {
			name: values.name,
			message: values.message,
			email: values.email,
			phone: values.mobile,
			subject: values.topic,
		});
		if (data.status >= 200 && data.status < 300) {
			return data;
		} else if (data.status >= 400 && data.status < 500) {
			return data;
		}
	} catch (error) {
		if (error.response) {
			return JSON.stringify(error.response);
		} else {
			return JSON.stringify(error.message);
		}
	}
};

export const specializationApi = async () => {
	try {
		const response = await instance.get(`web/all-specializations`);
		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else if (response.status >= 400 && response.status < 500) {
			return response;
		}
	} catch (error) {
		if (error.response) {
			return JSON.stringify(error.response);
		} else {
			return JSON.stringify(error.message);
		}
	}
};

export const insuranceEnquiry = async ({ name, phone, companyName, policyNumber }) => {
	try {
		const data = await instance.post(`web/add-insurance-enquiry`, {
			name,
			phone,
			companyName,
			policyNumber,
		});
		if (data.status >= 200 && data.status < 300) {
			return data.data;
		} else if (data.status >= 400 && data.status < 500) {
			return data;
		}
	} catch (error) {
		if (error.response) {
			return JSON.stringify(error.response);
		} else {
			return JSON.stringify(error.message);
		}
	}
};

export const googleLocationLatLong = async (lat, long) => {
	try {
		const data = await axios.get(
			`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${GOOGLE_KEY}`
		);
		if (data.status >= 200 && data.status < 300) {
			return data;
		} else if (data.status >= 400 && data.status < 500) {
			return data;
		}
	} catch (error) {
		if (error.response) {
			return JSON.stringify(error.response);
		} else {
			return JSON.stringify(error.message);
		}
	}
};
