import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  Button,
  Select,
  Option,
  Textarea,
  Radio,
  Checkbox,
  Breadcrumbs,
} from "@material-tailwind/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useFetchSinglePhysioDataQuery } from "../../api/physios";
import { setPhysioDetail } from "../../slices/physioSlice";
import { emptyBooking } from "../../slices/bookingSlice";
import { useFormik } from "formik";
import moment from "moment";
import * as Yup from "yup";
import {
  appointmentDataToRazorpay,
  cashAppointment,
  couponApi,
} from "../../api/booking";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import ReactGA from "react-ga4";
import { jwtDecode } from "jwt-decode";
import Modal from "../../components/Modal";
import axios from "axios";
const Booking = () => {
  const [paymentType, setPaymentType] = useState("online");
  const [couponName, setCouponName] = useState("FIRST50");
  const [couponResponse, setCouponResponse] = useState();
  const [amountToPay, setAmountToPay] = useState();
  const [loading, setLoading] = useState(false);

  const { slug } = useParams();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal visibility
  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 10 - i);

  // get single physio all data
  const { data, error, isLoading } = useFetchSinglePhysioDataQuery(slug);
  const allData = data?.data;
  const physioId = data?.data?._id;
  // store physio all data in redux
  dispatch(() => dispatch(setPhysioDetail({ physioId, allData })));

  // collect all data from store for api to send
  const serviceTypeString = useSelector((e) => e.booking?.physioBookingType);
  // const serviceType = serviceTypeString == "home" ? 0 : 1;
  const selectedDate = useSelector((date) => date.booking.selectedDate);
  const physioData = useSelector((state) => state.physioDetail.physioData);
  const userToken = useSelector((state) => state?.auth?.user?.userToken);
  const patientId = useSelector((state) => state?.auth?.user?.userId);
  // const date = useSelector((state) => state?.booking.selectedDate);
  const time = useSelector((state) => state.booking.selectedSlot);
  const timeInString = moment(time).format("hh:mm A");
  const amount = physioData?.[serviceTypeString]?.charges;

  const navigate = useNavigate();
  if (userToken == null || userToken.length == 0) {
    navigate("/login");
  }

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user")).userToken;
    const decoded = jwtDecode(token);
    formik.setValues({
      patientName: decoded.patient.fullName,
      age: new Date(decoded.patient.dob).getFullYear(),
      gender: decoded.patient.gender,
      phone:
        decoded.patient.phone.length === 13
          ? decoded.patient.phone.slice(3, 13)
          : decoded.patient.phone.length === 10
          ? decoded.patient.phone
          : "",
      painNotes: "",
    });
  }, []);

  // google analytics
  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: window.location.pathname,
      title: "Booking",
    });
  }, []);

  useEffect(() => {
    if (couponResponse?.status >= 200 && couponResponse?.status < 300) {
      amount != 0 && amount != null && amount != undefined && couponResponse
        ? couponResponse?.data?.couponType == 0
          ? couponResponse?.data?.discount > amount
            ? setAmountToPay(0)
            : setAmountToPay(amount - couponResponse?.data?.discount)
          : setAmountToPay(
              amount - (couponResponse?.data?.discount * amount) / 100
            )
        : setAmountToPay(amount);
    } else {
      setAmountToPay(amount);
    }
  }, [amount, couponResponse]);

  const formik = useFormik({
    initialValues: {
      patientName: "", //string
      age: null, //number
      gender: null, //number
      phone: null, //number
      painNotes: "", //string
      state: "",
      city: "",
      pincode: "",
    },
    validationSchema: Yup.object().shape({
      patientName: Yup.string()
        .min(3, "Too Short!")
        .max(50, "Too Long!")
        .required("name is required"),
      age: Yup.number().required("Age is required"),
      state: Yup.string().required("State is required"),
      city: Yup.string().required("City is required"),
      pincode: Yup.string()
        .matches(/^\d{6}$/, "Pincode must be a 6-digit number")
        .required("Pincode is required"),
      gender: Yup.number().required("Gender is required"),
      phone: Yup.string()
        .length(10, "Number should be 10 digits")
        .matches(/[6789]\d{9}$/g, "Phone number is not valid")
        .required("Phone number is required"),
    }),
    onSubmit: (values) => {
      if (!userToken) toast.error("User not found");
      else if (!selectedDate) toast.error("Date is not selected");
      else if (!time) toast.error("Time slot is not selected");
      else
        try {
          paymentType == "online"
            ? appointmentDataToRazorpay({
                userToken,
                patientId,
                physioId,
                date: selectedDate,
                time,
                patientName: values.patientName,
                age: values.age,
                gender: values.gender,
                phone: values.phone,
                amount: amountToPay,
                serviceTypeString,
                timeInString,
                painNotes: values.painNotes,
                couponId:
                  couponResponse?.status >= 200 && couponResponse?.status < 300
                    ? couponResponse.data._id
                    : undefined,
              })
                .then(() => {
                  toast.success("Appointment has been created");
                  dispatch(emptyBooking());
                  setTimeout(() => {
                    navigate("/order-success");
                  }, 1000);
                })
                .catch(() => {
                  toast.error("Something went wrong");
                })
            : cashAppointment({
                userToken,
                patientId,
                physioId,
                date: selectedDate,
                time,
                patientName: values.patientName,
                age: values.age,
                gender: values.gender,
                phone: values.phone,
                amount: amountToPay,
                serviceTypeString,
                timeInString,
                painNotes: values.painNotes,
                couponId:
                  couponResponse?.status >= 200 && couponResponse?.status < 300
                    ? couponResponse.data._id
                    : null,
              })
                .then(() => {
                  toast.success("Appointment has been created");
                  dispatch(emptyBooking());
                  setTimeout(() => {
                    navigate("/order-success");
                  }, 1000);
                })
                .catch(() => {
                  toast.error("Something went wrong");
                });
        } catch (err) {
          return new Error(err);
        }
    },
  });
  // Function to fetch state and city from pincode
  useEffect(() => {
    const fetchLocation = async () => {
      if (formik.values.pincode.length === 6) {
        setLoading(true);
        try {
          const response = await axios.get(
            `https://api.postalpincode.in/pincode/${formik.values.pincode}`
          );
          const data = response.data;
          if (data[0].Status === "Success") {
            formik.setFieldValue("state", data[0].PostOffice[0].State);
            formik.setFieldValue("city", data[0].PostOffice[0].District);
          } else {
            formik.setFieldValue("state", "");
            formik.setFieldValue("city", "");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          formik.setFieldValue("state", "");
          formik.setFieldValue("city", "");
        }
        setLoading(false);
      }
    };

    fetchLocation();
  }, [formik.values.pincode]);
  return isLoading ? (
    <Loading />
  ) : error ? (
    "Error"
  ) : (
    <>
      <div className="h-40 w-full bg-[#FFFDF5] flex items-center">
        <Breadcrumbs
          separator=">"
          className="my-2 mx-2 md:mx-6 lg:mx-12 bg-transparent text-black"
        >
          <Link className="text-xs sm:text-base" to="/">
            Home
          </Link>
          <Link to="/physios">Physio</Link>
          <Link to={`/physios/${physioData.slug}`}>{physioData.fullName}</Link>
          <Link className="font-semibold">Patient Information</Link>
        </Breadcrumbs>
      </div>
      <div className="gap-4 justify-around flex flex-col md:flex-row -mt-12 mx-4 md:mx-8 lg:mx-16">
        {/* form with date & time */}
        <form
          onSubmit={formik.handleSubmit}
          method="POST"
          className="flex flex-col gap-2 flex-1 bg-white p-8 border rounded-lg"
        >
          <p className="text-lg font-bold">Enter Patient Information</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="">
              <label htmlFor="" className="text-sm">
                Name
              </label>
              <Input
                size="md"
                name="patientName"
                onChange={formik.handleChange}
                value={formik.values.patientName}
                placeholder="Enter Your Name"
                labelProps={{ className: "hidden" }}
                className="border border-[#A9ABB2] !border-t-[#A9ABB2] focus:!border-t-black placeholder:text-blue-gray-700 placeholder:opacity-100"
              />
              {formik.errors.patientName && formik.touched.patientName && (
                <span className="text-red-500 text-sm">
                  {formik.errors.patientName}
                </span>
              )}
            </div>
            <div className="">
              <label htmlFor="age" className="text-sm">
                DOB
              </label>
              <Select
                id="age"
                name="age"
                placeholder={"Select Year of Birth"}
                value={formik.values.age}
                labelProps={{ className: "hidden" }}
                onChange={(value) => formik.setFieldValue("age", value)}
                className="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all placeholder-shown:border focus:border-2 border-t-transparent focus:border-t-transparent focus:placeholder:opacity-100 text-sm px-3 py-2.5 rounded-[7px] focus:border-gray-900 border border-[#A9ABB2] border-t-[#A9ABB2] focus:!border-t-black placeholder:!text-blue-gray-900 placeholder:opacity-100"
              >
                {years.map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
              {formik.errors.age && formik.touched.age && (
                <span className="text-red-500 text-sm">
                  {formik.errors.age}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="pincode" className="text-sm">
                Pincode
              </label>
              <Input
                required
                size="md"
                name="pincode"
                onChange={formik.handleChange}
                value={formik.values.pincode}
                placeholder="Enter Your Pincode"
                className="border border-[#A9ABB2] !border-t-[#A9ABB2] focus:!border-t-black"
              />
              {formik.errors.pincode && formik.touched.pincode && (
                <span className="text-red-500 text-sm">
                  {formik.errors.pincode}
                </span>
              )}
            </div>

            <div>
              <label htmlFor="state" className="text-sm">
                State
              </label>
              <Input
                size="md"
                name="state"
                value={formik.values.state}
                placeholder="Enter Your State"
                className="border border-[#A9ABB2] !border-t-[#A9ABB2]  "
              />
            </div>

            <div>
              <label htmlFor="city" className="text-sm">
                City
              </label>
              <Input
                size="md"
                name="city"
                value={formik.values.city}
                placeholder="Enter Your City"
                className="border border-[#A9ABB2] !border-t-[#A9ABB2] "
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-sm">
                Mobile Number
              </label>
              <Input
                size="md"
                name="phone"
                maxLength="10"
                onChange={formik.handleChange}
                value={formik.values.phone}
                labelProps={{ className: "hidden" }}
                placeholder="Enter Your Mobile"
                className="border border-[#A9ABB2] !border-t-[#A9ABB2] focus:!border-t-black placeholder:text-blue-gray-700 placeholder:opacity-100"
              />
              {formik.errors.phone && formik.touched.phone && (
                <span className="text-red-500 text-sm">
                  {formik.errors.phone}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="gender" className="text-sm">
                Gender
              </label>
              <Select
                size="md"
                name="gender"
                labelProps={{ className: "hidden" }}
                placeholder="Select Your Gender"
                className="border border-[#A9ABB2] focus:border-2 focus:border-black focus:!border-t-black placeholder:text-blue-gray-300 placeholder:opacity-100"
                onChange={(value) => formik.setFieldValue("gender", value)}
                value={formik.values.gender}
              >
                <Option key={0} value={0} defaultChecked>
                  Female
                </Option>
                <Option key={1} value={1}>
                  Male
                </Option>
                <Option key={2} value={2}>
                  Other
                </Option>
              </Select>
              {formik.errors.gender && formik.touched.gender && (
                <span className="text-red-500 text-sm">
                  {formik.errors.gender}
                </span>
              )}
            </div>
            <div className="col-span-1 lg:col-span-2">
              <label htmlFor="painNotes" className="text-sm">
                Describe your pain
              </label>
              <Textarea
                required
                size="md"
                name="painNotes"
                onChange={formik.handleChange}
                value={formik.values.painNotes}
                labelProps={{ className: "hidden" }}
                placeholder="Enter Your Pain here"
                className="border border-[#A9ABB2] !border-t-[#A9ABB2] focus:!border-t-black placeholder:text-blue-gray-700 placeholder:opacity-100"
              />
            </div>
          </div>
          <hr className="my-4" />
          <p className="text-lg font-bold">Payment Options</p>
          <div className="flex flex-col gap-2 p-2 shadow-sm rounded-md">
            <span className="flex flex-col gap-0 text-sm sm:text-base">
              <Radio
                name="paymentType"
                label={"Online"}
                value={"online"}
                className={"w-4 h-4 "}
                defaultChecked
                onClick={(e) => {
                  setPaymentType(e.target.value.toLowerCase());
                }}
              />
              <hr className="my-2" />
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="w-4 h-4 hover:before:opacity-0 border border-green checked:bg-green text-green "
                  defaultChecked
                  checked={true}
                />
                <label className="text-xs">
                  By proceeding, I agree to Physioplus,{" "}
                  <span
                    className="text-green underline cursor-pointer"
                    onClick={openModal}
                  >
                    Terms of Service
                  </span>{" "}
                  and Cancellation Policies.
                </label>
              </div>
            </span>

            <button
              className="sm:w-fit px-12 py-2 text-xs sm:text-sm shadow-none bg-green text-white rounded-full capitalize hover:bg-lightGreen hover:text-black"
              type="submit"
            >
              Pay Now
            </button>
          </div>
        </form>

        {/* booking detail card  */}
        <div className="text-base sm:min-w-28 rounded-md gap-4 px-6 py-4 h-fit bg-white border border-gray-200 shadow-md lg:min-w-[350px] mb-8">
          <h6 className="text-lg font-semibold mb-4">Booking Summary</h6>
          <div className="flex flex-col gap-2 sm:text-sm text-base">
            <p className="flex justify-between text-right gap-8">
              <span className="text-start">Your Schedule</span>
              {selectedDate &&
                timeInString &&
                moment(selectedDate).format("ll")}{" "}
              {!selectedDate && "Please select a date"}
            </p>
            <p className="flex justify-between capitalize">
              <span className="text-start">Booked Slot</span>{" "}
              {selectedDate && timeInString && timeInString}
              {!timeInString && "Please select a date"}
            </p>
            <hr className="my-2" />
            <p className="flex justify-between">
              <span className="text-nowrap">Consultation Fee</span> ₹ {amount}
            </p>
            <div className="relative flex w-full my-2">
              <Input
                name="coupon"
                placeholder="Enter Coupon Code"
                labelProps={{ className: "hidden" }}
                className="placeholder:text-blue-gray-300 placeholder:opacity-100 border-none ring-1 ring-[#EAEBEC] focus:!border-t-black"
                value={couponName}
                onChange={(e) => setCouponName(e.target.value)}
              />
              <Button
                size="lg"
                className="!absolute right-0 py-2.5 rounded-none rounded-r bg-[#E6F4EC] text-black shadow-none hover:shadow-none"
                onClick={() => {
                  if (couponName) {
                    couponApi(couponName, patientId, userToken)
                      .then((res) => {
                        if (res.status >= 200 && res.status < 300) {
                          setCouponResponse(res.data);
                        } else {
                          setCouponResponse(res.data);
                        }
                      })
                      .catch((err) => {
                        toast.error(err.message);
                      });
                  } else {
                    toast.error("Please enter a valid coupon code");
                  }
                }}
              >
                Apply
              </Button>
            </div>
            <div className={`${couponResponse ? "block" : "hidden"} `}>
              {couponResponse &&
              couponResponse.status >= 200 &&
              couponResponse.status < 300 ? (
                <div className="flex justify-between mb-2 capitalize">
                  <span>Discount</span>{" "}
                  <span className="text-green">- ₹ {amount - amountToPay}</span>
                </div>
              ) : (
                <div className="text-red-600 mb-2 capitalize">
                  {couponResponse?.message}
                </div>
              )}
            </div>
          </div>

          <hr className="border-black my-2" />
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <p className="text-medium font-semibold">Total Amount to pay</p>
              <p className="text-sm">included taxes</p>
            </div>
            <p className="font-semibold">₹ {amountToPay}</p>
          </div>

          <hr className="my-2" />
          <div className="text-wrap text-sm mt-2">
            <div className="flex flex-col gap-2 justify-center items-center">
              <p className="text-lg font-bold">Recover Faster Step By Step</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 text-sm text-center max-w-md mx-auto">
            <p className="mt-2 text-blue-700">
              Use <span className="font-semibold text-blue-900">FIRST50</span>{" "}
              to get
              <span className="font-bold text-green-600"> 50% off</span>
            </p>
            <p className="text-gray-600 text-xs mt-1 italic">
              *For first-time users only
            </p>
          </div>
        </div>
      </div>

      {/* Render the Modal */}
      <Modal isOpen={isModalOpen} closeModal={closeModal} />
    </>
  );
};
export default Booking;
