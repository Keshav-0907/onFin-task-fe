import { Info } from 'lucide-react'
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
        lockedData?: {
            medianHouseholdIncome: number;
            populationDensity: number;
            purchasingPower: number;

        };
    } | null;
}

const WikiData = ({ lockedData }: LockedAreaProps) => {
    console.log('locked', lockedData)
    return (
        <div className='flex flex-col gap-4'>
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
        </div>
    )
}

export default WikiData