import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Autoplay, FreeMode, Navigation, Thumbs } from "swiper/modules";

const SwiperGallery = () => {
	return (
		<div>
			<Swiper
				style={{
					"--swiper-navigation-color": "#fff",
					"--swiper-pagination-color": "#fff",
					"--swiper-navigation-size": "25px",
				}}
				autoplay={{
					delay: 2500,
					disableOnInteraction: false,
				}}
				spaceBetween={10}
				modules={[Autoplay, FreeMode, Navigation, Thumbs]}
				className="mb-2 sm:mb-4 rounded-md"
			>
				{[30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40].map((num) => (
					<SwiperSlide
						key={num}
						className="flex items-center justify-center"
					>
						<img
							className="rounded-md w-full h-full object-contain"
							src={`https://123456789video.s3.ap-south-1.amazonaws.com/Physioplus+Inc+Patient/Swiper+Gallery/${num}.png`}
							alt={`Gallery image ${num}`}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
};
export default SwiperGallery;
