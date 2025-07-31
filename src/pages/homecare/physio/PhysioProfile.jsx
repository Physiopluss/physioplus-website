// import React from "react";

// export default function PhysioProfile() {
//   return (
//     <div className="max-w-md mx-auto min-h-screen bg-[#f8f9fa] pb-10">
//       {/* Profile Card */}
//       <div className="flex flex-col items-center bg-white rounded-xl shadow border border-gray-100 px-6 pt-8 pb-6 mt-7 mx-3">
//         <img
//           src="https://randomuser.me/api/portraits/men/1.jpg"
//           alt="Dr. Aman Singh"
//           className="w-20 h-20 rounded-full object-cover border-2 border-green mb-2"
//         />
//         <div className="font-semibold text-xl mt-1">Dr. Aman Singh</div>
//         <div className="text-green font-medium text-sm mt-1">
//           MPT (Ortho), BPT
//         </div>
//         <div className="text-xs text-gray-500 mt-0.5">
//           Physiotherapist • 6 Years Experience
//         </div>
//         <div className="flex gap-2 mt-4">
//           <button className="px-4 py-2 rounded-lg bg-green/10 text-green text-sm font-semibold border border-green">
//             Call
//           </button>
//           <button className="px-4 py-2 rounded-lg bg-green text-white text-sm font-semibold">
//             Message
//           </button>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="flex justify-between gap-2 mt-5 mx-3">
//         <div className="flex flex-col items-center flex-1 bg-white rounded-xl shadow border border-green/10 p-4">
//           <span className="font-semibold text-lg text-green">4.9</span>
//           <span className="text-xs text-gray-400 mt-0.5">Ratings</span>
//         </div>
//         <div className="flex flex-col items-center flex-1 bg-white rounded-xl shadow border border-green/10 p-4">
//           <span className="font-semibold text-lg text-green">254</span>
//           <span className="text-xs text-gray-400 mt-0.5">Consultations</span>
//         </div>
//         <div className="flex flex-col items-center flex-1 bg-white rounded-xl shadow border border-green/10 p-4">
//           <span className="font-semibold text-lg text-green">13</span>
//           <span className="text-xs text-gray-400 mt-0.5">Treatments</span>
//         </div>
//       </div>

//       {/* About and Details */}
//       <div className="bg-white rounded-xl shadow border border-gray-100 px-5 py-4 mt-6 mx-3">
//         <div className="font-semibold text-base text-gray-800 mb-1">About</div>
//         <div className="text-sm text-gray-700 mb-4">
//           Dr. Aman Singh specializes in orthopedic physiotherapy with 6+ years
//           experience across clinics and home care. Skilled with sports injuries,
//           chronic pain, and post-surgery rehabilitation.
//         </div>
//         <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-600">
//           <span className="font-semibold">Qualification:</span>
//           <span>MPT (Ortho), BPT</span>
//           <span className="font-semibold">Registration No.:</span>
//           <span>PT20221547</span>
//           <span className="font-semibold">Phone:</span>
//           <span>+91 91234 56789</span>
//           <span className="font-semibold">Clinic:</span>
//           <span>Shanti Nagar Physiotherapy Center, Jaipur</span>
//         </div>
//       </div>
//     </div>
//   );
// }
import React from "react";
import { Wallet, Star, HelpCircle, Info, LogOut } from "lucide-react";

export default function PhysioProfile() {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#f8f9fa] pb-10">
      {/* Header */}
      <div className="w-full bg-white h-14 flex items-center justify-center border-b border-gray-100 text-base font-semibold">
        Profile
      </div>

      {/* Profile Top Card */}
      <div className="mx-3 mt-8">
        <div className="bg-white rounded-xl shadow flex flex-col items-center pt-5 pb-2 px-2 relative">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Dr. Jolly Saxena"
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md -mt-10"
          />
          <div className="mt-2 font-bold text-lg">Dr. Jolly Saxena</div>
          <div className="text-xs text-gray-500 mt-1 mb-1.5 text-center">
            Cardiologist | Physio Plus Hospital
          </div>
          <button className="w-[85%] bg-green text-white rounded-lg py-2 font-semibold shadow mt-2 mb-2 text-sm">
            Physiplous Pro
          </button>
        </div>
      </div>

      {/* Menu List */}
      <div className="mt-5 mx-3 space-y-0.5">
        <button className="flex items-center w-full bg-white rounded-lg px-4 py-3 shadow text-gray-800 text-base font-medium mb-1">
          <Wallet className="w-5 h-5 mr-4 text-green" />
          My Wallet
        </button>
        <button className="flex items-center w-full bg-white rounded-lg px-4 py-3 shadow text-gray-800 text-base font-medium mb-1">
          <Star className="w-5 h-5 mr-4 text-yellow-400" />
          Rating & Review
        </button>
        <button className="flex items-center w-full bg-white rounded-lg px-4 py-3 shadow text-gray-800 text-base font-medium mb-1">
          <HelpCircle className="w-5 h-5 mr-4 text-blue-400" />
          Help & Support
        </button>
        <button className="flex items-center w-full bg-white rounded-lg px-4 py-3 shadow text-gray-800 text-base font-medium mb-1">
          <Info className="w-5 h-5 mr-4 text-green-500" />
          About Us
        </button>
        {/* Logout Button */}
        <button className="flex items-center w-full bg-white rounded-lg px-4 py-3 shadow text-red-600 text-base font-semibold mt-2">
          <LogOut className="w-5 h-5 mr-4 text-red-600" />
          Logout
        </button>
      </div>
    </div>
  );
}
