import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { ChartBarStacked, TrendingUp } from 'lucide-react'

const DrawerSkeleton = () => {
    return (
        <div className="p-4 space-y-4">
            <div className='flex flex-col gap-2'>
                <div className='text-xs font-semibold text-gray-600 flex items-center gap-1'> <ChartBarStacked size={16} /> General Stats  </div>
                <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-24 w-full rounded-xl bg-gray-300" />
                    <Skeleton className="h-24 w-full rounded-xl bg-gray-300" />
                    <Skeleton className="h-24 w-full rounded-xl bg-gray-300" />
                    <Skeleton className="h-24 w-full rounded-xl bg-gray-300" />
                </div>
            </div>

            <div className='flex flex-col gap-2'>
                <div className='text-xs font-semibold text-gray-600 flex items-center gap-1'> <TrendingUp size={16} /> Other Stats </div>
                <div className='grid grid-cols-1 gap-4'>
                    <Skeleton className="h-32 w-full rounded-xl bg-gray-300" />
                    <Skeleton className="h-32 w-full rounded-xl bg-gray-300" />
                </div>
            </div>
        </div>
    )
}

export default DrawerSkeleton
