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
      params: { consultationId },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching consultation:", error);
    throw error;
  }
}

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

export async function getTreatmentById(treatmentId) {
  try {
    const response = await instanceHomeCare.get("web/physio/singleTreatment", {
      params: { treatmentId },
    });
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching treatment:", error);
    throw error;
  }
}
