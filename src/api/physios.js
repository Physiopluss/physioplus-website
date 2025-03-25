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
                latitude,
                longitude,
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
						latitude,
						longitude,
					},
				};
			},
		}),
		fetchSinglePhysioData: builder.query({
			query: (id) => `web/physio/physioByid?slug=${id}`,
		}),
		// In your api/physios.js or similar file
		getPhysioReviews: builder.query({
	query: (physioId) => `web/physio/getPhysioReviews?physioId=${physioId}`,
	// providesTags: ['PhysioReviews'],
  }),
	}),
});

export const { useFetchPhysioDataQuery,useGetPhysioReviewsQuery, useFetchSinglePhysioDataQuery } = physioDataApi;
