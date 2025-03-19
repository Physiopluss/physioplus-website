const VideoPopup = ({ src, className }) => {
	return (
		<video
			className="absolute max-w-[50vw] min-w-[20vw] max-h-[25vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
			src="https://123456789video.s3.ap-south-1.amazonaws.com/Physios+Review+Images/Govind.mp4"
			controls
		/>
	);
};
export default VideoPopup;
