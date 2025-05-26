import React from 'react'
import MetricsCard from './MetricsCard'
import LineCard from './LineCard';
import { ChartBarStacked, TrendingUp } from 'lucide-react';

interface StatsProps {
    stats: {
        totalOrders: number;
        avgOrderValue: number;
        avgDeliveryTime: number;
        deliveryDelay: number;
        dailyOrders: {
            date: string;
            orders: number;
        }[];
        appOpensHistory: {
            date: string;
            opens: number;
        }[];
    } | null
}

const Stats = ({ stats }: StatsProps) => {

    const totalOrders = stats?.dailyOrders?.reduce((sum, day) => sum + day.orders, 0)
    return (
        <div className='px-4 py-4 flex-col flex gap-4'>
            <div className='flex flex-col gap-2'>
                <div className='text-xs font-semibold text-gray-600 flex items-center gap-1'> <ChartBarStacked size={16} /> General Stats  </div>
                <div className='grid grid-cols-2 gap-2'>
                    <MetricsCard title='Total Orders' total={totalOrders} changePercent={4.2} />
                    <MetricsCard title='Average Order Value' total={stats?.avgOrderValue} changePercent={7} />
                    <MetricsCard title='Average Delivery Time' total={stats?.avgDeliveryTime} changePercent={-4.5} />
                    <MetricsCard title='Total Delivery Delays' total={stats?.deliveryDelay} showChange={false} />
                </div>
            </div>

            <div className='flex flex-col gap-2'>
                <div className='text-xs font-semibold text-gray-600 flex items-center gap-1'> <TrendingUp size={16} /> Other Stats </div>
                <LineCard title="Daily Orders" data={stats?.dailyOrders ?? []} />
                <LineCard title="App Opens" data={stats?.appOpensHistory ?? []} />

            </div>
        </div>
    )
}

export default Stats