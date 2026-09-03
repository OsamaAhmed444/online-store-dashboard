import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Spinner from '../common/Spinner'; 
import EmptyState from '../common/EmptyState';
///////////////////
export default function RevenueLineChart() {
const [revenueData, setRevenueData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  async function fetchRevenue() {
    try {
      const response = await axios.get('https://e-commerce-api-3wara.vercel.app/orders/admin/dashboard');
      const allRevenue = response.data.dashboard.dailyRevenue || [];
      const filteredRevenue = allRevenue.filter(item => item.category === 'team-1-products');

      setRevenueData(filteredRevenue);
      setLoading(false);
    } catch (error) {
       setError(error.message);
      setLoading(false);
    }
  }

  fetchRevenue();
}, []);

if (loading) return <Spinner />;

return (
  <div className="bg-[#FFF7ED] dark:bg-[#1F2937] shadow-md rounded-lg p-6 border border-[#FFEDD5] dark:border-gray-800 transition-colors">
    <h3 className="text-lg font-bold mb-4 text-[#1F2937] dark:text-[#FFF7ED] text-center">Revenue (Last 7 Days)</h3>

    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={revenueData}>
          <CartesianGrid
           strokeDasharray="3 3"
           stroke="#fed7aa" 
           opacity={0.3} />
          <XAxis dataKey="_id" 
          stroke="#9ca3af" 
          textAnchor="end" />
          <YAxis
           stroke="#9ca3af" />
          <Tooltip 
            contentStyle=
            {{ backgroundColor: '#fff', 
               borderRadius: '8px', 
               border: '1px solid #fed7aa' }}/>
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#F97316" 
            strokeWidth={3} 
            dot={{ fill: '#F97316', r: 5 }} 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);


}
