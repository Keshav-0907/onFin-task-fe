'use client'
import React from 'react'
import { useAreaStore } from '@/store/useAreaStore';
import { Lock, MapPin } from 'lucide-react';

interface DrawerHeaderProps {
  locality: string
  isLocked: boolean
}

const DrawerHeader = ({ locality, isLocked }: DrawerHeaderProps) => {
  const setActivePinCode = useAreaStore((state) => state.setActivePinCode);
  const activePinCode = useAreaStore((state) => state.activePindCode);

  return (
    <div className="sticky top-0 z-50 bg-white px-4 py-2 border-b border-gray-300 flex items-center justify-between">
      <div className='flex gap-2 items-center'>
        <div className='flex flex-col'>
          <div className="font-semibold flex items-center gap-2">{locality}
            {
              isLocked ? (
                <Lock size={14} strokeWidth={2} className='text-red-500' />
              ) : (
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                </span>
              )
            }
          </div>
          <div className='flex text-xs gap-1 items-center'>
            <MapPin size={12} /> {activePinCode}
          </div>
        </div>

      </div>

      <div onClick={() => setActivePinCode(null)} className="px-2 py-1 rounded-md hover:bg-red-600 text-white text-sm bg-red-400 border border-red-500 cursor-pointer transition-colors duration-200">
        Close
      </div>
    </div>
  )
}

export default DrawerHeader