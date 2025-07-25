import React, { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const TaxInvoice = ({
  type = "Consultation", // "Consultation" or "Treatment"
  physioName = "Dr. Vishal",
  invoiceNumber = "PPY4512",
  invoiceDate = "15 Jan 2025",
  modeOfPayment = "Online",
  patientName = "Manish Sharma",
  address = "Plot no 506 Shanti Nagar. Mansrover, Jaipur, 302020",
  charges = 700,
  discountPercent = 50,
  couponLabel = "Coupon Applied",
  transactionId = "",
  pincode = "302021",
  orgName = "Home Care",
  serviceDays, // only for Treatment, e.g. 5
}) => {
  const discountAmount = charges * (discountPercent / 100);
  const total = charges - discountAmount;
  const invoiceRef = useRef();

  const handleDownloadPDF = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#fff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
    pdf.save(`${orgName.replace(/\s/g, "_")}_Tax_Invoice.pdf`);
  };

  return (
    <div>
      {/* Invoice Card */}
      <div
        ref={invoiceRef}
        className="bg-white w-full max-w-md mx-auto my-6 rounded-lg shadow p-5"
        style={{ fontFamily: "Inter, Arial, sans-serif" }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div className="font-semibold text-lg">{orgName}</div>
          <div className="text-xs text-gray-600">{pincode}</div>
        </div>
        <hr className="mb-3" />
        {/* Details */}
        <div className="space-y-2 text-sm text-black/90 mb-4">
          <div>
            <span className="font-medium">Physio Name :</span> {physioName}
          </div>
          <div>
            <span className="font-medium">Invoice Number :</span>{" "}
            {invoiceNumber}
          </div>
          <div>
            <span className="font-medium">Type :</span> {type}
          </div>
          {type === "Treatment" && serviceDays && (
            <div>
              <span className="font-medium">Service Days :</span> {serviceDays}{" "}
              Day
            </div>
          )}
          <div>
            <span className="font-medium">Invoice Date :</span> {invoiceDate}
          </div>
          <div>
            <span className="font-medium">Transaction Id :</span>{" "}
            {transactionId ? (
              transactionId
            ) : (
              <span className="text-gray-400">ID will generate</span>
            )}
          </div>
          <div>
            <span className="font-medium">Mode of Payment :</span>{" "}
            {modeOfPayment}
          </div>
        </div>
        <hr className="mb-3" />
        {/* Patient */}
        <div className="space-y-1 text-sm mb-2">
          <div>
            <span className="font-medium">Invoice To :</span> {patientName}
          </div>
          <div>
            <span className="font-medium">Address :</span> {address}
          </div>
        </div>
        {/* Payment Summary */}
        <div className="bg-gray-50 border p-3 rounded-md mt-4 mb-5">
          <div className="flex justify-between text-sm">
            <span>
              {type === "Consultation"
                ? "Consultation Charges"
                : "Treatment Charges"}
            </span>
            <span>₹{charges}</span>
          </div>
          <div className="flex justify-between text-sm text-green-700 mt-1">
            <span>
              {couponLabel} {discountPercent}%{" "}
              <span className="text-xs text-green-500 underline cursor-pointer">
                Edit
              </span>
            </span>
            <span>-₹{discountAmount}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-medium text-base">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>
      {/* Download Button */}
      <button
        onClick={handleDownloadPDF}
        className="block w-full max-w-md mx-auto rounded-md bg-green-600 hover:bg-green-700 text-white text-base py-3 font-semibold mt-2"
      >
        Download Invoice
      </button>
    </div>
  );
};

export default TaxInvoice;
