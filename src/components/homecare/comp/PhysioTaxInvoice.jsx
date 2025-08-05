import React, { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useLocation, useNavigate } from "react-router-dom";
import { getInvoiceByOrderId } from "../../../api/homecare";

const orgName = "Home Care";

// Utility to reverse calculate original amount & discount
function reverseCoupon({ paid, couponType, couponValue }) {
  let original = paid,
    discount = 0;
  if (couponType === 1 && couponValue > 0) {
    original = paid / (1 - couponValue / 100);
    discount = original - paid;
  } else if (couponType === 0 && couponValue > 0) {
    original = paid + couponValue;
    discount = couponValue;
  }
  original = Math.round(original * 100) / 100;
  discount = Math.round(discount * 100) / 100;
  return { original, discount };
}

const PhysioTaxInvoice = () => {
  const invoiceRef = useRef();
  const navigate = useNavigate();
  const { state } = useLocation();

  const order = state?.order;
  const type = state?.type ?? "appointment";

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Fallback state

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await getInvoiceByOrderId(order?.id, type);
        setInvoice(res.data);
      } catch (err) {
        console.error("Invoice fetch failed:", err);
        if (err?.response?.status === 404) {
          setError("Invoice not found.");
        } else {
          setError("Something went wrong. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (order?.id) fetchInvoice();
    else {
      setLoading(false);
      setError("Invalid order details.");
    }
  }, [order, type, navigate]);

  const paid = Number(invoice?.amount ?? 0);
  const couponType = Number(invoice?.couponType ?? 0);
  const couponValue = Number(invoice?.couponDiscount ?? 0);
  const couponLabel = invoice?.couponName ?? "Coupon Applied";

  const { original: originalAmount, discount: discountAmount } = reverseCoupon({
    paid,
    couponType,
    couponValue,
  });

  const finalInvoiceNumber = invoice?.invoiceNumber ?? "N/A";
  const finalInvoiceDate = invoice?.createdAt
    ? new Date(invoice.createdAt).toLocaleDateString()
    : "—";
  const finalTransactionId = invoice?.transactionId?.transactionId ?? "";
  const finalPatientAddress = invoice?.patientAddress ?? "N/A";
  const finalPatientZip = invoice?.patientId?.zipCode ?? "—";
  const finalPaymentMode = invoice?.paymentMode ?? "—";
  const physioName = invoice?.physioName ?? "N/A";

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
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = pdfHeight;
    let position = 10;

    pdf.addImage(imgData, "PNG", 10, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(
      `${orgName.replace(/\s/g, "_")}_${finalInvoiceNumber}_Invoice.pdf`
    );
  };

  // === Loading fallback ===
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center py-6 text-gray-500">
        Loading Invoice...
      </div>
    );
  }

  // === Error fallback ===
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-12">
        <img src="/homecare/invoice-failed.png" className="w-64" alt="Error" />
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-green text-white px-6 py-2 rounded-md text-sm font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-6">
      <div
        ref={invoiceRef}
        className="bg-white w-full max-w-md mx-auto my-6 rounded-lg shadow p-5"
        style={{ fontFamily: "Inter, Arial, sans-serif" }}
      >
        <h1 className="flex justify-center text-2xl text-green mb-6">
          Tax Invoice
        </h1>

        <div className="text-center mb-4">
          <div className="font-semibold text-lg">{orgName}</div>
          <div className="text-xs text-gray-600">{finalPatientZip}</div>
        </div>
        <hr className="mb-3" />

        <div className="space-y-2 text-sm text-black/90 mb-4">
          <div>
            <span className="font-medium">Physio Name :</span> {physioName}
          </div>
          <div>
            <span className="font-medium">Invoice Number :</span>{" "}
            {finalInvoiceNumber}
          </div>
          <div>
            <span className="font-medium">Service Type :</span>{" "}
            {invoice?.type ?? type}
          </div>

          {type === "treatment" &&
            invoice?.appointmentId?.isTreatmentScheduled?.treatmentDate
              ?.length > 0 && (
              <div className="space-y-1">
                <div>
                  <span className="font-medium">Service Days :</span>{" "}
                  {
                    invoice?.appointmentId?.isTreatmentScheduled?.treatmentDate
                      ?.length
                  }{" "}
                  Day(s)
                </div>
                {invoice?.appointmentId?.isTreatmentScheduled.treatmentDate.map(
                  (day, index) => (
                    <div
                      key={day._id || index}
                      className="ml-2 text-sm text-gray-700"
                    >
                      <span className="font-medium">• Day {index + 1}:</span>{" "}
                      {new Date(day.date).toLocaleDateString()}{" "}
                      {day.isPaid && (
                        <span className="text-green-600 ml-1">
                          [Paid - {day.paymentMode}]
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            )}

          {type === "appointment" && (
            <div>
              <span className="font-medium">Service Day :</span>{" "}
              {invoice?.appointmentId?.date}
            </div>
          )}

          <div>
            <span className="font-medium">Invoice Date :</span>{" "}
            {finalInvoiceDate}
          </div>
          <div>
            <span className="font-medium">Transaction Id :</span>{" "}
            {finalTransactionId || (
              <span className="text-gray-400">ID will generate</span>
            )}
          </div>
          <div>
            <span className="font-medium">Mode of Payment :</span>{" "}
            {finalPaymentMode}
          </div>
        </div>
        <hr className="mb-3" />

        <div className="space-y-1 text-sm mb-2">
          <div>
            <span className="font-medium">Invoice To :</span>{" "}
            {invoice?.patientName ?? "N/A"}
          </div>
          <div>
            <span className="font-medium">Address :</span> {finalPatientAddress}
          </div>
        </div>

        <div className="bg-gray-50 border p-3 rounded-md mt-4 mb-5">
          <div className="flex justify-between text-sm">
            <span>
              {type === "appointment"
                ? "Appointment Charges"
                : "Treatment Charges"}
            </span>
            <span>₹{originalAmount.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-700 mt-1">
              <span>
                {couponLabel} (
                {couponType === 1 ? `${couponValue}%` : `₹${couponValue}`})
              </span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <hr className="my-2" />
          <div className="flex justify-between font-medium text-base">
            <span>Total Amount Paid</span>
            <span>₹{paid.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownloadPDF}
        className="block w-full max-w-md mx-auto rounded-md bg-green/90 hover:bg-green text-white text-base py-3 font-semibold mt-2"
      >
        Download Invoice
      </button>
    </div>
  );
};

export default PhysioTaxInvoice;
