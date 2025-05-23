import React from 'react';

interface FallBackComponentProps {
  fallbackData: {
    areaName: string;
    isFallback: boolean;
    medianHouseholdIncome: number;
    pinCode: string;
    populationDensity: number;
    purchasingPower: number;
  } | null
}

const FallBack = ({ fallbackData }: FallBackComponentProps) => {

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Limited Area Insights
      </h2>

      <table className="w-full border text-sm text-gray-700 bg-white shadow rounded overflow-hidden">
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-3 font-medium bg-gray-100">Area Name</td>
            <td className="px-4 py-3">{fallbackData?.areaName}</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3 font-medium bg-gray-100">Pin Code</td>
            <td className="px-4 py-3">{fallbackData?.pinCode}</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3 font-medium bg-gray-100">Population Density</td>
            <td className="px-4 py-3">
              {fallbackData?.populationDensity.toLocaleString()} people/sq.km
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3 font-medium bg-gray-100">Median Income</td>
            <td className="px-4 py-3">
              ₹{(fallbackData?.medianHouseholdIncome !== undefined
                ? fallbackData.medianHouseholdIncome / 100000
                : 0).toFixed(2)} LPA
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium bg-gray-100">Purchasing Power Index</td>
            <td className="px-4 py-3">
              {fallbackData?.purchasingPower !== undefined
                ? `${(fallbackData.purchasingPower * 100).toFixed(1)}%`
                : '0.0%'}
            </td>

          </tr>
        </tbody>
      </table>

      <p className="text-xs text-gray-500 mt-3">
        * This is fallback data and may not be fully up-to-date.
      </p>
    </div>
  );
};

export default FallBack;
