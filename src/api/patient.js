import { instance } from "./axiosConfig";

export const singlePatient = async (id) => {
	try {
		const response = await instance.get(`web/patient/patient-by-id?patientId=${id}`);

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
