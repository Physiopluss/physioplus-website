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


// export const physioConnectRazorPayOrderApi = async (
//   physioConnectPhysioId,
//   mobileNumber,
//   couponAppliedId
// ) => {
//   try {
//     const response = await axios.post(
//       `${BaseUrl}web/physio/subscription-payment`,
//       {
//         physioId: physioConnectPhysioId,
//         couponId: couponAppliedId,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (response.status >= 200 && response.status < 300) {
//       const data = response.data.data;

//       return new Promise((resolve, reject) => {
//         const options = {
//           key: import.meta.env.VITE_RAZORPAY_KEY,
//           amount: data.amount,
//           currency: data.currency || "INR",
//           name: "Physioplus Healthcare",
//           description: "Subscription Payment",
//           order_id: data.id,
//           prefill: {
//             contact: mobileNumber,
//           },
//           handler: function (response) {
//             console.log("✅ Payment Success", response);
//             resolve(response); // Only resolve on success
//           },
//           theme: {
//             color: "#039342",
//           },
//           modal: {
//             ondismiss: () => {
//               reject("Payment cancelled by user");
//             },
//           },
//         };

//         if (window.Razorpay) {
//           const rzp = new window.Razorpay(options);
//           rzp.open();
//         } else {
//           reject("Razorpay SDK not loaded");
//         }
//       });
//     } else {
//       throw new Error(response.data.message || "Failed to create Razorpay order");
//     }
//   } catch (error) {
//     return Promise.reject(error?.message || "Unexpected error occurred");
//   }
// };

export const physioConnectRazorPayOrderApi = async (
	physioConnectPhysioId,
	amoutToPay,
	mobileNumber,
	couponAppliedId,

) => {
	try {
		const response = await axios.post(
			`${BaseUrl}web/physio/createPayment`,
			{
				physioId: physioConnectPhysioId,
				amount: amoutToPay,
				couponId: couponAppliedId,

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

// all orders of physio

export const physioAllOrders = async (physioId, userToken) => {

	try {
		const response = await instance.get(
			`web/appointment/appointmentByPhysioId?physioId=${physioId}`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userToken}`
				},
			}
		);

		if (!response.data) throw new Error("No data received");
		return response.data;

	} catch (error) {
		// Convert error to a proper Error object
		let errorMessage = "Failed to fetch orders";

		if (error.response) {
			errorMessage = error.response.data?.message ||
				error.response.statusText ||
				`Server error: ${error.response.status}`;
		} else if (error.message) {
			errorMessage = error.message;
		}

		throw new Error(errorMessage); // Always throw an Error object
	}
};


export const physioWithdrawalRequest = async (physioId, amount, userToken) => {
	try {
		const response = await instance.post(
			`web/physio/PhysioWalletWithdrawTransaction`,
			{ physioId, amount },
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userToken}`
				}
			}
		);

		return response.data;
	} catch (error) {
		console.error("POST request failed:", error.response?.data || error.message);
		throw error.response?.data || new Error("Something went wrong");
	}
};



export const physioWalletWithdrawTransaction = async (physioId, userToken) => {
	try {
		const response = await instance.get(
			`web/physio/getPhysioWalletWithdrawalRequest`,
			{
				params: { physioId },
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userToken}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error(
			"Wallet withdrawal fetch failed:",
			error.response?.data || error.message
		);
		throw error.response?.data || new Error("Something went wrong");
	}
};

export const physioWalletTransaction = async (physioId, userToken) => {
	try {
		const response = await instance.get(
			`web/physio/getPhysioWalletTransaction`,
			{
				params: { physioId },
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userToken}`,
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error(
			"Wallet transaction fetch failed:",
			error.response?.data || error.message
		);
		throw error.response?.data || new Error("Something went wrong");
	}
};



export const physioWalletData = async (physioId, userToken) => {
	try {
		const response = await instance.get(
			`web/physio/getPhysioWalletData`,
			{
				params: { physioId },
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userToken}`,
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error(
			"Wallet transaction fetch failed:",
			error.response?.data || error.message
		);
		throw error.response?.data || new Error("Something went wrong");
	}
};




export const physioRefundRequest = async (userId, refundType, userToken) => {
	try {
		const response = await instance.post(
			"web/physio/request-refund",
			{
				physioId: userId,

				refundShare: refundType, // either "full" or "partial"
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${userToken}`,
				},
			}
		);

		return response.data;
	} catch (error) {
		console.error("API Error in physioRefundRequest:", error);
		throw error.response?.data || { message: "Something went wrong while processing the refund." };
	}
};
