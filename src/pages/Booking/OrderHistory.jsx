import OrderCard from "../../components/OrderCard";
import { useDispatch, useSelector } from "react-redux";
import { allOrders } from "../../api/booking";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactGA from "react-ga4";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import { setLogOut } from "../../slices/authSlice";

const OrderHistory = () => {
	const { userId, userToken } = useSelector((e) => e.auth.user || {});
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [tab, setTab] = useState("all");

	const navigate = useNavigate();
	const dispatch = useDispatch();

	if (!userId) {
		navigate("login");
	}

	let reversedOrders;
	useEffect(() => {
		allOrders(userId, userToken)
			.then((data) => {
				setLoading;
				setOrders(data.data);
			})
			.catch((err) => toast.error(err))
			.finally(() => setLoading(false));
	}, [userId, userToken]);

	orders != null && (reversedOrders = [...orders]?.reverse());

	// google analytics
	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Order History" });
	}, []);

	return (
		<div className="font-Urbanist flex min-h-screen bg-[#FFFCF0] py-8 px-4 sm:px-12 lg:px-[120px]">
			{/* Sidebar */}
			<div className="hidden md:block w-32 lg:w-64 text-base font-semibold bg-white border-r rounded-l-2xl overflow-hidden">
				<nav className="flex flex-col">
					<Link
						to={"/profile"}
						className={`p-4 cursor-pointer `}
					>
						My Profile
					</Link>
					<Link
						to="/order-history"
						className={`p-4 cursor-pointer bg-[#E6F4EC] text-emerald-700`}
					>
						My Appointment
					</Link>
					<div
						onClick={() => {
							localStorage.removeItem("user");
							dispatch(setLogOut());
							navigate("../");
						}}
						className="p-4 cursor-pointer mt-auto"
					>
						Logout
					</div>
				</nav>
			</div>

			{/* Main Content */}
			<div className="flex-1 p-8 bg-white rounded-r-2xl">
				<div className="block md:hidden text-xl font-semibold mb-4">My Appointments</div>
				{/* <div className="mb-4 hidden md:flex gap-2">
					<button
						className={`bg-[#F3F4F6] rounded-lg px-6 py-1 border border-[#DFE4EA] ${
							tab == "all" && "!bg-green text-white"
						}`}
						value="all"
						onClick={() => setTab("all")}
					>
						All
					</button>
					<button
						className={`bg-[#F3F4F6] rounded-lg px-8 py-1 border border-[#DFE4EA] ${
							tab == "upcoming" && "!bg-green text-white"
						}`}
						value="upcoming"
						onClick={() => setTab("upcoming")}
					>
						Upcoming
					</button>
					<button
						className={`bg-[#F3F4F6] rounded-lg px-8 py-1 border border-[#DFE4EA] ${
							tab == "completed" && "!bg-green text-white"
						}`}
						value="completed"
						onClick={() => setTab("completed")}
					>
						Completed
					</button>
					<button
						className={`bg-[#F3F4F6] rounded-lg px-8 py-1 border border-[#DFE4EA] ${
							tab == "pending" && "!bg-green text-white"
						}`}
						value="pending"
						onClick={() => setTab("pending")}
					>
						Pending
					</button>
				</div> */}
				{loading ? (
					<Loading />
				) : (
					reversedOrders?.map((order) => (
						<div
							key={order?._id}
							className="mb-4"
						>
							<OrderCard orderData={order} />
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default OrderHistory;
