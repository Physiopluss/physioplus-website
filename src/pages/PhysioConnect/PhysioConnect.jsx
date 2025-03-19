import ReactGA from "react-ga4";
import { Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { Pagination } from "swiper/modules";
import ServiceCard from "../../components/ServiceCard";
import HomeTitleComponent from "../../components/HomeTitleComponent";
import HorizontalCardTwo from "../../components/HorizontalCardTwo";
import PrincipleCard from "../../components/PrincipleCard";
import { MdLocationPin, MdMail, MdPhoneInTalk } from "react-icons/md";
import FAQ from "../../components/FAQ";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { useEffect, useState } from "react";
import { MemberVideoData } from "../../Mock/MemberVideoData";
import { FaApple, FaArrowRight, FaGooglePlay } from "react-icons/fa";
import { mobdata } from "../../Mock/physioConnectPageData";
//import {physioconnectCard} from "../../components/PhysioconnectCard";

const PhysioConnect = () => {
	const [selectedBenefits, setSelectedBenefits] = useState({});
	const navigate = useNavigate();
	// google analytics
	useEffect(() => {
		ReactGA.send({
			hitType: "pageview",
			page: window.location.pathname,
			title: "Physio Connect",
		});
	}, []);

	useEffect(() => {
		// Set the first benefit as the default selected benefit for each card
		if (mobdata.length > 0) {
			const initialSelections = {};
			mobdata.forEach((data, index) => {
				if (data?.benefits?.length > 0) {
					initialSelections[index] = data.benefits[0].title; // Set the first benefit title as default
				}
			});
			setSelectedBenefits(initialSelections);
		}
	}, []);

	const handleBenefitClick = (index, benefitTitle) => {
		setSelectedBenefits((prev) => ({
			...prev,
			[index]: benefitTitle, // Update the selected benefit for the specific card
		}));
	};

	// scroll to top
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<>
			{/* header */}
			<div className="relative flex justify-center py-8 px-4 sm:px-12 lg:px-[120px] md:gap-0 bg-white">
				<img
					src="/connect/bannerDesign.png"
					alt=""
					className="absolute -top-2 left-12 sm:left-24 h-20vw"
				/>
				<img
					src="/connect/bannerDesign.png"
					alt=""
					className="absolute -top-2 right-12 sm:right-24 h-20vw"
				/>

				{/* content */}
				<div className="z-10 w-full pt-20 mt-8 md:mt-0 flex flex-col justify-center gap-2 sm:gap-4 items-center text-center">
					<Typography
						variant="h6"
						className="text-sm font-medium bg-[#F5FAF7] px-8 py-3 border-2 border-[#EAEBEC] rounded-2xl text-green"
					>
						Unlock Extra Income Oppurtunity
					</Typography>
					<Typography
						variant="h2"
						className="text-5xl sm:text-6xl font-semibold text-black"
					>
						Join the Physio Plus Community
					</Typography>
					<Typography
						variant="h5"
						className="text-base font-medium text-black"
					>
						As a part of Physio Connect, you’ll gain access to a network of professionals dedicated to enhancing patient
						care and expanding your practice.
					</Typography>
					<div className="flex flex-col lg:flex-row gap-2 lg:gap-4 my-4">
						<Button
							onClick={() => navigate("/physio-connect/signup")}
							className="text-nowrap text-base font-semibold bg-green text-white w-full lg:w-fit rounded-full px-8 py-3 text-center"
						>
							Start Your Journey Today
						</Button>
						<a
							href={"#video"}
							className="text-nowrap text-base font-semibold bg-[#E6F4EC] text-black w-full lg:w-fit rounded-full px-8 py-3 flex gap-1.5 justify-center items-center"
						>
							<img
								src="/connect/playBlack.png"
								alt=""
							/>
							Watch Video
						</a>
					</div>
					{/* cards grid */}
					<div className="w-full grid  grid-cols-2 md:grid-cols-5 md:grid-rows-4 gap-2 text-start">
						<div className="row-start-3 row-span-2 md:row-span-3 rounded-lg px-4 py-2 pb-10 border border-[#EAEBEC] bg-gradient-to-tl from-[#16CE67] to-[#012D14] text-white relative flex flex-col justify-center gap-3">
							<p className="text-2xl font-semibold">74%</p>
							<p className="text-base font-semibold">Guaranteed Client Flow</p>
							<p className="text-sm font-medium">Grow Your Practice with a Steady Stream of Patients</p>
							<button
								onClick={() => navigate("signup")}
								className="absolute -bottom-1 -right-0.5 bg-[#039342] rounded-tl-2xl rounded-br-2xl text-white border-2 border-white px-4 py-2"
							>
								Join Now
							</button>
						</div>
						<div className="md:col-start-1 md:row-span-1 rounded-lg px-4 py-2 border border-[#EAEBEC] bg-[#EAF6EF] flex flex-col justify-center">
							<p className="text-2xl font-semibold">Earn Upto</p>
							<p className="text-base font-semibold">50,000 / Month</p>
						</div>
						<div className="col-start-1 row-start-1 md:col-start-2 md:row-span-3 md:row-start-2 rounded-lg px-4 py-2 pb-20 border border-[#EAEBEC] bg-[#FFFBED] flex flex-col justify-start relative overflow-hidden gap-1.5">
							<p className="text-base font-semibold">Join India’s Largest Physio Network</p>
							<p className="text-sm font-medium">Join India’s Largest Physio Network</p>
							<button
								className="w-fit text-green"
								onClick={() => navigate("signup")}
							>
								Join Now
							</button>
							<img
								src="/connect/network.png"
								alt=""
								className="absolute bottom-0 right-0"
							/>
						</div>
						<div className="col-span-2 col-start-1 row-start-2 md:col-span-1 md:col-start-3 md:row-start-3 md:row-span-2 rounded-lg px-4 py-4 md:py-2 border border-[#EAEBEC] flex flex-col justify-around bg-green">
							<p className="text-xl text-center font-semibold text-white">Already 1283+ Physio With Us Over India</p>
							<button
								onClick={() => navigate("signup")}
								className="w-full bg-white text-base font-medium rounded-lg mt-2 py-1"
							>
								Join Now
							</button>
						</div>
						<div className="col-start-2 row-start-1 md:col-start-4 md:row-span-3 md:row-start-2 rounded-lg px-4 py-2 pb-20 border border-[#EAEBEC] bg-[#FFFBED] flex flex-col justify-start relative overflow-hidden gap-1.5">
							<p className="text-base font-semibold">Boost Your Clinic’s Revenue by</p>
							<p className="text-sm font-medium">Unlock Up to 40% More Revenue</p>
							<button
								onClick={() => navigate("signup")}
								className="w-fit text-green"
							>
								Join Now
							</button>
							<img
								src="/connect/network.png"
								alt=""
								className="absolute bottom-0 right-0"
							/>
						</div>
						<div className="col-start-2 row-span-2 row-start-4 md:col-start-5 md:row-start-1 md:row-span-3 rounded-lg px-4 py-2 pb-10 border border-[#EAEBEC] bg-gradient-to-tl from-[#16CE67] to-[#012D14] text-white flex flex-col justify-center relative gap-3">
							<p className="text-2xl font-semibold mb-2">91%</p>
							<p className="text-base font-semibold mb-1">Boost Your Clinic’s Online Presence</p>
							<p className="text-sm font-medium">Increase Your Digital Visibility</p>
							<button
								onClick={() => navigate("signup")}
								className="absolute -bottom-1 -right-0.5 bg-[#039342] rounded-tl-2xl rounded-br-2xl text-white border-2 border-white px-4 py-2"
							>
								Join Now
							</button>
						</div>
						<div className="col-start-2 row-start-3 md:col-start-5 md:row-span-1 rounded-lg px-4 py-2 border border-[#EAEBEC] bg-[#EAF6EF] flex flex-col justify-center">
							<p className="text-2xl font-semibold">24/7</p>
							<p className="text-base font-semibold">Dedicated Support</p>
						</div>
					</div>
				</div>
			</div>

			{/* service card */}
			<div className="bg-green px-12 py-6 hidden md:block">
				<div className="bg-[#E6F2EB] py-8 rounded-lg grid grid-cols-1 divide-y-2 md:divide-y-0 gap-4 md:gap-0 md:grid-cols-4 sm:divide-x-2 divide-white ">
					<ServiceCard
						number={"2700+"}
						text={"Physio With us"}
					/>
					<ServiceCard
						number={"24*7"}
						text={"Customer Support"}
					/>
					<ServiceCard
						number={"Same Day"}
						text={"Payment Withdrawl"}
					/>
					<ServiceCard
						number={"22+ Cities"}
						text={"1500+ Pincode"}
					/>
				</div>
			</div>

			{/* Empower growth */}
			<section className="pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px]">
				<HomeTitleComponent
					sectionText={"Ready to Join PhysioPlus?"}
					title={"Empowering Growth with Innovative Support"}
					description={
						"Transform your practice with our innovative support, designed to enhance your growth and elevate patient care efficiently."
					}
				/>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
					<PrincipleCard
						section={"physioConnect"}
						img={"connect/Ready.png"}
						title={"Boost Your Earnings with More Clients!"}
						description={
							"Join our platform and connect with a steady stream of clients looking for expert physiotherapy services. Increase your earnings while helping more people get back on their feet."
						}
						buttonText={
							<>
								Join Now <FaArrowRight className="text-xs" />
							</>
						}
						buttonLink={() => navigate("/physio-connect/signup")}
					/>
					<PrincipleCard
						section={"physioConnect"}
						img={"connect/Ready2.png"}
						title={"Expand Your Online Presence, Be Seen by Thousands"}
						description={
							"Stand out in the digital space with your own professional profile. We help you showcase your expertise, credentials, and client reviews to attract more patients online."
						}
						buttonText={
							<>
								Join Now <FaArrowRight className="text-xs" />
							</>
						}
						buttonLink={() => navigate("/physio-connect/signup")}
					/>
					<PrincipleCard
						section={"physioConnect"}
						img={"connect/Ready3.png"}
						title={"Grow Your Business with Strategic Marketing Support"}
						description={
							"Leave the marketing to us! Our platform promotes your services through targeted digital campaigns, helping you grow your client base without any extra effort"
						}
						buttonText={
							<>
								Join Now <FaArrowRight className="text-xs" />
							</>
						}
						buttonLink={() => navigate("/physio-connect/signup")}
					/>
					<PrincipleCard
						section={"physioConnect"}
						img={"connect/Ready4.png"}
						title={"Your Success is Our Mission - Let's Grow Together"}
						description={
							"We are committed to helping you succeed. Whether you're just starting out or a seasoned professional, our platform provides the tools and support you need to take your career to the next level"
						}
						buttonText={
							<>
								Join Now <FaArrowRight className="text-xs" />
							</>
						}
						buttonLink={() => navigate("/physio-connect/signup")}
					/>
					<PrincipleCard
						section={"physioConnect"}
						img={"connect/Ready5.png"}
						title={"Enhance skills with continuous learning opportunities"}
						description={
							"Stay ahead in your field with access to exclusive webinars, courses, professional development content, networking events, mentorship programs, and certifications"
						}
						buttonText={
							<>
								Join Now <FaArrowRight className="text-xs" />
							</>
						}
						buttonLink={() => navigate("/physio-connect/signup")}
					/>
					<PrincipleCard
						section={"physioConnect"}
						img={"connect/Ready6.png"}
						title={"Be Part of a Thriving Professional Community"}
						description={
							"Join a network of top physiotherapists and gain access to valuable resources, continuing education, and peer support. Collaborate, grow, and share knowledge to improve your practice"
						}
						buttonText={
							<>
								Join Now <FaArrowRight className="text-xs" />
							</>
						}
						buttonLink={() => navigate("/physio-connect/signup")}
					/>
				</div>
				<div className="mt-12 flex items-center justify-center">
					<Button
						onClick={() => navigate("/physio-connect/signup")}
						className="font-normal text-lg sm:text-base rounded-full w-fit bg-[#039342] text-white hover:shadow-none px-8 py-3 capitalize border border-white shadow-none"
					>
						Get Started Today
					</Button>
				</div>
			</section>

			{/* about opportunity */}
			<section className="bg-[#FFFDF8] pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px]">
				<HomeTitleComponent
					sectionText={"About The Opportunity"}
					title={"Unlock New Opportunities with Physio Connect"}
					description={
						"Joining Physio Connect is more than just an opportunity it's a gateway to a thriving community of physiotherapists who are dedicated to excellence in care and collaboration. By enrolling, you’ll not only enhance your skills and resources but also open the door to new revenue streams. Embrace the future of physiotherapy today."
					}
					textColor={"black"}
				/>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-[#FFFDF5] border border-[#EAEBEC] rounded-2xl p-4 flex">
						<div className="w-2/3">
							<p className="text-lg font-semibold mb-4">Step : 1</p>
							<p className="text-lg font-semibold mb-1">Elevate Your Digital Presence Affordably</p>
							<p className="text-sm mb-6">
								Transform your digital presence affordably with creative, impactful solutions that fit your budget
								perfectly.
							</p>
							<button
								className="flex gap-1 items-center mt-4 w-fit bg-green text-white px-3 py-1 rounded-2xl"
								onClick={() => navigate("signup")}
							>
								Join Now <FaArrowRight className="text-xs" />
							</button>
						</div>
						<div className="w-1/3">
							<img
								src="connect/opportunity.png"
								alt=""
								className="w-full h-full object-contain rounded-2xl shadow-none"
							/>
						</div>
					</div>
					<div className="bg-[#FFFDF5] border border-[#EAEBEC] rounded-2xl p-4 flex">
						<div className="w-2/3">
							<p className="text-lg font-semibold mb-4">Step : 2</p>
							<p className="text-lg font-semibold mb-1">Drive Growth with Physioplus</p>
							<p className="text-sm mb-6">
								Increase growth Physioplus provide new patient through it, vast network and unique marketing strategies
							</p>
							<button
								className="flex gap-1 items-center mt-4 w-fit bg-green text-white px-3 py-1 rounded-2xl"
								onClick={() => navigate("signup")}
							>
								Join Now <FaArrowRight className="text-xs" />
							</button>
						</div>
						<div className="w-1/3">
							<img
								src="connect/opportunity2.png"
								alt=""
								className="w-full h-full object-contain rounded-2xl shadow-none"
							/>
						</div>
					</div>
					<div className="bg-[#FFFDF5] border border-[#EAEBEC] rounded-2xl p-4 flex">
						<div className="w-2/3">
							<p className="text-lg font-semibold mb-4">Step : 3</p>
							<p className="text-lg font-semibold mb-1">
								Boost Your Patient Base with a Surge of Inquiries from Your Clinic
							</p>
							<p className="text-sm mb-6">Increase Patient client by getting vast queries of patient from clinic</p>
							<button
								className="flex gap-1 items-center mt-4 w-fit bg-green text-white px-3 py-1 rounded-2xl"
								onClick={() => navigate("signup")}
							>
								Join Now <FaArrowRight className="text-xs" />
							</button>
						</div>
						<div className="w-1/3">
							<img
								src="connect/opportunity3.png"
								alt=""
								className="w-full h-full object-contain rounded-2xl shadow-none"
							/>
						</div>
					</div>
					<div className="bg-[#FFFDF5] border border-[#EAEBEC] rounded-2xl p-4 flex">
						<div className="w-2/3">
							<p className="text-lg font-semibold mb-4">Step : 4</p>
							<p className="text-lg font-semibold mb-1">
								Join India's Largest Network of Physiotherapists and Be the Plus!
							</p>
							<p className="text-sm mb-6">Be the Plus in the Biggest Network of the Physiotherapists Across India</p>
							<button
								className="flex gap-1 items-center mt-4 w-fit bg-green text-white px-3 py-1 rounded-2xl"
								onClick={() => navigate("signup")}
							>
								Join Now <FaArrowRight className="text-xs" />
							</button>
						</div>
						<div className="w-1/3">
							<img
								src="connect/opportunity4.png"
								alt=""
								className="w-full h-full object-contain rounded-2xl shadow-none"
							/>
						</div>
					</div>
				</div>

				<div className="mt-12 flex items-center justify-center">
					<Button
						onClick={() => navigate("/physio-connect/signup")}
						className="font-normal text-lg sm:text-base rounded-full w-fit bg-[#039342] text-white hover:shadow-none px-8 py-3 capitalize border border-white shadow-none"
					>
						Start Your Journey Today
					</Button>
				</div>
			</section>

			{/* mobile details card */}
			<section className="py-12 px-4 sm:px-12 lg:px-[120px] md:min-h-screen bg-gradient-to-b from-[#039342] to-[#004E89]">
				{/* heading */}
				<div className="flex flex-col md:flex-row gap-2 md:gap-4 text-white items-center">
					<div className="w-4/5 flex flex-col gap-3 justify-center">
						<h6 className="text-3xl md:text-5xl font-bold text-left md:text-left leading-5">
							Your All-in-One Solution for PHYSIO MANAGEMENT
						</h6>
						<p className="text-base text-left my-0 lg:pl-0 lg:pr-2 py-2">
							Experience a seamless way to manage your physiotherapy practice with our app. From patient scheduling and
							treatment plans to progress tracking and performance insights, everything is at your fingertips
						</p>
					</div>
					<div className="w-1/5">
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
				<section className="py-8 ">
					<Swiper
						modules={[Navigation, Pagination]}
						spaceBetween={10}
						slidesPerView={1}
						loop={true}
						pagination={{ clickable: true }}
						style={{
							height: "100%",
						}}
						breakpoints={{
							540: { slidesPerView: 1, spaceBetween: 10 },
							720: { slidesPerView: 1.2, spaceBetween: 10 },
							960: { slidesPerView: 1.5, spaceBetween: 10 },
						}}
						className="relative max-w-[88vw] sm:max-w-[80vw] md:max-w-[64vw] lg:max-w-[72vw] md:h-[560px]"
					>
						{mobdata.map((data, index) => (
							<SwiperSlide key={index}>
								<div className="px-8 py-6 mb-8 border border-[#EAEBEC] rounded-2xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-md">
									<div className="flex flex-col justify-around gap-4">
										<h6
											className="text-xl sm:text-3xl lg:text-5xl font-bold text-white"
											dangerouslySetInnerHTML={{ __html: data.title }}
										/>
										<p className="text-white text-xs md:text-base font-xs md:w-2/3 text-justify">{data.description}</p>
									</div>

									<div className="flex flex-col-reverse sm:flex-row gap-2 items-center sm:items-start mt-2">
										{/* Left side - Benefits */}
										<div className="w-full flex flex-col justify-center">
											<div className="flex flex-col justify-around">
												{/* <hr className="mt-4 mb-4 border-1 border-gray-300" /> */}

												<h6 className="font-bold text-white text-lg mt-2">Benefits</h6>
											</div>

											<div>
												{data?.benefits?.map((benefit, benefitIndex) => (
													<p
														key={benefitIndex}
														className={`w-2/3 text-xs sm:text-sm md:text-base font-small text-white cursor-pointer mx-0 my-1 px-2 flex rounded-lg items-center py-1 ${
															selectedBenefits[index] === benefit.title
																? "bg-white bg-opacity-20  px-4" // Green background and white text when selected
																: "hover:bg-white hover:bg-opacity-20"
														}`}
														onClick={() => handleBenefitClick(index, benefit.title)} // Update the selected benefit for this card
													>
														<img
															src={selectedBenefits[index] === benefit.title ? data.selectedVerify : data.verify}
															alt=""
															className=" w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1"
														/>
														{benefit.title}
													</p>
												))}
												<Button
													className="mt-3 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-green font-normal text-sm md:text-base px-4 py-2.5 rounded-full normal-case border border-green"
													onClick={() =>
														window.open(
															"https://play.google.com/store/apps/details?id=com.physio.physio&hl=en",
															"_blank"
														)
													}
												>
													Download our App <FaApple className="w-5 h-5" /> <FaGooglePlay className="w-4 h-4" />
												</Button>
											</div>
										</div>

										{/* Right side - Image display */}
										<div className="w-fit flex flex-col justify-center items-center">
											{/* Conditionally render the image based on selectedBenefit */}
											{selectedBenefits[index] && (
												// Check if benefit exists, else show a fallback
												<>
													{data.benefits?.find((benefit) => benefit.title === selectedBenefits[index]) ? (
														<img
															src={data.benefits.find((benefit) => benefit.title === selectedBenefits[index]).img}
															alt={selectedBenefits[index]}
															className="max-w-[120px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[250px] xl:max-w-[300px] max-h-[360px] object-contain aspect-[9/16]"
														/>
													) : (
														<p className="text-gray-500">No image available for this benefit.</p>
													)}
												</>
											)}
										</div>
									</div>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</section>
			</section>

			{/* Interested */}
			<section className="flex flex-col md:flex-row mt-12 md:mt-[108px] mb-11 md:mb-24 mx-4 sm:mx-12 lg:mx-[120px] sm:flex-row justify-center items-center bg-[#F1F9F4] rounded-lg px-12">
				<div className="flex flex-col text-center sm:text-left w-full md:w-1/2 gap-8">
					<h6 className="sm:text-4xl text-3xl self-start font-bold">Interested in Partnering with us</h6>
					<p>Explore a range of tools that you can use as a physiotherapist to elevate and optimize your practice.</p>

					<Button
						onClick={() => navigate("/contact")}
						className="font-normal text-sm sm:text-base rounded-full w-fit bg-green text-white hover:shadow-none px-8 py-2 capitalize"
					>
						Send an enquiry
					</Button>
				</div>
				<div className="flex justify-center w-36 sm:w-1/2">
					<img
						src="connect/interested.png"
						alt="interested Image"
						className=""
					/>
				</div>
			</section>

			{/* Hear from team */}
			<section
				className="pt-12 md:pt-[108px] bg-[#FFFDF8] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px]"
				id="video"
			>
				<HomeTitleComponent
					sectionText={"What Our Members Are Saying"}
					title={"Hear from Team Physioplus"}
					description={
						"Join over 20,000 physiotherapists who trust PhysioPlus to elevate their online business and enhance client engagement."
					}
				/>
				<div className="flex flex-col md:flex-row gap-4 lg:gap-8 items-center justify-evenly w-full mx-auto">
					<Swiper
						spaceBetween={10}
						slidesPerView={1}
						loop={true}
						modules={[Navigation, FreeMode, Thumbs]}
						onSlideChange={() => {
							// Pause all videos when sliding
							const videos = document.querySelectorAll("video");
							videos.forEach((video) => video.pause());
						}}
						breakpoints={{
							640: {
								slidesPerView: 2,
								spaceBetween: 10,
							},
							720: {
								slidesPerView: 2,
								spaceBetween: 10,
							},
							960: {
								slidesPerView: 3,
								spaceBetween: 10,
							},
							1140: {
								slidesPerView: 4,
								spaceBetween: 10,
							},
						}}
						className="max-w-[80vw] lg:max-w-[74vw] !mx-0"
					>
						{MemberVideoData.map((data) => (
							<SwiperSlide
								key={data.id}
								className="h-auto"
							>
								<HorizontalCardTwo
									video={data.video}
									title={data.title}
									subTitle={data.subTitle}
									imgLink={data.imgLink}
									description={data.description}
									poster={data.poster}
								/>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
				<div className="mt-12 flex items-center justify-center md:justify-between">
					<div className="hidden md:block md:invisible">Many more to come ....</div>
					<Button
						onClick={() => navigate("/physio-connect/signup")}
						className="font-normal text-base sm:text-lg rounded-full w-fit bg-green text-white hover:shadow-none px-8 py-2 capitalize"
					>
						Get Started Today
					</Button>
					<div className="hidden md:block md:invisible">Many more to come ....</div>
				</div>
			</section>

			{/* Our Principles */}
			<section className="pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px]">
				<HomeTitleComponent
					sectionText={"Our Core Principles"}
					title={"Our Principles"}
					description={"Their are 3 principle that lay our foundation"}
				/>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
					<PrincipleCard
						section={"physioConnect"}
						img={"connect/graduation.png"}
						title={"Educate"}
						description={
							"Our advanced surgical treatments provide effective solutions, combining expert care and cutting-edge technology to achieve the best patient outcomes."
						}
					/>
					<PrincipleCard
						section={"physioConnect"}
						img={"connect/mic.png"}
						title={"Aware"}
						description={
							"Our services are available in over 300+ pincodes, ensuring convenience and accessibility for clients in diverse regions across the country."
						}
					/>
					<PrincipleCard
						section={"physioConnect"}
						img={"connect/connect.png"}
						title={"Connect"}
						description={
							"Our treatments are designed to be cost-effective, providing high-quality care and exceptional results without compromising your budget or expectations."
						}
					/>
				</div>
				<div className="mt-12 flex items-center justify-center">
					<Button
						onClick={() => navigate("/physio-connect/signup")}
						className="font-normal text-base sm:text-lg rounded-full w-fit bg-green text-white hover:shadow-none px-8 py-2 capitalize"
					>
						Get Started Today
					</Button>
				</div>
			</section>

			{/* Still in doubts? */}
			<section className="pt-12 md:pt-[108px] bg-[#FFFDF8] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px]">
				<HomeTitleComponent
					sectionText={"Still in doubts?"}
					title={"How Physioplus will increase patient to your clinic"}
					description={
						"Physioplus enhances clinic visibility, simplifies patient bookings, and improves patient management for consistent growth"
					}
				/>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
					<div className="bg-[#FFFFFD] border border-[#EAEBEC] rounded-2xl p-4">
						<div>
							<p className="text-lg font-semibold mb-1">Empower Patient Choices</p>
							<p className="text-sm">
								Enable patients to make informed decisions about their treatments, fostering personalized care and
								effective recovery
							</p>
						</div>
						<div className="flex items-end justify-end">
							<button
								className="w-1/3 flex gap-1 items-center mt-4 h-fit text-nowrap bg-green text-white px-3 py-1 rounded-2xl"
								onClick={() => navigate("signup")}
							>
								Join Now <FaArrowRight className="text-xs" />
							</button>
							<img
								src="connect/stillDoubts.png"
								alt=""
								className="w-2/3 h-full object-contain rounded-2xl shadow-none"
							/>
						</div>
					</div>
					<div className="bg-[#FFFFFD] border border-[#EAEBEC] rounded-2xl p-4">
						<div>
							<p className="text-lg font-semibold mb-1">Innovative Marketing Strategies</p>
							<p className="text-sm">
								Leverage cutting-edge social media tactics to increase your visibility and attract new patients
								effortlessly
							</p>
						</div>
						<div className="flex items-end justify-end">
							<button
								className="w-1/3 flex gap-1 items-center mt-4 h-fit text-nowrap bg-green text-white px-3 py-1 rounded-2xl"
								onClick={() => navigate("signup")}
							>
								Join Now <FaArrowRight className="text-xs" />
							</button>
							<img
								src="connect/stillDoubts2.png"
								alt=""
								className="w-2/3 h-full object-contain rounded-2xl shadow-none"
							/>
						</div>
					</div>
					<div className="bg-[#FFFFFD] border border-[#EAEBEC] rounded-2xl p-4">
						<div>
							<p className="text-lg font-semibold mb-1">Diverse Partnership Opportunities</p>
							<p className="text-sm">
								Benefit from exclusive collaborations with corporates and sports academies, expanding your reach to
								varied demographics
							</p>
						</div>
						<div className="flex items-end justify-end">
							<button
								className="w-1/3 flex gap-1 items-center mt-4 h-fit text-nowrap bg-green text-white px-3 py-1 rounded-2xl"
								onClick={() => navigate("signup")}
							>
								Join Now <FaArrowRight className="text-xs" />
							</button>
							<img
								src="connect/stillDoubts3.png"
								alt=""
								className="w-2/3 h-full object-contain rounded-2xl shadow-none"
							/>
						</div>
					</div>
					<div className="bg-[#FFFFFD] border border-[#EAEBEC] rounded-2xl p-4">
						<div>
							<p className="text-lg font-semibold mb-1">Join a Network</p>
							<p className="text-sm">
								Connect with India's largest physiotherapy network, promoting collaboration and growth across over 100+
								cities
							</p>
						</div>
						<div className="flex items-end justify-end">
							<button
								className="w-1/3 flex gap-1 items-center mt-4 h-fit text-nowrap bg-green text-white px-3 py-1 rounded-2xl"
								onClick={() => navigate("signup")}
							>
								Join Now <FaArrowRight className="text-xs" />
							</button>
							<img
								src="connect/stillDoubts4.png"
								alt=""
								className="w-2/3 h-full object-contain rounded-2xl shadow-none"
							/>
						</div>
					</div>
					<div className="bg-[#FFFFFD] border border-[#EAEBEC] rounded-2xl p-4">
						<div>
							<p className="text-lg font-semibold mb-1">Insurance Patient Access</p>
							<p className="text-sm">
								Tap into a steady stream of patients seeking recovery through partnerships with leading insurance TPAs
							</p>
						</div>
						<div className="flex items-end justify-end">
							<button
								className="w-1/3 flex gap-1 items-center mt-4 h-fit text-nowrap bg-green text-white px-3 py-1 rounded-2xl"
								onClick={() => navigate("signup")}
							>
								Join Now <FaArrowRight className="text-xs" />
							</button>
							<img
								src="connect/stillDoubts5.png"
								alt=""
								className="w-2/3 h-full object-contain rounded-2xl shadow-none"
							/>
						</div>
					</div>
					<div className="bg-[#FFFFFD] border border-[#EAEBEC] rounded-2xl p-4">
						<div>
							<p className="text-lg font-semibold mb-1">Ongoing Professional Support</p>
							<p className="text-sm">
								Enable patients to make informed decisions about their treatments, fostering personalized care and
								effective recovery
							</p>
						</div>
						<div className="flex items-end justify-end">
							<button
								className="w-1/3 flex gap-1 items-center mt-4 h-fit text-nowrap bg-green text-white px-3 py-1 rounded-2xl"
								onClick={() => navigate("signup")}
							>
								Join Now <FaArrowRight className="text-xs" />
							</button>
							<img
								src="connect/stillDoubts6.png"
								alt=""
								className="w-2/3 h-full object-contain rounded-2xl shadow-none"
							/>
						</div>
					</div>
				</div>
				<div className="mt-12 flex items-center justify-center">
					<Button
						onClick={() => navigate("signup")}
						className="font-normal text-sm sm:text-base rounded-full w-fit bg-green text-white hover:shadow-none px-8 py-2 capitalize"
					>
						Get Started Today
					</Button>
				</div>
			</section>

			{/* review */}
			<div className="flex flex-col pt-12 md:pt-[108px] bg-[#FFFDED] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px]">
				<div className="flex justify-center mb-12">
					<p className="text-4xl font-semibold">Experience the Joy Through Our Customers Faces</p>
				</div>
				<Swiper
					// onSwiper={setThumbsSwiper}
					spaceBetween={10}
					slidesPerView={2}
					freeMode={true}
					watchSlidesProgress={true}
					breakpoints={{
						480: { slidesPerView: 4 },
						720: {
							slidesPerView: 6,
						},
					}}
					modules={[FreeMode, Navigation, Thumbs]}
					className="max-w-[80vw] md:max-w-[72vw] max-h-[65vh]  rounded-md"
				>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/131.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/20.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/21.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/22.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/23.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/24.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/25.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/26.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/27.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/28.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/29.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/132.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/133.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/134.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/135.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/136.png"
						/>
					</SwiperSlide>
					<SwiperSlide>
						<img
							className="rounded-md "
							src="https://123456789video.s3.ap-south-1.amazonaws.com/Happy+Customer/137.png"
						/>
					</SwiperSlide>
				</Swiper>
			</div>

			{/* faq */}
			<div className="flex flex-col md:flex-row gap-4 pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px] md:divide-x divide-gray-200">
				<div className="md:w-2/5 w-full flex flex-col gap-6">
					<h6 className="text-3xl md:text-6xl font-semibold ">Frequently Asked Questions</h6>
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
						onClick={() => navigate("/physio-connect/signup")}
						className="bg-green w-fit px-6 py-3 rounded-full font-normal hover:shadow-none"
					>
						Book Appointment
					</Button>
				</div>
				<FAQ />
			</div>
		</>
	);
};
export default PhysioConnect;
