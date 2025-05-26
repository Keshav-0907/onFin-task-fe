import useServedAreas from '@/hooks/useServedAreas';
import { useAreaStore } from '@/store/useAreaStore';
import { useChatStore } from '@/store/useChatStore';
import { Bot, RotateCw, X } from 'lucide-react'
import React from 'react'

const ChatHeader = () => {
  const { areas } = useServedAreas()

  const toggleChatModal = useChatStore((state) => state.toggleChatModal);
  const chatSummary = useChatStore((state) => state.chatSummary);
  const isSummarising = useChatStore((state) => state.isSummarising);
  const activePinCode = useAreaStore((state) => state.activePindCode);

  const activeAreaName = areas.find(
    (area) => Number(area.pinCode) === activePinCode
  )?.name

  return (

    <div className='flex justify-between w-full items-center p-2 border-b border-gray-300'>
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
      <div>
        {activeAreaName && (
          <div className='text-xs text-gray-500 bg-amber-100 px-2 py-1 rounded-lg flex items-center gap-1'>
            Active Area: {activeAreaName}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatHeader