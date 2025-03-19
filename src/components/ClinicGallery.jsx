import { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const ClinicGallery = ({ images }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const scrollContainerRef = useRef(null);

	const openGallery = (index) => {
		setCurrentImageIndex(index);
		setIsOpen(true);
	};

	const closeGallery = () => {
		setIsOpen(false);
	};

	const showNextImage = (e) => {
		e.stopPropagation();
		setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
	};

	const showPrevImage = (e) => {
		e.stopPropagation();
		setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
	};

	const scroll = (direction) => {
		const container = scrollContainerRef.current;
		if (container) {
			const scrollAmount = 200;
			container.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	const showButtons =
		scrollContainerRef.current && scrollContainerRef.current.scrollWidth > scrollContainerRef.current.clientWidth;

	return (
		<div className="relative">
			{/* Thumbnail Gallery */}
			<div className="relative">
				{showButtons && (
					<button
						onClick={() => scroll("left")}
						className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full w-8 h-8 shadow-md bg-opacity-70 z-10 flex items-center justify-center"
					>
						<FaChevronLeft className="w-5 h-5" />
					</button>
				)}

				<div
					ref={scrollContainerRef}
					className="flex gap-2 rounded-md overflow-x-hidden my-2"
					style={{ scrollBehavior: "smooth" }}
				>
					{images.map((item, index) => (
						<img
							key={index}
							src={item}
							alt={`Clinic image ${index + 1}`}
							className="object-cover rounded-md h-48 w-40 cursor-pointer"
							onClick={() => openGallery(index)}
						/>
					))}
				</div>

				{showButtons && (
					<button
						onClick={() => scroll("right")}
						className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full w-8 h-8 shadow-md bg-opacity-70 z-10 flex items-center justify-center"
					>
						<FaChevronRight className="w-5 h-5" />
					</button>
				)}
			</div>

			{/* Modal Gallery */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
					onClick={closeGallery}
				>
					<div
						className="relative w-full h-full flex items-center justify-center"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Navigation Buttons */}
						<button
							className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
							onClick={showPrevImage}
						>
							<FaChevronLeft className="w-6 h-6 text-gray-800" />
						</button>

						{/* Current Image */}
						<div className="relative">
							<img
								src={images[currentImageIndex]}
								alt={`Gallery image ${currentImageIndex + 1}`}
								className="max-w-[80vw] max-h-[80vh] rounded-md object-contain"
							/>

							{/* Image Counter */}
							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
								{currentImageIndex + 1} / {images.length}
							</div>
						</div>

						<button
							className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
							onClick={showNextImage}
						>
							<FaChevronRight className="w-6 h-6 text-gray-800" />
						</button>

						{/* Close Button */}
						<button
							className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
							onClick={closeGallery}
						>
							<IoMdClose className="w-6 h-6 text-gray-800" />
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default ClinicGallery;
