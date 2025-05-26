'use client';

import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

type RentBuckets = {
  [key: string]: number;
};

interface RentDataType {
  rentBuckets: RentBuckets;
}

interface RentDataProps {
  rentData: RentDataType | null;
  isLoading: boolean;
}

interface ChartData {
  range: string;
  count: number;
  percentage: number;
}

const RentData = ({ rentData, isLoading }: RentDataProps) => {
  if (isLoading || !rentData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 border-solid border-r-transparent"></div>
      </div>
    );
  }

  const total = Object.values(rentData.rentBuckets).reduce((acc, val) => acc + val, 0);

  const data: ChartData[] = Object.entries(rentData.rentBuckets).map(([key, value]) => {
    const rangeLabel = key
      .replace(/([a-z])([A-Z])/g, '$1 to $2')
      .replace(/([a-z])([0-9])/gi, '$1 $2')
      .replace('upto', 'Up to ')
      .replace('above', 'Above ');

    const percentage = total === 0 ? 0 : parseFloat(((value / total) * 100).toFixed(2));

    return {
      range: rangeLabel,
      count: value,
      percentage,
    };
  });

  const hasData = data.some((item) => item.percentage > 0);

  console.log(hasData)

  return (
    <Card className="w-full max-w-3xl rounded-2xl shadow-md bg-white py-4">
      <CardContent className="px-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Rent Price Distribution
        </h2>

        {!hasData ? (
          <div className="text-gray-500 text-center py-12">
            No rent data available for this area.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="range"
                tick={{ fill: '#4a5568', fontSize: 12 }}
                axisLine={{ stroke: '#cbd5e0' }}
                tickLine={false}
                angle={-20}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#4a5568', fontSize: 12 }}
                axisLine={{ stroke: '#cbd5e0' }}
                tickLine={false}
                label={{
                  value: 'Percentage (%)',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#718096',
                  fontSize: 12,
                }}
              />
              <Tooltip
                formatter={(value: number, name: string, props) => [
                  `${value}% (${props.payload.count} listings)`,
                  'Rent Range',
                ]}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '14px',
                }}
              />
              <Bar dataKey="percentage" fill="#3C82F6" radius={[5, 5, 0, 0]} maxBarSize={40}>
                <LabelList
                  dataKey="percentage"
                  position="top"
                  formatter={(val: number) => `${val}%`}
                  fill="#1f2937"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default RentData;
