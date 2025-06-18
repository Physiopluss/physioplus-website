import { Button } from "@material-tailwind/react";
import { FaLinkedin, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
	const navigate = useNavigate();
	return (
		<div className="w-full flex flex-col justify-center items-center relative ">
			{/*Contact Us */}
			<section className="absolute max-w-full flex flex-col md:flex-row -top-4 md:top-16 sm:flex-row justify-center items-center bg-[#F1F9F4] rounded-lg p-14 ">
				<div className="flex flex-col text-justify sm:text-left w-full md:w-1/2 gap-8">
					<h6 className="sm:text-4xl text-3xl self-start font-bold">Contact Us</h6>
					<p className="w-[110%] text-base">
						Whether you have questions about our services, want to book an appointment, or just need some advice, we're
						here to help. Reach out to our friendly team today.
					</p>

					<Button
						onClick={() => navigate("/contact")}
						className="font-normal text-sm sm:text-base rounded-full w-fit bg-green text-white hover:shadow-none px-9 py-3 capitalize"
					>
						Call us Now
					</Button>
				</div>
				<div className="relative w-36 sm:w-1/2">
					<img
						src="/contactImg.png"
						alt="Contact Us Image"
						className="absolute -top-10 left-24 sm:left-0 md:-top-36 lg:-top-56"
					/>
				</div>
			</section>
			<div className="w-full mt-64 md:mt-64 pt-28 pb-4 bg-[#FFFBED] px-4 sm:px-12 lg:px-[120px]">
				<div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-4 my-10">
					{/* logo and description */}
					<div className="col-span-2 flex flex-col gap-4  items-start w-full sm:items-start">
						<img
							src="/logo-nobg.png"
							className="max-w-[200px]"
						/>
						<p className="text-base font-normal">
							At Physioplus, we are committed to helping you regain mobility and live a pain-free life through
							personalized physiotherapy treatments. Our expert physiotherapists combine advanced techniques with
							compassionate care to address your unique needs
						</p>
						<div className="flex flex-row items-center space-x-3 ">
							<button>
								<a
									href="https://www.facebook.com/Physioplus.pvt.ltd?mibextid=ZbWKwL/"
									target="_blank"
								>
									<FaFacebookF className="w-8 h-8 bg-gray-300  text-green p-1.5 rounded-md cursor-pointer" />
								</a>
							</button>
							<button>
								<a
									href="https://www.instagram.com/physioplushealthcare/?igsh=ZWV6YWVtZDhzN3Ew"
									target="_blank"
								>
									<FaInstagram className="w-8 h-8 bg-gray-300  text-green p-1.5 rounded-md cursor-pointer" />
								</a>
							</button>
							<button>
								<a
									href="https://www.linkedin.com/company/physioplus-healthcare-private-limited/"
									target="_blank"
								>
									<FaLinkedin className="w-8 h-8 bg-gray-300  text-green p-1.5 rounded-md cursor-pointer" />
								</a>
							</button>
							<button>
								<a
									href="https://www.youtube.com/@physioplushealthcare"
									target="_blank"

								>
									<FaYoutube className="w-8 h-8 bg-gray-300  text-green p-1.5 rounded-md cursor-pointer" />
								</a>
							</button>
						</div>
					</div>
					{/* Company */}
					<div className="col-span-2 md:col-span-1 flex flex-col w-full gap-6">
						<div className="text-xl font-semibold">Company</div>
						<ul className="text-base font-normal flex flex-col gap-2">
							<li>
								<Link to="/about">About Us</Link>
							</li>
							<li>
								<Link to="/contact">Contact Us</Link>
							</li>
							<li>
								<Link to="/refund-policy">Refund Policy</Link>
							</li>
							<li>
								<Link to="/privacy">Privacy Policy</Link>
							</li>
							<li>
								<Link to="/terms&condition">Terms & Conditions</Link>
							</li>
						</ul>
					</div>

					{/* Links */}
					<div className="col-span-2 md:col-span-1 flex flex-col w-full gap-6">
						<div className="text-xl font-semibold">Links</div>
						<ul className="text-base font-normal flex flex-col gap-2">
							<li>
								<Link to="/blog">Blogs</Link>
							</li>
							<li>
								<Link to="/physio-connect">Physio Connect</Link>
							</li>
						</ul>
					</div>
					{/* Contact us */}
					<div className="col-span-2 md:col-span-1 flex flex-col w-full gap-6">
						<div className="text-xl font-semibold">Contact Us</div>
						<ul className="text-base font-normal flex flex-col gap-2">
							<li className="flex items-center gap-2">

								<img src="/phone-call.png" alt="Phone Icon" className="min-w-4 h-4 text-green" />
								+91 8107333576
							</li>
							<li className="flex text-wrap items-center gap-2">

								<img src="/mail.png" alt="Mail Icon" className="min-w-4 h-4" />
								info@physio
								<br className="hidden md:block lg:hidden" />
								plushealthcare.com
							</li>
							<li className="flex items-start gap-2 text-sm">
								<img src="/Location.png" alt="Location Icon" className="min-w-4 h-4 mt-1 " />

								<span>
									109, 1st Floor, Sankalp Tower,<br />
									Khatipura Road, Jaipur, 302012
								</span>
							</li>
						</ul>
					</div>
				</div>
				<hr className="w-full border-black" />
				<div className="self-center flex flex-col-reverse sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-5">
					<div className="flex-1 sm:mx-auto self-center text-center my-auto text-sm sm:text-base  cursor-pointer text-neutral-400 hover:underline">
						<a href="/">Copyright © 2025 by Physioplus. All Rights Reserved.</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Footer;
