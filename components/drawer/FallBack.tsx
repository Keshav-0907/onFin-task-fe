'use client';

import React, { useEffect, useState } from 'react';
import TopCompanies from './fallback/TopCompanies';
import SalaryData from './fallback/SalaryData';
import RentData from './fallback/RentData';
import axios from 'axios';

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

    const fetchCompanyData = async () => {
      try {
        setCompanyLoading(true);
        const res = await axios.post(`http://localhost:8080/api/areas/getSalary`, {
          pinCode: fallbackData.pinCode,
        });
        setFallBackCompanyData(res.data);
      } catch (error) {
        console.error('Company data fetch failed', error);
      } finally {
        setCompanyLoading(false);
      }
    };

    const fetchRentData = async () => {
      try {
        setRentLoading(true);
        const res = await axios.post(`http://localhost:8080/api/areas/getRentPrice`, {
          pinCode: fallbackData.pinCode,
        });
        setFallBackRentData(res.data);
      } catch (error) {
        console.error('Rent data fetch failed', error);
      } finally {
        setRentLoading(false);
      }
    };

    fetchCompanyData();
    fetchRentData();
  }, [fallbackData?.pinCode]);

  return (
    <div className="px-4 py-2 flex flex-col gap-6">
      {fallBackRentData || rentLoading ? (
        <RentData rentData={fallBackRentData} isLoading={rentLoading} />
      ) : null}
      {fallBackCompanyData || companyLoading ? (
        <SalaryData companiesData={fallBackCompanyData} isLoading={companyLoading} />
      ) : null}
      {fallBackCompanyData && !companyLoading ? (
        <TopCompanies companiesData={fallBackCompanyData} isLoading={companyLoading}/>
      ) : null}
    </div>
  );
};

export default FallBack;
