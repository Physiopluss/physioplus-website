import { useEffect, useState } from "react";
import { singleOrder } from "../../api/booking";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import moment from "moment";
import ReactGA from "react-ga4";

const OrderDetail = () => {
	const [order, setOrder] = useState();
	const { orderId } = useParams();
	const token = useSelector((state) => state?.auth?.user?.userToken);

	// google analytics
	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Order Detail" });
	}, []);

	// fetch order data
	useEffect(() => {
		singleOrder(orderId, token)
			.then((response) => {
				if (response.status >= 200 && response.status < 300) setOrder(response.data);
				else toast.error("Something went wrong");
			})
			.catch(() => toast.error("Something went wrong"));
	}, [orderId, token]);

	// {
	// 	"_id": "66e197939ce43813dce69582",
	// 	"patientId": {
	// 		"profilePhoto": null,
	// 		"_id": "66c8296364d87763b61493b4",
	// 		"fullName": "Abhishek Ajmera",
	// 		"phone": "+917793007779",
	// 		"dob": "01-08-2024",
	// 		"gender": 1,
	// 		"liked": [],
	// 		"createdAt": "2024-08-23T06:17:07.366Z",
	// 		"updatedAt": "2024-09-02T09:39:28.102Z",
	// 		"__v": 0
	// 	},
	// 	"physioId": {
	// 		"degree": {
	// 			"degreeId": "66bc48c472019f571903dafa",
	// 			"degreeImage": "https://123456789video.s3.ap-south-1.amazonaws.com/Physio/Physio/1725276356296.png"
	// 		},
	// 		"clinic": {
	// 			"timings": {
	// 				"start": "12:08 PM",
	// 				"end": "2:08 PM"
	// 			},
	// 			"status": 0,
	// 			"name": "himanshu Clinic",
	// 			"address": "Bandikui",
	// 			"workingDays": [
	// 				"Monday",
	// 				"Tuesday",
	// 				"Thursday"
	// 			],
	// 			"duration": 30,
	// 			"charges": 100,
	// 			"imagesClinic": [
	// 				"https://123456789video.s3.ap-south-1.amazonaws.com/Physio/Physio/1726123193413.jpg",
	// 				"https://123456789video.s3.ap-south-1.amazonaws.com/Physio/Physio/1726123194285.jpg",
	// 				"https://123456789video.s3.ap-south-1.amazonaws.com/Physio/Physio/1726123194433.jpg",
	// 				"https://123456789video.s3.ap-south-1.amazonaws.com/Physio/Physio/1726123194550.jpg"
	// 			]
	// 		},
	// 		"home": {
	// 			"morningTimings": {
	// 				"start": "12:08 PM",
	// 				"end": "2:09 PM"
	// 			},
	// 			"eveningTimings": {
	// 				"start": "12:09 PM",
	// 				"end": "5:09 PM"
	// 			},
	// 			"status": 0,
	// 			"workingDays": [
	// 				"Monday",
	// 				"Tuesday",
	// 				"Thursday"
	// 			],
	// 			"mode": [
	// 				"Morning",
	// 				"Evening"
	// 			],
	// 			"duration": 30,
	// 			"charges": 100
	// 		},
	// 		"online": {
	// 			"timings": {
	// 				"start": "9:09 PM",
	// 				"end": "11:09 PM"
	// 			},
	// 			"status": 0,
	// 			"workingDays": [
	// 				"Monday",
	// 				"Thursday"
	// 			],
	// 			"duration": 30,
	// 			"charges": 100
	// 		},
	// 		"wallet": 0,
	// 		"_id": "66bc46ba72019f571903dae3",
	// 		"preferId": "5geHpEVX",
	// 		"phone": "+916375568082",
	// 		"rating": 2,
	// 		"specialization": [
	// 			"66bc495172019f571903db05"
	// 		],
	// 		"serviceType": [
	// 			"clinic",
	// 			"home",
	// 			"online"
	// 		],
	// 		"activeStatus": 1,
	// 		"accountStatus": 1,
	// 		"__v": 0,
	// 		"email": "himanshu@gmail.com",
	// 		"fullName": "Himanshu",
	// 		"about": "Hello World",
	// 		"degreeImage": "1724657408155.pdf",
	// 		"dob": "5-7-2000",
	// 		"iapImage": "https://123456789video.s3.ap-south-1.amazonaws.com/Physio/Physio/1725276356409.png",
	// 		"profileImage": "https://123456789video.s3.ap-south-1.amazonaws.com/Physio/Physio/1726123195588.jpg",
	// 		"workExperience": 3,
	// 		"iapNumber": "545zdbfd",
	// 		"gender": 1,
	// 		"updatedAt": "2024-09-12T06:39:58.062Z",
	// 		"iapMember": 41655
	// 	},
	// 	"appointmentStatus": 0,
	// 	"date": "2024-09-12T00:00:00.000000",
	// 	"time": "2024-09-12T13:30:00:00000",
	// 	"timeInString": "01:30 PM",
	// 	"patientName": "sfgsg",
	// 	"age": 14,
	// 	"phone": "+917878787878",
	// 	"gender": 0,
	// 	"painNotes": "dsfvsdfv",
	// 	"serviceType": "clinic",
	// 	"amount": 200,
	// 	"paymentStatus": 0,
	// 	"couponId": null,
	// 	"isTreatmentScheduled": [],
	// 	"createdAt": "2024-09-11T13:13:55.875Z",
	// 	"updatedAt": "2024-09-11T13:13:55.875Z",
	// 	"__v": 0
	// }

	return (
		<div className="w-2/3 border border-1 border-black mx-auto px-4 sm:px-6 py-4 mt-8 p-6 rounded-xl">
			<div className="flex justify-center gap-3 sm:gap-4">
				{/* <div className="relative w-20 h-20 sm:w-28 sm:h-28">
					<img
						loading="lazy"
						className="rounded-full object-cover w-full h-full overflow-hidden"
						src={"./mockPhysioFemale.png"}
						alt={"name"}
					/>
				</div> */}

				<div className="my-2 flex min-w-32 max-sm:text-xs justify-between text-xs sm:text-base gap-1 sm:gap-2 flex-col sm:flex-row">
					<div className="flex flex-col gap-1 leading-relaxed">
						<p className="text-gray-900 leading-none font-medium mb-0.5 sm:mb-1 text-base sm:text-lg capitalize">
							Name : {order?.physioId?.fullName}
						</p>
						<p className="text-gray-900 leading-none font-medium mb-0.5 sm:mb-1 text-xs sm:text-sm capitalize">
							Specialization : {order?.physioId?.specialization}
						</p>
					</div>
				</div>
			</div>
			
				
			<div>
				<p className="capitalize">
					<span className="font-semibold">Date - </span>
					{moment(order?.date).format("LL")}
				</p>
				<p className="capitalize">
					<span className="font-semibold">Mode - </span>
					{order?.serviceType}
				</p>
				<p className="capitalize">
					<span className="font-semibold">Clinic Name - </span>
					{order?.physioId?.clinic?.name}
				</p>
			</div>
			<div>
				<h6 className="text-2xl font-bold text-center">Patient Details</h6>
				<p>Full name -</p>
				<p>Age -</p>
				<p>Gender -</p>
				<p>Phone number -</p>
				<p>Problem - </p>
			</div>
		</div>
	);
};
export default OrderDetail;
