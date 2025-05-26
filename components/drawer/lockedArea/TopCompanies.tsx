import React from 'react';
import { Building } from 'lucide-react';

const COLORS = ['bg-yellow-600', 'bg-red-600', 'bg-green-600', 'bg-blue-600'];

interface CompaniesData {
    topCompanies: {
        name: string;
        address: string;
    }[];
}

interface CompanyDataProps {
    companiesData: CompaniesData | null;
    isLoading: boolean;
}

const TopCompanies = ({ companiesData, isLoading }: CompanyDataProps) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 border-solid border-r-transparent"></div>
            </div>
        );
    }

    const companies = companiesData?.topCompanies || [];

    if (companies.length === 0) {
        return (
            <div className="text-gray-500 text-center py-8">
                No companies found in this area.
            </div>
        );
    }

    return (
        <div className="p-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Companies</h2>
            <div className="flex flex-col gap-4">
                {companies.map((company, index) => {
                    const colorClass = COLORS[index % COLORS.length];
                    const shortAddress = company.address
                        .split(',')
                        .slice(-4, -2)
                        .join(', ')
                        .trim();

                    return (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-start border border-gray-200"
                        >
                            <div
                                className={`${colorClass} rounded-md w-10 h-10 flex items-center justify-center text-white`}
                            >
                                <Building size={20} />
                            </div>

                            <div className="flex-1">
                                <div className="font-semibold text-sm text-gray-900">{company.name}</div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {shortAddress}{' '}
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                            company.name + ' ' + company.address
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline ml-1"
                                    >
                                        View more
                                    </a>
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TopCompanies;
