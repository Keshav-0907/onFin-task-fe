'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAreaStore } from '@/store/useAreaStore';
import axios from 'axios';
import DrawerHeader from './DrawerHeader';
import Stats from './Stats';
import PocData from './PocData';
import LockedArea from './LockedArea';

const Drawer = () => {
  const activePinCode = useAreaStore((state) => state.activePindCode);
  const setActivePinCode = useAreaStore((state) => state.setActivePinCode);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [stats, setStats] = useState<any>(null);
  const [lockedData, setLockedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!activePinCode) return;

    setLoading(true);
    setStats(null);
    setLockedData(null);
    setIsLocked(false);

    (async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/areas/area-stats/${activePinCode}`);
        const { isLocked: locked, areaStats } = res.data;

        if (locked) {
          setIsLocked(true);
          const lockedRes = await axios.get(`http://localhost:8080/api/areas/locked-area/${activePinCode}`);
          if(lockedRes.data.wikiData) {
            setLockedData(lockedRes.data);
          } 
          else {
            setLockedData({
              areaId: lockedRes.data.areaId,
              areaName: lockedRes.data.areaName,
              area_name: lockedRes.data.area_name,
              wikiData: {
                title: 'No data available',
                description: 'No data available',
                thumbnail: null,
                extract: 'No data available',
                content_urls: {
                  desktop: {
                    page: 'No data available'
                  }
                }
              }
            });
          }
        } else {
          setStats(areaStats);
        }
      } catch (error) {
        console.error('Error fetching area data:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [activePinCode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setActivePinCode(null);
      }
    };

    if (activePinCode !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePinCode, setActivePinCode]);

  console.log(lockedData)

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 transition-opacity duration-300 z-40 ${activePinCode ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      <div
        ref={drawerRef}
        className={`fixed flex flex-col top-0 right-0 rounded-l-xl overflow-y-auto h-full border-l-[1px] w-[450px] bg-[#FFF2E6] shadow-lg z-50 transform transition-transform duration-300 ${activePinCode ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <DrawerHeader locality={stats?.name || lockedData?.areaName || 'Area'} isLocked={isLocked}/>

        {loading ? (
          <div className="p-4 text-center text-sm text-gray-500">Loading area data...</div>
        ) : isLocked ? (
          <LockedArea lockedData={lockedData} />
        ) : stats ? (
          <>
            <Stats stats={stats} loading={loading} />
            <PocData pocName={stats.pocName} pocPhone={stats.pocPhone} />
          </>
        ) : (
          <div className="p-4 text-sm text-red-500">Unable to fetch area details.</div>
        )}
      </div>
    </>
  );
};

export default Drawer;
