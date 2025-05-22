'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAreaStore } from '@/store/useAreaStore';
import axios from 'axios';
import DrawerHeader from './DrawerHeader';
import Stats from './Stats';
import LockedArea from './LockedArea';
import FallBack from './FallBack';

const Drawer = () => {
  const activePinCode = useAreaStore((state) => state.activePindCode);
  const setActivePinCode = useAreaStore((state) => state.setActivePinCode);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState<any>(null);
  const [lockedData, setLockedData] = useState<any>(null);
  const [fallback, setFallback] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    if (!activePinCode) return;

    setLoading(true);
    setStats(null);
    setLockedData(null);
    setFallback(null);
    setIsLocked(false);
    setIsFallback(false);

    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/areas/area-stats/${activePinCode}`);
        const data = res.data;

        if (data.isLocked) {
          setIsLocked(true);
          setLockedData(data);
        } else if (data.isFallback) {
          setIsFallback(true);
          setFallback(data);
        } else {
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching area data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activePinCode]);

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

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity duration-300 z-40 ${
          activePinCode ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <div
        ref={drawerRef}
        className={`fixed flex flex-col top-0 right-0 rounded-l-xl overflow-y-auto h-full border-l-[1px] w-[450px] bg-[#FFF2E6] shadow-lg z-50 transform transition-transform duration-300 ${
          activePinCode ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <DrawerHeader locality={stats?.name || lockedData?.areaName || fallback?.areaName || 'Area'} isLocked={isLocked} />

        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">Loading area data...</div>
        ) : isLocked ? (
          <LockedArea lockedData={lockedData} />
        ) : isFallback ? (
          <FallBack fallbackData={fallback} />
        ) : stats ? (
          <Stats stats={stats.areaStats} loading={loading} />
        ) : (
          <div className="p-4 text-sm text-red-500">Unable to fetch area details.</div>
        )}
      </div>
    </>
  );
};

export default Drawer;
