import { Button, Card, Typography } from "@material-tailwind/react";
import { twMerge } from "tailwind-merge";
import { useEffect, useRef } from "react";

const HorizontalCardTwo = ({
	section,
	img,
	video,
	title,
	subTitle,
	description,
	imgLink,
	button,
	buttonLink,
	poster,
}) => {
	const videoRef = useRef(null);

	useEffect(() => {
		const currentVideo = videoRef.current;

		// Pause other videos when this one starts playing
		const handlePlay = () => {
			const videos = document.querySelectorAll("video");
			videos.forEach((video) => {
				if (video !== currentVideo) {
					video.pause();
				}
			});
		};

		// Add play event listener
		if (currentVideo) {
			currentVideo.addEventListener("play", handlePlay);
		}

		// Cleanup
		return () => {
			if (currentVideo) {
				currentVideo.removeEventListener("play", handlePlay);
			}
		};
	}, []);

	return (
		<Card className="border border-[#EAEBEC] h-[500px] shadow-none p-3 flex flex-col gap-2">
			<div className="h-[250px]">
				{video && (
					<video
						ref={videoRef}
						src={video}
						controls
						loading="lazy"
						poster={poster}
						className="object-cover rounded-lg shadow-none w-full h-full"
					/>
				)}
				{img && (
					<img
						src={img}
						alt={"name"}
						className="object-cover rounded-lg shadow-none w-full h-full"
					/>
				)}
			</div>
			<div className="flex-1 flex flex-col overflow-scroll">
				<div className="flex flex-col h-full">
					<Typography
						variant="h3"
						className={twMerge("text-xl text-black mb-1", section == "physioConnectDoubt" && "flex gap-1")}
					>
						{section == "physioConnectDoubt" && <div className="border-l-4 border-green h-full" />}
						{title}
					</Typography>

					{subTitle && (
						<Typography
							variant="p"
							className="text-base text-black mb-1 font-semibold"
						>
							{subTitle}
						</Typography>
					)}

					<div className="text-[14px] flex-1 overflow-y-auto">{description}</div>

					{button && (
						<Button
							onClick={buttonLink}
							className="bg-green text-sm font-semibold w-full hover:shadow-none rounded-full mt-4"
						>
							{button}
						</Button>
					)}
				</div>
			</div>
		</Card>
	);
};
export default HorizontalCardTwo;
