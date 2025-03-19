import BlogCard from "../components/BlogCard";
import BannerComponent from "../components/BannerComponent";
import FAQ from "../components/FAQ";
import ReviewCard from "../components/ReviewCard";
import SpecializationCard from "../components/SpecializationCard";
import TextContainer from "../components/TextContainer";
import { Reviews } from "../Mock/ReviewData";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { listAllBlog } from "../api/blog";
import HomeTitleComponent from "../components/HomeTitleComponent";
import HorizontalCard from "../components/HorizontalCard";
import { Button } from "@material-tailwind/react";
import { MdLocationPin, MdMail, MdPhoneInTalk } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperGallery from "../components/SwiperGallery";
import InsuranceModal from "../components/InsuranceModal";
import SuccessModal from "../components/SuccessModal";
import { useDispatch } from "react-redux";
import { setSuccessModalOpen } from "../slices/modalSlice";
import ReactGA from "react-ga4";
import { Helmet } from "react-helmet-async";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import { mobileData, painCardData } from "../Mock/homeData";
import SpecialityCard from "../components/SpecialityCard";

const Home = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [blogData, setBlogData] = useState();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();
	const [insuranceModal, setInsuranceModal] = useState(false);

	const bannerItems = ["Explore our blog", "Experience home care", "Experience clinic care"];

	// google analytics
	useEffect(() => {
		ReactGA.send({
			hitType: "pageview",
			page: window.location.pathname,
			title: "Home",
		});
	}, []);

	// scroll to top & fetch blog data
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res = await listAllBlog();
				if (res.status >= 200 && res.status < 300) {
					setBlogData(res.data.blogs);
				} else {
					setError("Failed to fetch blogs.");
				}
			} catch (err) {
				setError("Something went wrong.");
			} finally {
				setLoading(false);
			}
		};

		if (document.readyState === "complete") {
			fetchData();
		} else {
			window.addEventListener("load", fetchData);
		}

		// Cleanup the event listener
		return () => {
			window.removeEventListener("load", fetchData);
		};
	}, []);

	return (
		<>
			<Helmet>
				<title>Home | Physioplus Healthcare</title>
				<meta
					name="description"
					content="Discover Physioplus Healthcare: Your destination for comprehensive physiotherapy care in India. Offering in-clinic and home care services, we provide personalized treatments to help you recover and thrive. Visit us today and experience the best in physiotherapy."
				/>
				<meta
					name="keywords"
					content="Physioplus Healthcare, physiotherapy care, comprehensive physiotherapy, in-clinic services, home care services, Jaipur physiotherapy, Delhi Physiotherapy."
				/>
				<meta
					name="robots"
					content="index, follow"
				/>
			</Helmet>
			<div className="max-w-[100vw]">
				<div className="bg-[url('home/bannerDesign.png')] bg-no-repeat bg-left max-w-[99vw] mx-auto relative mb-24 sm:mb-12 md:mb-0 min-h-[500px] sm:min-h-[600px] bg-cover">
					<BannerComponent />
				</div>

				{/* scroll bar */}
				<div className="max-w-[100vw] flex justify-center bg-[#025A28]">
					<div className="max-w-[98vw] bg-[#025A28] text-white overflow-hidden py-4 px-0 mx-0">
						<div className="flex animate-scroll">
							{bannerItems.map((item, index) => (
								<div key={index}>
									<span className="mx-4 whitespace-nowrap text-lg">{item}</span>
									<span className="mx-4">✦</span>
								</div>
							))}
							{bannerItems.map((item, index) => (
								<div key={`repeat-${index}`}>
									<span className="mx-4 whitespace-nowrap text-lg">{item}</span>
									<span className="mx-4">✦</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* service Type */}
				<section className="bg-[#FFFCF0] pt-12 md:pt-[108px] pb-9 md:pb-24 px-4 sm:px-12 lg:px-[120px] ">
					<HomeTitleComponent
						sectionText={"Our Offering"}
						title={"Your Therapy, Your Way "}
						subTitle={"At Home or In-Clinic"}
						inlineSubtext={false}
						fontShape="font-serif"
						description={
							"Choose clinic or home care—both options offer expert, personalized physiotherapy for your convenience and comfort"
						}
					/>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<SpecializationCard
							title={"Visit Clinic"}
							img={"home/physio-center.png"}
							description={"Visit our clinic for professional in-house treatment"}
							onclickFn={() => {
								navigate("/physios", { state: { serviceType: "clinic" } });
								// dispatch(setBookingFilter("clinic"));
							}}
						/>
						<SpecializationCard
							title={"Physio at home"}
							img={"home/physio-home.png"}
							description={"Convenient physiotherapy sessions in the comfort of your home"}
							onclickFn={() => {
								navigate("/physios", { state: { serviceType: "home" } });
								// dispatch(setBookingFilter("home"));
							}}
						/>
					</div>
				</section>

				{/* mobile information */}
				<section className="pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px] bg-gradient-to-b from-[#039342] to-[#004E89]">
					{/* heading */}
					<div className="flex flex-col md:flex-row gap-2 md:gap-4 text-white items-center">
						<div className="flex-1 flex flex-col gap-1">
							<h6 className="text-3xl md:text-5xl font-bold text-left md:text-left">
								Pain Relief is Now Just a Click Away
							</h6>
							<p className="text-base text-left my-0 lg:pl-0 lg:pr-2">
								Choose clinic or home care—both options offer expert, personalized physiotherapy for your convenience
								and comfort
							</p>
						</div>
						<div>
							<Button
								className="rounded-3xl bg-white text-green flex items-center gap-1"
								onClick={() =>
									window.open(
										"https://play.google.com/store/apps/details?id=com.physioplus.physioplus&pcampaignid=web_share",
										"_blank"
									)
								}
							>
								Download our App <FaApple className="w-5 h-5" /> <FaGooglePlay className="w-5 h-5" />
							</Button>
						</div>
					</div>
					{/* mobile details card */}
					<section className="py-12 ">
						<Swiper
							modules={[Navigation, Pagination]}
							spaceBetween={10}
							slidesPerView={1}
							loop={true}
							pagination={{ clickable: true }}
							breakpoints={{
								540: { slidesPerView: 1, spaceBetween: 10 },
								720: { slidesPerView: 1, spaceBetween: 10 },
								960: { slidesPerView: 1, spaceBetween: 10 },
							}}
							className=" p-0 m-0 overflow-hidden h-full md:h-[520px] max-w-[76vw] sm:max-w-[78vw] md:max-w-[60vw] lg:max-w-[70vw]"
						>
							{mobileData.map((data, index) => (
								<SwiperSlide key={index}>
									<div className="h-full md:h-[480px] flex flex-col md:flex-row items-center md:items-stretch justify-between px-6 md:px-8 py-6 md:py-8 rounded-lg border border-[#EAEBEC] bg-white bg-opacity-10 backdrop-filter backdrop-blur-md">
										{/* Text Content */}
										<div className="w-full md:w-2/3 flex flex-col justify-around text-center md:text-left">
											<h6
												className="text-2xl md:text-3xl lg:text-5xl font-bold text-white leading-tight"
												dangerouslySetInnerHTML={{ __html: data.title }}
											/>

											<p className="text-xs sm:text-sm md:text-base text-white font-medium my-2 leading-relaxed">
												{data.description}
											</p>

											{/* Feature Grid */}
											<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 my-2 me-2">
												{data.card.map((data, index) => (
													<div
														key={index}
														className="border border-[#EAEBEC] px-3 py-2 text-xs sm:text-sm text-white rounded-lg flex flex-col items-center justify-around bg-white bg-opacity-20 min-h-20"
													>
														<img
															src={data.cardImg}
															alt={data.cardText}
															className="w-5 h-5"
														/>
														<div className="text-xs text-center">{data.cardText}</div>
													</div>
												))}
											</div>

											{/* Button */}
											<Button
												className="mt-3 w-fit inline-flex items-center justify-center gap-2 bg-white text-green font-normal text-sm md:text-base px-4 py-2.5 rounded-full normal-case"
												onClick={() =>
													window.open(
														"https://play.google.com/store/apps/details?id=com.physioplus.physioplus&pcampaignid=web_share",
														"_blank"
													)
												}
											>
												Download our App <FaApple className="w-5 h-5" /> <FaGooglePlay className="w-4 h-4" />
											</Button>
										</div>

										{/* Image */}
										<div className="w-full md:w-1/3 flex justify-center mt-4 md:mt-0">
											<img
												src={data.imageLink}
												alt="Mobile App"
												className="max-w-[120px] sm:max-w-[160px] md:max-w-[220px] lg:max-w-[280px] object-contain aspect-[9/16]"
											/>
										</div>
									</div>
								</SwiperSlide>
							))}
						</Swiper>
					</section>
				</section>

				{/* free marquee */}
				<div className="max-w-[100vw] flex justify-center bg-[#025A28]">
					<div className="max-w-[98vw] bg-[#025A28] flex text-white overflow-hidden relative py-4">
						{/* First row */}
						<div className="flex animate-marquee whitespace-nowrap">
							{Array(16)
								.fill(null)
								.map((_, index) => (
									<div
										key={index}
										className="flex items-center"
									>
										<span className="font-Oregano text-4xl sm:text-5xl md:text-6xl lg:text-[80px] mx-2 sm:mx-4">
											Free
										</span>
									</div>
								))}
						</div>
						{/* Duplicate row */}
						<div className="flex animate-marquee2 whitespace-nowrap absolute top-4">
							{Array(16)
								.fill(null)
								.map((_, index) => (
									<div
										key={index}
										className="flex items-center"
									>
										<span className="font-Oregano text-4xl sm:text-5xl md:text-6xl lg:text-[80px] mx-2 sm:mx-4">
											Free
										</span>
									</div>
								))}
						</div>
					</div>
				</div>

				{/* insurance */}
				<section className="bg-[#FFFCF0] pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px]">
					<HomeTitleComponent
						sectionText={"Insurance that Empowers You to Live Freely"}
						title={"Effortless Care with Cashless Physiotherapy"}
						description={"Experience seamless recovery with cashless physiotherapy, designed for convenience and ease"}
					/>
					<div className="flex flex-col md:flex-row-reverse justify-between items-center gap-8 xl:gap-14">
						<div className="mt-10 md:mt-0 mx-auto flex items-center justify-center md:w-1/2 h-full">
							<img
								src={"home/insurance.png"}
								alt={"Get Treated Without Financial Worry"}
								className="object-contain rounded-md"
							/>
						</div>
						<TextContainer
							title={"Get Treated Without Financial Worry"}
							description={
								"We believe in making physiotherapy both accessible and stress-free. Through our partnership with top insurance providers, we ensure you receive high-quality care without upfront costs. We handle all the paperwork while you focus on your recovery."
							}
							list={
								<>
									<li className="flex items-center gap-2 md:gap-4">
										<img
											src="/success.png"
											className="w-4 h-4"
										/>
										Cashless Treatment Available
									</li>
									<li className="flex items-center gap-2 md:gap-4">
										<img
											src="/success.png"
											className="w-4 h-4"
										/>
										Hassle-Free Insurance Billing
									</li>
									<li className="flex items-center gap-2 md:gap-4">
										<img
											src="/success.png"
											className="w-4 h-4"
										/>
										Reduce Out-of-Pocket Expenses
									</li>
								</>
							}
							lastText={"Click below to learn more about how your insurance can cover your physiotherapy sessions"}
							buttonTitle={"Check Enquiry"}
							buttonClickFunction={() => setInsuranceModal(!insuranceModal)}
						/>
					</div>
				</section>

				<InsuranceModal
					insuranceModal={insuranceModal}
					handleInsuranceModalOpen={() => setInsuranceModal(!insuranceModal)}
				/>
				<SuccessModal
					title={"Thank you for reaching us."}
					description={"Our representative will get in touch with you within 24 hours."}
					btnOne={"Go to main menu"}
					btnOneFunction={() => dispatch(setSuccessModalOpen())}
				/>

				{/* free marquee */}
				<div className="max-w-[100vw] flex justify-center bg-[#025A28]">
					<div className="max-w-[98vw] bg-[#025A28] flex text-white overflow-hidden relative py-4">
						{/* First row */}
						<div className="flex animate-marquee whitespace-nowrap">
							{Array(16)
								.fill(null)
								.map((_, index) => (
									<div
										key={index}
										className="flex items-center"
									>
										<span className="font-Oregano text-4xl sm:text-5xl md:text-6xl lg:text-[80px] mx-2 sm:mx-4">
											Free
										</span>
									</div>
								))}
						</div>
						{/* Duplicate row */}
						<div className="flex animate-marquee2 whitespace-nowrap absolute top-4">
							{Array(16)
								.fill(null)
								.map((_, index) => (
									<div
										key={index}
										className="flex items-center"
									>
										<span className="font-Oregano text-4xl sm:text-5xl md:text-6xl lg:text-[80px] mx-2 sm:mx-4">
											Free
										</span>
									</div>
								))}
						</div>
					</div>
				</div>

				{/* Relief Cards */}
				<section className="pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px]">
					<HomeTitleComponent
						sectionText={"Expert Physiotherapy Care"}
						title={"Choose Your"}
						subTitle={"Speciality for Relief"}
						inlineSubtext={true}
						description={
							"Feeling uncertain about your options? Our best offering is here to make you the best choice for your health."
						}
					/>
					<Swiper
						modules={[Navigation]}
						spaceBetween={20}
						slidesPerView={1.2}
						loop={true}
						breakpoints={{
							640: { slidesPerView: 2.2, spaceBetween: 10 },
							768: { slidesPerView: 3.2, spaceBetween: 20 },
							1024: { slidesPerView: 3.2, spaceBetween: 20 },
						}}
						className="max-w-[88vw] sm:max-w-[80vw] md:max-w-[80vw] lg:max-w-[72vw]"
						// navigation
					>
						{painCardData.map((item, index) => (
							<SwiperSlide key={index}>
								<SpecialityCard
									// section={"painCard"}
									img={item.img}
									title={item.title}
									description={item.description}
									link={() => navigate("/physios", { state: item.linkState })}
								/>
							</SwiperSlide>
						))}
					</Swiper>

					<div className="mt-12 flex justify-center">
						<Button
							onClick={() => {
								navigate("/physios");
							}}
							className="w-fit text-nowrap text-lg font-semibold bg-green text-white rounded-full px-8 py-2.5 "
						>
							See All Specialities
						</Button>
					</div>
				</section>

				{/* Why Choose Us */}
				<section className="bg-[#F5FAF7] pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px]">
					<HomeTitleComponent
						sectionText={"Why Choose Us"}
						title={"100% Recover Faster with"}
						subTitle={"Physioplus"}
						description50={true}
						inlineSubtext={true}
						description={
							"Expert physiotherapy, in-person or home visits, and easy online booking with 300+ professionals all over India !"
						}
					/>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
						<HorizontalCard
							section={"whyChooseUs"}
							img={"home/treatment.png"}
							title={"Non Surgical Treatment"}
							description={
								"Our advanced surgical treatments provide effective solutions, combining expert care and cutting-edge technology to achieve the best patient outcomes."
							}
						/>
						<HorizontalCard
							section={"whyChooseUs"}
							img={"home/location.png"}
							title={"Available in 1500+ Pincodes"}
							description={
								"Our services are available in over 1500+ pincodes, ensuring convenience and accessibility for clients in diverse regions across the country."
							}
						/>
						<HorizontalCard
							section={"whyChooseUs"}
							img={"home/rupee.png"}
							title={"Cost Effective"}
							description={
								"Our treatments are designed to be cost-effective, providing high-quality care and exceptional results without compromising your budget or expectations."
							}
						/>
						<HorizontalCard
							section={"whyChooseUs"}
							img={"home/calender.png"}
							title={"Easy Appointments"}
							description={
								"Schedule your appointments effortlessly through our user-friendly app or web app, making healthcare access simple and convenient for everyone."
							}
						/>
						<HorizontalCard
							section={"whyChooseUs"}
							img={"home/care.png"}
							title={"Expert Care at Our Centers"}
							description={
								"Our centers offer expert care with highly trained professionals, ensuring personalized treatment plans tailored to meet your specific health needs."
							}
						/>
						<HorizontalCard
							section={"whyChooseUs"}
							img={"home/house.png"}
							title={"In-Home Services"}
							description={
								"Our physiotherapists come to you, providing personalized treatment in the comfort of your home, making recovery convenient and effective."
							}
						/>
					</div>
				</section>

				{/* Events */}
				{/* <section className="pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px]">
					<HomeTitleComponent
						sectionText={"Your Path to Wellness!"}
						subTitle={"Exclusive Happenings"}
						inlineSubtext={true}
						description={
							"Join our physiotherapy events and discover exclusive offers to enhance your recovery journey. Don’t miss out!"
						}
					/>
					<div>
						<Swiper
							modules={[Navigation]}
							spaceBetween={10}
							centeredSlides={true}
							slidesPerView={1.2}
							loop={true}
							breakpoints={{
								640: { slidesPerView: 1.2 },
								768: { slidesPerView: 1.5 },
								1024: { slidesPerView: 3 },
							}}
							className="max-w-[80vw] lg:max-w-[74vw] xl:w-full"
						>
							{[...Array(5)].map((_, index) => (
								<SwiperSlide
									key={index}
									className="transition-transform duration-300"
								>
									{({ isActive }) => (
										<div
											className={`relative w-full h-[250px] overflow-hidden rounded-lg shadow-lg 
                  ${isActive ? "scale-100 rounded-lg" : "scale-75 opacity-75"} transition-transform duration-500`}
										>
											<img
												src="/home/eventImg.jpg"
												alt="Shoulder Pain"
												className="absolute inset-0 w-full h-full object-cover"
											/>
											<div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
												<div className="text-center text-white">
													<h2 className="text-xl font-bold mb-2">Get Relief from Shoulder Pain</h2>
													<p className="text-sm">
														Relieve shoulder pain, restore flexibility, and regain strength with targeted solutions for
														lasting comfort and mobility.
													</p>
												</div>
											</div>
										</div>
									)}
								</SwiperSlide>
							))}
						</Swiper>
					</div>
				</section> */}

				{/* review section */}
				<section className="bg-[#F5FAF7] pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px]">
					<HomeTitleComponent
						sectionText={"Success in Every Steps"}
						title={"Patient Testimonials on Their"}
						subTitle={"Healing Journey"}
						inlineSubtext={true}
						description50={true}
						description={
							"Our customer's stories speak volumes. Discover how our physiotherapy services have transformed their lives and brought smiles back!"
						}
					/>
					<div className="flex flex-col md:flex-row justify-center items-center gap-8 xl:gap-14">
						<div className="max-w-[88vw] sm:max-w-[80vw] md:max-w-[56vw] md:w-2/3 mt-10 md:mt-0 flex flex-col">
							<SwiperGallery />
						</div>
						{/* reviews for tablet & web */}
						<div className="hidden md:flex w-1/3 h-full flex-col">
							<Swiper
								direction={"vertical"}
								spaceBetween={0}
								slidesPerView={4}
								breakpoints={{
									640: {
										slidesPerView: 3,
									},
									768: {
										slidesPerView: 3,
									},
									1024: {
										slidesPerView: 4,
									},
								}}
								className="hidden md:block max-h-[600px] lg:max-h-[800px] w-full"
							>
								{Reviews.slice(0, 5).map((review) => (
									<SwiperSlide key={review.id}>
										<ReviewCard
											key={review.id}
											id={review.id}
											name={review.name}
											img={review.img}
											rating={review.rating}
											review={review.review}
											patientType={review.patientType}
										/>
									</SwiperSlide>
								))}
							</Swiper>
						</div>
					</div>
				</section>

				{/* blogs loading */}
				{loading ? (
					<p>Loading blogs...</p>
				) : error ? (
					<p className="text-red-500">{error}</p>
				) : (
					blogData &&
					blogData.length > 0 && (
						<section className="pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px] bg-[#FFFCF0]">
							<HomeTitleComponent
								sectionText={"Our Blogs"}
								title={"Unlock the Secrets to"}
								subTitle={"Faster Recovery"}
								inlineSubtext={true}
								description={
									"Stay informed with the latest physiotherapy insights and tips for maintaining a healthy, active lifestyle."
								}
							/>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-4">
								{blogData.slice(0, 4).map((blog) => (
									<BlogCard
										key={blog._id}
										id={blog._id}
										title={blog.title}
										description={blog.description}
										youTubeLink={blog.youTubeLink}
										image={blog.image}
										status={blog.status}
										views={blog.views}
										tags={blog.tags}
										blogType={blog.blogType}
										date={blog.date}
									/>
								))}
							</div>
							<div className="mt-12 flex justify-center">
								<Button
									onClick={() => navigate("/blog")}
									className="w-fit text-nowrap text-base font-semibold bg-green text-white rounded-2xl px-8 py-2.5"
								>
									View All
								</Button>
							</div>
						</section>
					)
				)}

				{/* faq */}
				<div className="flex flex-col md:flex-row gap-4 pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px] md:divide-x divide-gray-200">
					<div className="md:w-[45vw] w-full flex flex-col gap-6">
						<h6 className="text-3xl md:text-5xl font-semibold ">Frequently Asked Questions</h6>
						<p className="mt-4 sm:mt-6 text-base">
							Discover our locations closest to you and experience our services firsthand. Whether you're around the
							corner or a few miles away, we're just a step away from making your day better.
						</p>
						<div className="flex flex-col gap-2">
							<p className="flex items-center gap-2 text-base">
								<MdLocationPin className="min-w-4 h-4" />
								109,1st Floor, Sankalp Tower, Khatipura Road, Jaipur
							</p>
							<p className="flex items-center gap-2">
								<MdPhoneInTalk className="min-w-4 h-4" />
								+91 8107333576
							</p>
							<p className="flex text-wrap items-center gap-2">
								<MdMail className="min-w-4 h-4" />
								info@physioplushealthcare.com
							</p>
						</div>
						<Button
							onClick={() => navigate("/physios")}
							className="bg-green w-fit px-6 py-3 rounded-full font-normal hover:shadow-none"
						>
							Book An Appointment
						</Button>
					</div>
					<FAQ />
				</div>
			</div>
		</>
	);
};
export default Home;
