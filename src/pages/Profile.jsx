import ReactGA from "react-ga4";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { singlePatient } from "../api/patient";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setLogOut } from "../slices/authSlice";

const Profile = () => {
	const [editMode, setEditMode] = useState(false);
	const [physioData, setPhysioData] = useState([]);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { userId } = useSelector((e) => e.auth.user || {});

	if (!userId) {
		navigate("login");
	}

	// google analytics
	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Profile" });
	}, []);

	// patient data
	useEffect(() => {
		singlePatient(userId)
			.then((res) => {
				setLoading(true);
				if (res.status >= 200 && res.status < 300) {
					setPhysioData(res.data.data);
				} else {
					toast.error(res);
				}
			})
			.catch((err) => toast.error(err))
			.finally(() => {
				setLoading(false);
			});
	}, []);

	return (
		<div className="font-Urbanist flex min-h-screen bg-[#FFFCF0] py-8 px-4 sm:px-12 lg:px-[120px]">
			{/* Sidebar */}
			<div className="hidden md:block lg:w-64 text-base font-semibold bg-white border-r rounded-l-2xl overflow-hidden">
				<nav className="flex flex-col">
					<Link
						to={"/profile"}
						className={`p-4 cursor-pointer bg-[#E6F4EC] text-emerald-700`}
					>
						My Profile
					</Link>
					<Link
						to="/order-history"
						className={`p-4 cursor-pointer `}
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
			{loading ? (
				<Loading />
			) : (
				<div className="flex-1 p-8 bg-white rounded-r-2xl">
					<div className="block md:hidden text-xl font-semibold mb-4">My Profile</div>
					<div className="max-w-3xl mx-auto">
						{/* Profile Header */}
						<div className="flex justify-between items-center mb-12">
							<div className="flex items-center gap-4">
								<div className="relative">
									<img
										src="/mockPhysioMale.png"
										alt="Profile"
										className="rounded-full w-16 h-16 object-cover"
									/>
									<button
										className={
											"absolute bottom-0 right-0 bg-white p-1 rounded-full border shadow-sm" + (!editMode && " hidden")
										}
									>
										<FaPencilAlt className="w-3 h-3 text-black" />
									</button>
								</div>
								<div>
									<h2 className="text-xl font-semibold">{physioData?.fullName}</h2>
									<p className="text-gray-500">{physioData?.phone}</p>
								</div>
							</div>
							{/* <button
							onClick={() => setEditMode(!editMode)}
							className="px-6 py-2 bg-green text-white rounded-lg hover:bg-emerald-600 transition-colors"
						>
							Update Profile
						</button> */}
						</div>

						{/* Profile Form */}
						<div className="space-y-6">
							<div className="flex justify-between items-center">
								<label className="text-gray-600">Name</label>
								<p className={`${editMode && "hidden"}`}>{physioData?.fullName}</p>
								<input
									type="text"
									value={physioData?.fullName}
									className={"w-2/3 p-2 border rounded-lg bg-gray-50" + (!editMode && " hidden")}
								/>
							</div>

							<div className="flex justify-between items-center">
								<label className="text-gray-600">Mobile Number</label>
								<p className={`${editMode && "hidden"}`}>{physioData?.phone}</p>
								<input
									type="tel"
									value={physioData?.phone}
									className={"w-2/3 p-2 border rounded-lg bg-gray-50" + (!editMode && " hidden")}
								/>
							</div>

							<div className="flex justify-between items-center">
								<label className="text-gray-600">Year of Birth</label>
								<p className={`${editMode && "hidden"}`}>{physioData?.dob}</p>
								<input
									type="text"
									value={physioData?.dob}
									className={"w-2/3 p-2 border rounded-lg bg-gray-50" + (!editMode && " hidden")}
								/>
							</div>

							<div className="flex justify-between items-center">
								<label className="text-gray-600">Gender</label>
								<p className={`${editMode && "hidden"}`}>{physioData?.gender == 1 ? "Male" : "Female"}</p>
								<input
									type="text"
									value="Male"
									className={"w-2/3 p-2 border rounded-lg bg-gray-50" + (!editMode && " hidden")}
								/>
							</div>

							<div className={`"pt-4" + ${!editMode && "hidden"}`}>
								<button className="px-6 py-2 bg-green text-white rounded-lg hover:bg-emerald-600 transition-colors">
									Save Changes
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
export default Profile;
