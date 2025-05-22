import { X } from 'lucide-react'
import React from 'react'

const ChatHeader = () => {
  return (
    
        <div className='flex justify-between items-center p-2 border-b'>
          <div className='text-sm font-semibold'> AI Powered Chat </div>
          <X size={16} className='cursor-pointer' />
        </div>
  )
}

export default ChatHeader