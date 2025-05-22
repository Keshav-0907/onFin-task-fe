'use client'
import React from 'react'
import { Button } from '../ui/button'
import { useAreaStore } from '@/store/useAreaStore';
import { Lock } from 'lucide-react';

interface DrawerHeaderProps {
  locality: string
  isLocked: boolean
}

const DrawerHeader = ({ locality, isLocked }: DrawerHeaderProps) => {
  const setActivePinCode = useAreaStore((state) => state.setActivePinCode);
  return (
    <div className="sticky top-0 z-50 bg-[#FFF2E6] px-4 py-2 border-b border-gray-300 flex items-center justify-between">
      <div className='flex gap-2 items-center'>
        <div className="font-semibold">{locality}</div>
       {
        isLocked ? (
          <Lock size={14} strokeWidth={2} className='text-red-500'/>
        ) : (
           <span className="relative flex h-2 w-2 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
        </span>
        )
       }
      </div>

      <div onClick={() => setActivePinCode(null)} className="px-2 py-1 rounded-md hover:bg-red-600 text-white text-sm bg-red-500 cursor-pointer transition-colors duration-200">
        Close
      </div>
    </div>
  )
}

export default DrawerHeader