import { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./slices/authSlice";
import ReactGA from "react-ga4";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "leaflet/dist/leaflet.css";
import { LoadScript } from "@react-google-maps/api";
const apiKey = import.meta.env.VITE_GOOGLE_KEY;

// main or ui
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import ErrorComp from "./components/ErrorComp";
import Cta from "./components/Cta";
import NoInternet from "./components/NoInternet";
import OrderDetails from "./pages/Booking/OrderDetails";

import PhysioRefundPolicy from "./pages/PhysioRefundPolicy";
import TreatmentDetails from "./pages/Booking/TreatmentDetails";

// auth
const Login = lazy(() => import("./pages/Auth/Login"));

const SignUp = lazy(() => import("./pages/Auth/SignUp"));

// homecare
// auth new for homecare
import HomecareLayout from "./pages/layout/HomecareLayout";
import TestPage from "./pages/TestPage";
// for patient
const LoginNew = lazy(() => import("./pages/homecare/auth/LoginNew"));
const SignUpNew = lazy(() => import("./pages/homecare/auth/SignUpNew"));
const HomecareSupport = lazy(() => import("./pages/homecare/HomecareSupport"));
const PatientProfile = lazy(() =>
  import("./pages/homecare/patient/PatientProfile")
);
const PatientOrderHistory = lazy(() =>
  import("./pages/homecare/patient/PatientOrderHistory")
);

const ConsultationOrderList = lazy(() =>
  import("./pages/homecare/patient/ConsultationOrderList")
);
const TreatmentOrderList = lazy(() =>
  import("./pages/homecare/patient/TreatmentOrderList")
);
const PerferConsultation = lazy(() =>
  import("./pages/homecare/patient/PerferConsultation")
);
const ViewConsultation = lazy(() =>
  import("./pages/homecare/patient/ViewConsultation")
);
const TaxInvoice = lazy(() => import("./components/homecare/comp/TaxInvoice"));
const PhysioTaxInvoice = lazy(() =>
  import("./components/homecare/comp/PhysioTaxInvoice")
);
const PerferTreatment = lazy(() =>
  import("./pages/homecare/patient/PerferTreatment")
);
const PaymentPage = lazy(() => import("./pages/homecare/patient/PaymentPage"));
const ViewTreatment = lazy(() =>
  import("./pages/homecare/patient/ViewTreatment")
);

// patient side physio
const LoginPhysio = lazy(() => import("./pages/homecare/auth/LoginPhysio"));

const HomePhysios = lazy(() => import("./pages/homecare/HomePhysios"));
const BookPhysioPage = lazy(() => import("./pages/homecare/BookPhysioPage"));
const PhysioProfile = lazy(() => import("./pages/homecare/PhysioProfile"));
const BookingSummaryPage = lazy(() =>
  import("./pages/homecare/BookingSummaryPage")
);

// for physio

const PhysioOrderHistory = lazy(() =>
  import("./pages/homecare/physio/PhysioOrderHistory")
);
const ConsultationPage = lazy(() =>
  import("./pages/homecare/physio/ConsultationPage")
);
const TreatmentPage = lazy(() =>
  import("./pages/homecare/physio/TreatmentPage")
);
const PhysioProfileData = lazy(() =>
  import("./pages/homecare/physio/PhysioProfile")
);
const WalletPage = lazy(() => import("./pages/homecare/physio/WalletPage"));
const ConsultationDetailPage = lazy(() =>
  import("./pages/homecare/physio/ConsultationDetailPage")
);
const TreatmentDetailPage = lazy(() =>
  import("./pages/homecare/physio/TreatmentDetailPage")
);
const CreateTreatmentPage = lazy(() =>
  import("./pages/homecare/physio/CreateTreatmentPage")
);
const PhysioHomeScreen = lazy(() =>
  import("./pages/homecare/physio/PhysioHomeScreen")
);
// const  =lazy(()=>import("./pages/homecare/physio/"))
// const  =lazy(()=>import("./pages/homecare/physio/"))
// const  =lazy(()=>import("./pages/homecare/physio/"))
const PhysioAccount = lazy(() =>
  import("./pages/homecare/physio/PhysioAccount")
);

// main sites

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Profile = lazy(() => import("./pages/Profile"));

const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Refund = lazy(() => import("./pages/Refund"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));

// booking flow
const Booking = lazy(() => import("./pages/Booking/Booking"));
const PhysioDetail = lazy(() => import("./pages/Booking/PhysioDetail"));
const ListAllPhysios = lazy(() => import("./pages/Booking/ListAllPhysios"));
const OrderDetail = lazy(() => import("./pages/Booking/OrderDetail"));
const OrderHistory = lazy(() => import("./pages/Booking/OrderHistory"));

// blogs
const Blog = lazy(() => import("./pages/Blog/Blog"));
const BlogDetail = lazy(() => import("./pages/Blog/BlogDetail"));

// physioConnect flow
const PhysioConnect = lazy(() => import("./pages/PhysioConnect/PhysioConnect"));
const PhysioConnectProfessionalForm = lazy(() =>
  import("./pages/PhysioConnect/PhysioConnectProfessionalForm")
);
const PhysioConnectPersonalForm = lazy(() =>
  import("./pages/PhysioConnect/PhysioConnectPersonalForm")
);
const PhysioConnectBusinessDetails = lazy(() =>
  import("./pages/PhysioConnect/PhysioConnectBusinessDetails")
);
const PhysioConnectPayment = lazy(() =>
  import("./pages/PhysioConnect/PhysioConnectPayment")
);
const PhysioConnectSignup = lazy(() =>
  import("./pages/PhysioConnect/PhysioConnectSignup")
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Helmet>
          <title>Physioplus Healthcare</title>
          <meta
            name="description"
            content="Discover Physioplus Healthcare: Your destination for comprehensive physiotherapy care in India. Offering in-clinic and home care services, we provide personalized treatments to help you recover and thrive. Visit us today and experience the best in physiotherapy."
          />
          <meta
            name="keywords"
            content="Physioplus Healthcare, physiotherapy care, comprehensive physiotherapy, in-clinic services, home care services, Jaipur physiotherapy, Delhi Physiotherapy."
          />
        </Helmet>
        <div className="font-Urbanist text-black min-h-screen flex flex-wrap flex-col justify-between">
          <Navbar />
          <div>
            <Outlet />
            <Cta />
          </div>
          <Footer />
        </div>
      </>
    ),
    errorElement: <ErrorComp />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loading />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        ),
      },

      {
        path: "/signup",
        element: (
          <Suspense fallback={<Loading />}>
            <SignUp />
          </Suspense>
        ),
      },
      {
        path: "/about",
        element: (
          <Suspense fallback={<Loading />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: "/contact",
        element: (
          <Suspense fallback={<Loading />}>
            <Contact />
          </Suspense>
        ),
      },

      {
        path: "/physios",
        element: (
          <Suspense fallback={<Loading />}>
            <ListAllPhysios />
          </Suspense>
        ),
      },
      {
        path: "/physios/:slug",
        element: (
          <Suspense fallback={<Loading />}>
            <PhysioDetail />
          </Suspense>
        ),
      },
      {
        path: "/booking/:slug",
        element: (
          <Suspense fallback={<Loading />}>
            <Booking />
          </Suspense>
        ),
      },
      {
        path: "/order-history",
        element: (
          <Suspense fallback={<Loading />}>
            <OrderHistory />
          </Suspense>
        ),
      },
      {
        path: "/order-details",
        element: (
          <Suspense fallback={<Loading />}>
            <OrderDetails />
          </Suspense>
        ),
      },
      {
        path: "/treatment-details",
        element: (
          <Suspense fallback={<Loading />}>
            <TreatmentDetails />
          </Suspense>
        ),
      },

      {
        path: "/order-history/:orderId",
        element: (
          <Suspense fallback={<Loading />}>
            <OrderDetail />
          </Suspense>
        ),
      },
      {
        path: "/profile",
        element: (
          <Suspense fallback={<Loading />}>
            <Profile />
          </Suspense>
        ),
      },

      {
        path: "/privacy",
        element: (
          <Suspense fallback={<Loading />}>
            <Privacy />
          </Suspense>
        ),
      },
      {
        path: "/terms&condition",
        element: (
          <Suspense fallback={<Loading />}>
            <Terms />
          </Suspense>
        ),
      },
      {
        path: "/refund-policy",
        element: (
          <Suspense fallback={<Loading />}>
            <Refund />
          </Suspense>
        ),
      },
      {
        path: "/physio-refund-policy",
        element: (
          <Suspense fallback={<Loading />}>
            <PhysioRefundPolicy />
          </Suspense>
        ),
      },
      {
        path: "/physio-terms&condition",
        element: (
          <Suspense fallback={<Loading />}>
            <Terms />
          </Suspense>
        ),
      },
      {
        path: "/order-success",
        element: (
          <Suspense fallback={<Loading />}>
            <OrderSuccess />
          </Suspense>
        ),
      },
      {
        path: "/blog",
        element: (
          <Suspense fallback={<Loading />}>
            <Blog />
          </Suspense>
        ),
      },
      {
        path: "/blog/:slug",
        element: (
          <Suspense fallback={<Loading />}>
            <BlogDetail />
          </Suspense>
        ),
      },
      {
        path: "/physio-connect",
        element: (
          <Suspense fallback={<Loading />}>
            <PhysioConnect />
          </Suspense>
        ),
      },
      {
        path: "/physio-connect/personal-details",
        element: (
          <Suspense fallback={<Loading />}>
            <PhysioConnectPersonalForm />
          </Suspense>
        ),
      },
      {
        path: "/physio-connect/professional-details",
        element: (
          <Suspense fallback={<Loading />}>
            <PhysioConnectProfessionalForm />
          </Suspense>
        ),
      },
      {
        path: "/physio-connect/business-details",
        element: (
          <Suspense fallback={<Loading />}>
            <PhysioConnectBusinessDetails />
          </Suspense>
        ),
      },

      {
        path: "/physio-connect/payment",
        element: (
          <Suspense fallback={<Loading />}>
            <PhysioConnectPayment />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/physio-connect/signup",
    element: (
      <Suspense fallback={<Loading />}>
        <PhysioConnectSignup />
      </Suspense>
    ),
    errorElement: <ErrorComp />,
  },

  // homecare routes
  {
    path: "/homecare",
    element: <HomecareLayout />,
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <HomePhysios />
          </Suspense>
        ),
      },

      {
        path: "test",
        element: <TestPage />,
      },
      // patient routes
      {
        path: "login-new",
        element: (
          <Suspense fallback={<Loading />}>
            <LoginNew />
          </Suspense>
        ),
      },

      {
        path: "signup-new",
        element: (
          <Suspense fallback={<Loading />}>
            <SignUpNew />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<Loading />}>
            <About />
          </Suspense>
        ),
      },

      {
        path: "contact",
        element: (
          <Suspense fallback={<Loading />}>
            <HomecareSupport />
          </Suspense>
        ),
      },

      {
        path: "patient-profile",
        element: (
          <Suspense fallback={<Loading />}>
            <PatientProfile />
          </Suspense>
        ),
      },
      {
        path: "patient-order-history",
        element: (
          <Suspense fallback={<Loading />}>
            <PatientOrderHistory />
          </Suspense>
        ),
      },

      {
        path: "consultation-orders",
        element: (
          <Suspense fallback={<Loading />}>
            <ConsultationOrderList />
          </Suspense>
        ),
      },
      {
        path: "prefer-consultation/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <PerferConsultation />
          </Suspense>
        ),
      },
      {
        path: "consultation-detail/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <ViewConsultation />
          </Suspense>
        ),
      },

      {
        path: "treatment-orders",
        element: (
          <Suspense fallback={<Loading />}>
            <TreatmentOrderList />
          </Suspense>
        ),
      },
      {
        path: "prefer-Treatment/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <PerferTreatment />
          </Suspense>
        ),
      },
      {
        path: "treatment-detail/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <ViewTreatment />
          </Suspense>
        ),
      },
      {
        path: "treatment-payment",
        element: (
          <Suspense fallback={<Loading />}>
            <PaymentPage />
          </Suspense>
        ),
      },

      {
        path: "show-invoice",
        element: (
          <Suspense fallback={<Loading />}>
            <TaxInvoice />
          </Suspense>
        ),
      },
      {
        path: "profile/:physioId",
        element: (
          <Suspense fallback={<Loading />}>
            <PhysioProfile />
          </Suspense>
        ),
      },
      {
        path: "book/:physioId",
        element: (
          <Suspense fallback={<Loading />}>
            <BookPhysioPage />
          </Suspense>
        ),
      },
      {
        path: "book/summary",
        element: (
          <Suspense fallback={<Loading />}>
            <BookingSummaryPage />
          </Suspense>
        ),
      },

      // physio

      {
        path: "login-physio",
        element: (
          <Suspense fallback={<Loading />}>
            <LoginPhysio />
          </Suspense>
        ),
      },

      {
        path: "physio-profile",
        element: (
          <Suspense fallback={<Loading />}>
            <PhysioProfileData />
          </Suspense>
        ),
      },
      {
        path: "physio-order-history",
        element: (
          <Suspense fallback={<Loading />}>
            <PhysioOrderHistory />
          </Suspense>
        ),
      },
      {
        path: "physio-current",
        element: (
          <Suspense fallback={<Loading />}>
            <PhysioHomeScreen />
          </Suspense>
        ),
      },
      {
        path: "get-invoice",
        element: (
          <Suspense fallback={<Loading />}>
            <PhysioTaxInvoice />
          </Suspense>
        ),
      },
      {
        path: "physio-consultations",
        element: (
          <Suspense fallback={<Loading />}>
            <ConsultationPage />
          </Suspense>
        ),
      },
      {
        path: "physio-consultation/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <ConsultationDetailPage />
          </Suspense>
        ),
      },
      {
        path: "create-treatment/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <CreateTreatmentPage />
          </Suspense>
        ),
      },

      {
        path: "physio-treatments",
        element: (
          <Suspense fallback={<Loading />}>
            <TreatmentPage />
          </Suspense>
        ),
      },
      {
        path: "physio-treatment/:id",
        element: (
          <Suspense fallback={<Loading />}>
            <TreatmentDetailPage />
          </Suspense>
        ),
      },
      {
        path: "physio-wallet",
        element: (
          <Suspense fallback={<Loading />}>
            <WalletPage />
          </Suspense>
        ),
      },
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <br />
          </Suspense>
        ),
      },
      {
        path: "",
        element: (
          <Suspense fallback={<Loading />}>
            <br />
          </Suspense>
        ),
      },
      {
        path: "physio",
        element: (
          <Suspense fallback={<Loading />}>
            <PhysioAccount />
          </Suspense>
        ),
      },
    ],
  },
]);

const App = () => {
  const dispatch = useDispatch();
  const helmetContext = {};
  ReactGA.initialize("G-C5SWTZWJJM");

  useEffect(() => {
    dispatch(setUser(JSON.parse(localStorage.getItem("user"))));
  }, [dispatch]);

  return (
    <HelmetProvider context={helmetContext}>
      <NoInternet>
        <LoadScript googleMapsApiKey={apiKey} libraries={["places"]}>
          <RouterProvider router={router} />
        </LoadScript>
      </NoInternet>
    </HelmetProvider>
  );
};
export default App;
