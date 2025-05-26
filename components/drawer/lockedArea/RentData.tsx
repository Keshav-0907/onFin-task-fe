'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';
import { Chart } from 'react-chartjs-2';
import { Card } from '@/components/ui/card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BoxPlotController,
  BoxAndWiskers,
  Title,
  Tooltip,
  Legend
);

interface RentBucket {
  upto10k: number;
  "10to20k": number;
  "20to30k": number;
  "30to40k": number;
  above40k: number;
}

interface Property {
  id: number;
  rent: number;
}

interface RentData {
  success: boolean;
  message: string;
  areaName: string;
  rentBuckets: RentBucket;
  properties: Property[];
}

interface RentDataProps {
  rentData: RentData;
  isLoading: boolean;
}


export const RentData = ({ rentData, isLoading }: RentDataProps) => {
  const rents = rentData?.properties?.map((p) => p.rent) || [];

  console.log('rentData', rentData)

  if (rents.length === 0 || isLoading) {
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

  const maxRent = Math.max(...rents);
  const yAxisMax = Math.ceil((maxRent * 1.2) / 1000) * 1000;
  const yAxisStep = Math.ceil(yAxisMax / 5 / 1000) * 1000;

  const data = {
    labels: ['Rent'],
    datasets: [
      {
        label: 'Box Plot of Rent Prices',
        backgroundColor: '#3C82F6',
        borderColor: 'black',
        borderWidth: 1,
        outlierColor: '#999999',
        padding: 10,
        itemRadius: 0,
        data: [rents],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Rent Distribution',
      },
      tooltip: {
      enabled: false, 
    },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Rent (INR)',
        },
        beginAtZero: true,
        max: yAxisMax,
        ticks: {
          stepSize: yAxisStep,
          callback: function (value: { toLocaleString: (arg0: string) => any; }) {
            return value.toLocaleString('en-IN');
          },
        },
      },
    },
  };

  return (
    <Card>
      <div style={{ height: '300px', width: '100%' }}>
        <Chart type="boxplot" data={data} options={options} />
      </div>
    </Card>
  );
};

export default RentData;
