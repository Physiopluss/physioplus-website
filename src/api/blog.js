// import axios from "axios";
// const BaseUrl = import.meta.env.VITE_BASE_URL;
import { instance } from "./axiosConfig";

export const listAllBlog = async (page, query) => {
	try {
		const response = await instance.get(`web/all-blogs`, {
			params: {
				page,
				title: query,
			},
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

export const singleBlog = async (slug) => {
	try {
		const response = await instance.get(`web/blog/${slug}`);

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
