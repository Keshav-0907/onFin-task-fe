'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAreaStore } from '@/store/useAreaStore';
import axios from 'axios';
import DrawerHeader from './DrawerHeader';
import Stats from './Stats';
import LockedArea from './LockedArea';
import DrawerSkeleton from '../skeletons/DrawerSkeleton';
import FloatingChatIcon from '../chat/FloatingChatIcon';
import { useChatStore } from '@/store/useChatStore';
import { baseURL } from '@/config/config';
import useServedAreas from '@/hooks/useServedAreas';

interface StatsProps {
  data: {
    areaName: string;
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
  } | null;
  loading: boolean;
  areaName: string;
}

interface FallBackProps {
  areaName: string;
  isFallback: boolean;
  medianHouseholdIncome: number;
  pinCode: string;
  populationDensity: number;
  purchasingPower: number;
}

interface LockedDataProps {
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
}


const Drawer = () => {
  const { areas } = useServedAreas();
  const activePinCode = useAreaStore((state) => state.activePindCode);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [statsData, setStatsData] = useState<StatsProps | null>(null);
  const [lockedData, setLockedData] = useState<LockedDataProps | null>(null);
  const [fallbackData, setFallbackData] = useState<FallBackProps | null>(null);

  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    if (!activePinCode) return;

    setLoading(true);
    setStatsData(null);
    setLockedData(null);
    setFallbackData(null);
    setIsLocked(false);
    setIsFallback(false);

    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/areas/area-stats/${activePinCode}`);


        if (response.data.data.isLocked) {
          setIsLocked(true);
          setLockedData(response.data.data);
        } else if (response.data.data.isFallback) {
          setIsFallback(true);
          setFallbackData(response.data.data);
        } else {
          setStatsData(response.data);
        }
      } catch (error) {
        console.error('Error fetching area data:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 200);
      }
    };

    fetchData();
  }, [activePinCode]);

  const areaName = areas.find(area => Number(area.pinCode) == activePinCode)?.name || 'Area';
  return (
    <div
      ref={drawerRef}
      className={`fixed flex flex-col top-0 right-0 rounded-l-xl overflow-y-auto h-full border-l-[1px] md:w-[450px] w-[90%] bg-white shadow-lg z-50 transform transition-transform duration-300 ${activePinCode ? 'translate-x-0' : 'translate-x-full'
        }`}
    >
      <DrawerHeader locality={areaName || 'Area'} isLocked={isLocked || isFallback} />

      {loading ? (
        <div>
          <DrawerSkeleton />
        </div>
      ) : isLocked ? (
        <LockedArea lockedData={lockedData} />
      ) : statsData ? (
        <Stats stats={statsData.data} />
      ) : (
        <div className="p-4 text-sm text-red-500">Unable to fetch area details.</div>
      )}
    </div>
  );
};

export default Drawer;




