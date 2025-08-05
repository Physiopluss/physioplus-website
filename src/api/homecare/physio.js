import axios from "axios";
import { instanceHomeCare,commonInstanceHomeCare } from "../axiosConfig";

export const loginPhysio = async (phone) => {
  try {
    const response = await instanceHomeCare.post(`web/physio/loginPhysioOtp`, {
      phone: phone,
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

export const OtpVerifyPhysio = async (phone, otp, type) => {
  try {
    const response = await instanceHomeCare.post(`web/physio/verifyOtp`, {
      phone,
      otp,
      type,
      
      
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



export async function getPhysioDetails(id) {
  const res = await instanceHomeCare.get("/web/physio/physioById", {
    params: { physioId: id },
  });
  return res?.data?.data;
}




export async function getAllPhysioConsultations(physioId) {
  try {
    const response = await instanceHomeCare.get("web/physio/getAppointmentByPhysio", {
      params: { physioId },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching consultations:", error);
    throw error;
  }
}

export async function getConsultationById(consultationId) {
  try {
    const response = await instanceHomeCare.get("web/physio/singleAppointment", {
      params: { appointmentId:consultationId },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching consultation:", error);
    throw error;
  }
}

export async function createTreatmentPlan(payload) {
  try {
    const res = await instanceHomeCare.post("web/physio/create-treatment", payload);
    return res?.data;
  } catch (err) {
    console.error("Error creating treatment:", err);
    throw err;
  }
}
export const verifyConsultationOtp = async ({ consultationId, otp }) => {
  const res = await instanceHomeCare.post("web/physio/verify-appointment", { appointmentId:consultationId, otp });
  return res.data;
};


export async function getAllPhysioTreatments(physioId) {
  try {
   const response = await instanceHomeCare.get("web/physio/getTreatmentByPhysio", {
      params: { physioId },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching treatments:", error);
    throw error;
  }
}

export async function getTreatmentById(id) {
  try {
    const response = await instanceHomeCare.get("web/physio/singleTreatment", {
      params: { appointmentId:id },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching treatment:", error);
    throw error;
  }
}
export async function markTreatmentDaysPaid(dayIds = [], treatmentId) {
  return instanceHomeCare.post("/web/physio/markTreatmentDaysPaid", {
    appointmentId:treatmentId,
    dateId:dayIds,
  });
}

export async function markTreatmentComplete(treatmentId) {
  return instanceHomeCare.post("/web/physio/completeTreatment", {
    appointmentId:treatmentId,
  });
}

export const updateTreatmentPlan = async ({
  treatmentId,
  dateIds,
  dates,
  startTime,
  endTime,
}) => {
  try {
    const response = await instanceHomeCare.put(
      `/web/physio/rescheduleTreatment`,
      {appointmentId:treatmentId,
        treatmentIds:dateIds,
        updatedDates:dates, // Array of ISO or string dates
        startTime,
        endTime,
       
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating treatment plan:", error?.response?.data || error.message);
    throw error;
  }
};


export const updateConsultationDate = ({ consultationId, newDate }) => {
  return instanceHomeCare.put(`/web/physio/consultation-reschedule`, {appointmentId:consultationId,
    date:newDate,
  });
};

// ✅ Get all consultations for a physio
export const getAllTodayConsultations = async ({ physioId }) => {
  const response = await instanceHomeCare.get(
    `/web/physio/getTodayAppointment/?physioId=${physioId}`
  );

  return response?.data?.data;
};
export const makePhysioWithdrawal = async ({ physioId, amount }) => {
  return instanceHomeCare.post("web/physio/wallet-withdraw", { physioId, amount });
};
export async function getPhysioWalletRevenue({  physioId }) {
  try {
    const res = await instanceHomeCare.get("/web/physio/getPhysioWalletRevenue", {
      params: {    
        physioId,   
      },
    });
    return res?.data?.data;
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    throw error;
  }
}
export async function getPhysioWithdrawTransactions({ physioId }) {
  try {
    const res = await instanceHomeCare.get("/web/physio/getWithdrawHistory", {
      params: {
 // "online" or "cash"
        physioId,   // physio's user ID
      },
    });
    return res?.data?.data;
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    throw error;
  }
}
export async function getPhysioRepayTransactions({ physioId }) {
  try {
    const res = await instanceHomeCare.get("/web/physio/payToPhysioPlusHistory", {
      params: {
        physioId,   // physio's user ID
      },
    });
    return res?.data?.data;
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    throw error;
  }
}

export const payToAdminByRazorpay = async ({
  amount,
  physioId,
  userToken,
}) => {
  if (!userToken) throw new Error("userToken is required");
  if (!physioId) throw new Error("physioId is required");
  if (!amount) throw new Error("amount is required");

  try {
    const response = await instanceHomeCare.post(
      "/web/physio/payToAdmin",
      {
        amount,
        physioId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      const data = response.data.data;
   
      
      const result = await verifyPayToAdminPayment({ data, userToken });
      return result;
    } else {
      throw new Error(response?.data?.message || "Payment initiation failed");
    }
  } catch (error) {
    console.error("Razorpay Payment Error:", error);
    throw error;
  }
};

export const verifyPayToAdminPayment = async ({ data, userToken }) => {
  return new Promise((resolve, reject) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.notes.amount,
      currency: data.currency,
    
      name: "Physioplus Healthcare",
      address:data.notes.appointmentAddress,
      description: `Payment to Physio-Plus`,
      order_id: data.id,
      prefill: {
        name: data.notes.patientName,
        contact: data.notes.phone,
      },
      handler: async (response) => {
        try {
          const verifyRes = await instanceHomeCare.post(
            "web/physio/verifyPayToAdmin",
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
            resolve(verifyRes.data);
          } else {
            reject(
              new Error(
                verifyRes.data?.message || "Payment verification failed"
              )
            );
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          reject(error);
        }
      },
      theme: {
        color: "#039342",
      },
    };

    if (window.Razorpay) {
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } else {
      reject(new Error("Razorpay is not available"));
    }
  });
};