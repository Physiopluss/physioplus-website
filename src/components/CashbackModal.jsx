import { useState } from 'react';
import { toast } from 'react-hot-toast';

const CashbackModal = ({ isOpen, onClose, onRedeem, loading }) => {
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');

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
    onRedeem(upiId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Redeem Cashback</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-green-600 font-medium mb-2">Congratulations! 🎉</p>
          <p className="text-gray-700 mb-4">You're eligible for cashback! Please enter your UPI ID to redeem it.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID
              </label>
              <input
                type="text"
                id="upiId"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  if (error) setError('');
                }}
                placeholder="example@upi"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Redeem Now'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CashbackModal;
