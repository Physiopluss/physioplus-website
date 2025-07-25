import React, { useState } from "react";

const demoDoctor = {
  name: "Dr. Abhi Mehra",
  specialization: "General Pain, Sport Physiotherapy",
  // Replace below with actual image URL or static import in your project
  photo: "https://randomuser.me/api/portraits/men/65.jpg",
};

const GiveRating = () => {
  const [rating, setRating] = useState(2);

  // Optional: handle rating submit
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`You submitted a rating of ${rating} stars!`);
    // Add your API call here
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      {/* Profile */}
      <div className="flex flex-col items-center mt-8 mb-6">
        <img
          src={demoDoctor.photo}
          alt="Doctor"
          className="w-20 h-20 rounded-full object-cover object-center mb-2"
        />
        <div className="text-lg font-semibold text-center mb-1">
          {demoDoctor.name}
        </div>
        <div className="text-sm text-gray-500 text-center">
          {demoDoctor.specialization}
        </div>
      </div>
      {/* Rating */}
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col items-center"
      >
        <div className="text-base text-center mb-5">
          How was your experience with them?
        </div>
        <div className="flex flex-row mb-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg
              key={i}
              onClick={() => setRating(i)}
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill={i <= rating ? "#20B486" : "#D1D5DB"}
              stroke="none"
              className="mx-1 cursor-pointer transition-colors"
              aria-label={`${i} Star`}
            >
              <path d="M12 17.25l-6.172 3.727a1 1 0 0 1-1.451-1.054l1.179-6.873-5.028-4.898a1 1 0 0 1 .554-1.704l6.945-1.011 3.107-6.3a1 1 0 0 1 1.794 0l3.107 6.3 6.945 1.011a1 1 0 0 1 .554 1.704l-5.028 4.898 1.179 6.873a1 1 0 0 1-1.451 1.054L12 17.25z" />
            </svg>
          ))}
        </div>
        <button
          type="submit"
          className="w-[90%] max-w-sm bg-green-600 text-lg text-white font-medium rounded-md py-3"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default GiveRating;
