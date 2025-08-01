import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const promoData = [
  {
    id: 1,
    image: "/homecare/banner2.jpeg",
  },

  {
    id: 2,
    image: "/homecare/banner1.jpeg",
  },
  {
    id: 3,
    image: "/homecare/banner3.jpeg",
  },
];

export default function PromoBannerSwiper() {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 4000 }}
      loop
      spaceBetween={16}
      slidesPerView={1}
      className="w-full  rounded-xl overflow-hidden"
    >
      {promoData.map(({ id, image }) => (
        <SwiperSlide key={id}>
          <img
            src={image}
            alt={`Promo ${id}`}
            className="w-full h-40  md:h-64 object-contain md:object-contain rounded-xl"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
