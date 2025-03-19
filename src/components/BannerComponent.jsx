import { Typography, Avatar } from "@material-tailwind/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import PhysioFinder from "./PhysioFinder";

const BannerComponent = () => {
	return (
		<div className="py-4 min-h-[110vh] flex flex-col justify-around items-center gap-4">
			<div className="relative flex flex-col gap-4 md:w-1/2 items-center text-center">
				{/* avatar group */}
				<div className="w-fit px-4 sm:px-6 py-2.5 flex items-center gap-2 sm:gap-4 border bg-white border-gray-200 rounded-xl">
					<div className="flex  items-center -space-x-4">
						<Avatar
							variant="circular"
							alt="user 1"
							size="sm"
							className="border-2 border-white"
							src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
						/>
						<Avatar
							variant="circular"
							alt="user 2"
							size="sm"
							className="border-2 border-white"
							src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80"
						/>
						<Avatar
							variant="circular"
							alt="user 3"
							size="sm"
							className="border-2 border-white"
							src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80"
						/>
						<Avatar
							variant="circular"
							alt="user 4"
							size="sm"
							className="border-2 border-white"
							src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
						/>
					</div>
					<div className="font-semibold text-xs sm:text-sm text-green">5000+ people already Recovered</div>
				</div>
				<Typography
					variant="h2"
					className="px-4 sm:px-0 text-5xl sm:text-6xl font-semibold text-black"
				>
					Get the Right <span className="text-green">Physio Care</span> for <span className="text-green">You</span>
				</Typography>
				<Typography
					variant="h5"
					className="px-4 sm:px-0 text-base font-medium text-black"
				>
					Get expert physiotherapy in the comfort of your home or at our trusted clinic, with personalized care tailored
					to your recovery needs
				</Typography>

				<img
					src="/home/HeroIllustratorOne.png"
					alt=""
					className="lg:block hidden absolute -bottom-4 -left-48"
				/>
				<img
					src="/home/HeroIllustratorTwo.png"
					alt=""
					className="md:block hidden absolute -bottom-4 -right-44"
				/>
			</div>

			<div className="w-full px-4 sm:px-12 lg:px-[120px] mx-auto
">
				<PhysioFinder />
			</div>

			{/* cities section */}
			<div className="w-full px-4 sm:px-12 lg:px-[120px] ">
				<div
					className="flex flex-col sm:flex-row  
                      bg-white border border-[#EAEBEC] rounded-2xl sm:rounded-3xl 
                      p-3 sm:p-4 items-center drop-shadow-md 
                      gap-3 sm:gap-0"
				>
					<div
						className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 
                          w-full sm:w-2/5 text-center sm:text-left"
					>
						<div
							className="flex justify-center items-center 
                              bg-[#E6F4EC] rounded-full 
                              w-12 h-12 p-1 sm:p-2"
						>
							<img
								src="/home/city.png"
								alt="city"
								className="w-8 h-8"
							/>
						</div>
						<div
							className="text-green font-semibold 
                              text-base sm:text-lg 
                              px-2 sm:px-0"
						>
							Available in 12+ Cities Near You
						</div>
					</div>

					{/* Divider */}
					<hr className="hidden sm:block rotate-90 border sm:w-16 border-green" />

					{/* Cities Swiper */}
					<Swiper
						spaceBetween={8}
						slidesPerView="auto"
						modules={[FreeMode, Navigation, Thumbs]}
						className="w-full sm:w-3/5 px-2 sm:px-0"
						loop={true}
						freeMode={true}
						breakpoints={{
							0: {
								slidesPerView: "auto",
								spaceBetween: 8,
							},
							640: {
								slidesPerView: 3,
								spaceBetween: 10,
							},
							768: {
								slidesPerView: 4,
								spaceBetween: 10,
							},
							1024: {
								slidesPerView: 5,
								spaceBetween: 10,
							},
						}}
					>
						{["Jaipur", "Delhi", "Pune", "Bangalore", "Mumbai", "Chandigarh", "Surat"].map((city) => (
							<SwiperSlide
								key={city}
								className="!w-auto" // Important for mobile sizing
							>
								<div
									className="font-medium text-xs sm:text-sm 
                                      border border-gray-200 
                                      px-3 sm:px-4 py-1.5 sm:py-2 
                                      rounded-full text-center 
                                      hover:bg-gray-200 cursor-pointer 
                                      whitespace-nowrap"
								>
									{city}
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</div>
			</div>
		</div>
	);
};
export default BannerComponent;
