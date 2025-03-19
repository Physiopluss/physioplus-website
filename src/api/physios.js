import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// const BaseUrl = import.meta.env.VITE_BASE_URL;
const newBackendUrl = import.meta.env.VITE_API_URL;

export const physioDataApi = createApi({
	baseQuery: fetchBaseQuery({
		// baseUrl: "http://192.168.29.134:8000/api/",
		baseUrl: newBackendUrl,
	}),
	endpoints: (builder) => ({
		fetchPhysioData: builder.query({
			query: ({
				page,
				query,
				location,
				gender,
				experience,
				rating,
				language,
				specializationFilter,
				subSpecializationFilter,
				mode,
			}) => {
				return {
					url: `web/physio/filter`,
					params: {
						page: page,
						name: query,
						location,
						gender: gender,
						workExperience: experience,
						rating,
						language,
						specialization: specializationFilter,
						subspecializationId: subSpecializationFilter,
						serviceType: mode,
					},
				};
			},
		}),
		fetchSinglePhysioData: builder.query({
			query: (id) => `web/physio/physioByid?slug=${id}`,
		}),
	}),
});

export const { useFetchPhysioDataQuery, useFetchSinglePhysioDataQuery } = physioDataApi;
