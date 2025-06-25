import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import InvoiceDownloader from "./InvoiceDownloader";

const TransactionModal = ({ orderData, isOpen, onClose, transactions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        >
          <AiOutlineClose size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Transaction History</h2>

        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Amount</th>
                  <th className="px-4 py-2 border">Mode</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">
                      {txn.createdAt
                        ? new Date(txn.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : txn.updatedAt
                        ? new Date(txn.updatedAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "-"}
                    </td>
                    <td className="px-4 py-2 border">₹{txn.amount}</td>
                    <td className="px-4 py-2 border">{txn.paymentMode}</td>
                    <td className="px-4 py-2 border capitalize">
                      {txn.paymentStatus}
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        className="text-blue-600 underline hover:text-blue-800"
                        onClick={() => setIsModalOpen(true)}
                        disabled={!txn.invoice}
                      >
                        Download
                      </button>
                    </td>
                    <InvoiceDownloader
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      orderData={orderData}
                      invoiceData={txn.invoice}
                      filename={
                        orderData.invoice
                          ? `Invoice_${txn.invoice.invoiceNumber}.pdf`
                          : "Invoice_unknown.pdf"
                      }
                    />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionModal;
