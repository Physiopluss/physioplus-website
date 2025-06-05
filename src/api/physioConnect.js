import axios from "axios";
import { commonInstance, instance } from "./axiosConfig";
import { toast } from "react-hot-toast";
const BaseUrl = import.meta.env.VITE_BASE_URL;
const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_KEY;

export const physioConnectSignUp = async (mobile) => {
	try {
		const response = await axios.post(`${BaseUrl}web/physio/signUpPhysioOtp`, {
			phone: mobile,
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


export const physioConnectLogin = async (mobile) => {
	try {
		const response = await instance.post(`web/physio/loginPhysioOtp`, {
			phone: mobile,
		});
		if (response.status >= 200 && response.status < 300) {
			return response;
		}
		else if (response.status >= 400 && response.status < 500) {
			return response;
		}
		else {
			return new Error("Something went wrong");
		}
	}
	catch (error) {
		if (error.response) {
			return error.response;
		} else {
			return error.message;
		}
	}
}



export const physioConnectOtpVerify = async (phone, otp, fullName) => {
	try {
		// Get current location
		const getLocation = () =>
			new Promise((resolve) => {
				if (!navigator.geolocation) {
					toast.error("Geolocation is not supported by your browser.");
					resolve({ latitude: null, longitude: null });
				} else {
					navigator.geolocation.getCurrentPosition(
						(pos) =>
							resolve({
								latitude: pos.coords.latitude,
								longitude: pos.coords.longitude,
							}),
						(err) => {
							console.warn("Geolocation error:", err);
							toast.error("Unable to fetch location. Please enable location services.");
							resolve({ latitude: null, longitude: null });
						}
					);
				}
			});

		const { latitude, longitude } = await getLocation();

		const payload = {
			name: fullName,
			phone: phone,
			otp,
			latitude: latitude ? latitude.toString() : null,
			longitude: longitude ? longitude.toString() : null,
			location: {
				type: "Point",
				coordinates: longitude && latitude ? [longitude, latitude] : [0, 0],
			},
		};

		const response = await axios.post(`${BaseUrl}web/physio/verifyOtp`, payload);

		if (response.status >= 200 && response.status < 300) {
			return response;
		} else if (response.status >= 400 && response.status < 500) {
			return response;
		} else {
			toast.error("Something went wrong. Please try again.");
			return new Error("Unexpected server response");
		}
	} catch (error) {
		toast.error("OTP verification failed: " + (error?.message || "Unknown error"));
		return error.response;
	}
};

// export const physioConnectOtpVerify = async (phone, otp, fullName) => {
// 	try {
// 		const response = await axios.post(`${BaseUrl}web/physio/verifyOtp`, {
// 			name: fullName,
// 			phone: phone,
// 			otp,
// 		});
// 		if (response.status >= 200 && response.status < 300) {
// 			return response;
// 		} else if (response.status >= 400 && response.status < 500) {
// 			return response;
// 		} else {
// 			return new Error("Something went wrong");
// 		}
// 	} catch (error) {
// 		return error.response;
// 	}
// };

export const physioConnectDegreeApi = async () => {
	try {
		const response = await axios.get(`${BaseUrl}web/degree`);
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

export const physioConnectSpecializationsApi = async () => {
	try {
		const response = await axios.get(`${BaseUrl}web/all-specializations`);
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

export const physioConnectSubSpecializationsApi = async () => {
	try {
		const response = await axios.get(`${BaseUrl}web/all-subspecializations`);
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

// export const physioConnectProfessionalsApi = async ({
// 	physioConnectPhysioId,
// 	degree,
// 	specialization,
// 	serviceType,
// 	clinicName,
// 	clinicAddress,
// 	clinicPincode,
// 	clinicCity,
// 	clinicState,
// 	consultationFees,
// 	treatmentCharges,
// 	homeChargesUpto5km,
// 	homeChargesUpto10km,
// 	homePincode,
// 	homeState,
// 	homeCity,
// 	AnotherTreatmentName,
// 	AnotherTreatmentPrice,
// }) => {
// 	try {
// 		const response = await axios.post(`${BaseUrl}web/physio/ProfessionalDetails`, {
// 			physioId: physioConnectPhysioId,
// 			degreeId: degree,
// 			specializationId: specialization,
// 			serviceType: serviceType,
// 			clinicName: clinicName,
// 			address: clinicAddress,
// 			zipCode: clinicPincode,
// 			homeZipCode: homePincode,
// 			homeState: homeState,
// 			homeCity: homeCity,
// 			city: clinicCity,
// 			state: clinicState,
// 			charges: consultationFees,
// 			consultationCharges: treatmentCharges,
// 			consultationChargesUp5Km: homeChargesUpto5km,
// 			consultationChargesUp10Km: homeChargesUpto10km,
// 			otherTreatmentName: AnotherTreatmentName,
// 			otherTreatmentCharges: AnotherTreatmentPrice,
// 		});
// 		if (response.status >= 200 && response.status < 300) {
// 			return response;
// 		} else if (response.status >= 400 && response.status < 500) {
// 			return response;
// 		} else {
// 			return new Error("Something went wrong");
// 		}
// 	} catch (error) {
// 		return error.response;
// 	}
// };


export const physioConnectProfileEdit = async (physioData) => {
	try {
		// Get geolocation dynamically
		const getLocation = () =>
			new Promise((resolve) => {
				if (!navigator.geolocation) {
					resolve({ latitude: null, longitude: null });
				} else {
					navigator.geolocation.getCurrentPosition(
						(pos) => resolve({
							latitude: pos.coords.latitude,
							longitude: pos.coords.longitude
						}),
						(err) => {

							console.error("Geolocation error:", err); // Log actual error for debugging
							toast.error("Location access denied.", {
								id: "geo-error",
								className: "capitalize z-10",
							});
							resolve({ latitude: null, longitude: null });
						}
					);
				}
			});

		const { latitude, longitude } = await getLocation();

		const payload = {
			...physioData,
			latitude: latitude ? latitude.toString() : null,
			longitude: longitude ? longitude.toString() : null,
			location: {
				type: "Point",
				coordinates: longitude && latitude ? [longitude, latitude] : [0, 0],
			},
		};

		// Send request with merged location data
		const response = await axios.put(`${BaseUrl}web/physio/physioConnectProfileEdit`, payload);

		if (response.status === 200) {
			toast.success(response.data?.message || "Profile updated!");
			return response.data;
		} else {
			toast.error(response.data?.message || "Submission failed");
		}
	} catch (error) {
		toast.error("Submit error: " + (error?.message || error));
	}
};

// export const physioConnectProfileEdit = async (physioData) => {
// 	try {
// 		const response = await axios.put(`${BaseUrl}web/physio/physioConnectProfileEdit`, physioData);

// 		if (response.status === 200) {
// 			toast.success(response.data?.message || "Profile updated!");
// 			return response.data; // optional, return data if needed
// 		} else {
// 			toast.error(response.data?.message || "Submission failed");
// 		}
// 	} catch (error) {
// 		toast.error("Submit error: " + (error?.message || error));
// 	}
// };




export const physioConnectPersonalApi = async ({
	physioConnectPhysioId,
	fullName,
	gender,
	dob,
	phone,
	email,
	about,
}) => {
	try {
		const response = await axios.post(`${BaseUrl}web/physio/createPhysioPersonalDetails?physioId=${physioConnectPhysioId}`, {
			physioId: physioConnectPhysioId,
			fullName: fullName,
			gender: gender,
			dob: dob,
			email: email,
			phone: phone,
			about: about,
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
export const physioConnectProfessionalApi = async ({
	physioConnectPhysioId,
	bptDegree,
	mptDegree,
	specialization,
	experience,
	serviceType,
	iapMember,
	iapNumber,
}) => {
	try {
		const response = await axios.post(`${BaseUrl}web/physio/createPhysioProfessionalDetails?physioId=${physioConnectPhysioId}`, {

			physioId: physioConnectPhysioId,
			bptDegree,
			mptDegree,
			specialization: specialization,
			experience: experience,

			serviceType: serviceType,
			iapMember: iapMember,
			iapNumber: iapNumber,
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

export const physioConnectBusinessApi = async (

	clinicName,
	clinicAddress,
	clinicPincode,
	clinicCity,
	clinicState,
	clinicCharges,
	clinicDuration,
	homePincode,
	homeCity,
	homeState,
	homeDuration,
	homeCharges,
	physioConnectPhysioId
) => {
	try {
		const response = await axios.post(`${BaseUrl}web/physio/createPhysioBusinessDetails`, {
			physioId: physioConnectPhysioId,
			clinicName: clinicName,
			clinicAddress: clinicAddress,
			clinicPincode: clinicPincode,
			clinicCity: clinicCity,
			clinicState: clinicState,
			clinicCharges: clinicCharges,
			clinicDuration: clinicDuration,
			homePincode: homePincode,
			homeCity: homeCity,
			homeState: homeState,
			homeDuration: homeDuration,
			homeCharges: homeCharges,

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




export const physioConnectCouponApi = async (couponCode, physioConnectPhysioId) => {
	try {
		const response = await axios.post(
			`${BaseUrl}web/physio/coupon?couponName`,
			{
				couponName: couponCode,
				physioId: physioConnectPhysioId,
			},
			{
				headers: { "Content-Type": "application/json" },
			}
		);

		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else if (response.status >= 400 && response.status < 500) {
			return response.data;
		}
	} catch (error) {
		if (error.response) {
			return error.response;
		} else {
			return error.message;
		}
	}
};

export const physioConnectBusinessDetailsApi = async (formData) => {
	// console.log(formData);
	try {
		const response = await axios.post(`${BaseUrl}web/physio/addProfileDetails`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
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
		return error.response;
	}
};

export const physioConnectPhysioDataApi = async (physioConnectPhysioId) => {
	try {
		const response = await axios.get(`${BaseUrl}web/physio/physioConnectId?physioId=${physioConnectPhysioId}`);
		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else if (response.status >= 400 && response.status < 500) {
			return response;
		} else {
			return new Error("Something went wrong");
		}
	} catch (error) {
		return error.response;
	}
};

export const physioConnectRazorPayOrderApi = async (
	physioConnectPhysioId,
	amoutToPay,
	mobileNumber,
	couponApplied,

) => {
	try {
		const response = await axios.post(
			`${BaseUrl}web/physio/createPayment`,
			{
				physioId: physioConnectPhysioId,
				amount: amoutToPay,
				couponName: couponApplied,

			},
			{ headers: { "Content-Type": "application/json" } }
		);
		if (response.status >= 200 && response.status < 300) {
			const data = response.data.data;
			const paymentResult = await paymentVerify({ data, mobileNumber });
			return paymentResult;
		} else {
			return new Error(response.data.message);
		}
	} catch (error) {
		return Promise.reject(error);
	}
};

export const paymentVerify = async ({ data, mobileNumber }) => {
	return new Promise((resolve, reject) => {
		const options = {
			key: import.meta.env.VITE_RAZORPAY_KEY,
			amount: data.amount,
			currency: data.currency,
			name: "Physioplus Healthcare",
			prefill: {
				contact: mobileNumber,
			},
			order_id: data.id,
			handler: async (response) => {
				const data = await axios.post(
					`${BaseUrl}web/physio/verifyPayment`,
					{
						orderId: response.razorpay_order_id,
						razorpay_payment_id: response.razorpay_payment_id,
						razorpay_signature: response.razorpay_signature,
					},
					{
						headers: {
							"content-type": "application/json",
						},
					}
				);
				if (data.status >= 200 && data.status < 300) {
					resolve(data.data);
				} else {
					reject(new Error(`Payment verification failed with status ${data.status}`));
				}
			},
			theme: {
				color: "#039342",
			},
		};
		// Check if Razorpay is available
		if (window.Razorpay) {
			const rzp1 = new window.Razorpay(options);
			rzp1.open();
		} else {
			reject(new Error("Razorpay is not loaded or not available."));
		}
	});
};

export const locationUsingPincode = async (pincode) => {
	try {
		const response = await axios.get(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${pincode}&key=${GOOGLE_KEY}`
		);
		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else if (response.status >= 400 && response.status < 500) {
			return response;
		} else {
			return new Error("Something went wrong");
		}
	} catch (error) {
		return error.response;
	}
};

export const physioConnectFreePayment = async (physioConnectPhysioId, selectedExperienceId) => {
	// console.log(selectedExperienceId);
	try {
		const response = await axios.post(`${BaseUrl}web/physio/physioPaymentFree`, {
			physioId: physioConnectPhysioId,
			experiencePriceId: selectedExperienceId,
		});
		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else if (response.status >= 400 && response.status < 500) {
			return response;
		} else {
			return new Error("Something went wrong");
		}
	} catch (error) {
		return error.response;
	}
};

export const getPhysioDataPhysioConnectApi = async (physioConnectPhysioId) => {
	try {
		const response = await axios.get(`${BaseUrl}web/physio/physioConnectById?Id=${physioConnectPhysioId}`);
		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else if (response.status >= 400 && response.status < 500) {
			return response;
		} else {
			return new Error("Something went wrong");
		}
	} catch (error) {
		return error.response;
	}
};
export const getPhysioDataById = async (physioConnectPhysioId) => {
	try {
		const response = await axios.get(`${BaseUrl}web/physio/getPhysioDetailsById?Id=${physioConnectPhysioId}`);
		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else if (response.status >= 400 && response.status < 500) {
			return response;
		} else {
			return new Error("Something went wrong");
		}
	} catch (error) {
		return error.response;
	}
};


export const getPresignedUrl = async (file, folder) => {
	const params = {
		fileName: file.name,
		fileType: file.type,
		folder: folder,
	};

	const res = await commonInstance.get("/get-presigned-url", { params });
	console.log(res.data);
	return res.data; // { uploadUrl, fileUrl, fileKey }
};

export const uploadFileToS3 = async (file, presignedUrl) => {
	await axios.put(presignedUrl, file, {
		headers: {
			"Content-Type": file.type,
		},
	});
	console.log("File uploaded successfully", presignedUrl);
};

