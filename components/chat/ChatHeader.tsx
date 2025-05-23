import { useChatStore } from '@/store/useChatStore';
import { Bot, RotateCw, X } from 'lucide-react'
import React from 'react'

const ChatHeader = () => {
  const toggleChatModal = useChatStore((state) => state.toggleChatModal);
  const chatSummary = useChatStore((state) => state.chatSummary);
  const isSummarising = useChatStore((state) => state.isSummarising);

  return (

    <div className='flex justify-between items-center p-2 border-b'>
      <div className='flex items-center gap-2'>
        <div className='text-sm font-semibold'> AI Powered Chat </div>
        {(isSummarising || chatSummary.summary) && (
          <div className="text-xs text-green-700 flex items-center gap-1 z-20 ">
            {
              isSummarising ? <RotateCw size={12} className='animate-spin' /> : <Bot size={14} />
            }
            {isSummarising ? "Summarising..." : "Summarised"}
          </div>
        )}
      </div>
      <X size={16} className='cursor-pointer' onClick={toggleChatModal} />
    </div>
  )
}

export default ChatHeader