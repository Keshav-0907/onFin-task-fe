import { useChatStore } from '@/store/useChatStore';
import { X } from 'lucide-react'
import React from 'react'

const ChatHeader = () => {
    const toggleChatModal = useChatStore((state) => state.toggleChatModal);
  
  return (
    
        <div className='flex justify-between items-center p-2 border-b'>
          <div className='text-sm font-semibold'> AI Powered Chat </div>
          <X size={16} className='cursor-pointer' onClick={toggleChatModal}/>
        </div>
  )
}

export default ChatHeader