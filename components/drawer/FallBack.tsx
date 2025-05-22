import React from 'react';

interface FallbackData {
  isFallback: true;
  pinCode: string;
  areaName: string;
  populationDensity: number;
  medianHouseholdIncome: number;
  purchasingPower: number;
}

const FallBack = ({ fallbackData }: { fallbackData: FallbackData }) => {
  const {
    pinCode,
    areaName,
    populationDensity,
    medianHouseholdIncome,
    purchasingPower,
  } = fallbackData;

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Limited Area Insights
      </h2>

      <table className="w-full border text-sm text-gray-700 bg-white shadow rounded overflow-hidden">
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-3 font-medium bg-gray-100">Area Name</td>
            <td className="px-4 py-3">{areaName}</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3 font-medium bg-gray-100">Pin Code</td>
            <td className="px-4 py-3">{pinCode}</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3 font-medium bg-gray-100">Population Density</td>
            <td className="px-4 py-3">
              {populationDensity.toLocaleString()} people/sq.km
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3 font-medium bg-gray-100">Median Income</td>
            <td className="px-4 py-3">
              ₹{(medianHouseholdIncome / 100000).toFixed(2)} LPA
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium bg-gray-100">Purchasing Power Index</td>
            <td className="px-4 py-3">{(purchasingPower * 100).toFixed(1)}%</td>
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
