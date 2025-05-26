import { Info } from 'lucide-react'
import React from 'react'

const WikiData = ({lockedData}) => {
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