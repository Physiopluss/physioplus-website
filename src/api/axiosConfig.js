import axios from "axios";
const newBackendUrl = import.meta.env.VITE_API_URL;

export const instance = axios.create({
	baseURL: newBackendUrl,
	// baseURL: "http://192.168.29.134:8000/api/",
});
