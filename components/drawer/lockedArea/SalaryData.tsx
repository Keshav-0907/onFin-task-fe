'use client';

import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import {
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  LabelList,
} from 'recharts';

interface DistributionEntry {
  percentage: string;
  count: number;
}

interface CompaniesData {
  distribution: {
    [key: string]: DistributionEntry;
  };
}

interface SalaryDataProps {
  companiesData: CompaniesData | null;
  isLoading: boolean;
}

const SalaryData = ({ companiesData, isLoading }: SalaryDataProps) => {
  if (isLoading || !companiesData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-t-primary border-b-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>

    );
  }

  const rawDistribution = companiesData.distribution;

  const data = Object.entries(rawDistribution).map(([range, info]) => ({
    range,
    percentage: parseFloat(info.percentage.replace('%', '')) || 0,
    count: info.count,
  }));

  const hasData = data.some((item) => item.percentage > 0);

  return (
    <Card className="w-full max-w-3xl rounded-2xl shadow-md bg-white py-3">
      <CardContent className="px-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Salary Distribution
        </h2>

        {!hasData ? (
          <div className="text-gray-500 text-center py-4">
            No salary data available for this area.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fill: '#4a5568', fontSize: 12 }}
                axisLine={{ stroke: '#cbd5e0' }}
                tickLine={false}
                label={{
                  value: 'Percentage (%)',
                  position: 'insideBottom',
                  offset: -5,
                  fill: '#718096',
                  fontSize: 12,
                }}
              />
              <YAxis
                type="category"
                dataKey="range"
                tick={{ fill: '#4a5568', fontSize: 12 }}
                axisLine={{ stroke: '#cbd5e0' }}
                tickLine={false}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '14px',
                }}
                formatter={(value, name, props) =>
                  [`${value}% (${props.payload.count} roles)`, 'Percentage']
                }
              />
              <Bar
                dataKey="percentage"
                radius={[0, 5, 5, 0]}
                fill="#3b82f6"
                barSize={24}
              >
                <LabelList
                  dataKey="count"
                  position="right"
                  fill="#1a202c"
                  fontSize={12}
                  formatter={(val: number) => `${val} roles`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SalaryData;
