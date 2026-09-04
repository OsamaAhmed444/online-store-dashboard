import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import RevenueLineChart from '../components/charts/RevenueLineChart';
import TopProductsTable from '../components/charts/TopProductsTable';

const StatCard = ({ title, fetchFn, formatValue = (v) => v }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchFn()
      .then((res) => {
        if (isMounted) {
          const val = res?.data?.total !== undefined ? res.data.total : res?.data?.count ?? res?.data;
          setData(val);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to load data');
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [fetchFn]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[120px]">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2">
        {loading ? (
          <div className="flex items-center justify-center py-2">
            <Spinner />
          </div>
        ) : error ? (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        ) : data === null || data === undefined ? (
          <EmptyState message="No data" />
        ) : (
          <p className="text-2xl font-bold text-gray-900">{formatValue(data)}</p>
        )}
      </div>
    </div>
  );
};

export default function DashboardHome() {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Revenue"
          fetchFn={() => api.get('/orders/revenue')}
          formatValue={(val) => `$${Number(val).toLocaleString()}`}
        />
        <StatCard
          title="Orders"
          fetchFn={() => api.get('/orders/count')}
          formatValue={(val) => Number(val).toLocaleString()}
        />
        <StatCard
          title="Customers"
          fetchFn={() => api.get('/users/count')}
          formatValue={(val) => Number(val).toLocaleString()}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <RevenueLineChart />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <TopProductsTable />
        </div>
      </div>
    </div>
  );
}
