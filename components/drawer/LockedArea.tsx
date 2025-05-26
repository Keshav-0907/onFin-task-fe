import axios from 'axios';
import { Info } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import RentData from './lockedArea/RentData';
import TopCompanies from './lockedArea/TopCompanies';
import SalaryData from './lockedArea/SalaryData';
import { baseURL } from '@/config/config';
import WikiData from './lockedArea/WikiData';

interface LockedAreaProps {
    lockedData: {
        areaName: string;
        area_name: string;
        isLocked: boolean;
        pinCode: string;
        wikiData?: {
            content_urls?: {
                desktop?: {
                    page?: string;
                    revisions?: string;
                    edit?: string;
                    talk?: string;
                };
                mobile?: {
                    page?: string;
                    revisions?: string;
                    edit?: string;
                    talk?: string;
                };
            };
            title?: string;
            displaytitle?: string;
            namespace?: {
                id?: number;
                text?: string;
            };
            wikibase_item?: string;
            titles?: {
                canonical?: string;
                normalized?: string;
                display?: string;
            };
            pageid?: number;
            thumbnail?: {
                source?: string;
                width?: number;
                height?: number;
            };
            originalimage?: {
                source?: string;
                width?: number;
                height?: number;
            };
            lang?: string;
            dir?: string;
            revision?: string;
            tid?: string;
            timestamp?: string;
            description?: string;
            description_source?: string;
            coordinates?: {
                lat?: number;
                lon?: number;
            };
            extract?: string;
            extract_html?: string;
            type?: string;
        };
        lockedData?: {
            medianHouseholdIncome: number;
            populationDensity: number;
            purchasingPower: number;

        };
    } | null;
}

const LockedArea = ({ lockedData }: LockedAreaProps) => {
    const [rentData, setRentData] = useState(null);
    const [companyData, setCompanyData] = useState(null);
    const [companyLoading, setCompanyLoading] = useState(false);
    const [rentLoading, setRentLoading] = useState(false);
    if (!lockedData) return <div>No area data available.</div>

    useEffect(() => {
        if (!lockedData?.pinCode) return;

        const fetchData = async () => {
            setCompanyLoading(true);
            setRentLoading(true);

            try {
                const [companyRes, rentRes] = await Promise.all([
                    axios.post(`${baseURL}/api/areas/getSalary`, {
                        pinCode: lockedData.pinCode,
                    }),
                    axios.post(`${baseURL}/api/areas/getRentPrice`, {
                        pinCode: lockedData.pinCode,
                    }),
                ]);

                setCompanyData(companyRes.data);
                setRentData(rentRes.data);
            } catch (error) {
                console.error('Data fetch failed', error);
            } finally {
                setCompanyLoading(false);
                setRentLoading(false);
            }
        };

        fetchData();
    }, [lockedData?.pinCode]);

    return (
        <div className="py-2 px-4 bg-white space-y-4">
            {
                lockedData.wikiData && (
                    <WikiData lockedData={lockedData} />
                )

            }

            <div className="flex flex-col gap-2">
                {rentData || rentLoading ? (
                    <RentData rentData={rentData} isLoading={rentLoading} />
                ) : null}
                {companyData || companyLoading ? (
                    <SalaryData companiesData={companyData} isLoading={companyLoading} />
                ) : null}
                {companyData && !companyLoading ? (
                    <TopCompanies companiesData={companyData} isLoading={companyLoading} />
                ) : null}
            </div>

            <div className="text-xs text-gray-500 px-2">
                Pin Code: {lockedData.pinCode} | Display Name: {lockedData.areaName}
            </div>
        </div>
    )
}

export default LockedArea
