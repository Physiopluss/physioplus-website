import React from "react";
import PhysioHomeScreen from "./homecare/physio/PhysioHomeScreen";
import PhysioTabsPage from "./homecare/physio/PhysioTabsPage";
import ConsultationSessionPage from "./homecare/physio/ConsultationSessionPage";
import ConsultationPage from "./homecare/physio/ConsultationPage";
import TreatmentPage from "./homecare/physio/TreatmentPage";
import CreateTreatmentPage from "./homecare/physio/CreateTreatmentPage";
import TreatmentDetailPage from "./homecare/physio/TreatmentDetailPage";
import ConsultationDetailPage from "./homecare/physio/ConsultationDetailPage";
import PaymentHistory from "./homecare/physio/PaymentHistory";
import WalletPage from "./homecare/physio/WalletPage";
import PhysioProfile from "./homecare/physio/PhysioProfile";

// 🧪 Import the component(s) you want to test here

// 🧪 Dummy data (for testing props)
const DEMO_DATA = {
  patientName: "Test User",
  type: "Consultation",
  date: "01 Aug, 2025",
  time: "03:00 PM",
  mode: "Video Call",
  avatar: "https://randomuser.me/api/portraits/men/4.jpg",
};

export default function TestPage() {
  const handleStart = () => {
    alert("Start clicked!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-xl font-semibold mb-4 text-center text-green-700">
        🧪 Testing Playground
      </h1>

      {/* 👇 Uncomment one of the blocks below to test a specific component */}

      {/* 1. Test AppointmentCard directly */}
      {/* <AppointmentCard {...DEMO_DATA} onStart={handleStart} /> */}

      {/* 2. Test full Physio Home Screen */}
      {/* <PhysioHomeScreen /> */}

      {/* 3. Add your new components below to test */}
      {/* <PhysioTabsPage /> */}
      {/* <ConsultationDetailPage /> */}
      {/* <ConsultationSessionPage /> */}
      {/* <ConsultationPage /> */}
      {/* <TreatmentPage /> */}
      {/* <CreateTreatmentPage /> */}
      {/* <TreatmentDetailPage /> */}
      {/* <PaymentHistory /> */}
      {/* <WalletPage /> */}
      <PhysioProfile />
      {/* 3. Add your new components below to test */}
      {/* <MyNewComponent /> */}
    </div>
  );
}
