import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FaGift, FaCheckCircle, FaTimes, FaArrowRight } from 'react-icons/fa';

const CashbackModal = ({ isOpen, onClose, onRedeem, loading, cashbackData }) => {
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset states when modal is closed
      setUpiId('');
      setError('');
      setIsSubmitted(false);
      setShowSuccess(false);
    }
  }, [isOpen]);

  const validateUpiId = (id) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    return upiRegex.test(id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!upiId.trim()) {
      setError('Please enter your UPI ID');
      return;
    }

    if (!validateUpiId(upiId)) {
      setError('Please enter a valid UPI ID (e.g., example@upi)');
      return;
    }

    setError('');
    setIsSubmitted(true);
    onRedeem(upiId);
  };

  if (!isOpen) return null;

  // If cashback is being processed or completed
  if (cashbackData?.status === 'process' || cashbackData?.status === 'completed') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="p-6 text-center">
            <div className="flex justify-end items-center mb-6">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {cashbackData?.status === 'process' ? 'Cashback Processing' : 'Cashback Redeemed!'}
            </h3>
            <p className="text-gray-600 mb-6">
              {cashbackData?.status === 'process'
                ? 'Your cashback request is being processed. You will receive the amount soon.'
                : `₹${cashbackData?.rewardAmount || '0'} has been credited to your UPI ID.`}
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success state after submission
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Request Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Your cashback request has been received. We'll process it shortly and credit ₹{cashbackData?.rewardAmount || '0'} to your UPI ID.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main form view
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <FaGift className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Redeem Cashback</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You're eligible for <span className="font-bold">₹{cashbackData?.rewardAmount || '0'}</span> cashback!
                  Enter your UPI ID to claim it.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-2">
                Enter UPI ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="upiId"
                  value={upiId}
                  onChange={(e) => {
                    setUpiId(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="example@upi"
                  className={`w-full px-4 py-3 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                  disabled={loading}
                />
                {error && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Enter your UPI ID to receive cashback (e.g., yourname@upi)
              </p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={loading || !upiId.trim()}
                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${loading || !upiId.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-black hover:bg-green text-white'}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    Send to Redeem
                    <FaArrowRight className="ml-2" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-2">How it works:</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mr-2">1</span>
                Enter your UPI ID and click "Send to Redeem"
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mr-2">2</span>
                We'll verify and process your request
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mr-2">3</span>
                Receive ₹{cashbackData?.rewardAmount || '0'} in your UPI account within 24-48 hours
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashbackModal;
