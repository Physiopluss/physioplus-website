import { Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { Reviews } from "../Mock/ReviewData";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@material-tailwind/react";
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel } from "@material-tailwind/react";
import HomeTitleComponent from "../components/HomeTitleComponent";
import ServiceCard from "../components/ServiceCard";
import ReviewCardTwo from "../components/ReviewCardTwo";
import { offeringData, principleData } from "../Mock/aboutPageData";
import ReactGA from "react-ga4";
import { Link } from "react-router-dom";

const AboutUs = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState("patients");

	// google analytics
	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "About" });
	}, []);

	// scroll to top
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<div className="flex flex-col bg-white mx-auto relative">
			{/* hero */}
			<div className="relative inset-0 flex min-h-[calc(100vh-100px)] w-full py-4 flex-col gap-8 md:gap-0 md:flex-row items-center justify-evenly bg-[#FFFDF5] overflow-hidden">
				<div className="w-[70%] md:w-[40%] flex flex-col gap-4 lg:gap-8 z-10 ">
					<Typography
						variant="h2"
						className="text-3xl md:text-5xl font-semibold text-black"
					>
						Reducing Pain and transforming recovery with integrated <span className="text-[#008037]">Physio Care</span>
					</Typography>

					<Typography
						variant="h5"
						className="text-base font-normal text-black"
					>
						At Physioplus experience faster recovery and lasting pain relief with Integrated Physio Care – combining
						expert physiotherapy and advanced treatments to restore mobility, strength, and confidence
					</Typography>

					<Button
						onClick={() => navigate("/physios")}
						className={"rounded-full font-semibold text-base w-fit bg-green text-white px-8 py-2"}
					>
						Reduce Pain Now
					</Button>
				</div>
				<img
					src="about-group.png"
					alt="image 2"
					className="w-[75%] md:w-[45%] z-10 bg-[url('aboutImg/.png')] bg-no-repeat"
				/>
			</div>

			{/* Our journey */}
			<section className="w-full pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px]">
				<HomeTitleComponent
					sectionText={"Our Journey"}
					title={"The Story Behind Us"}
				/>
				<p className="relative text-center text-base font-normal">
					<img
						src="aboutImg/quotes.png"
						className="hidden md:block absolute -top-6 -left-12"
					/>
					Our journey began with a personal experience. Our founder, Jaswant Singh, witnessed his friend Hitesh suffered
					an ACL tear while playing football. Seeing the challenges Hitesh faced during his recovery, Jaswant realized
					the critical role of skilled sports physiotherapists in preventing and treating injuries.
					<br />
					<br />
					Inspired by this experience, we set out to create an accessible platform connecting athletes and individuals
					with qualified physiotherapists. Our mission is to educate parents, coaches, and the general public about the
					importance of preventive care and rehabilitation in sports and everyday life. By providing a convenient way to
					find the right physiotherapist, we aim to support individuals on their path to optimal health and well-being."
				</p>
				<div className="flex flex-col md:flex-row gap-8 justify-center mt-4">
					<Card className="mt-6 mb-2 bg-[#E6F4EC]">
						<CardBody>
							<img
								src="/aboutImg/mission.png"
								alt=""
							/>
							<Typography
								variant="h5"
								className="text-2xl font-semibold text-black mt-4"
							>
								Our Mission
							</Typography>
							<Typography
								variant="body1"
								className="mt-4 text-base font-normal"
							>
								To become the leading physiotherapy service provider across India by delivering exceptional care,
								personalized treatment plans, and innovative solutions that improve the quality of life for our clients.
								We are dedicated to building a healthier nation through accessible, professional, and result-oriented
								physiotherapy services, ensuring our clients achieve optimal physical well-being.
							</Typography>
						</CardBody>
					</Card>
					<Card className="mt-6 mb-2 bg-[#E6F4EC]">
						<CardBody>
							<img
								src="/aboutImg/bulb.png"
								alt=""
							/>
							<Typography
								variant="h5"
								className="text-2xl font-semibold text-black mt-4"
							>
								Our Vision
							</Typography>
							<Typography
								variant="body1"
								className="mt-4 text-base font-normal"
							>
								At PhysioPlus Healthcare, our vision To ensure that no sportsperson or individual is ever forced to
								leave their career or live in worry due to physical limitations. We strive to empower people with the
								highest quality physiotherapy services, helping them overcome injuries and challenges, so they can
								continue pursuing their passions and living their lives to the fullest patients
							</Typography>
						</CardBody>
					</Card>
				</div>
			</section>

			{/* Our offering */}
			<section className="pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px] bg-[#FFFDF5]">
				<HomeTitleComponent
					sectionText={"Our offering"}
					title={"What We do at Physioplus Healthcare"}
				/>
				<Tabs value={activeTab}>
					<TabsHeader
						className="rounded-md border-none bg-transparent p-0 max-w-lg mx-auto mt-8 text-lg font-medium"
						indicatorProps={{
							className: "bg-transparent border-b-2 border-green shadow-none rounded-none",
						}}
					>
						{offeringData.map(({ label, value }) => (
							<Tab
								key={value}
								value={value}
								onClick={() => setActiveTab(value)}
								className={`text-lg font-medium ${activeTab === value ? "text-green" : ""}`}
							>
								{label}
							</Tab>
						))}
					</TabsHeader>

					<TabsBody>
						{offeringData.map(({ value, title, desc, image, label, list, button, buttonLink, target }) => (
							<TabPanel
								key={value}
								value={value}
							>
								<div className="flex flex-col-reverse md:flex-row items-center">
									<div className="w-full md:w-1/2 p-4">
										<p className="text-xl text-black font-medium mb-2">{title}</p>
										<p className="text-base font-normal">{desc}</p>
										<ul className="flex flex-col gap-2 list-none mt-4 text-sm font-">
											{list.map((list, index) => (
												<li
													key={index}
													className="flex items-start gap-2"
												>
													<img
														className="w-4 h-4 mt-1"
														src="/success.png"
														alt=""
													/>
													{list}
												</li>
											))}
										</ul>
										<Link
											to={buttonLink}
											target={target}
											rel="noopener noreferrer"
											className="mt-6 rounded-full font-semibold text-base w-fit bg-green text-white px-8 py-2 inline-block"
										>
											{button}
										</Link>
										{/* <link>{buttonLink}</link> */}
									</div>
									<div className="w-full md:w-1/2 p-4">
										<img
											src={image}
											alt={label}
											className="w-full h-auto rounded-md shadow-md"
										/>
									</div>
								</div>
							</TabPanel>
						))}
					</TabsBody>
				</Tabs>
			</section>

			{/* Detail & swiper */}
			<section className="pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px] bg-[#FFFDF5]">
				<div className="bg-white">
					<div className="bg-[#E6F2EB] py-8 rounded-lg grid grid-cols-1 divide-y-2 md:divide-y-0 gap-4 md:gap-0 md:grid-cols-3 sm:divide-x-2 divide-white ">
						<ServiceCard
							number={"2022"}
							text={"Founded Year"}
						/>
						<ServiceCard
							number={"2700+"}
							text={"Physio Associated"}
						/>
						<ServiceCard
							number={"3000+"}
							text={"Patient Treated"}
						/>
					</div>
				</div>
				<div className="mt-10 pt-10 pb-10 w-full bg-[#FFFDED]">
					<div className=" mx-auto max-w-[75vw] ">
						<Swiper
							slidesPerView={4}
							spaceBetween={10}
							className="cursor-pointer bg-[#FFFDED]"
							loop={true}
							modules={[Autoplay, Pagination]}
							autoplay={{
								delay: 2000,
							}}
							breakpoints={{
								640: {
									slidesPerView: 4,
									spaceBetween: 10,
								},
								768: {
									slidesPerView: 4,
									spaceBetween: 10,
								},
								1024: {
									slidesPerView: 4,
									spaceBetween: 10,
								},
							}}
						>
							<SwiperSlide>
								<img
									src="https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/msme-registration-certificate-removebg-preview.png"
									alt=""
									className="object-contain max-h-20 h-20 w-full"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/e9172514-a6cc-44cc-9292-79e840ead44f-removebg-preview.png"
									alt=""
									className="object-contain max-h-20 h-20 w-full"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/image+3.png"
									alt=""
									className="object-contain max-h-20 h-20 w-full"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/image_2-removebg-preview.png"
									alt=""
									className="object-contain max-h-20 h-20 w-full"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/Rajasthan_Football_Association.svg-removebg-preview+(1).png"
									alt=""
									className="object-contain max-h-20 h-20 w-full"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/fortis-hospitals-logo-A9EB82FFBA-seeklogo.com-removebg-preview.png"
									alt=""
									className="object-contain max-h-20 h-20 w-full"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/This_is_a_logo_for_Shalby_Hospitals-removebg-preview.png"
									alt=""
									className="object-contain max-h-20 h-20 w-full"
								/>
							</SwiperSlide>
							<SwiperSlide>
								<img
									src="https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/LOGO-1-1-removebg-preview.png"
									alt=""
									className="object-contain max-h-20 h-20 w-full"
								/>
							</SwiperSlide>
						</Swiper>
					</div>
				</div>
			</section>

			{/* Our Core Principles */}
			<section className="pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px] bg-[#FFFDF5]">
				<HomeTitleComponent
					sectionText={"Our Core Principles"}
					title={"Foundations of Our Excellence"}
				/>
				<Tabs value={activeTab}>
					<TabsHeader
						className="rounded-lg border-b bg-[#E6F4EC] p-0 max-w-lg mx-auto mt-0 mb-8"
						indicatorProps={{
							className: "bg-gray-900/10 shadow-none !text-gray-900",
						}}
					>
						{principleData.map(({ label, value }) => (
							<Tab
								key={value}
								value={value}
								className="text-black" // Inactive state text color
								activeClassName="rounded-md bg-green !text-white" // Active state text color
							>
								{label}
							</Tab>
						))}
					</TabsHeader>
					<TabsBody>
						{principleData.map(({ value, card }) => (
							<TabPanel
								key={value}
								value={value}
							>
								<div className="flex flex-col md:flex-row space-x-6 md:space-x-10">
									{card.map((card, i) => (
										<Card
											key={i}
											className="w-full md:max-w-[30%] overflow-hidden mb-4 ml-4 transition-transform duration-200 hover:scale-105"
										>
											<img
												src={card.img}
												alt="ui/ux review check"
												className=" h-48 w-full object-cover"
											/>
											<CardBody>
												<Typography
													variant="h4"
													color="blue-gray"
												>
													{card.title}
												</Typography>
												<Typography
													variant="lead"
													color="gray"
													className="mt-3 font-normal"
												>
													{card.desc}
												</Typography>
											</CardBody>
										</Card>
									))}
								</div>
								<div className="flex justify-center mt-8"></div>
							</TabPanel>
						))}
					</TabsBody>
				</Tabs>
			</section>

			{/* Testimonial */}
			<div className="pt-12 md:pt-[108px] pb-11 md:pb-24 px-4 sm:px-12 lg:px-[120px] bg-[#FFFDED]">
				<h6 className="sm:text-4xl text-start text-3xl font-bold w-full mb-8">See What's Our Patient Says</h6>
				<div className="flex flex-col md:flex-row gap-4 lg:gap-8 items-stretch justify-start w-full">
					<Swiper
						spaceBetween={10}
						slidesPerView={1}
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
								spaceBetween: 20,
							},
							1140: {
								slidesPerView: 3,
								spaceBetween: 30,
							},
						}}
						className="max-w-[240px] sm:max-w-[480px] md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg !mx-0"
					>
						{Reviews.slice(0, 6).map((review) => (
							<SwiperSlide key={review.id}>
								<ReviewCardTwo
									id={review.id}
									name={review.name}
									img={review.img}
									rating={review.rating}
									review={review.review}
									patientType={review.patientType}
									page={"physioDetail"}
								/>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</div>
	);
};
export default AboutUs;
