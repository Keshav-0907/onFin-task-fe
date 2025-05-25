'use client'
import React from 'react'
import ChatHeader from './ChatHeader'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'

const ChatDrawer = () => {
  return (
    <div className='w-[500px] bg-[#F8F4F1] border-r border-gray-300 h-screen relative'>
        <ChatHeader/>
        <ChatMessage/>
       <div className='absolute bottom-0 left-0 right-0'>
         <ChatInput/>
       </div>
    </div>
  )
}

export default ChatDrawer