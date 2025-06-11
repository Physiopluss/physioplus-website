import React from 'react';
import { useNavigate } from 'react-router-dom';

const PhysioRefundPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md font-sans text-gray-800">
      <h1 className="text-2xl font-bold mb-6">Refunds & Cancellation Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4">1. For Physiotherapists:</h2>

        <h3 className="font-semibold mb-2">Free Trial Policy:</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>
            Physiotherapists who join the platform under the Free Plan can provide up to 4 treatments or consultations without any upfront payment.
          </li>
          <li>
            Physioplus charges 22% commission + GST (18%) on the commission as a service fee, even during the free trial.
          </li>
          <li>
            The earnings from consultations during the free trial are credited to the physiotherapist’s in-app wallet, but cannot be withdrawn unless the physiotherapist upgrades to a paid plan.
          </li>
        </ul>

        <h3 className="font-semibold mb-2">Upgrade and Deductions:</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>
            If the physiotherapist does not wish to upgrade after the free plan, ₹1899 + GST will be deducted from the wallet as the Basic Plan Fee, and the remaining wallet balance will be processed for payout.
          </li>
          <li>
            If the physiotherapist chooses to upgrade, the wallet balance can be adjusted towards purchasing either of the following:
            <ul className="list-disc list-inside ml-5 mt-2 space-y-1">
              <li>Standard Plan: 22% commission + 18% GST on the commission</li>
              <li>Premium Plan: 17% commission + 18% GST on the commission</li>
            </ul>
          </li>
        </ul>

        <h3 className="font-semibold mb-2">No Refund Policy Post Membership:</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>
            Once any paid plan (Standard or Premium) is purchased, Physioplus follows a strict No Refund Policy.
          </li>
          <li>
            Please carefully evaluate your needs before purchasing a plan or proceeding beyond the free trial.
          </li>
        </ul>

        <h3 className="font-semibold mb-2">Delisting Policy:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            If a physiotherapist opts not to continue after the free plan:
            <ul className="list-disc list-inside ml-5 mt-2 space-y-1">
              <li>Their data will be permanently deleted.</li>
              <li>They will be delisted from the platform.</li>
              <li>Rejoining will only be permitted after one year, or earlier subject to internal team approval at the sole discretion of Physioplus Healthcare Pvt. Ltd.</li>
            </ul>
          </li>
        </ul>
      </section>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Go Back
      </button>
    </div>
  );
};

export default PhysioRefundPolicy;
