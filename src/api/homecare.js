import { instanceHomeCare,commonInstanceHomeCare } from "./axiosConfig";

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