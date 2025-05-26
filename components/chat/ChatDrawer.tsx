'use client'
import React, { useState } from 'react'
import ChatHeader from './ChatHeader'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import { Bot, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils' // optional: utility to merge classNames

const ChatDrawer = () => {
  const [isOpen, setIsOpen] = useState(true)

  const toggleDrawer = () => setIsOpen(!isOpen)

  return (
    <>
      <div
        onClick={toggleDrawer}
        className="fixed top-1/2 left-0 z-40 transform -translate-y-1/2 bg-white border border-gray-300 rounded-r-md p-1 cursor-pointer shadow-md"
      >
        <ChevronRight size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <div
        className={cn(
          'fixed top-0 left-0 h-full bg-[#F8F4F1] border-r border-gray-300 z-30 shadow-md transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0 w-[350px]' : '-translate-x-full w-[350px]'
        )}
      >
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <ChatHeader/>
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          <ChatMessage />
        </div>

        <div className="px-2 pb-4">
          <ChatInput />
        </div>
      </div>
    </>
  )
}

export default ChatDrawer
