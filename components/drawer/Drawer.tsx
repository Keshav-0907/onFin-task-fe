'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAreaStore } from '@/store/useAreaStore';
import axios from 'axios';
import DrawerHeader from './DrawerHeader';
import Stats from './Stats';
import LockedArea from './LockedArea';
import FallBack from './FallBack';
import DrawerSkeleton from '../skeletons/DrawerSkeleton';

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
        const response = await axios.get(`http://localhost:8080/api/areas/area-stats/${activePinCode}`);


        if (response.data.data.isLocked) {
          setIsLocked(true);
          setLockedData(response.data.data);
        } else if (response.data.data.isFallback) {
          setIsFallback(true);
          console.log('Fallback data:', response.data.data);
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

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity duration-300 z-40 ${activePinCode ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      />

      <div
        ref={drawerRef}
        className={`fixed flex flex-col top-0 right-0 rounded-l-xl overflow-y-auto h-full border-l-[1px] w-[450px] bg-[#FFF2E6] shadow-lg z-50 transform transition-transform duration-300 ${activePinCode ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <DrawerHeader locality={statsData?.data?.areaName || lockedData?.areaName || fallbackData?.areaName || 'Area'} isLocked={isLocked} />

        {loading ? (
          <div>
            <DrawerSkeleton />
          </div>
        ) : isLocked ? (
          <LockedArea lockedData={lockedData} />
        ) : isFallback ? (
          <FallBack fallbackData={fallbackData} />
        ) : statsData ? (
          <Stats stats={statsData.data} />
        ) : (
          <div className="p-4 text-sm text-red-500">Unable to fetch area details.</div>
        )}
      </div>
    </>
  );
};

export default Drawer;




// useEffect(() => {
//   const handleClickOutside = (event: MouseEvent) => {
//     if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
//       setActivePinCode(null);
//     }
//   };

//   if (activePinCode !== null) {
//     document.addEventListener('mousedown', handleClickOutside);
//   }

//   return () => {
//     document.removeEventListener('mousedown', handleClickOutside);
//   };
// }, [activePinCode, setActivePinCode]);