'use client';

import React, { useEffect, useState } from 'react';
import TopCompanies from './fallback/TopCompanies';
import SalaryData from './fallback/SalaryData';
import RentData from './fallback/RentData';
import axios from 'axios';
import { baseURL } from '@/config/config';

interface FallBackComponentProps {
  fallbackData: {
    areaName: string;
    isFallback: boolean;
    medianHouseholdIncome: number;
    pinCode: string;
    populationDensity: number;
    purchasingPower: number;
  } | null;
}

const FallBack = ({ fallbackData }: FallBackComponentProps) => {
  const [fallBackCompanyData, setFallBackCompanyData] = useState(null);
  const [fallBackRentData, setFallBackRentData] = useState(null);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [rentLoading, setRentLoading] = useState(false);

useEffect(() => {
  if (!fallbackData?.pinCode) return;

  const fetchData = async () => {
    setCompanyLoading(true);
    setRentLoading(true);

    try {
      const [companyRes, rentRes] = await Promise.all([
        axios.post(`${baseURL}/api/areas/getSalary`, {
          pinCode: fallbackData.pinCode,
        }),
        axios.post(`${baseURL}/api/areas/getRentPrice`, {
          pinCode: fallbackData.pinCode,
        }),
      ]);

      setFallBackCompanyData(companyRes.data);
      setFallBackRentData(rentRes.data);
    } catch (error) {
      console.error('Data fetch failed', error);
    } finally {
      setCompanyLoading(false);
      setRentLoading(false);
    }
  };

  fetchData();
}, [fallbackData?.pinCode]);

  console.log('fallBackCompanyData:', fallBackCompanyData);

  return (
    <div className="px-4 py-2 flex flex-col gap-6">
      {fallBackRentData || rentLoading ? (
        <RentData rentData={fallBackRentData} isLoading={rentLoading} />
      ) : null}
      {fallBackCompanyData || !companyLoading ? (
        <SalaryData companiesData={fallBackCompanyData} isLoading={companyLoading} />
      ) : null}
      {fallBackCompanyData && !companyLoading ? (
        <TopCompanies companiesData={fallBackCompanyData} isLoading={companyLoading}/>
      ) : null}
    </div>
  );
};

export default FallBack;
