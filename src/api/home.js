import axios from "axios";
const BaseUrl = import.meta.env.VITE_BASE_URL;

export const adEmailApi = async (email) => {
	try {
		const response = await axios.post(`${BaseUrl}web/add-advertisement`, {
			email,
		});
		if (response.status >= 200 && response.status < 300) {
			return JSON.stringify(response);
		} else if (response.status >= 400 && response.status < 500) {
			return JSON.stringify(response);
		}
	} catch (error) {
		if (error.response) {
			return JSON.stringify(error.response);
		} else {
			return JSON.stringify(error.message);
		}
	}
};
