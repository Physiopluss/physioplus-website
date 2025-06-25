import React, { useRef } from "react";
import html2pdf from "html2pdf.js";

const InvoiceDownloader = ({
  isOpen,
  onClose,
  orderData,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-auto">
      <div className="bg-white w-full max-w-4xl rounded-lg overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-bold">Invoice Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Invoice Content */}
        <div className="p-6 bg-white" ref={invoiceRef}>
          {/* Clinic Info */}
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-lg font-semibold text-green">
                PhysioPlus Healthcare
              </p>

              <p className="text-sm text-gray-600">
                109,1st Floor,Sankalp Tower,Khatipura Road,Jaipur
              </p>
              <p>
                Email:{" "}
                <span className="text-blue-600 underline">
                  support@physioplushealthcare.com
                </span>
              </p>
            </div>
            <div className="text-sm text-gray-700 space-y-1 text-right">
              <p>
                <strong>GST NO.: </strong>
                08AANCP1150A1ZT
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
          <div className="flex justify-between text-sm text-gray-700 mb-6 gap-6">
            {invoiceData.type === "subscription" ? (
              <>
                <div className="w-1/2">
                  <h3 className="font-semibold mb-1">Billed To (Physio)</h3>
                  <p>{invoiceData.physioName}</p>
                  <p className="break-words whitespace-pre-line">
                    {invoiceData.physioAddress}
                  </p>
                </div>
                <div className="w-1/2 text-right">
                  <h3 className="font-semibold mb-1">Provided By</h3>
                  <p>PhysioPlus Healthcare</p>
                  <p>109,1st Floor,Sankalp Tower,Khatipura Road,Jaipur</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-1/2">
                  <h3 className="font-semibold mb-1">Billed To (Patient)</h3>
                  <p>{invoiceData.patientName}</p>
                  <p className="break-words whitespace-pre-line">
                    {invoiceData.patientAddress}
                  </p>
                </div>
                <div className="w-1/2 text-right">
                  <h3 className="font-semibold mb-1">Provided By (Physio)</h3>
                  <p>{invoiceData.physioName}</p>
                  <p className="break-words whitespace-pre-line">
                    {invoiceData.physioAddress}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Services Table */}
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
                    : invoiceData.type === "subscription"
                    ? "PhysioPlus Subscription Plan"
                    : "Physio Consultation"}
                </td>
                <td className="px-4 py-2">1</td>
                <td className="px-4 py-2">
                  {invoiceData.type === "subscription"
                    ? invoiceData.amount
                    : invoiceData.appointmentAmount}
                </td>
                <td className="px-4 py-2 text-right">
                  {invoiceData.type === "subscription"
                    ? invoiceData.amount
                    : invoiceData.appointmentAmount}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Totals Section */}
          <div className="mt-6 flex justify-end text-sm">
            <div className="w-full max-w-xs space-y-2 text-sm">
              {/* Subtotal */}
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>
                  ₹
                  {(invoiceData.type === "subscription"
                    ? invoiceData.amount
                    : invoiceData.appointmentAmount
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              {/* Coupon Discount */}
              {invoiceData?.type === "appointment" && orderData?.couponId && (
                <div className="flex justify-between text-green-700">
                  <span>
                    Coupon Discount (
                    {orderData.couponId.couponName || "Applied"}):
                  </span>
                  <span className="text-green">
                    {orderData.couponId.couponType === 0
                      ? // Flat discount
                        `- ₹ ${orderData.couponId.discount.toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits:
                              orderData.couponId.discount % 1 === 0 ? 0 : 2,
                            maximumFractionDigits: 2,
                          }
                        )}`
                      : // Percentage discount
                        (() => {
                          const baseAmount = invoiceData.appointmentAmount;

                          if (!baseAmount) return "No Discount";

                          const percentageDiscount =
                            (baseAmount * orderData.couponId.discount) / 100;

                          return `- ₹ ${percentageDiscount.toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits:
                                percentageDiscount % 1 === 0 ? 0 : 2,
                              maximumFractionDigits: 2,
                            }
                          )}`;
                        })()}
                  </span>
                </div>
              )}

              {/* Total */}
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total Amount (GST inclusive):</span>
                <span>
                  ₹
                  {invoiceData.amount.toLocaleString("en-IN", {
                    minimumFractionDigits: invoiceData.amount % 1 === 0 ? 0 : 2,
                    maximumFractionDigits: 2,
                  })}
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
