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


export async function getPhysioWalletRevenue({ mode, physioId }) {
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
export async function getPhysioWalletDetails({ mode, physioId }) {
  try {
    const res = await instanceHomeCare.get("/web/physio/getPhysioWallet", {
      params: {
        mode,       // "online" or "cash"
        physioId,   // physio's user ID
      },
    });
    return res?.data?.data;
  } catch (error) {
    console.error("Error fetching wallet details:", error);
    throw error;
  }
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