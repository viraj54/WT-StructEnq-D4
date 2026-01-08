import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Users, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLoans: 0,
    activeLoans: 0,
    totalCollections: 0,
    defaulters: 0,
    loanStatusData: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: loans } = await api.get('/loans');
        // Fetch instalments to calculate collections if needed, but for now let's estimate or mock collections based on status
        // Or better, just count loans
        
        const totalLoans = loans.length;
        const activeLoans = loans.filter(l => l.status === 'Active').length;
        const defaulters = loans.filter(l => l.status === 'Defaulted').length; // Simplified logic
        const completed = loans.filter(l => l.status === 'Completed').length;
        const pending = loans.filter(l => l.status === 'Pending').length;

        setStats({
          totalLoans,
          activeLoans,
          totalCollections: 0, // Placeholder
          defaulters,
          loanStatusData: [pending, activeLoans, completed, defaulters]
        });
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };

    fetchDashboardData();
  }, []);

  const doughnutData = {
    labels: ['Pending', 'Active', 'Completed', 'Defaulted'],
    datasets: [
      {
        data: stats.loanStatusData,
        backgroundColor: ['#fbbf24', '#3b82f6', '#10b981', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Loans</p>
            <p className="text-2xl font-bold">{stats.totalLoans}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Active Loans</p>
            <p className="text-2xl font-bold">{stats.activeLoans}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold">--</p> {/* Need to fetch customers count */}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-full">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Defaulters</p>
            <p className="text-2xl font-bold">{stats.defaulters}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Loan Status Distribution</h3>
          <div className="w-full max-w-xs mx-auto">
            <Doughnut data={doughnutData} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <p className="text-gray-500">No recent activity found.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
