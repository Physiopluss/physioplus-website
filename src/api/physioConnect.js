import axios from "axios";
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

export const physioConnectOtpVerify = async (name, mobile, otp) => {
	try {
		const response = await axios.post(`${BaseUrl}web/physio/verifyOtp`, {
			name,
			phone: mobile,
			otp,
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

export const physioConnectPersonalApi = async ({
	physioConnectPhysioId,
	fullName,
	gender,
	dob,
	email,

	about,
}) => {
	try {
		const response = await axios.post(`${BaseUrl}web/physio/createPhysioPersonalDetails?physioId=${physioConnectPhysioId}`, {
			physioId: physioConnectPhysioId,
			fullName:fullName,
			gender:gender,
			dob:dob,
			email:email,
			
			about:about,
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
	degree,
	specialization,
	experience,
	insurance,
	serviceType,
	iapMember,
	iapNumber,
}) => {
	try {
		const response = await axios.post(`${BaseUrl}web/physio/createPhysioProfessionalDetails?physioId=${physioConnectPhysioId}`, {
			physioId: physioConnectPhysioId,
			degree:degree,
			specialization:specialization,
			experience:experience,
			insurance:insurance,
			serviceType:serviceType,
			iapMember:iapMember,
			iapNumber:iapNumber,
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
            homeCharges10Km,
	physioConnectPhysioId
) => {
	try {
		const response = await axios.post(`${BaseUrl}web/physio/createPhysioBusinessDetails`, {
			physioId: physioConnectPhysioId,
			clinicName:clinicName,
            clinicAddress:clinicAddress,
            clinicPincode:clinicPincode,
            clinicCity:clinicCity,
            clinicState:clinicState,
            clinicCharges:clinicCharges,
            clinicDuration:clinicDuration,
            homePincode:homePincode,
            homeCity:homeCity,
            homeState:homeState,
			homeDuration:homeDuration,
            homeCharges:homeCharges,
            homeCharges10Km:homeCharges10Km,
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
// export const physioConnectWorkExperiencePageApi = async (
// 	IAPInDigit,
// 	IAP_number,
// 	treatInsuredPatientInDigit,
// 	experience,
// 	physioConnectPhysioId
// ) => {
// 	try {
// 		const response = await axios.post(`${BaseUrl}web/physio/workExperiences`, {
// 			physioId: physioConnectPhysioId,
// 			workExperience: experience,
// 			iapMember: IAPInDigit,
// 			iapNumber: IAP_number,
// 			treatInsuranceclaims: treatInsuredPatientInDigit,
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

export const physioConnectPriceAndExperienceApi = async () => {
	try {
		const response = await axios.get(`${BaseUrl}web/experience-price`);
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

export const physioConnectCouponApi = async (couponCode) => {
	try {
		const response = await axios.post(
			`${BaseUrl}web/coupon?couponName`,
			{
				couponName: couponCode,
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
	selectedExperienceId
) => {
	try {
		const response = await axios.post(
			`${BaseUrl}web/physio/createPayment`,
			{
				physioId: physioConnectPhysioId,
				amount: amoutToPay,
				couponName: couponApplied,
				experiencePriceId: selectedExperienceId,
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
			key: import.meta.env.RAZORPAY_KEY,
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
