import axios from "axios";
import { instanceHomeCare,commonInstanceHomeCare } from "./axiosConfig";


// Auth routes functions

// patient

export const loginNew = async (phone) => {
  try {
    const response = await instanceHomeCare.post(`web/patient/loginOtp`, {
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

export const OtpVerifyNew = async (phone, otp, type, fullName, gender, date, dob) => {
  try {
    const response = await instanceHomeCare.post(`web/patient/verifyOtp`, {
      phone,
      otp,
      type,
      fullName,
      gender,
      date,
      dob,
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

export const signUpNew = async (values) => {
  try {
    const response = await instanceHomeCare.post(`web/patient/signUpOtp`, {
      fullName: values.fullName,
      phone: values.phone,
      dob: values.date,
      gender: values.gender,
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


// ✅ GET Patient Details
// ✅ api/homecare/patient.js
export async function getPatientDetails(id) {
  const res = await instanceHomeCare.get("/web/patient/getPatientById", {
    params: { patientId: id },
  });
  return res?.data?.data;
}

export async function editPatientDetails(id, payload) {
  const res = await instanceHomeCare.put(`/web/patient/updatePatient/${id}`, payload);
  return res?.data;
}



export const getPresignedUrl = async (file, folder) => {
  const params = {
    fileName: file.name,
    fileType: file.type,
    folder,
  };

  const res = await commonInstanceHomeCare.get("/get-presigned-url", { params });
  return res.data; // { uploadUrl, fileUrl, fileKey }
};

export const uploadFileToS3 = async (file, presignedUrl) => {
  await axios.put(presignedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });
  console.log("File uploaded successfully:", presignedUrl);
};

// ✅ GET All Consultations of a Patient
export async function getAllPatientConsultations(patientId) {
  try {
    const response = await instanceHomeCare.get("web/patient/getPatientAppointments", {
      params: { patientId },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching consultations:", error);
    throw error;
  }
}

// ✅ GET Single Consultation by ID
export async function getConsultationById(consultationId) {
  try {
    const response = await instanceHomeCare.get("web/patient/singleAppointment", {
      params: { consultationId },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching consultation:", error);
    throw error;
  }
}

// ✅ GET All Treatments of a Patient
export async function getAllPatientTreatments(patientId) {
  try {
   const response = await instanceHomeCare.get("web/patient/getPatientTreatments", {
      params: { patientId },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching treatments:", error);
    throw error;
  }
}



// ✅ GET Single Treatment by ID
export async function getTreatmentById(treatmentId) {
  try {
    const response = await instanceHomeCare.get("web/patient/singleTreatment", {
      params: { treatmentId },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching treatment:", error);
    throw error;
  }
}




export const couponApi = async (couponName, patientId, userToken) => {
  try {
    const response = await instanceHomeCare.post(
      `web/patient/coupon`,
      {
        couponName,
        patientId,
      },
      {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${userToken}` },
      }
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data;
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

export const payForTreatmentDayToRazorpay = async ({
  treatmentDayIds, // ✅ expect array now
  orderId,
  couponId,
  amount,
  patientId,
  physioId,
  userToken,
}) => {
  if (!userToken) throw new Error("userToken is required");
  if (!patientId) throw new Error("patientId is required");
  if (!physioId) throw new Error("physioId is required");
  if (!amount) throw new Error("amount is required");

  try {
    const response = await instanceHomeCare.post(
      "/web/patient/payTreatmentDay",
      {
        dateIds: treatmentDayIds, // ✅ array of day IDs
        appointmentsId: orderId,
        couponId,
        amount,
        patientId,
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
      const data = response.data.razorpay;
      
      const result = await verifyTreatmentPayment({ data, userToken });
      return result;
    } else {
      throw new Error(response?.data?.message || "Payment initiation failed");
    }
  } catch (error) {
    console.error("Razorpay Payment Error:", error);
    throw error;
  }
};

export const verifyTreatmentPayment = async ({ data, userToken }) => {
  return new Promise((resolve, reject) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.notes.amount,
      currency: data.currency,
      name: "Physioplus Healthcare",
      description: `Treatment Payment - Physio ID: ${data.notes.physioId}`,
      order_id: data.id,
      prefill: {
        name: data.notes.patientName,
        contact: data.notes.phone,
      },
      handler: async (response) => {
        try {
          const verifyRes = await instanceHomeCare.post(
            "web/patient/verifyTreatmentPayment",
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


// ✅ GET Invoice for Consultation
export async function getConsultationInvoice(consultationId) {
  try {
    const response = await instanceHomeCare.get("web/invoice/consultation", {
      params: { consultationId },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching consultation invoice:", error);
    throw error;
  }
}

// ✅ GET Invoice for Treatment
export async function getTreatmentInvoice(treatmentId) {
  try {
    const response = await instanceHomeCare.get("web/invoice/treatment", {
      params: { treatmentId },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching treatment invoice:", error);
    throw error;
  }
}


// ✅ SUBMIT Rating for Physio
export async function ratePhysio(payload) {
  try {
    const response = await instanceHomeCare.post("web/patient/addRatingToPhysio", payload);
    return response?.data;
  } catch (error) {
    console.error("Error rating physio:", error);
    throw error;
  }
}


// ✅ SUBMIT Rating for Patient
export async function ratePatient(payload) {
  try {
    const response = await instanceHomeCare.post("web/rating/patient", payload);
    return response?.data;
  } catch (error) {
    console.error("Error rating patient:", error);
    throw error;
  }
}






// physio
export async function getPhysios(params = {}) {
  try {
    const response = await instanceHomeCare.get("web/physio/allPhysios", { params });
    return response?.data?.data;
  } catch (error) {
    throw error;
  }
}

export async function getPhysioById(id) {
  try {
    const response = await instanceHomeCare.get("web/physio/singlePhysio", {
      params: { physioId: id },
    });
   
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching physio:", error); // ✅ Better error logging
    throw error;
  }
}