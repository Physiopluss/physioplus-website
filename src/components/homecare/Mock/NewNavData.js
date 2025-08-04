const patientNavData = [
  { id: 1, name: "Book Physio", slug: "/homecare" },
  { id: 2, name: "Bookings", slug: "/homecare/patient-order-history" },
//   { id: 3, name: "About", slug: "/homecare/about" },
  { id: 4, name: "Contact", slug: "/homecare/contact" },
];

const physioNavData = [
  { id: 1, name: "Today", slug: "/homecare/physio-current" },
  { id: 2, name: "Appointments", slug: "/homecare/physio-consultations" },
  { id: 3, name: "Treatments", slug: "/homecare/physio-treatments" },
    // { id: 4, name: "About", slug: "/homecare/about" },
  { id: 5, name: "Contact", slug: "/homecare/contact" },
];

export const getNewNavData = () => {
  const userType = localStorage.getItem("homecareUserType");
  if (userType === "physio") return physioNavData;
  return patientNavData;
};
