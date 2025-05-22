import { Info } from 'lucide-react';
import React from 'react'

const LockedArea = ({ lockedData }) => {
    if (!lockedData) return <div>No area data available.</div>

    const {
        areaId,
        areaName,
        area_name,
        wikiData: {
            title,
            description,
            thumbnail,
            extract,
            content_urls
        }
    } = lockedData;

    return (
        <div className="p-4 border bg-white shadow-md space-y-4">
           <div className='flex flex-col gap-1'>
             <div className="text-xl font-semibold">{title}</div>
            <div className='text-xs flex items-center'><Info size={14}/> Data source: Wikipedia</div>
           </div>

            {thumbnail?.source && (
                <img
                    src={thumbnail.source}
                    alt={title}
                    className="w-full max-w-md rounded-lg"
                />
            )}

            <div className="text-gray-600 text-sm">{description}</div>
            <div className="text-sm">{extract}</div>

            <div className="text-sm text-blue-600 underline">
                <a href={content_urls.desktop.page} target="_blank" rel="noopener noreferrer">
                    Read more on Wikipedia
                </a>
            </div>

            <div className="text-xs text-gray-500">
                Area ID: {areaId} | Internal Name: {area_name} | Display Name: {areaName}
            </div>
        </div>
    )
}

export default LockedArea
