import { useState, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

const MediaGallery = ({ items, type = "images" }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const scrollContainerRef = useRef(null);

	const openGallery = (index) => {
		setCurrentIndex(index);
		setIsOpen(true);
	};

	const closeGallery = () => {
		setIsOpen(false);
	};

	const showNextImage = (e) => {
		e.stopPropagation();
		setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
	};

	const showPrevImage = (e) => {
		e.stopPropagation();
		setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
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

	const getMediaUrl = (item) => {
		if (type === "achievements") {
			return item.achievementImage;
		}
		return item;
	};

	const isPDF = (url) => {
		return url.endsWith(".pdf");
	};

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
					{items?.map((item, index) => {
						const mediaUrl = getMediaUrl(item);
						return isPDF(mediaUrl) ? (
							<div
								key={index}
								className="relative cursor-pointer"
								onClick={() => openGallery(index)}
							>
								<embed
									src={mediaUrl}
									type="application/pdf"
									className="object-cover bg-gray-300 rounded-md h-48 w-40"
								/>
								<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-md">
									<span className="text-white font-medium">PDF</span>
								</div>
							</div>
						) : (
							<>
								<img
									key={index}
									src={mediaUrl}
									alt={`Gallery item ${index + 1}`}
									className="object-cover rounded-md h-48 w-40 cursor-pointer"
									onClick={() => openGallery(index)} // add achievent title if its achievement
								/>
								{type === "achievements" && items[currentIndex].title && (
									<div className="absolute bottom-0 bg-black bg-opacity-40 text-white text-sm px-2 py-1 w-full text-left rounded-b-md overflow-hidden">
										{items[currentIndex].title}
									</div>
								)}
							</>
						);
					})}
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

						{/* Current Item */}
						<div className="relative">
							{isPDF(getMediaUrl(items[currentIndex])) ? (
								<embed
									src={getMediaUrl(items[currentIndex])}
									type="application/pdf"
									className="max-w-[80vw] max-h-[80vh] rounded-md bg-white"
								/>
							) : (
								<>
									<img
										src={getMediaUrl(items[currentIndex])}
										alt={`Gallery item ${currentIndex + 1}`}
										className="max-w-[80vw] max-h-[80vh] rounded-md object-contain"
									/>
								</>
							)}

							{/* Item Counter */}
							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
								{currentIndex + 1} / {items.length}
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

export default MediaGallery;
