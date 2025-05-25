import axios from 'axios';
import { Info } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import RentData from './fallback/RentData';
import TopCompanies from './fallback/TopCompanies';
import SalaryData from './fallback/SalaryData';
import { baseURL } from '@/config/config';

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

        const fetchCompanyData = async () => {
            try {
                setCompanyLoading(true);
                const res = await axios.post(`${baseURL}/api/areas/getSalary`, {
                    pinCode: lockedData.pinCode,
                });
                setCompanyData(res.data);
            } catch (error) {
                console.error('Company data fetch failed', error);
            } finally {
                setCompanyLoading(false);
            }
        };

        const fetchRentData = async () => {
            try {
                setRentLoading(true);
                const res = await axios.post(`${baseURL}/api/areas/getRentPrice`, {
                    pinCode: lockedData.pinCode,
                });
                setRentData(res.data);
            } catch (error) {
                console.error('Rent data fetch failed', error);
            } finally {
                setRentLoading(false);
            }
        };

        fetchCompanyData();
        fetchRentData();
    }, [lockedData?.pinCode]);

    return (
        <div className="py-2 px-4 bg-white space-y-4">
            <div className='flex flex-col gap-1'>
                <div className="text-xl font-semibold">{lockedData?.wikiData?.title}</div>
                <div className='text-xs flex items-center gap-1'><Info size={14} />Data source: Wikipedia</div>
            </div>

            <div className="w-full rounded-xl shadow-md overflow-hidden">
                {lockedData?.wikiData?.thumbnail?.source && (
                    <div className="aspect-[3/2] w-full">
                        <img
                            src={lockedData.wikiData.thumbnail.source}
                            alt={lockedData.wikiData.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>



            <div className="text-gray-600 text-sm">{lockedData?.wikiData?.description}</div>
            <div className="text-sm border p-2 rounded-lg ">{lockedData?.wikiData?.extract}</div>

            <div className="text-sm px-2 text-blue-600 underline">
                <a href={lockedData?.wikiData?.content_urls?.desktop?.page} target="_blank" rel="noopener noreferrer">
                    Read more on Wikipedia
                </a>
            </div>

            <div className="px-4 py-2 flex flex-col gap-6">
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
