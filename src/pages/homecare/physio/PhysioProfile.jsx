import React, { useEffect, useState } from "react";
import { Wallet, Star, HelpCircle, Info, LogOut } from "lucide-react";
import { getPhysioDetails } from "../../../api/homecare/physio";
import { useDispatch } from "react-redux";
import { setLogOut } from "../../../slices/homecare/newAuthSlice";
import { useNavigate } from "react-router-dom";

export default function PhysioProfile() {
  const [physio, setPhysio] = useState(null);
  const physioId =
    JSON.parse(localStorage.getItem("homecareUser"))?.userId ?? null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  dispatch(setLogOut());
  useEffect(() => {
    const fetchPhysio = async () => {
      try {
        const data = await getPhysioDetails(physioId);
        setPhysio(data);
      } catch (error) {
        console.error("Error fetching physio details:", error);
      }
    };

    fetchPhysio();
  }, []);
  const handleLogout = () => {
    closeMenu();
    localStorage.removeItem("homecareUser");
    localStorage.removeItem("homecareUserType");
    dispatch(setLogOut());
    navigate("/homecare");
  };
  return (
    <div className="max-w-md mx-auto min-h-screen bg-white pb-10">
      {/* Header */}
      <div className="w-full bg-white h-14 flex items-center justify-center border-b border-gray-100 text-base font-semibold">
        Profile
      </div>

      {/* Profile Top Card */}
      <div className="mx-3 mt-8">
        <div className="bg-white rounded-xl shadow flex flex-col items-center pt-5 pb-2 px-2 relative">
          <img
            src={physio?.profileImage}
            alt={physio?.fullName || "Physio"}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md -mt-10"
          />
          <div className="mt-2 font-bold text-lg">{physio?.fullName}</div>
          <div className="text-xs text-gray-500 mt-1 mb-1.5 text-center">
            {physio?.specialization?.map((item) => item?.name).join(", ")} |{" "}
            {"Physio Plus Hospital "}
          </div>
          <button className="w-[85%] bg-green text-white rounded-lg py-2 font-semibold shadow mt-2 mb-2 text-sm">
            {physio?.subscriptionId?.planId?.name}
          </button>
        </div>
      </div>

      {/* Menu List */}
      <div className="mt-5 mx-3 space-y-0.5">
        <button
          onClick={() => navigate("/homecare/physio-wallet")}
          className="flex items-center w-full bg-white rounded-lg px-4 py-3 shadow text-gray-800 text-base font-medium mb-1"
        >
          <Wallet className="w-5 h-5 mr-4 text-green" />
          My Wallet
        </button>
        {/* <button className="flex items-center w-full bg-white rounded-lg px-4 py-3 shadow text-gray-800 text-base font-medium mb-1">
          <Star className="w-5 h-5 mr-4 text-yellow-400" />
          Rating & Review
        </button> */}
        <button
          onClick={() => navigate("/homecare/contact")}
          className="flex items-center w-full bg-white rounded-lg px-4 py-3 shadow text-gray-800 text-base font-medium mb-1"
        >
          <HelpCircle className="w-5 h-5 mr-4 text-blue-400" />
          Help & Support
        </button>
        {/* <button
          onClick={() => navigate("/homecare/about")}
          className="flex items-center w-full bg-white rounded-lg px-4 py-3 shadow text-gray-800 text-base font-medium mb-1"
        >
          <Info className="w-5 h-5 mr-4 text-green" />
          About Us
        </button> */}
        {/* Logout Button */}
        <button
          className="flex items-center w-full bg-white rounded-lg px-4 py-3 shadow text-red-600 text-base font-semibold mt-2"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-4 text-red-600" />
          Logout
        </button>
      </div>
    </div>
  );
}
