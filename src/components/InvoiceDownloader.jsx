import React, { useRef } from "react";
import html2pdf from "html2pdf.js";

const InvoiceDownloader = ({
  isOpen,
  onClose,
  invoiceData,
  filename = "invoice.pdf",
}) => {
  const invoiceRef = useRef();

  const handleDownload = () => {
    if (!invoiceRef.current) return;

    html2pdf()
      .set({
        margin: [0.5, 0.5],
        filename: filename,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      })
      .from(invoiceRef.current)
      .save();
  };

  // ✅ Restrict access to treatment and appointment only
  if (!isOpen || invoiceData?.type === "subscription") return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-auto px-2 py-4">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b">
          <h2 className="text-base sm:text-lg font-bold">Invoice Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Invoice Content */}
        <div className="p-4 sm:p-6 bg-white" ref={invoiceRef}>
          {/* Clinic Info */}
          <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
            <div>
              <p className="text-base sm:text-lg font-semibold text-green">
                PhysioPlus Healthcare
              </p>
              <p className="text-sm text-gray-600">
                109,1st Floor,Sankalp Tower,Khatipura Road,Jaipur
              </p>
              <p className="text-sm">
                Email:{" "}
                <span className="text-blue-600 underline">
                  support@physioplushealthcare.com
                </span>
              </p>
            </div>
            <div className="text-sm text-gray-700 space-y-1 text-right">
              <p>
                <strong>GST NO.: </strong>08AANCP1150A1ZT
              </p>
              <p>
                <strong>Invoice #: </strong>
                {invoiceData.invoiceNumber}
              </p>
              <p>
                <strong>Date: </strong>
                {new Date(invoiceData.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Payment Mode: </strong>
                {invoiceData.paymentMode}
              </p>
              {invoiceData.transactionId && (
                <p>
                  <strong>Transaction ID: </strong>
                  {invoiceData.transactionId}
                </p>
              )}
            </div>
          </div>

          {/* Billed / Provided Info */}
          <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-700 mb-6 gap-4">
            <div className="sm:w-1/2">
              <h3 className="font-semibold mb-1">Billed To (Patient)</h3>
              <p>{invoiceData.patientName}</p>
              <p className="break-words whitespace-pre-line">
                {invoiceData.patientAddress}
              </p>
            </div>
            <div className="sm:w-1/2 text-right">
              <h3 className="font-semibold mb-1">Provided By (Physio)</h3>
              <p>{invoiceData.physioName}</p>
              <p className="break-words whitespace-pre-line">
                {invoiceData.physioAddress}
              </p>
            </div>
          </div>

          {/* Services Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-t border-b">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 font-semibold">Description</th>
                  <th className="px-4 py-2 font-semibold">Qty</th>
                  <th className="px-4 py-2 font-semibold">Rate (₹)</th>
                  <th className="px-4 py-2 font-semibold text-right">
                    Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">
                    {invoiceData.type === "treatment"
                      ? "Physiotherapy Treatment Sessions"
                      : "Physio Consultation"}
                  </td>
                  <td className="px-4 py-2">
                    {invoiceData.type === "treatment"
                      ? invoiceData.treatment
                      : 1}
                  </td>
                  <td className="px-4 py-2">{invoiceData.appointmentAmount}</td>
                  <td className="px-4 py-2 text-right">
                    {invoiceData.type === "treatment"
                      ? invoiceData.totalTreatmentAmount
                      : invoiceData.appointmentAmount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end text-sm">
            <div className="w-full max-w-xs space-y-2">
              {/* Coupon Discount for Appointment */}
              {invoiceData?.type === "appointment" &&
                invoiceData?.discount != null &&
                invoiceData?.appointmentAmount && (
                  <div className="flex justify-between text-[#08845f]">
                    <span>
                      Coupon Discount ({invoiceData?.couponName || "Applied"}):
                    </span>
                    <span className="text-green">
                      {invoiceData?.couponType === 0
                        ? `- ₹ ${invoiceData.discount.toLocaleString("en-IN")}`
                        : (() => {
                            const amt = invoiceData.appointmentAmount;
                            const discount = (amt * invoiceData.discount) / 100;
                            return `- ₹ ${discount.toLocaleString("en-IN")}`;
                          })()}
                    </span>
                  </div>
                )}

              {/* Coupon Discount for Treatment */}
              {invoiceData?.type === "treatment" &&
                invoiceData?.totalTreatmentAmount != null &&
                invoiceData?.amount != null &&
                invoiceData.totalTreatmentAmount > invoiceData.amount && (
                  <div className="flex justify-between text-[#08845f]">
                    <span>Coupon Discount (Applied):</span>
                    <span>
                      - ₹{" "}
                      {(
                        invoiceData.totalTreatmentAmount - invoiceData.amount
                      ).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

              {/* Total */}
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total Amount (GST inclusive):</span>
                <span>
                  ₹
                  {invoiceData?.amount
                    ? invoiceData.amount.toLocaleString("en-IN", {
                        minimumFractionDigits:
                          invoiceData.amount % 1 === 0 ? 0 : 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-xs text-gray-500 text-center">
            Thank you for choosing{" "}
            <span className="font-semibold text-green">Physio+</span>. For
            support, email{" "}
            <span className="text-blue-600 underline">
              support@physioplushealthcare.com
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 p-4 border-t">
          <button
            onClick={handleDownload}
            className="bg-green text-white px-4 py-2 rounded font-semibold text-sm"
          >
            Download PDF
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded font-semibold text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDownloader;
