import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  couponApi,
  payForAppointmentByCash,
  payForAppointmentDayToRazorpay,
} from "../../api/homecare";
import { Button, Input } from "@material-tailwind/react";

export default function BookingSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { patient, physio, formData, selectedDate } = location.state || {};

  const userObj = JSON.parse(localStorage.getItem("homecareUser"));
  const patientId = userObj?.userId;
  const userToken = userObj?.userToken;

  const consultationCharges = physio?.home?.charges || 0;
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [couponName, setCouponName] = useState("");
  const [couponResponse, setCouponResponse] = useState(null);

  const [amount, setAmount] = useState(consultationCharges);
  const [amountToPay, setAmountToPay] = useState(consultationCharges);

  const appointmentDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const patientName = formData?.name || "Patient";

  // --- AGE CALCULATION ---
  const getAgeFromDOB = (dob) => {
    if (!dob) return "";
    const birthYear = parseInt(dob);
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
  };

  const getGenderLabel = (genderCode) => {
    return genderCode === 1 ? "Male" : genderCode === 0 ? "Female" : "Other";
  };

  // Apply coupon effects
  useEffect(() => {
    if (couponResponse?.status >= 200 && couponResponse?.status < 300) {
      const { discount, couponType } = couponResponse.data;
      if (couponType === 0) {
        setAmountToPay(Math.max(0, amount - discount));
      } else if (couponType === 1) {
        const discountAmt = (discount / 100) * amount;
        setAmountToPay(Math.max(0, amount - discountAmt));
      } else {
        setAmountToPay(amount);
      }
    } else {
      setAmountToPay(amount);
    }
  }, [amount, couponResponse]);

  const handleCouponApply = async () => {
    if (!couponName.trim()) return toast.error("Enter a coupon code");

    try {
      const res = await couponApi(couponName.trim(), patientId, userToken);
      setCouponResponse(res);
      if (res?.status >= 200 && res?.status < 300) {
        toast.success("Coupon applied successfully");
      } else {
        toast.error(res?.data?.message || "Invalid coupon");
      }
    } catch {
      toast.error("Failed to apply coupon");
    }
  };

  const handlePay = async () => {
    if (!paymentMethod) return toast.error("Select payment method");

    try {
      if (paymentMethod === "cash") {
        // Call the cash payment API
        await payForAppointmentByCash({
          selectedDate,
          formData,
          phone: patient?.phone,
          couponId: couponResponse?.data?._id,
          amount: amountToPay,
          patientId,
          userToken,
          physioId: physio?._id,
        });

        toast.success("Cash appointment booked successfully");
      } else {
        // Call the Razorpay/online payment API
        await payForAppointmentDayToRazorpay({
          selectedDate,
          formData,
          phone: patient?.phone,
          couponId: couponResponse?.data?._id,
          amount: amountToPay,
          patientId,
          userToken,
          physioId: physio?._id,
        });

        toast.success("Online payment successful");
      }

      setShowConfirmation(true);
    } catch (err) {
      toast.error(err?.message || "Payment failed");
    }
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
        <CheckCircle className="text-green-600 w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Appointment Confirmed!</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          You booked an appointment with <br />
          <strong>{physio?.fullName}</strong> on{" "}
          <strong>{appointmentDate}</strong>
        </p>
        <button
          className="bg-green text-white w-full max-w-xs py-3 rounded-xl text-sm font-medium"
          onClick={() => navigate("/homecare/consultation-orders")}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen p-4 bg-white">
      {/* Top Bar */}
      <div className="flex items-center mb-4">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5 text-green-700" />
        </button>
        <h2 className="ml-auto mr-auto text-sm font-medium text-green">
          Summary
        </h2>
      </div>

      {/* Profile */}
      <div className="rounded-xl p-4 mb-4 text-center shadow border">
        <img
          src={physio?.profileImage ?? "https://via.placeholder.com/80"}
          alt={physio?.fullName}
          className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
        />
        <h3 className="text-md font-semibold border-b pb-2 mb-2">
          {physio?.fullName}
        </h3>
        <div className="flex justify-between text-sm">
          <span>Service:</span>
          <span>{physio?.serviceType ?? "Consultation"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Date:</span>
          <span>{appointmentDate}</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-2 mb-4">
        {["cash", "online"].map((type) => (
          <label
            key={type}
            className={`flex items-center justify-between px-4 py-3 border rounded-lg text-sm cursor-pointer ${
              paymentMethod === type ? "bg-green/10 border-green" : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === type}
                onChange={() => setPaymentMethod(type)}
              />
              {type === "cash" ? "Cash" : "Online"}
            </div>
            <span
              className={`font-semibold ${
                type === "online" ? "text-green-700" : "text-gray-700"
              }`}
            >
              ₹{type === "cash" ? consultationCharges : amountToPay}
            </span>
          </label>
        ))}
      </div>

      {/* Coupon Input */}
      {paymentMethod === "online" && (
        <>
          <div className="mt-6 relative flex w-full">
            <Input
              name="coupon"
              placeholder="Enter Coupon Code"
              className="placeholder:text-blue-gray-300 border-none ring-1 ring-[#EAEBEC] focus:ring-green"
              value={couponName}
              onChange={(e) => setCouponName(e.target.value)}
            />
            <Button
              size="lg"
              className="!absolute right-0 py-2.5 rounded-none rounded-r bg-[#E6F4EC] text-black"
              onClick={handleCouponApply}
            >
              Apply
            </Button>
          </div>

          {/* Coupon Feedback */}
          {couponResponse && (
            <div className="my-2 text-sm">
              {couponResponse?.status >= 200 ? (
                <div className="flex justify-between text-green-700">
                  <span>Discount Applied</span>
                  <span>- ₹{Math.max(0, amount - amountToPay).toFixed(2)}</span>
                </div>
              ) : (
                <div className="text-red-600">
                  {couponResponse?.data?.message || "Invalid coupon"}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Amount Summary */}
      {paymentMethod && (
        <div className="mt-8 mb-2 border-t pt-4 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>₹{amount.toFixed(2)}</span>
          </div>
          {couponResponse?.status >= 200 && (
            <div className="flex justify-between text-green-700">
              <span className="text-green">Discount ({couponName})</span>
              <span className="text-green">
                - ₹{(amount - amountToPay).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>₹{amountToPay.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Patient Info */}
      <div className="border-t pt-4 mt-6">
        <div className="text-sm font-medium mb-2">Booking For</div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={patient?.profilePhoto || "/homecare/user.png"}
              alt="patient"
              className="w-9 h-9 rounded-full"
            />
            <div>
              <div className="text-sm font-semibold">{patientName}</div>
              <div className="text-xs text-gray-600">
                {formData?.gender || getGenderLabel(patient?.gender)},{" "}
                {formData?.age || getAgeFromDOB(patient?.dob)} years
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-green underline"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Final CTA */}
      <div className="flex items-center justify-between border-t pt-4 mt-6">
        <div className="text-sm">
          <span className="block text-gray-600">
            Pay by {paymentMethod || "--"}
          </span>
          <span className="font-bold">
            ₹{paymentMethod === "cash" ? consultationCharges : amountToPay}
          </span>
        </div>
        <button
          onClick={handlePay}
          disabled={!paymentMethod}
          className={`w-[60%] py-3 rounded-xl text-sm font-medium text-white ${
            paymentMethod ? "bg-green" : "bg-green/50 cursor-not-allowed"
          }`}
        >
          Continue to Pay
        </button>
      </div>
    </div>
  );
}
