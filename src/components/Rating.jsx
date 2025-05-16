import React from 'react'
import { FaStar, FaRegStar } from "react-icons/fa"; // filled and outlined stars

const Rating = (rating) => {
 const totalStars = 5;
  return (
    <div className="flex gap-1 mb-4">
      {Array.from({ length: totalStars }).map((_, index) => {
        const isActive = index < rating;
        return (
          <div
            key={index}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold border
              ${isActive ? "bg-green-500 text-white" : "bg-white text-green-500 border-green-500"}
            `}
          >
            {isActive ? <FaStar className="text-sm" /> : <FaRegStar className="text-sm" />}
          </div>
        );
      })}
    </div>
  );
};

export default Rating
