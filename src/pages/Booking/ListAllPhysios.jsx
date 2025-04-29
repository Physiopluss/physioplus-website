import PhysioCard from "../../components/PhysioCard";
import Skeleton from "../../components/Skeleton";
import { useCallback, useEffect, useState } from "react";
import { useFetchPhysioDataQuery } from "../../api/physios";
import { useDispatch, useSelector } from "react-redux";
import { emptyPhysio } from "../../slices/physioSlice";
import { Button, IconButton, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import { FaArrowLeft, FaArrowRight, FaChevronDown } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { googleLocationLatLong, specializationApi } from "../../api/misc";
import ReactGA from "react-ga4";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import FilterComponent from "../../components/FilterComponent";
import { useLocation } from "react-router-dom";


const cities = ["Jaipur", "Delhi", "Pune", "Bangalore", "Mumbai", "Chandigarh", "Surat"];
const sortOptions = [
	{ name: "Most Popular", href: "#", current: true },
	{ name: "Best Rating", href: "#", current: false },
	{ name: "Newest", href: "#", current: false },
	{ name: "Price: Low to High", href: "#", current: false },
	{ name: "Price: High to Low", href: "#", current: false },
];

const ListAllPhysios = () => {
	const { state } = useLocation();

	// remove old data in store
	const dispatch = useDispatch();
	dispatch(emptyPhysio());

	const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
	// all specialisation from databse
	const [allSpecialization, setAllSpecialization] = useState([]);

	//filter states
	const [query, setQuery] = useState(""); //physio name & physio center name
	const [location, setLocation] = useState(""); //location

	
	const [gender, setGender] = useState(); //gender
	const [experience, setExperience] = useState([]); //experience
	const [rating, setRating] = useState([]); //rating
	const [language, setLanguage] = useState([]); //language
	const [specializationFilter, setSpecializationFilter] = useState(""); //specialization
	const [subSpecializationFilter, setSubSpecializationFilter] = useState([]); //subspecialization
	const [mode, setMode] = useState([]); //mode
	const [page, setPage] = useState(1);
	const [totalPage, setTotalPage] = useState();
	const [latitude, setLatitude] = useState();
	const [longitude, setLongitude] = useState();
	
	
		
	useEffect(() => {
		if (state) {
			if (state.location) {
				setLocation(state.location);
			}
		
			if (state.specialization) {
				setSpecializationFilter(state.specialization);
			}
			if (state.serviceType) {
				setMode([state.serviceType]);
			}
			if (state.subspecializationId) {
				setSubSpecializationFilter([state.subspecializationId]);
			}
		}
	}, [state]);

	

	// google analytics
	useEffect(() => {
		ReactGA.send({
			hitType: "pageview",
			page: window.location.pathname,
			title: "List All Physios",
		});
	}, []);

	// get physios data from database with pagination & filter
	const { data, error, isLoading } = useFetchPhysioDataQuery({
		page: page,
		query,
		location,
		gender,
		experience,
		rating,
		language,
		specializationFilter,
		subSpecializationFilter,
		mode,
		longitude,
		latitude,
	});

	const handlePosition = useCallback((position) => {
		googleLocationLatLong(position.coords.latitude, position.coords.longitude).then((res) => {
			const locality = res?.data?.results[0].address_components.find((item) =>
				item.types.includes("locality")
			).short_name;
			setLocation(locality);
			setLatitude(position.coords.latitude);
 setLongitude(position.coords.longitude);
		});
	}, []);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(handlePosition);
		}
	}, [handlePosition]);

	// set page to 1 when query, location, gender, experience, rating, language, specializationFilter, mode changes
	useEffect(() => {
		setPage(1);
	}, [query, location, gender, experience, rating, language, specializationFilter, mode]);

	// set total page according to physios count
	useEffect(() => {
		data && data.physioCount != undefined && setTotalPage(Math.ceil(data.physioCount / 10));
	}, [data, totalPage]);

	// get all specialization from database
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		specializationApi()
			.then((res) => (res.status == 200 ? setAllSpecialization(res.data) : null))
			.catch((err) => new Error(err));
	}, []);

	// clear filter
	const handleClearFilter = () => {
		setQuery("");
		setLocation("");
		setGender("");
		
		setExperience([]);
		setRating([]);
		setLanguage([]);
		setSpecializationFilter([]);
		setSubSpecializationFilter([]);
		setMode([]);
		setPage(1);
	};

	return (
		<div className="flex flex-col gap-4 text-3xl ">
			{isLoading ? (
				<div className="flex justify-center items-center h-full">
					<Skeleton />
				</div>
			) : (
				<>
					<div className="w-full bg-[#FFFCF0]">
						<div className="flex flex-col gap-2 md:gap-4 py-12 mx-auto px-4 sm:px-6 lg:px-8 max-w-[85%]">
							{/* name & location search box */}
							<h4 className="font-semibold text-3xl md:text-5xl text-center">Search & Book Certified <span className="text-green"> Physiotherapist </span></h4>
							<h5 className="font-semibold text-3xl md:text-5xl text-green text-center">Near You</h5>
							{/* search physios on basis of location and name */}
							<form className="mt-8 ms:mt-4 w-full flex flex-col sm:flex-wrap sm:flex-row items-stretch gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
								<div className="flex flex-col flex-1 gap-1">
									<label
										htmlFor="search"
										className="text-base font-medium"
									>
										What are you looking for?
									</label>
									<input
										type="text"
										id="Search"
										name="search"
										value={query}
										placeholder="Search for category, name, company.. etc"
										onChange={(e) => setQuery(e.target.value)}
										className="w-full text-black font-normal border border-gray-200 text-base px-2 py-2 rounded-lg bg-[#F1F5F9] placeholder:text-gray-600 placeholder:text-base"
									/>
								</div>
								<div className="flex flex-col flex-1 gap-1">
									<label
										htmlFor="Location"
										className="text-base font-medium"
									>
										Location
									</label>
									<input
										type="text"
										id="Location"
										name="Location"
										value={location}
										placeholder="Enter your location"
										onChange={(e) => setLocation(e.target.value)}
										className="w-full text-black font-normal border border-gray-200 text-base px-2 py-2 rounded-lg bg-[#F1F5F9] placeholder:text-gray-600 placeholder:text-base"
									/>
								</div>
								<div className="flex w-full sm:w-auto items-end">
									<Button
										onClick={(e) => e.preventDefault()}
										className="bg-green w-full sm:w-auto font-normal border border-gray-200 text-base px-3.5 py-3 rounded-lg leading-none"
									>
										Search
									</Button>
								</div>
							</form>
						</div>
					</div>
					<main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 min-w-[85%]">
						<div className="flex items-center justify-between pt-12 ">
							<div className="flex flex-col md:flex-row flex-1 justify-between gap-2 ">
								<p className="text-lg font-semibold tracking-tight text-black">{error ? "No physio found" : data && data.data && "Best " + data?.physioCount + " Physios in " } {location==""?"india":location}</p>
								<p className="text-base font-semibold tracking-tight text-black">
									
								</p>
							</div>
							{/* sort */}
							<div className="flex justify-center items-center flex-col md:justify-end md:flex-row gap-2 md:w-1/3">
								<button
									type="button"
									onClick={() => setMobileFiltersOpen(true)}
									className="-m-2 ml-4 p-2 text-black font-semibold sm:ml-6 lg:hidden text-base"
								>
									Filters
								</button>

								{/* Mobile filter dialog */}
								<div
									className={`fixed inset-0 z-40 flex transition-transform duration-300 ease-in-out ${
										mobileFiltersOpen ? "" : "translate-x-full"
									}`}
								>
									{/* Backdrop */}
									<div
										className="fixed inset-0 bg-black bg-opacity-25 transition-opacity duration-300 ease-linear"
										onClick={() => setMobileFiltersOpen(false)}
									></div>

									{/* Panel */}
									<div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white py-4 pb-12 shadow-xl">
										<div className="sticky top-0 bg-white z-10 flex items-center justify-between px-4 py-2 border-b border-gray-200">
											<h2 className="text-lg font-medium text-gray-900">Filters</h2>
											<button
												type="button"
												onClick={() => setMobileFiltersOpen(false)}
												className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
											>
												<span className="sr-only">Close menu</span>
												<IoMdClose
													aria-hidden="true"
													className="h-6 w-6"
												/>
											</button>
										</div>

										{/* Filters */}
										<div className="flex-1 overflow-y-auto px-4 pb-6">
											<FilterComponent
												gender={gender}
												setGender={setGender}
												setExperience={setExperience}
												rating={rating}
												setRating={setRating}
												language={language}
												setLanguage={setLanguage}
												mode={mode}
												allCities={cities}
												setCityFilter={setLocation}
												allSpecialization={allSpecialization}
												specializationFilter={specializationFilter}
												setSpecializationFilter={setSpecializationFilter}
												subSpecializationFilter={subSpecializationFilter}
												setSubSpecializationFilter={setSubSpecializationFilter}
												setMode={setMode}
												handleClearFilter={handleClearFilter}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Main section with heading, web filter and physio listing  */}
						<section
							aria-labelledby="products-heading"
							className="pt-6"
						>
							<h2
								id="products-heading"
								className="sr-only"
							>
								Products
							</h2>

							<div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 ">
								{/* Web filter here */}
								<div className="min-w-[230px] hidden lg:block bg-white mt-6 rounded-md p-4 border border-[#EAEBEC] shadow-md h-fit">
									<FilterComponent
										gender={gender}
										setGender={setGender}
										setExperience={setExperience}
										rating={rating}
										setRating={setRating}
										language={language}
										setLanguage={setLanguage}
										mode={mode}
										allCities={cities}
										setCityFilter={setLocation}
										allSpecialization={allSpecialization}
										setSpecializationFilter={setSpecializationFilter}
										setSubSpecializationFilter={setSubSpecializationFilter}
										setMode={setMode}
										handleClearFilter={handleClearFilter}
									/>
								</div>
								{error ? (
									<div className="lg:col-span-3 text-center">{error?.data?.message}</div>
								) : (
									/* All Physios Listing */
									<div className="lg:col-span-3">
										{data?.data.map((physio) => (
											<PhysioCard
												key={physio?._id}
												id={physio?._id}
												physio={physio}
											/>
										))}
										{/* Pagination */}
										<div className="flex items-center justify-between my-8 gap-4">
											{/* Previous Button */}
											<Button
												variant="text"
												className="border-2 border-[#EAEBEC] rounded-lg bg-white text-green flex items-center !shadow-none hover:!shadow-none gap-2 disabled:text-black hover:bg-white active:bg-white"
												onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
												disabled={page === 1}
											>
												<FaArrowLeft className="h-4 w-4" />
												Previous
											</Button>

											{/* Page Numbers */}
											<div className="justify-center items-center hidden sm:flex gap-2">
												{/* First Page & Ellipsis */}
												{page > 3 && (
													<>
														<IconButton
															className="bg-transparent text-[#667085] !shadow-none hover:!shadow-none"
															onClick={() => setPage(1)}
														>
															1
														</IconButton>
														<IconButton
															className="bg-transparent text-[#667085] !shadow-none hover:!shadow-none"
															disabled
														>
															...
														</IconButton>
													</>
												)}

												{/* Main Pagination Numbers */}
												{Array.from({ length: 3 }, (_, i) => page - 1 + i)
													.filter((num) => num > 0 && num <= totalPage)
													.map((num) => (
														<IconButton
															key={num}
															className={`${
																num === page ? "bg-[#E6F4EC] text-green" : "bg-transparent text-[#667085]"
															} !shadow-none hover:!shadow-none`}
															onClick={() => setPage(num)}
														>
															{num}
														</IconButton>
													))}

												{/* Last Page & Ellipsis */}
												{page < totalPage - 2 && (
													<>
														<IconButton
															className="bg-transparent text-[#667085] !shadow-none hover:!shadow-none"
															disabled
														>
															...
														</IconButton>
														<IconButton
															className="bg-transparent text-[#667085] !shadow-none hover:!shadow-none"
															onClick={() => setPage(totalPage)}
														>
															{totalPage}
														</IconButton>
													</>
												)}
											</div>

											{/* Next Button */}
											<Button
												variant="text"
												className="border-2 border-[#EAEBEC] rounded-lg bg-white text-green flex items-center gap-2 disabled:text-black !shadow-none hover:!shadow-none hover:bg-white active:bg-white"
												onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
												disabled={page === totalPage}
											>
												Next
												<FaArrowRight className="h-4 w-4" />
											</Button>
										</div>
									</div>
								)}
							</div>
						</section>
					</main>
				</>
			)}
		</div>
	);
};
export default ListAllPhysios;
