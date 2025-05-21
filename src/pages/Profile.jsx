import ReactGA from "react-ga4";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { singlePatient } from "../api/patient";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setLogOut } from "../slices/authSlice";
import { Breadcrumbs } from "@material-tailwind/react";

const Profile = () => {
	const [editMode, setEditMode] = useState(false);
	const [patientData, setPatientData] = useState([]);
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
					setPatientData(res.data.data);
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


		<div className="font-Urbanist   bg-[#FFFCF0] py-8 px-4 sm:px-12 lg:px-[120px]">

			<div className="h-40 w-full  flex items-center">
				<Breadcrumbs
					separator=">"
					className="my-2 mx-4 md:mx-6 lg:mx-12 text-black bg-transparent"
				>
					<Link to="/profile">
						<span className="text-black hover:text-green font-bold">My Account</span></Link> {/* Active breadcrumb */}
				</Breadcrumbs>
			</div>

			<div className="mx-4 md:mx-8 lg:mx-16 -mt-12 bg-white pb-8 rounded-xl">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
					{/* Card 1 - My Profile */}
					<Link to="/profile" className="bg-white border rounded-xl p-4 flex gap-4 hover:shadow-md transition">
						<div className="flex-shrink-0">
							<img src="/images/person.png" alt="" className="w-5 h-5 object-contain" />
						</div>
						<div>
							<h3 className="text-sm font-bold text-black">My Profile</h3>
							<p className="text-sm text-gray-500">Manage your profile</p>
						</div>
					</Link>

					{/* Card 2 - My Bookings */}
					<Link to="/order-history" className="bg-white border rounded-xl p-4 flex gap-4 hover:shadow-md transition">
						<div className="flex-shrink-0">
							<img src="/images/bag.png" alt="" className="w-5 h-5 object-contain" />
						</div>
						<div>
							<h3 className="text-sm font-bold text-black">My Booking</h3>
							<p className="text-sm text-gray-500">Manage your booked consultation</p>
						</div>
					</Link>


					{/* Card 3 - Logout */}
					<div
						onClick={() => {
							localStorage.removeItem("user");
							dispatch(setLogOut());
							navigate("/");
						}}
						className="bg-white border rounded-xl p-4 flex gap-4 hover:shadow-md transition cursor-pointer"
					>
						<div className="flex-shrink-0">
							<img src="/images/exit.png" alt="" className="w-5 h-5 object-contain" />
						</div>
						<div>
							<h3 className="text-sm font-bold text-black">Logout</h3>
							<p className="text-sm text-gray-500">Logout your profile as a Patient</p>
						</div>
					</div>

				</div>
				<hr className="my-4" />

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
										<h2 className="text-xl font-semibold">{patientData?.fullName}</h2>
										<p className="text-gray-500">{patientData?.phone}</p>
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
									<p className={`${editMode && "hidden"}`}>{patientData?.fullName}</p>
									<input
										type="text"
										value={patientData?.fullName}
										className={"w-2/3 p-2 border rounded-lg bg-gray-50" + (!editMode && " hidden")}
									/>
								</div>

								<div className="flex justify-between items-center">
									<label className="text-gray-600">Mobile Number</label>
									<p className={`${editMode && "hidden"}`}>{patientData?.phone}</p>
									<input
										type="tel"
										value={patientData?.phone}
										className={"w-2/3 p-2 border rounded-lg bg-gray-50" + (!editMode && " hidden")}
									/>
								</div>

								<div className="flex justify-between items-center">
									<label className="text-gray-600">Year of Birth</label>
									<p className={`${editMode && "hidden"}`}>{patientData?.dob}</p>
									<input
										type="text"
										value={patientData?.dob}
										className={"w-2/3 p-2 border rounded-lg bg-gray-50" + (!editMode && " hidden")}
									/>
								</div>

								<div className="flex justify-between items-center">
									<label className="text-gray-600">Gender</label>
									<p className={`${editMode && "hidden"}`}>{patientData?.gender == 1 ? "Male" : "Female"}</p>
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











		</div>
	);
};
export default Profile;
