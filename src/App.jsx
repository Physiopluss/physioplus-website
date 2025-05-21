import { lazy, Suspense, useEffect } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./slices/authSlice";
import ReactGA from "react-ga4";
import { Helmet, HelmetProvider } from "react-helmet-async";

// main or ui
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import ErrorComp from "./components/ErrorComp";
import Cta from "./components/Cta";
import NoInternet from "./components/NoInternet";
import OrderDetails from "./pages/Booking/OrderDetails";

// auth
const Login = lazy(() => import("./pages/Auth/Login"));
const Loginphysio = lazy(() => import("./pages/Auth/Loginphysio"));
const SignUp = lazy(() => import("./pages/Auth/SignUp"));

// pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Profile = lazy(() => import("./pages/Profile"));
const Profilephysio = lazy(() => import("./pages/Profilephysio"));
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
const OrderHistoryPhysio = lazy(() => import("./pages/OrderHistoryPhysio"));
const Professionalprofile = lazy(() => import("./pages/Professionalprofile"));
const Editpersonalprofile = lazy(() => import("./pages/PhysioConnect/Editpersonalprofile"));

// blogs
const Blog = lazy(() => import("./pages/Blog/Blog"));
const BlogDetail = lazy(() => import("./pages/Blog/BlogDetail"));

// physioConnect flow
const PhysioConnect = lazy(() => import("./pages/PhysioConnect/PhysioConnect"));
const PhysioConnectProfessionalForm = lazy(() => import("./pages/PhysioConnect/PhysioConnectProfessionalForm"));
const PhysioConnectPersonalForm = lazy(() => import("./pages/PhysioConnect/PhysioConnectPersonalForm"));
const PhysioConnectBusinessDetails = lazy(() => import("./pages/PhysioConnect/PhysioConnectBusinessDetails"));
const PhysioConnectWorkExperience = lazy(() => import("./pages/PhysioConnect/PhysioConnectWorkExperience"));
const PhysioConnectPayment = lazy(() => import("./pages/PhysioConnect/PhysioConnectPayment"));
const PhysioConnectSignup = lazy(() => import("./pages/PhysioConnect/PhysioConnectSignup"));

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
				path: "/login-physio",
				element: (
					<Suspense fallback={<Loading />}>
						<Loginphysio />
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
				path: "/order-history-physio",
				element: (
					<Suspense fallback={<Loading />}>
						<OrderHistoryPhysio />
					</Suspense>
				),
			},
			{
				path: "/professional",
				element: (
					<Suspense fallback={<Loading />}>
						<Professionalprofile />
					</Suspense>
				),
			},
			{
				path: "/edit-personal",
				element: (
					<Suspense fallback={<Loading />}>
						<Editpersonalprofile />
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
				path: "/profile-physio",
				element: (
					<Suspense fallback={<Loading />}>
						<Profilephysio />
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
				path: "/blog/:blogId",
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
				path: "/physio-connect/work-experience",
				element: (
					<Suspense fallback={<Loading />}>
						<PhysioConnectWorkExperience />
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
				<RouterProvider router={router} />
			</NoInternet>
		</HelmetProvider>
	);
};
export default App;
