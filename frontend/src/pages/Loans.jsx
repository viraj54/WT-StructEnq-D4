import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Check, Search } from 'lucide-react';

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    loanAmount: '',
    interestRate: '',
    tenure: '',
  });

  useEffect(() => {
    fetchLoans();
    fetchCustomers();
  }, []);

  const fetchLoans = async () => {
    try {
      const { data } = await api.get('/loans');
      setLoans(data);
    } catch (error) {
      console.error('Error fetching loans', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get('/customers');
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/loans', formData);
      setShowModal(false);
      setFormData({ customerId: '', loanAmount: '', interestRate: '', tenure: '' });
      fetchLoans();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating loan');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/loans/${id}/approve`);
      fetchLoans();
    } catch (error) {
      alert(error.response?.data?.message || 'Error approving loan');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Loans</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-opacity-90 transition"
        >
          <Plus size={20} />
          New Loan Application
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenure</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.map((loan) => (
              <tr key={loan._id}>
                <td className="px-6 py-4 whitespace-nowrap">{loan.customer?.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{loan.loanAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{loan.interestRate}%</td>
                <td className="px-6 py-4 whitespace-nowrap">{loan.tenure} Months</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{loan.emiAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${loan.status === 'Active' ? 'bg-green-100 text-green-800' : 
                      loan.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      loan.status === 'Defaulted' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                    {loan.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {loan.status === 'Pending' && (
                    <button 
                      onClick={() => handleApprove(loan._id)}
                      className="text-green-600 hover:text-green-900 flex items-center gap-1"
                    >
                      <Check size={16} /> Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loans.length === 0 && (
          <div className="p-6 text-center text-gray-500">No loans found.</div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">New Loan Application</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map(c => (
                    <option key={c._id} value={c._id}>{c.name} ({c.phone})</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="loanAmount"
                  placeholder="Loan Amount"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  name="interestRate"
                  placeholder="Interest Rate (%)"
                  value={formData.interestRate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="number"
                  name="tenure"
                  placeholder="Tenure (Months)"
                  value={formData.tenure}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
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
                  Create Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
