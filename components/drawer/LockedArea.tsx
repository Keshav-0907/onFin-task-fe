import { Info } from 'lucide-react';
import React from 'react'

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
    if (!lockedData) return <div>No area data available.</div>

    return (
        <div className="p-4 border bg-white shadow-md space-y-4">
            <div className='flex flex-col gap-1'>
                <div className="text-xl font-semibold">{lockedData?.wikiData?.title}</div>
                <div className='text-xs flex items-center'><Info size={14} /> Data source: Wikipedia</div>
            </div>

            {lockedData?.wikiData?.thumbnail?.source && (
                <img
                    src={lockedData?.wikiData?.thumbnail.source}
                    alt={lockedData?.wikiData?.title}
                    className="w-full max-w-md rounded-lg"
                />
            )}

            <div className="text-gray-600 text-sm">{lockedData?.wikiData?.description}</div>
            <div className="text-sm">{lockedData?.wikiData?.extract}</div>

            <div className="text-sm text-blue-600 underline">
                <a href={lockedData?.wikiData?.content_urls?.desktop?.page} target="_blank" rel="noopener noreferrer">
                    Read more on Wikipedia
                </a>
            </div>

            <div className="text-xs text-gray-500">
                Pin Code: {lockedData.pinCode} | Display Name: {lockedData.areaName}
            </div>
        </div>
    )
}

export default LockedArea
