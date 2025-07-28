import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Input } from "@material-tailwind/react";
import { RadioGroup } from "@headlessui/react";
import toast from "react-hot-toast";
import { payForTreatmentDayToRazorpay, couponApi } from "../../../api/homecare";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { order, day, days = [] } = state || {};

  const userObj = JSON.parse(localStorage.getItem("homecareUser"));
  const patientId = userObj?.userId;
  const userToken = userObj?.userToken;

  const [treatmentDays, setTreatmentDays] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [couponName, setCouponName] = useState("");
  const [couponResponse, setCouponResponse] = useState(null);
  const [amount, setAmount] = useState(0);
  const [amountToPay, setAmountToPay] = useState(0);

  const baseAmount = useMemo(() => {
    return order?.isTreatmentScheduled?.amount || order?.amount || 1000;
  }, [order]);

  // Init unpaid treatment days
  useEffect(() => {
    const unpaid =
      order?.isTreatmentScheduled?.treatmentDate?.filter((d) => !d.isPaid) ||
      [];
    setTreatmentDays(unpaid);

    if (Array.isArray(days) && days.length) {
      setSelectedOption("full");
    } else if (day?._id) {
      setSelectedOption(day._id);
    } else if (unpaid.length) {
      setSelectedOption(unpaid[0]._id);
    }
  }, [order, day, days]);

  // Update total amount
  useEffect(() => {
    if (!selectedOption) return;
    if (selectedOption === "full") {
      setAmount(treatmentDays.length * baseAmount);
    } else {
      setAmount(baseAmount);
    }
  }, [selectedOption, treatmentDays, baseAmount]);

  // Apply coupon logic
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
    } catch (err) {
      toast.error("Failed to apply coupon");
    }
  };

  const handlePay = async () => {
    if (!selectedOption) return toast.error("No treatment day selected");

    const daysToPay =
      selectedOption === "full"
        ? treatmentDays
        : [treatmentDays.find((d) => d._id === selectedOption)].filter(Boolean);

    if (!daysToPay.length) return toast.error("No unpaid treatments selected");

    try {
      const treatmentDayIds = daysToPay.map((d) => d._id); // ✅ collect all ids

      await payForTreatmentDayToRazorpay({
        treatmentDayIds, // ✅ array of day IDs
        orderId: order._id,
        couponId: couponResponse?.data?._id,
        amount: amountToPay,
        patientId,
        userToken,
        physioId: order?.physioId?._id,
      });

      toast.success("Payment successful");
      navigate("/homecare/orders");
    } catch (err) {
      toast.error(err?.message || "Payment failed");
    }
  };
  return (
    <div className="bg-white w-full max-w-md mx-auto rounded-xl shadow p-5 py-8 my-10">
      <div className="font-semibold text-lg text-center mb-6">
        Select Treatment Payment
      </div>

      <div className="bg-gradient-to-r from-green/20 to-white rounded-md text-green my-4">
        <div className="flex items-center justify-center gap-2">
          <div className="font-semibold text-lg my-2 w-[60%]">
            <p className="mb-2">Want to save more?</p>
            <p className="text-xs mb-2">
              Pay at once and get{" "}
              <span className="font-extrabold bg-white rounded text-green p-2">
                70% Off
              </span>
            </p>
          </div>
          <img src="/homecare/coins.png" alt="" className="w-10 h-10" />
        </div>
      </div>

      {/* Treatment Day Options */}
      <RadioGroup
        value={selectedOption}
        onChange={setSelectedOption}
        className="space-y-3"
      >
        {treatmentDays.map((day, i) => (
          <RadioGroup.Option
            key={day._id}
            value={day._id}
            className={({ checked }) =>
              `flex justify-between items-center border px-4 py-3 rounded-lg cursor-pointer ${
                checked ? "border-green bg-green/5" : "border-gray-300"
              }`
            }
          >
            {({ checked }) => (
              <>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      checked ? "border-green bg-green" : "border-gray-400"
                    }`}
                  />
                  <div className="text-sm font-medium">
                    Treatment Day {i + 1} – ₹{baseAmount}
                  </div>
                </div>
                <span className="text-xs bg-green text-white rounded-full px-2 py-0.5">
                  Unpaid
                </span>
              </>
            )}
          </RadioGroup.Option>
        ))}

        {treatmentDays.length > 1 && (
          <RadioGroup.Option
            value="full"
            className={({ checked }) =>
              `flex justify-between items-center border px-4 py-3 rounded-lg cursor-pointer ${
                checked ? "border-green bg-green/5" : "border-gray-300"
              }`
            }
          >
            {({ checked }) => (
              <>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      checked ? "border-green bg-green" : "border-gray-400"
                    }`}
                  />
                  <div className="text-sm font-medium">
                    Pay for All ({treatmentDays.length} Days) – ₹
                    {treatmentDays.length * baseAmount}
                  </div>
                </div>
                <span className="text-xs bg-green text-white rounded-full px-2 py-0.5">
                  Unpaid
                </span>
              </>
            )}
          </RadioGroup.Option>
        )}
      </RadioGroup>

      {/* Coupon Input */}
      <div className="mt-6 relative flex w-full">
        <Input
          name="coupon"
          placeholder="Enter Coupon Code"
          className="placeholder:text-blue-gray-300 border-none ring-1 ring-[#EAEBEC] focus:!border-t-green"
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

      {/* Amount Summary */}
      <div className="mt-8 mb-2 border-t pt-4 text-sm">
        <div className="flex justify-between">
          <span>Sub Total</span>
          <span>₹{amount.toFixed(2)}</span>
        </div>
        {couponResponse?.status >= 200 && (
          <div className="flex justify-between text-green-700">
            <span>Discount (Coupon)</span>
            <span>- ₹{Math.max(0, amount - amountToPay).toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between py-2 text-md font-semibold">
        <span>Pay Online</span>
        <span className="text-green">₹{amountToPay.toFixed(2)}</span>
      </div>

      <button
        onClick={handlePay}
        className="mt-4 w-full rounded-md bg-green text-white font-semibold py-3 text-lg disabled:opacity-50"
        disabled={!selectedOption}
      >
        Continue to Pay
      </button>
    </div>
  );
};

export default PaymentPage;
