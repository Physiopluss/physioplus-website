import axios from "axios";
import { instance } from "./axiosConfig";
const BaseUrl = import.meta.env.VITE_BASE_URL;

export const fetchBookedSlot = async (physioId, selectedDate, serviceSelected) => {
	try {
		const response = await instance.get(`web/appointment/list`, {
			params: {
				physioId,
				date: selectedDate,
				serviceType: serviceSelected,
			},
		});
		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else {
			return response;
		}
	} catch (error) {
		if (error.response) {
			return JSON.stringify(error.response);
		} else {
			return JSON.stringify(error.message);
		}
	}
};

export const cashAppointment = async ({
	userToken,
	patientId,
	physioId,
	date,
	time,
	patientName,
	age,
	gender,
	phone,
	amount,
	serviceTypeString,
	timeInString,
	painNotes,
	couponId,
}) => {
	if (!userToken) {
		throw new Error("userToken is null or undefined");
	}

	if (!patientId) {
		throw new Error("patientId is null or undefined");
	}

	if (!physioId) {
		throw new Error("physioId is null or undefined");
	}

	if (!date) {
		throw new Error("date is null or undefined");
	}

	if (!time) {
		throw new Error("time is null or undefined");
	}

	if (!patientName) {
		throw new Error("patientName is null or undefined");
	}

	if (!age) {
		throw new Error("age is null or undefined");
	}

	if (gender === null || gender === undefined) {
		throw new Error("gender is null or undefined");
	}

	if (!phone) {
		throw new Error("phone is null or undefined");
	}

	if (!amount) {
		throw new Error("amount is null or undefined");
	}

	if (!serviceTypeString) {
		throw new Error("serviceType is null or undefined");
	}

	if (!timeInString) {
		throw new Error("timeInString is null or undefined");
	}

	try {
		const response = await instance.post(
			`web/appointment/cashAppointment`,
			{
				patientId,
				physioId,
				date,
				time,
				patientName,
				age,
				gender,
				phone,
				amount,
				serviceType: serviceTypeString == "home" ? "0" : "1",
				timeInString,
				painNotes,
				couponId,
			},
			{ headers: { "Content-Type": "application/json", authorization: `Bearer ${userToken}` } }
		);

		if (!response.status >= 200 && !response.status < 300) {
			throw new Error(`Cash appointment failed with status ${response.status}`);
		} else {
			return response;
		}
	} catch (error) {
		return new Error(error);
	}
};

export const appointmentDataToRazorpay = async ({
	userToken,
	patientId,
	physioId,
	date,
	time,
	patientName,
	age,
	appointmentAddress,
	gender,
	phone,
	amount,
	serviceTypeString,
	timeInString,
	painNotes,
	couponId,
}) => {
	if (!userToken) {
		throw new Error("userToken is null or undefined");
	}

	if (!patientId) {
		throw new Error("patientId is null or undefined");
	}

	if (!physioId) {
		throw new Error("physioId is null or undefined");
	}

	if (gender === null || gender === undefined) {
		throw new Error("gender is null or undefined");
	}

	if (!date) {
		throw new Error("date is null or undefined");
	}

	if (!time) {
		throw new Error("time is null or undefined");
	}

	// ✅ Only validate address if serviceType is 'home'
	if (serviceTypeString === "home" && !appointmentAddress) {
		throw new Error("address is required for home service");
	}

	if (!patientName) {
		throw new Error("patientName is null or undefined");
	}

	if (!age) {
		throw new Error("age is null or undefined");
	}

	if (!phone) {
		throw new Error("phone is null or undefined");
	}

	if (!amount) {
		throw new Error("amount is null or undefined");
	}

	if (!serviceTypeString) {
		throw new Error("serviceType is null or undefined");
	}

	if (!timeInString) {
		throw new Error("timeInString is null or undefined");
	}

	try {
		const response = await instance.post(
			`web/appointment/addAppointment`,
			{
				patientId,
				physioId,
				date,
				time,
				patientName,
				age,
				gender,
				phone,
				amount,
				appointmentAddress,
				serviceType: serviceTypeString == "home" ? 0 : 1,
				timeInString,
				painNotes,
				couponId,
			},
			{ headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` } }
		);
		if (response.status >= 200 && response.status < 300) {
			const data = response.data.data;
			const paymentResult = await paymentVerify({ data, userToken });
			return paymentResult;
		} else {
			if (response.data.message === "Appointment already booked") {
				return new Error("Time Slot already booked");
			} else {
				return new Error(response.data.message);
			}
		}
	} catch (error) {
		return Promise.reject(error);
	}
};

export const paymentVerify = async ({ data, userToken }) => {
	return new Promise((resolve, reject) => {
		const options = {
			key: import.meta.env.VITE_RAZORPAY_KEY,
			amount: data.amount,
			currency: data.currency,
			name: "Physioplus Healthcare",
			description: `Booking of physio with id ${data.notes.physioId}`,
			order_id: data.id,
			prefill: {
				name: data.notes.patientName,
				contact: data.notes.phone,
			},
			handler: async (response) => {
				const data = await instance.post(
					`web/appointment/verifyPayment`,
					{
						orderId: response.razorpay_order_id,
						razorpay_payment_id: response.razorpay_payment_id,
						razorpay_signature: response.razorpay_signature,
					},
					{
						headers: {
							"content-type": "application/json",
							Authorization: `Bearer ${userToken}`,
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

export const allOrders = async (patientId, userToken) => {
	if (!patientId) {
		throw new Error("OrderId is null or undefined");
	}

	if (!userToken) {
		throw new Error("userToken is null or undefined");
	}
	try {
		const response = await instance.get(
			`web/appointment/appointmentByPatientId?patientId=${patientId}`
			// 	, {
			// 	headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
			// }
		);
		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else {
			return response;
		}
	} catch (error) {
		if (error.response) {
			return JSON.stringify(error.response);
		} else {
			return JSON.stringify(error.message);
		}
	}
};

export const singleOrder = async (OrderId, userToken) => {
	if (!OrderId) {
		throw new Error("OrderId is null or undefined");
	}

	if (!userToken) {
		throw new Error("userToken is null or undefined");
	}
	try {
		const response = await axios.get(`${BaseUrl}web/appointment/appointmentById`, {
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
			params: {
				appointmentId: OrderId,
			},
		});
		if (response.status >= 200 && response.status < 300) {
			return response.data;
		} else if (response.status >= 400 && response.status < 500) {
			return response;
		}
	} catch (error) {
		if (error.response) {
			return JSON.stringify(error.response);
		} else {
			return JSON.stringify(error.message);
		}
	}
};

export const couponApi = async (couponName, patientId, userToken) => {
	try {
		const response = await instance.post(
			`web/coupon`,
			{
				couponName,
				patientId,
			},
			{
				headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
			}
		);

		if (response.status >= 200 && response.status < 300) {
			return response;
		} else if (response.status >= 400 && response.status < 500) {
			return response;
		}
	} catch (error) {
		if (error.response) {
			return error.response;
		} else {
			return error.message;
		}
	}
};
