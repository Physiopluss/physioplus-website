import axios from "axios";
import { instanceHomeCare,commonInstanceHomeCare } from "../axiosConfig";

export const loginPhysio = async (phone) => {
  try {
    const response = await instanceHomeCare.post(`web/physio/loginOtp`, {
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