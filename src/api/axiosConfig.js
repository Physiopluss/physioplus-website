import axios from "axios";
const newBackendUrl = import.meta.env.VITE_API_URL;
const newCommonUrl = import.meta.env.VITE_COMMON_URL;

export const instance = axios.create({
	baseURL: newBackendUrl,
	// baseURL: "http://192.168.29.134:8000/api/",
});
export const commonInstance = axios.create({
	baseURL: newCommonUrl,
	// VITE_COMMON_URL = http://localhost:8000/api/common
	
});

