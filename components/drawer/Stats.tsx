import React from 'react'
import MetricsCard from './MetricsCard'
import LineCard from './LineCard';
import { ChartBarStacked, TrendingUp } from 'lucide-react';

interface StatsProps {
    stats: any;
    loading: boolean;
}

const Stats = ({ stats, loading }: StatsProps) => {
    return (
        <div className='px-4 py-4 flex-col flex gap-4'>
            <div className='flex flex-col gap-2'>
                <div className='text-xs font-semibold text-gray-600 flex items-center gap-1'> <ChartBarStacked size={16} /> General Stats  </div>
                <div className='grid grid-cols-2 gap-2'>
                    <MetricsCard title='Total Orders' total={stats?.totalOrders} changePercent={4.2} />
                    <MetricsCard title='Avergae Order Value' total={stats?.avgOrderValue} changePercent={7} />
                    <MetricsCard title='Average Delivery Time' total={stats?.avgDeliveryTime} changePercent={-4.5} />
                    <MetricsCard title='Total Delivery Dealys' total={stats?.deliveryDelay} showChange={false} />
                </div>
            </div>

            <div className='flex flex-col gap-2'>
                <div className='text-xs font-semibold text-gray-600 flex items-center gap-1'> <TrendingUp size={16}/> Other Stats </div>
                <div className='flex flex-col gap-2'>
                    <LineCard title={'Daily Orders'} data={stats?.dailyOrders}/>
                    <LineCard title={'App Opens'} data={stats?.appOpensHistory}/>
                </div>
            </div>
        </div>
    )
}

export default Stats