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

// export const appointmentDataToRazorpay = async ({
//   userToken,
//   patientId,
//   physioId,
//   date,
//   time,
//   patientName,
//   age,
//   appointmentAddress,
//   gender,
//   phone,
//   serviceTypeString,
//   timeInString,
//   painNotes,
//   couponId,
// }) => {
//   // 🛡️ Validation checks
//   if (!userToken) throw new Error("userToken is null or undefined");
//   if (!patientId) throw new Error("patientId is null or undefined");
//   if (!physioId) throw new Error("physioId is null or undefined");
//   if (!date) throw new Error("date is null or undefined");
//   if (!time) throw new Error("time is null or undefined");
//   if (!gender) throw new Error("gender is required");
//   if (!patientName) throw new Error("patientName is required");
//   if (!age) throw new Error("age is required");
//   if (!phone) throw new Error("phone is required");
//   if (!serviceTypeString) throw new Error("serviceType is required");
//   if (!timeInString) throw new Error("timeInString is required");
//   if (serviceTypeString === "home" && !appointmentAddress) {
//     throw new Error("address is required for home service");
//   }

//   try {
//     const response = await instance.post(
//       `web/appointment/appointment-payment`,
//       {
//         patientId,
//         physioId,
//         date,
//         time,
//         patientName,
//         age,
//         gender,
//         phone,
//         appointmentAddress,
//         serviceType: serviceTypeString,
//         timeInString,
//         painNotes,
//         couponId,
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userToken}`,
//         },
//       }
//     );

//     if (response.status >= 200 && response.status < 300) {
//       const data = response.data.data;

//       // ✅ Open Razorpay directly (no verify step)
//       return new Promise((resolve, reject) => {
//         const options = {
//           key: import.meta.env.VITE_RAZORPAY_KEY,
//           amount: data.amount,
//           currency: data.currency || "INR",
//           name: "Physioplus Healthcare",
//           description: `Booking of physio with id ${data.notes.physioId}`,
//           order_id: data.id,
//           prefill: {
//             name: data.notes.patientName,
//             contact: data.notes.phone,
//           },
//           handler: (response) => {
//             console.log("✅ Payment Successful:", response);
//             resolve(response); // Resolving directly without verification
//           },
//           modal: {
//             ondismiss: () => {
//               reject("Payment cancelled by user");
//             },
//           },
//           theme: {
//             color: "#039342",
//           },
//         };

//         if (window.Razorpay) {
//           const rzp1 = new window.Razorpay(options);
//           rzp1.open();
//         } else {
//           reject("Razorpay is not loaded or not available.");
//         }
//       });
//     } else {
//       if (response.data.message === "Appointment already booked") {
//         throw new Error("Time Slot already booked");
//       } else {
//         throw new Error(response.data.message || "Error in appointment payment request");
//       }
//     }
//   } catch (error) {
//     return Promise.reject(error?.message || "Something went wrong");
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

export const requestTreatment = async (orderId, patientId, physioId, userToken) => {
  try {
    const response =  await instance.post(
      `web/appointment/sendNotificationForTreatment`, // adjust to your real endpoint
      {
        appointmentId:orderId,
        patientId,
        physioId,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Something went wrong";
  }
};





export const singleOrder = async (OrderId, userToken) => {
	
	console.log("OrderId:", OrderId);
	try {
		const response = await instance.get(`web/appointment/appointmentById`, {
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


export const treatmentTransactions = async (OrderId, userToken) => {
	
	console.log("OrderId:", OrderId);
	try {
		const response = await instance.get(`web/appointment/transactionsByAppointmentId`, {
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


// api/booking.js




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



export const makeTreatmentPaymentToRazorpay = async ({
  userToken,
  appointmentsId,
  dateIdArray,
  isRazorpay,
  patientId,
  appointmentAmount,
  amount,
  couponId,
}) => {
  console.log("✅ makeTreatmentPaymentToRazorpay called");

  if (!userToken) throw new Error("userToken is null or undefined");
  if (!patientId) throw new Error("patientId is null or undefined");
  if (!amount) throw new Error("amount is null or undefined");

  try {
    const response = await instance.post(
      `web/appointment/addTreatmentMultiDayPayment`,
      {
        appointmentsId,
        dateIdArray,
        isRazorpay,
        patientId,
        appointmentAmount,
        amount,
        couponId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    console.log("🧾 Full Backend Response:", response?.data);

    const data = response?.data?.razorpay; // ✅ updated to use razorpay

    if (!data || !data.id || !data.amount) {
      console.error("❌ Invalid Razorpay order structure:", data);
      throw new Error("Invalid Razorpay data received");
    }

    console.log("✅ Valid Razorpay Order:", data);
    const result = await treatmentPaymentVerify({ data, userToken });
    return result;
  } catch (error) {
    console.error("❌ Error in makeTreatmentPaymentToRazorpay:", error);
    throw error;
  }
};

export const treatmentPaymentVerify = async ({ data, userToken }) => {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      console.error("❌ Razorpay is not loaded");
      return reject(new Error("Razorpay is not available."));
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY, // your Razorpay key
      amount: data.amount,
      currency: data.currency,
      name: "Physioplus Healthcare",
      description: `Booking of physio with ID ${data.notes?.physioId || ""}`,
      order_id: data.id,
      prefill: {
        name: data.notes?.patientName || "",
        contact: data.notes?.phone || "",
      },
      handler: async (response) => {
        try {
          const verifyRes = await instance.post(
            `web/appointment/verifyTreatmentMultiDayPayment`,
            {
              orderId: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          if (verifyRes.status >= 200 && verifyRes.status < 300) {
            console.log("✅ Payment verified:", verifyRes.data);
            resolve(verifyRes.data);
          } else {
            console.error("❌ Payment verification failed:", verifyRes);
            reject(
              new Error(`Payment verification failed: ${verifyRes.data?.message}`)
            );
          }
        } catch (err) {
          console.error("❌ Razorpay handler error:", err);
          reject(new Error("Payment verification failed."));
        }
      },
      theme: {
        color: "#039342",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  });
};
