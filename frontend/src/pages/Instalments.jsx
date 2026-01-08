import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Search, DollarSign } from 'lucide-react';

const Instalments = () => {
  const [loans, setLoans] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState('');
  const [instalments, setInstalments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    instalmentId: '',
    amountPaid: '',
  });

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    if (selectedLoan) {
      fetchInstalments(selectedLoan);
    } else {
      setInstalments([]);
    }
  }, [selectedLoan]);

  const fetchLoans = async () => {
    try {
      const { data } = await api.get('/loans');
      setLoans(data.filter(l => l.status === 'Active' || l.status === 'Completed' || l.status === 'Defaulted'));
    } catch (error) {
      console.error('Error fetching loans', error);
    }
  };

  const fetchInstalments = async (loanId) => {
    try {
      const { data } = await api.get(`/instalments/${loanId}`);
      setInstalments(data);
    } catch (error) {
      console.error('Error fetching instalments', error);
    }
  };

  const handlePayClick = (instalment) => {
    setPaymentData({
      instalmentId: instalment._id,
      amountPaid: instalment.amount, // Default to full amount
    });
    setShowModal(true);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/instalments/pay', paymentData);
      setShowModal(false);
      fetchInstalments(selectedLoan);
    } catch (error) {
      alert(error.response?.data?.message || 'Error processing payment');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Instalments & Payments</h2>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">Select Loan Account</label>
        <select
          value={selectedLoan}
          onChange={(e) => setSelectedLoan(e.target.value)}
          className="w-full max-w-md p-2 border rounded"
        >
          <option value="">-- Select Loan --</option>
          {loans.map(loan => (
            <option key={loan._id} value={loan._id}>
              {loan.customer?.name} - ₹{loan.loanAmount} (Status: {loan.status})
            </option>
          ))}
        </select>
      </div>

      {selectedLoan && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penalty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {instalments.map((inst) => (
                <tr key={inst._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(inst.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{inst.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-600">{inst.penalty > 0 ? `₹${inst.penalty}` : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600">{inst.amountPaid > 0 ? `₹${inst.amountPaid}` : '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${inst.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                        inst.status === 'Overdue' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {inst.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {inst.status !== 'Paid' && (
                      <button 
                        onClick={() => handlePayClick(inst)}
                        className="bg-accent text-white px-3 py-1 rounded text-sm hover:bg-opacity-90"
                      >
                        Pay
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {instalments.length === 0 && (
            <div className="p-6 text-center text-gray-500">No instalments found.</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Record Payment</h3>
            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Amount to Pay</label>
                <input
                  type="number"
                  value={paymentData.amountPaid}
                  onChange={(e) => setPaymentData({ ...paymentData, amountPaid: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Instalments;
