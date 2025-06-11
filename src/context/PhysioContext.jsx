// context/PhysioContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

import { toast } from "react-hot-toast";
import { getPhysioDataById, physioConnectProfileEdit } from "../api/physioConnect";
import { useSelector } from "react-redux";

const PhysioContext = createContext();

export const PhysioProvider = ({ children }) => {
  const userType = localStorage.getItem("userType");
  const userId = useSelector((e) => e.auth.user?.userId);

  const [physioData, setPhysioData] = useState({});
  const [invoiceData, setInvoiceData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || userType !== "physio") return;  // Only fetch for physio users

    setLoading(true);

    getPhysioDataById(userId)
      .then((res) => {
        if (res.status >= 200 && res.status < 300) {
          setInvoiceData(res.invoiceData);
          setPhysioData(res.physioData);
        } else {
          // For physio users only, show error; otherwise, silently ignore
          if (userType === "physio") {
            toast.error("Failed to load physio data");
          }
        }
      })
      .catch((err) => {
        if (userType === "physio") {
          toast.error("Error: " + (err?.message || err));
        }
      })
      .finally(() => setLoading(false));
  }, [userId, userType]);

  // Update function remains the same
  const updatePhysioData = (newData) => {
    setPhysioData((prev) => {
      const updated = { ...prev, ...newData };
      console.log("Updated Physio Data:", updated);
      return updated;
    });
  };


  // ✅ Submit all data on last step
  const submitFinalData = async () => {
    try {
      const res = await physioConnectProfileEdit(physioData);

      if (res.status === 200) {
        toast.success(res.data?.message || "Profile updated successfully!");

        try {
          const refreshed = await getPhysioDataById(userId);
          if (refreshed.status >= 200 && refreshed.status < 300) {
            setPhysioData(refreshed.physioData);
          } else {
            toast.error("Failed to refresh physio data after update");
          }
        } catch (refreshError) {
          console.error("Error while refetching:", refreshError);
          toast.error("Something went wrong while refreshing data.");
        }

        return true; // ✅ Successful
      } else {
        toast.error("Something went wrong while updating.");
        return false;
      }
    } catch (err) {
      console.error("Error during final submission:", err);
      toast.error("Submission failed.");
      return false;
    }
  };






  return (
    <PhysioContext.Provider
      value={{ invoiceData, physioData, updatePhysioData, submitFinalData, loading }}
    >
      {children}
    </PhysioContext.Provider>
  );
};

export const usePhysio = () => useContext(PhysioContext);
