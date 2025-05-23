'use client';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface LineCardProps {
  title: string;
  data: {
    date: string;
    orders?: number;
    opens?: number;
  }[];
}


const LineCard = ({ title, data }: LineCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const key = title === 'Daily Orders' ? 'orders' : 'opens';

  const chartData = data?.map((entry, index) => ({
    label: entry.date || `Day ${index + 1}`,
    value: entry[key as 'orders' | 'opens'] ?? 0,
  }));

  const total = data?.reduce((acc, entry) => acc + (entry[key as 'orders' | 'opens'] ?? 0), 0);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'overflow-hidden p-4 bg-white transition-shadow duration-300 border rounded-2xl border-border/40 backdrop-blur',
        isHovered ? 'shadow-md' : 'shadow-sm'
      )}
    >
      <div className='flex items-center justify-between mb-2'>
        <div className="text-sm font-medium text-foreground">
          {title}
        </div>
        <div className="text-xs text-gray-500">
          {title === 'Daily Orders' ? 'Total Orders' : 'Total App Opens'}: {total}
        </div>
      </div>

      <div className="h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Tooltip
              contentStyle={{ fontSize: '12px', padding: '4px 6px' }}
              labelFormatter={(label) => `${label}`}
              formatter={(value) => [`${value}`, title]}
              cursor={{ strokeDasharray: '3 3' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


export default LineCard;
